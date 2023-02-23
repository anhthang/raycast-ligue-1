import {
  Action,
  ActionPanel,
  Color,
  Icon,
  Image,
  List,
  showToast,
  Toast,
} from "@raycast/api";
import { useEffect, useState } from "react";
import groupBy from "lodash.groupby";
import SeasonDropdown from "./components/season_dropdown";
import { FixturesAndResults } from "./types";
import { getMatches } from "./api";

export default function Fixture() {
  const [fixtures, setFixtures] = useState<FixturesAndResults[]>();
  const [season, setSeason] = useState<string>("");
  const [matchday, setMatchday] = useState<number>();

  useEffect(() => {
    showToast({
      title: "Loading...",
      style: Toast.Style.Animated,
    });
    getMatches(season, matchday).then((data) => {
      setFixtures(data);
      showToast({
        title: "Completed",
        style: Toast.Style.Success,
      });
    });
  }, [matchday, season]);

  const categories = groupBy(fixtures, "day");

  return (
    <List
      throttle
      isLoading={!fixtures}
      navigationTitle={
        !fixtures
          ? "Fixtures & Results"
          : `Matchday ${fixtures[0].matchday} | Fixtures & Results`
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
              switch (match.status) {
                case "live":
                  icon = { source: Icon.Livestream, tintColor: Color.Red };
                  break;
                case "completed":
                  icon = { source: Icon.CheckCircle, tintColor: Color.Green };
                  break;
                case "unplanned":
                  icon = Icon.Clock;
                  break;
                default:
                  icon = Icon.Calendar;
                  break;
              }

              return (
                <List.Item
                  key={match.url}
                  title={match.title}
                  subtitle={match.subtitle}
                  keywords={[match.subtitle]}
                  icon={icon}
                  actions={
                    <ActionPanel>
                      <Action.OpenInBrowser url={match.url} />
                      <ActionPanel.Section title="Matchday">
                        {match.matchday > 1 && (
                          <Action
                            title={`Matchday ${match.matchday - 1}`}
                            icon={Icon.ArrowLeftCircle}
                            onAction={() => {
                              setMatchday(match.matchday - 1);
                            }}
                          />
                        )}
                        {match.matchday < 38 && (
                          <Action
                            title={`Matchday ${match.matchday + 1}`}
                            icon={Icon.ArrowRightCircle}
                            onAction={() => {
                              setMatchday(match.matchday + 1);
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
