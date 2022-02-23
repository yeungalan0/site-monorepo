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
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Paper from "@mui/material/Paper";
import { addYears, addWeeks } from "date-fns";
import { useSession, signOut } from "next-auth/react";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import ReactTooltip from "react-tooltip";
import { Box } from "@mui/system";
import { useState } from "react";
import { isValidDate } from "../src/life-in-weeks/utils";
import { liwStyles } from "../src/life-in-weeks/styles";
import { LoadingCircle } from "../src/utils";
import {
  AVERAGE_LIFE_EXPECTANCY_MALE,
  CELL_WIDTH,
  WEEKS_PER_YEAR,
} from "../src/life-in-weeks/definitions";

// TODO: Add stats
// TODO: Next-auth sign in theme preference: https://github.com/mui/material-ui/issues/15588
// TODO: Add tests
// TODO: Properly configure variables
// TODO: Cleanup code
// TODO: Female vs. male life expectancy
// TODO: Create monorepo
// TODO: Hourglass for mobile https://codepen.io/tag/hourglass?cursor=ZD0xJm89MCZwPTE=
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
      <form
        onSubmit={handleSubmit}
        className={classes.birthdateFormStyles}
        data-cy="birthdate-form"
      >
        <Box>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Birthdate"
              value={birthdateInput}
              onChange={(newValue) => {
                setBirthdateInput(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
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
        >
          Submit
        </Button>
      </form>
    </Box>
  );
}

export default function LifeInWeeks(): JSX.Element {
  const classes = liwStyles();
  const { status, data: session } = useSession({
    required: true,
  });

  if (status === "loading") {
    return <LoadingCircle />;
  } else if (typeof session?.birthdate !== "string") {
    return <BirthdateForm />;
  }

  const columns = getColumns();
  const rows = getRows(session.birthdate, classes);

  return (
    <>
      {/* Signed in as {session?.user?.email} <br />
      {JSON.stringify(session)}
      <br />
      {} */}
      <Button onClick={() => signOut()}>Sign out</Button>
      <TableContainer component={Paper} sx={{ maxHeight: "80vh" }}>
        <Table stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>{columns}</TableRow>
          </TableHead>
          <TableBody>{rows}</TableBody>
        </Table>
      </TableContainer>
      <ReactTooltip id="dateDisplay" data-for="dateDisplay" delayShow={500} />
    </>
  );
}

function getColumns(): JSX.Element[] {
  const columns: JSX.Element[] = [
    <TableCell align="center" key={-1} width={CELL_WIDTH} padding="none">
      Year↓ Weeks→
    </TableCell>,
  ];

  for (let i = 0; i < WEEKS_PER_YEAR; i++) {
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
  birthdateString: string,
  classes: ClassNameMap<"birthdateFormStyles" | "cellStyles">
): JSX.Element[] {
  const birthday = new Date(birthdateString);
  const rows = [];
  let cellDate = birthday;
  const nowInMillis = Date.now();

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
      if (i + 1 < weeks) {
        cellDate = addWeeks(cellDate, 1);
      } else {
        // Last loop, set to start of a new row
        cellDate = addYears(birthday, yearsLived + 1);
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

  while (yearsLived < AVERAGE_LIFE_EXPECTANCY_MALE) {
    const yearsLeft = AVERAGE_LIFE_EXPECTANCY_MALE - yearsLived;
    // Either you have a full year left or a partial year of weeks left
    const weeks =
      yearsLeft > 1 ? WEEKS_PER_YEAR : Math.round(WEEKS_PER_YEAR * yearsLeft);
    rows.push(createRow(weeks, yearsLived));
    yearsLived += 1;
  }

  return rows;
}
