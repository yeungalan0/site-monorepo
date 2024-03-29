import {
  Checkbox,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  TableBody,
  TextField,
  Button,
  ClassNameMap,
  Tooltip,
  IconButton,
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Paper from "@mui/material/Paper";
import { addYears, addWeeks, intervalToDuration } from "date-fns";
import { useSession } from "next-auth/react";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import ReactTooltip from "react-tooltip";
import { Box } from "@mui/system";
import { useEffect, useMemo, useState } from "react";
import { capitalizeFirst, isValidDate } from "../src/life-in-weeks/utils";
import { liwStyles } from "../src/life-in-weeks/styles";
import { LoadingCircle } from "../src/utils";
import {
  AVERAGE_LIFE_EXPECTANCY_YEARS_MALE,
  CELL_WIDTH,
  APPROX_WEEKS_PER_YEAR,
  MAX_VH,
  AVERAGE_LIFE_EXPECTANCY_MILLIS_MALE,
} from "../src/life-in-weeks/definitions";
import TableViewIcon from "@mui/icons-material/TableView";
import { PieChart } from "react-minimal-pie-chart";
import AnalyticsIcon from "@mui/icons-material/Analytics";

// TODO: Add stats
// TODO: Next-auth sign in theme preference: https://github.com/mui/material-ui/issues/15588
// TODO: Female vs. male life expectancy
// TODO: Look into replacing make with tasks
// TODO: Test sign out button
// TODO: Test pie chart stats
function BirthdateForm() {
  const classes = liwStyles();
  const [birthdateInput, setBirthdateInput] = useState<Date | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch("/api/life-in-weeks/birthdate", {
      method: "POST",
      body: JSON.stringify({
        birthdate: birthdateInput?.toLocaleDateString("en-US"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      window.location.reload();
    } else {
      console.error(`ERROR: ${response.status} ${response.statusText}`);
      alert(
        `ERROR: Received response code ${response.status} (${response.statusText}) attempting to set brithdate. Please, try again.`
      );
    }
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="50vh"
    >
      <form onSubmit={handleSubmit} className={classes.birthdateFormStyles}>
        <Box>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Birthdate"
              value={birthdateInput}
              onChange={(newValue) => {
                setBirthdateInput(newValue);
              }}
              renderInput={(params) => (
                <TextField data-cy="birthdate-form-text-field" {...params} />
              )}
            />
          </LocalizationProvider>
        </Box>
        <Button
          variant="contained"
          type="submit"
          disabled={
            birthdateInput === null ||
            !isValidDate(birthdateInput.toLocaleDateString("en-US"))
          }
          data-cy="birthdate-form-submit"
        >
          Submit
        </Button>
      </form>
    </Box>
  );
}

export default function LifeInWeeks(): JSX.Element {
  const { status, data: session } = useSession({
    required: true,
  });

  const [displayType, setDisplayType] = useState<DisplayType>(
    DisplayType.ANALYTICS
  );

  if (status === "loading") {
    return <LoadingCircle />;
  } else if (typeof session?.birthdate !== "string") {
    return <BirthdateForm />;
  }

  return (
    <>
      <Box justifyContent="center" alignItems="center" display="flex">
        <Tooltip title="Table view">
          <IconButton
            onClick={() => setDisplayType(DisplayType.TABLE)}
            disabled={displayType === DisplayType.TABLE}
            data-cy="liw-display-table-button"
          >
            <TableViewIcon fontSize="large" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Stats view">
          <IconButton
            onClick={() => setDisplayType(DisplayType.ANALYTICS)}
            disabled={displayType === DisplayType.ANALYTICS}
            data-cy="liw-display-stats-button"
          >
            <AnalyticsIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <LifeInWeeksDisplay
        displayType={displayType}
        birthdateString={session.birthdate}
      />
    </>
  );
}

function LifeInWeeksDisplay({
  displayType,
  birthdateString,
}: {
  displayType: DisplayType;
  birthdateString: string;
}): JSX.Element {
  const classes = liwStyles();
  const birthdate = new Date(birthdateString);
  const deathdate = new Date(
    birthdate.getTime() + AVERAGE_LIFE_EXPECTANCY_MILLIS_MALE
  );

  if (displayType === DisplayType.TABLE) {
    const columns = getColumns();
    const rows = getRows(birthdate, classes);

    return (
      <>
        <TableContainer component={Paper} sx={{ maxHeight: MAX_VH }}>
          <Table stickyHeader aria-label="simple table" data-cy="liw-table">
            <TableHead>
              <TableRow>{columns}</TableRow>
            </TableHead>
            <TableBody>{rows}</TableBody>
          </Table>
        </TableContainer>
        <ReactTooltip id="dateDisplay" data-for="dateDisplay" delayShow={500} />
      </>
    );
  } else {
    return <StatsDisplay birthdate={birthdate} deathdate={deathdate} />;
  }
}

function StatsDisplay({
  birthdate,
  deathdate,
}: {
  birthdate: Date;
  deathdate: Date;
}): JSX.Element {
  return (
    <Grid container direction="column" padding="2em">
      <Grid container item justifyContent="center" spacing={2}>
        <Box display="flex" justifyContent="center" padding="1em">
          <TimerDisplay deathdate={deathdate} />
        </Box>
      </Grid>
      <Grid container item justifyContent="center" spacing={2}>
        <PieChartDisplay birthdate={birthdate} deathdate={deathdate} />
      </Grid>
    </Grid>
  );
}

function TimerDisplay({ deathdate }: { deathdate: Date }): JSX.Element {
  const initialDuration = useMemo(
    () => intervalToDuration({ start: new Date(), end: deathdate }),
    []
  );
  const [timeLeft, setTimeLeft] = useState(initialDuration);

  useEffect(() => {
    const reactInterval = setInterval(() => {
      const currentTimeLeft = intervalToDuration({
        start: new Date(),
        end: deathdate,
      });

      const deathdatePassed = Object.values(currentTimeLeft).every(
        (v) => v === 0
      );
      if (deathdatePassed) {
        clearInterval(reactInterval);
      }

      setTimeLeft(currentTimeLeft);
    }, 1000);

    return () => {
      clearInterval(reactInterval);
    };
  }, []);

  const countDownElements: JSX.Element[] = [];
  const totalKeys = Object.keys(timeLeft).length;
  let currentKey = 0;

  for (const [duration, value] of Object.entries(timeLeft)) {
    currentKey++;

    countDownElements.push(
      <Card sx={{ border: "none" }} variant="outlined">
        <CardContent
          sx={{
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {capitalizeFirst(duration)}
          </Typography>
          <Typography variant="h5">{value}</Typography>
        </CardContent>
      </Card>
    );

    if (currentKey < totalKeys) {
      countDownElements.push(
        <Box display="flex" alignItems="center" height="100%">
          <Typography variant="h4" alignContent="center">
            :
          </Typography>
        </Box>
      );
    }
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      padding="1em"
      data-cy="liw-timer"
    >
      {countDownElements}
    </Box>
  );
}

function PieChartDisplay({
  birthdate,
  deathdate,
}: {
  birthdate: Date;
  deathdate: Date;
}): JSX.Element {
  const [selected, setSelected] = useState<number | undefined>(0);
  const [hovered, setHovered] = useState<number | undefined>(undefined);

  const lineWidth = 60;
  const weeksBetween = (d1: Date, d2: Date) => {
    const weekInMillis = 7 * 24 * 60 * 60 * 1000;
    return Math.round((d2.getTime() - d1.getTime()) / weekInMillis);
  };
  const now = new Date();
  const weeksLived = weeksBetween(birthdate, now);
  let weeksToLive = weeksBetween(now, deathdate);
  weeksToLive = weeksToLive > 0 ? weeksToLive : 0;
  console.log(`weeksLived: ${weeksLived}, weeksToLive: ${weeksToLive}`);

  const data = [
    { title: "Weeks lived", value: weeksLived, color: "#E38627" },
    { title: "Weeks left", value: weeksToLive, color: "#6A2135" },
  ];

  const updatedData: { color: string; tooltip?: string; value: number }[] =
    data.map(({ title, ...entry }, i) => {
      if (hovered === i) {
        return {
          ...entry,
          color: "grey",
          tooltip: title,
        };
      }
      return entry;
    });

  return (
    <Box height={MAX_VH} data-tip="" data-for="chart" data-cy="liw-pie-chart">
      <PieChart
        style={{
          fontFamily:
            '"Nunito Sans", -apple-system, Helvetica, Arial, sans-serif',
          fontSize: "8px",
        }}
        data={updatedData}
        radius={40}
        lineWidth={60}
        segmentsStyle={{ transition: "stroke .3s", cursor: "pointer" }}
        segmentsShift={(index) => (index === selected ? 6 : 1)}
        animate
        label={({ dataEntry }) => Math.round(dataEntry.percentage) + "%"}
        labelPosition={100 - lineWidth / 2}
        labelStyle={{
          fill: "#fff",
          opacity: 0.75,
          pointerEvents: "none",
        }}
        onClick={(_, index) => {
          setSelected(index === selected ? undefined : index);
        }}
        onMouseOver={(_, index) => {
          setHovered(index);
        }}
        onMouseOut={() => {
          setHovered(undefined);
        }}
      />
      <ReactTooltip
        id="chart"
        getContent={() =>
          typeof hovered === "number" ? updatedData[hovered]?.tooltip : null
        }
      />
    </Box>
  );
}

enum DisplayType {
  ANALYTICS = "analytics",
  TABLE = "table",
}

function getColumns(): JSX.Element[] {
  const columns: JSX.Element[] = [
    <TableCell align="center" key={-1} width={CELL_WIDTH} padding="none">
      Year↓ Weeks→
    </TableCell>,
  ];

  for (let i = 0; i < APPROX_WEEKS_PER_YEAR; i++) {
    const weekNumber = i + 1;
    columns.push(
      <TableCell
        align="center"
        key={weekNumber}
        width={CELL_WIDTH}
        padding="none"
      >
        {weekNumber}
      </TableCell>
    );
  }

  return columns;
}

function getRows(
  birthdate: Date,
  classes: ClassNameMap<"birthdateFormStyles" | "cellStyles">
): JSX.Element[] {
  const rows = [];
  let cellDate = birthdate;
  const nowInMillis = Date.now();

  // console.log(`NOW: ${new Date().toLocaleDateString("en-US")}`); // Save for testing

  const getCellSettings = (currentCellDate: Date, nextDate: Date) => {
    // Default settings if it is a past time range
    let disabled: boolean | undefined = false;
    let checked: boolean | undefined = true;
    let icon: JSX.Element | undefined = undefined;
    let color: "primary" | "secondary" = "primary";

    // If it is a future time range
    if (currentCellDate.getTime() > nowInMillis) {
      disabled = false;
      checked = false;
    } else if (
      currentCellDate.getTime() <= nowInMillis &&
      nowInMillis < nextDate.getTime()
    ) {
      // If it is within the current time range
      disabled = false;
      checked = undefined;
      icon = <CircleOutlinedIcon />;
      color = "secondary";
    }

    return { disabled, checked, icon, color };
  };

  const createRow = (weeks: number, yearsLived: number) => {
    const cells: JSX.Element[] = [
      <TableCell align="center" key={-1} width={CELL_WIDTH} padding="none">
        {yearsLived}
      </TableCell>,
    ];

    let currentCellDate = new Date(cellDate);

    for (let i = 0; i < weeks; i++) {
      // Set the next date to work with
      if (i < APPROX_WEEKS_PER_YEAR - 1) {
        // For 51 weeks, add a week to the next date
        cellDate = addWeeks(cellDate, 1);
      } else {
        // Done with row, set to start of a new row
        cellDate = addYears(birthdate, yearsLived + 1);
      }

      const cellSettings = getCellSettings(currentCellDate, cellDate);

      cells.push(
        <TableCell align="center" key={i} width={CELL_WIDTH} padding="none">
          <Checkbox
            checked={cellSettings.checked}
            disabled={cellSettings.disabled}
            color={cellSettings.color}
            icon={cellSettings.icon}
            size="small"
            className={classes.cellStyles}
            inputProps={{
              // Ignoring this per: https://github.com/mui-org/material-ui/issues/20160
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              "data-tip": currentCellDate.toLocaleDateString("en-US"),
              "data-for": "dateDisplay",
            }}
          />
        </TableCell>
      );

      currentCellDate = new Date(cellDate);
    }

    const row = <TableRow key={yearsLived}>{cells}</TableRow>;
    return row;
  };

  let yearsLived = 0;

  while (yearsLived < AVERAGE_LIFE_EXPECTANCY_YEARS_MALE) {
    const yearsLeft = AVERAGE_LIFE_EXPECTANCY_YEARS_MALE - yearsLived;
    // Either you have a full year left or a partial year of weeks left
    const weeks =
      yearsLeft > 1
        ? APPROX_WEEKS_PER_YEAR
        : Math.round(APPROX_WEEKS_PER_YEAR * yearsLeft);
    rows.push(createRow(weeks, yearsLived));
    yearsLived += 1;
  }

  return rows;
}
