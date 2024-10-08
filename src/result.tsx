import { Action, ActionPanel, Color, Icon, Image, List } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { format } from "date-fns";
import groupBy from "lodash.groupby";
import { useState } from "react";
import { getGameWeeks, getMatches } from "./api";
import SeasonDropdown from "./components/season_dropdown";

export default function Fixture() {
  const [season, setSeason] = useState<string>("2024_1");
  const [gameWeek, setGameWeek] = useState<number>(1);

  usePromise(
    async (season) => (season ? await getGameWeeks(season) : 1),
    [season],
    {
      onData: (data: number) => {
        setGameWeek(data);
      },
    },
  );
  const { data: fixtures, isLoading } = usePromise(getMatches, [
    season,
    gameWeek,
  ]);

  const categories = groupBy(fixtures, (m) =>
    format(new Date(m.date), "eee dd MMM"),
  );

  return (
    <List
      throttle
      isLoading={isLoading}
      navigationTitle={
        !fixtures
          ? "Fixtures & Results"
          : `Game Week ${fixtures[0].gameWeekNumber} | Fixtures & Results`
      }
      searchBarAccessory={
        <SeasonDropdown selected={season} onSelect={setSeason} />
      }
    >
      {Object.entries(categories).map(([day, matches]) => {
        return (
          <List.Section key={day} title={day}>
            {matches.map((match) => {
              let icon: Image.ImageLike;

              if (match.isLive) {
                icon = { source: Icon.Livestream, tintColor: Color.Red };
              } else if (match.period === "fullTime") {
                icon = { source: Icon.CheckCircle, tintColor: Color.Green };
              } else if (match.dateTimeUnknown) {
                icon = Icon.Clock;
              } else {
                icon = Icon.Calendar;
              }

              const { home, away } = match;

              const title = match.dateTimeUnknown
                ? "TBC"
                : format(new Date(match.date), "HH:mm");
              const subtitle =
                match.period === "preMatch"
                  ? `${home.clubIdentity.name} - ${away.clubIdentity.name}`
                  : `${home.clubIdentity.name} ${home.score} - ${away.score} ${away.clubIdentity.name}`;

              return (
                <List.Item
                  key={match.matchId}
                  title={title}
                  subtitle={subtitle}
                  keywords={[
                    home.clubIdentity.name,
                    home.clubIdentity.shortName,
                    home.clubIdentity.trigram,
                    away.clubIdentity.name,
                    away.clubIdentity.shortName,
                    away.clubIdentity.trigram,
                  ]}
                  icon={icon}
                  actions={
                    <ActionPanel>
                      <Action.OpenInBrowser
                        url={`https://ligue1.com/match-sheet/${match.matchId}`}
                      />
                      <ActionPanel.Section title="Game Week">
                        {match.gameWeekNumber > 1 && (
                          <Action
                            title={`Game Week ${match.gameWeekNumber - 1}`}
                            icon={Icon.ArrowLeftCircle}
                            onAction={() => {
                              setGameWeek(match.gameWeekNumber - 1);
                            }}
                          />
                        )}
                        {match.gameWeekNumber < 38 && (
                          <Action
                            title={`Game Week ${match.gameWeekNumber + 1}`}
                            icon={Icon.ArrowRightCircle}
                            onAction={() => {
                              setGameWeek(match.gameWeekNumber + 1);
                            }}
                          />
                        )}
                      </ActionPanel.Section>
                    </ActionPanel>
                  }
                />
              );
            })}
          </List.Section>
        );
      })}
    </List>
  );
}
