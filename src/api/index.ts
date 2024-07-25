import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { showToast, Toast } from "@raycast/api";
import {
  Club,
  FixturesAndResults,
  L1Standings,
  Player,
  Standing,
} from "../types";

import xpath from "xpath-html";

function showFailureToast() {
  showToast(
    Toast.Style.Failure,
    "Something went wrong",
    "Please try again later",
  );
}

export const getClubs = async (seasonId: string): Promise<Club[]> => {
  const config: AxiosRequestConfig = {
    method: "get",
    url: `https://www.ligue1.com/clubs/List?seasonId=${seasonId}`,
  };

  try {
    const { data } = await axios(config);

    const nodes = xpath
      .fromPageSource(data)
      .findElements("//a[contains(@class, 'ClubListPage-link')]");

    return nodes.map((node: any) => {
      const url = node.getAttribute("href");

      const logo = xpath
        .fromNode(node)
        .findElement("//div[@class='ClubListPage-logo']/img")
        .getAttribute("data-src");
      const name = xpath
        .fromNode(node)
        .findElement("//div[contains(@class, 'ClubListPage-name')]/h3")
        .getText();

      return {
        id: url.replace("/clubs?id=", ""),
        name,
        logo: `https://www.ligue1.com${logo}`,
        url: `https://www.ligue1.com${url}`,
      };
    });
  } catch (e) {
    showFailureToast();

    return [];
  }
};

export const getTable = async (season: string): Promise<Standing[]> => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: "https://ma-api.ligue1.fr/championship-standings/1/general",
    params: {
      season,
    },
  };

  try {
    const { data }: AxiosResponse<L1Standings> = await axios(config);

    return Object.values(data.standings);
  } catch (e) {
    showFailureToast();

    return [];
  }
};

export const getMatches = async (
  seasonId: string,
  matchDay?: number,
): Promise<FixturesAndResults[]> => {
  const params = {
    seasonId,
    StatsActiveTab: 0,
    matchDay,
  };

  const config: AxiosRequestConfig = {
    method: "GET",
    url: "https://www.ligue1.com/fixtures-results",
    params,
  };

  try {
    const { data } = await axios(config);

    const matchday = xpath
      .fromPageSource(data)
      .findElement("//a[contains(@class, 'Scorebar-journeyItem--active')]")
      .getText()
      .trim();

    const days = xpath
      .fromPageSource(data)
      .findElements("//div[contains(@class, 'calendar-widget-day')]");

    const fixtures: FixturesAndResults[] = [];

    days.forEach((node: any) => {
      const day = node.firstChild.data;
      const rows = xpath
        .fromNode(node.nextSibling.nextSibling)
        .findElements("//li[contains(@class, 'match-result')]");

      rows.forEach((row: any) => {
        const clubs = xpath
          .fromNode(row)
          .findElements("//div[contains(@class, 'Calendar-clubWrapper')]/span")
          .map((n: any) => n.firstChild.data);

        const home = clubs[0];
        const away = clubs[clubs.length / 2];

        const classes = row.getAttribute("class");

        const result = xpath
          .fromNode(row)
          .findElements(
            "//div[contains(@class, 'Calendar-clubResult')]/span/span",
          )
          .map((e: any) => e.firstChild && e.firstChild.data)
          .filter((e: string) => !!e);

        let status = classes.includes("live") ? "live" : "upcoming";
        if (status !== "live" && result[1] === "-") {
          status = "completed";
        }

        let title;
        let subtitle;

        if (result.length === 1) {
          if (result[0] == "--:--") {
            title = "TBC";
            status = "unplanned";
          } else {
            title = result[0];
          }
          subtitle = `${home} - ${away}`;
        } else {
          title = "";
          subtitle = [home, ...result, away].join(" ");
        }

        const url = xpath
          .fromNode(row)
          .findElement("//div[contains(@class, 'discussion')]/a")
          .getAttribute("href")
          .trim();

        fixtures.push({
          day,
          title,
          subtitle,
          url: `https://www.ligue1.com${url}`,
          status,
          matchday: Number(matchday.replace("R", "")),
        });
      });
    });

    return fixtures;
  } catch (e) {
    showFailureToast();

    return [];
  }
};

export const getSquad = async (clubId: string): Promise<Player[]> => {
  const config: AxiosRequestConfig = {
    method: "get",
    url: `https://www.ligue1.com/clubs/squad?id=${clubId}`,
  };

  try {
    const { data } = await axios(config);

    const nodes = xpath
      .fromPageSource(data)
      .findElements("//a[contains(@class, 'SquadTeamTable-flip-card')]");

    return nodes.map((node: any) => {
      const name = xpath
        .fromNode(node)
        .findElement("//span[@class='SquadTeamTable-playerName']")
        .getText();
      const position = xpath
        .fromNode(node)
        .findElement("//span[@class='SquadTeamTable-position']")
        .getText();
      const number = xpath
        .fromNode(node)
        .findElement("//div[contains(@class, 'SquadTeamTable-detail--number')]")
        .getText()
        .trim();

      const img = xpath
        .fromNode(node)
        .findElement("//img[contains(@class, 'SquadTeamTable-player-picture')]")
        .getAttribute("src");

      const link = xpath
        .fromNode(node)
        .findElement("//a[contains(@class, 'SquadTeamTable-link')]")
        .getAttribute("href");

      return {
        id: link.replace("/player?id=", ""),
        name,
        position,
        number,
        img: `https://www.ligue1.com${img}`,
      };
    });
  } catch (e) {
    showFailureToast();

    return [];
  }
};
