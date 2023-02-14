import axios, { AxiosRequestConfig } from "axios";
import { showToast, Toast } from "@raycast/api";
import { Club, FixturesAndResults, Standing } from "../types";

import xpath from "xpath-html";

function showFailureToast() {
  showToast(
    Toast.Style.Failure,
    "Something went wrong",
    "Please try again later"
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

export const getTable = async (seasonId: string): Promise<Standing[]> => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `https://www.ligue1.com/ranking?seasonId=${seasonId}&StatsActiveTab=0`,
  };

  try {
    const { data } = await axios(config);

    const table = xpath
      .fromPageSource(data)
      .findElements('//div[@class="classement-table-body"]');
    const rows = xpath.fromNode(table).findElements("//li");

    const ranking = rows.map((node: any) => {
      const pos = xpath
        .fromNode(node)
        .findElement("//div[contains(@class, 'GeneralStats-item--position')]");
      const ranking = pos.getAttribute("class").split(" ")[2];
      const position = pos.getText();
      const name = xpath
        .fromNode(node)
        .findElement("//span[contains(@class, 'GeneralStats-clubName')]")
        .getText();
      const points = xpath
        .fromNode(node)
        .findElement("//div[contains(@class, 'GeneralStats-item--points')]")
        .getText();
      const forms = xpath
        .fromNode(node)
        .findElements("//span[contains(@class, 'circle')]")
        .map((form: any) => {
          return form.getAttribute("class").replace("circle", "").trim();
        });

      const img = xpath
        .fromNode(node)
        .findElement("//img")
        .getAttribute("data-src");
      const indexOf = img.indexOf("?");

      return {
        name,
        logo: "https://www.ligue1.com" + img.substr(0, indexOf),
        position,
        ranking,
        points,
        forms,
      };
    });

    return ranking;
  } catch (e) {
    showFailureToast();

    return [];
  }
};

export const getMatches = async (
  seasonId: string
): Promise<FixturesAndResults[]> => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `https://www.ligue1.com/fixtures-results?seasonId=${seasonId}&StatsActiveTab=0`,
  };

  console.log(config.url);

  try {
    const { data } = await axios(config);

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
        const left = clubs[0];
        const right = clubs[clubs.length / 2];

        const result = xpath
          .fromNode(row)
          .findElements(
            "//div[contains(@class, 'Calendar-clubResult')]/span/span"
          )
          .map((e: any) => e.firstChild && e.firstChild.data)
          .filter((e: string) => !!e);

        const title = [left, ...result, right].join(" ");

        const url = xpath
          .fromNode(row)
          .findElement("//div[contains(@class, 'discussion')]/a")
          .getAttribute("href")
          .trim();

        fixtures.push({
          day,
          title,
          url: `https://www.ligue1.com${url}`,
        });
      });
    });

    return fixtures;
  } catch (e) {
    showFailureToast();

    return [];
  }
};
