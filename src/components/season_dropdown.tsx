import { Grid, List } from "@raycast/api";

// const competitions = [
//   {
//     title: "La Liga",
//     value: "laliga-santander",
//   },
//   {
//     title: "Segunda División",
//     value: "laliga-smartbank",
//   },
//   {
//     title: "Liga F",
//     value: "primera-division-femenina",
//   },
// ];

const seasons = {
  2020: {
    "2022-2023": "2022/2023",
    "2021-2022": "2021/2022",
    "2020-2021": "2020/2021",
  },
  2010: {
    "2019-2020": "2019/2020",
    "2018-2019": "2018/2019",
    "2017-2018": "2017/2018",
    "2016-2017": "2016/2017",
    "2015-2016": "2015/2016",
    "2014-2015": "2014/2015",
    "2013-2014": "2013/2014",
    "2012-2013": "2012/2013",
    "2011-2012": "2011/2012",
    "2010-2011": "2010/2011",
  },
  2000: {
    "2009-2010": "2009/2010",
    "2008-2009": "2008/2009",
    "2007-2008": "2007/2008",
    "2006-2007": "2006/2007",
    "2005-2006": "2005/2006",
    "2004-2005": "2004/2005",
    "2003-2004": "2003/2004",
    "2002-2003": "2002/2003",
    "2001-2002": "2001/2002",
    "2000-2001": "2000/2001",
  },
  1990: {
    "1999-2000": "1999/2000",
    "1998-1999": "1998/1999",
    "1997-1998": "1997/1998",
    "1996-1997": "1996/1997",
    "1995-1996": "1995/1996",
    "1994-1995": "1994/1995",
    "1993-1994": "1993/1994",
  },
};

export default function CompetitionDropdown(props: {
  type?: string;
  selected: string;
  onSelect: React.Dispatch<React.SetStateAction<string>>;
}) {
  const DropdownComponent =
    props.type === "grid" ? Grid.Dropdown : List.Dropdown;

  return (
    <DropdownComponent
      tooltip="Filter by Competition"
      value={props.selected}
      onChange={props.onSelect}
    >
      {Object.entries(seasons)
        .sort((a, b) => Number(b[0]) - Number(a[0]))
        .map(([annees, years]) => {
          return (
            <DropdownComponent.Section title={`Années ${annees}`} key={annees}>
              {Object.entries(years).map(([key, value]) => {
                return (
                  <DropdownComponent.Item
                    key={key}
                    value={key}
                    title={value}
                    // title={competition.title}
                  />
                );
              })}
            </DropdownComponent.Section>
          );
        })}
    </DropdownComponent>
  );
}
