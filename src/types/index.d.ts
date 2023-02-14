export interface Standing {
  name: string;
  logo: string;
  position: string;
  ranking: string;
  points: string;
  forms: string[];
}

export interface FixturesAndResults {
  day: string;
  title: string;
  url: string;
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
