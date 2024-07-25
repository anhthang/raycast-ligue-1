/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { showToast, Toast } from "@raycast/api";
import {
  Club,
  L1GameWeeks,
  L1Matches,
  L1Standings,
  Match,
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
  season: string,
  gameweek?: number,
): Promise<Match[]> => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `https://ma-api.ligue1.fr/championship-matches/championship/1/game-week/${gameweek}`,
    params: {
      season,
    },
  };

  try {
    const { data }: AxiosResponse<L1Matches> = await axios(config);

    return data.matches;
  } catch (e) {
    showFailureToast();

    return [];
  }
};

export const getGameWeeks = async (): Promise<number> => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: "https://ma-api.ligue1.fr/championship-calendar/1/nearest-game-weeks",
  };

  try {
    const { data }: AxiosResponse<L1GameWeeks> = await axios(config);

    return data.nearestGameWeeks.currentGameWeek.gameWeekNumber;
  } catch (e) {
    showFailureToast();

    return 1;
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
