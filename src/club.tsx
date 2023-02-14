import { useEffect, useState } from "react";
import { Club } from "./types";
import { getClubs } from "./api";
import SeasonDropdown from "./components/season_dropdown";
import { Action, ActionPanel, Grid, Icon } from "@raycast/api";
import ClubDetails from "./components/club";

export default function Club() {
  const [clubs, setClubs] = useState<Club[]>();
  const [season, setSeason] = useState<string>("");

  useEffect(() => {
    if (season) {
      setClubs(undefined);
      getClubs(season).then((data) => {
        setClubs(data);
      });
    }
  }, [season]);

  return (
    <Grid
      throttle
      isLoading={!clubs}
      inset={Grid.Inset.Medium}
      searchBarAccessory={
        <SeasonDropdown type="grid" selected={season} onSelect={setSeason} />
      }
    >
      {clubs?.map((club) => {
        return (
          <Grid.Item
            key={club.name}
            title={club.name}
            content={club.logo}
            // actions={
            //   <ActionPanel>
            //     <Action.Push
            //       title="Club Profile"
            //       icon={Icon.Sidebar}
            //       target={<ClubDetails {...club} />}
            //     />
            //   </ActionPanel>
            // }
          />
        );
      })}
    </Grid>
  );
}
