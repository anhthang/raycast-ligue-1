export interface FixturesAndResults {
  day: string;
  title: string;
  subtitle: string;
  url: string;
  status: string;
  matchday: number;
}

export interface Club {
  id: string;
  name: string;
  logo: string;
  url: string;
}

export interface Player {
  id: string;
  name: string;
  img: string;
  position: string;
  number: string;
}

export interface L1Standings {
  competitionType: string;
  season: number;
  standings: { [key: string]: Standing };
}

export interface Standing {
  clubId: string;
  clubIdentity: ClubIdentity;
  againstGoals: number;
  forGoals: number;
  goalsDifference: number;
  wins: number;
  draws: number;
  losses: number;
  played: number;
  points: number;
  gameWeekStartingRank: number;
  rank: number;
  rankDelta: number;
  seasonResults: unknown[];
  allSeasonResults: unknown[];
  higherWinsInARow: number;
  qualifiedFor?: string;
}

export interface ClubIdentity {
  id: string;
  name: string;
  officialName: string;
  shortName: string;
  displayName: string;
  businessName: string;
  trigram: string;
  primaryColor: string;
  secondaryColor: string;
  assets: Assets;
  preferMonochromeLogo: boolean;
}

export interface Assets {
  logo: Logo;
  whiteLogo: Logo;
}

export interface Logo {
  small: string;
  medium: string;
  large: string;
}
