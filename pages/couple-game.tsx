import React, { Fragment, useEffect, useRef, useState } from "react";
import * as constants from "../constants/couple-game";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import Header from "../src/header";
import { makeStyles } from "@material-ui/styles";
import theme from "../src/theme";

// style={{ border: "solid 1px", backgroundColor: "orange" }}

// border: "solid 1px",
// backgroundColor: "orange",

const useStyles = makeStyles(() => ({
  footerStyle: {
    top: "auto",
    bottom: 0,
    background: "transparent",
    boxShadow: "none",
    color: "black",
    textAlign: "center",
  },
  contentContainerStyle: {
    height: "92vh",
  },
  titleStyle: {
    padding: theme.spacing(4),
  },
  contentStyle: {
    justifyContent: "center",
    alignItems: "center",
    flex: "1",
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
  },
  startStyle: {
    paddingBottom: theme.spacing(3),
  },
}));

export default function CoupleGame(): JSX.Element {
  const [players, setPlayers] = useState<string[]>([]);
  const [cardsTodo, setCardsTodo] = useState(-1);
  const [cont, setCont] = useState(false);
  const playerInput = useRef<HTMLInputElement>(null);
  const classes = useStyles();

  useEffect(() => {
    const savedPlayersJSON = localStorage.getItem(constants.PLAYERS_KEY);
    const savedIndexes = localStorage.getItem(constants.INDEXES_KEY);
    if (savedPlayersJSON !== null && savedIndexes !== null) {
      const savedCardsToDo = JSON.parse(savedIndexes).length;
      setPlayers(JSON.parse(savedPlayersJSON));
      setCardsTodo(savedCardsToDo);
    }
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const inputVal = playerInput.current ?? { value: "" };
    const inputPlayers = inputVal.value.split(",").map((s) => s.trim());
    if (inputPlayers.length < 2 || inputPlayers.includes("")) {
      alert(
        `Not enough players detected or an empty player detected! Players: ${inputPlayers.join(
          ", "
        )}`
      );
    } else {
      setPlayers(inputPlayers);
      setCont(true);
      resetCards();
      localStorage.setItem(constants.PLAYERS_KEY, JSON.stringify(inputPlayers));
      event.preventDefault();
    }
  }

  return (
    <Fragment>
      <Grid
        container
        direction="column"
        className={classes.contentContainerStyle}
      >
        <Grid item>
          <Header />
        </Grid>
        <Grid item>
          <Typography
            variant="h3"
            align="center"
            className={classes.titleStyle}
          >
            Welcome to the couple game! 💕😘
          </Typography>
        </Grid>
        <Grid item container>
          <Grid item sm={2} md={4} />
          <Grid item xs={12} sm={8} md={4}>
            <Content
              handleSubmit={handleSubmit}
              playerInput={playerInput}
              players={players}
              cardsTodo={cardsTodo}
              cont={cont}
              setCont={setCont}
            />
          </Grid>
          <Grid item sm={2} md={4} />
        </Grid>
      </Grid>
      <AppBar position="sticky" className={classes.footerStyle}>
        <p>Dedicated to my wonderful girlfriend, Jen 😳😽</p>
      </AppBar>
    </Fragment>
  );
}

function Content({
  handleSubmit,
  playerInput,
  players,
  cardsTodo,
  cont,
  setCont,
}: {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  playerInput: React.RefObject<HTMLInputElement>;
  players: string[];
  cardsTodo: number;
  cont: boolean;
  setCont: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const classes = useStyles();

  if (players.length > 0 && cont) {
    return <CoupleGameBoard players={players} />;
  } else {
    return (
      <div className={classes.contentStyle}>
        <form onSubmit={handleSubmit} className={classes.startStyle}>
          <div>
            <TextField
              label="Alan,Jen"
              helperText="Enter comma separated names"
              inputRef={playerInput}
            ></TextField>
          </div>
          <Button variant="contained" type="submit">
            Start new game
          </Button>
        </form>
        <ContinueGame
          players={players}
          cardsTodo={cardsTodo}
          onContinue={setCont}
        ></ContinueGame>
      </div>
    );
  }
}

function ContinueGame({
  players,
  cardsTodo,
  onContinue,
}: {
  players: string[];
  cardsTodo: number;
  onContinue: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element | null {
  if (players.length === 0) {
    return null;
  }
  return (
    <div>
      <p>
        Saved game detected, continue as: {players.join(", ")}? ({cardsTodo}{" "}
        cards left)
      </p>
      <Button variant="contained" onClick={() => onContinue(true)}>
        Continue
      </Button>
    </div>
  );
}

function CoupleGameBoard({ players }: { players: string[] }): JSX.Element {
  const classes = useStyles();
  const [card, setCard] = useState(() => drawCard());
  const [turn, setTurn] = useState(0);
  const [scores, setScores] = useState(() => getStartingScores());

  function init(): void {
    resetCards();
    setScores(getStartingScores());
    setCard(drawCard());
  }

  function getStartingScores() {
    const startingScores: Map<string, number> = new Map();
    players.forEach((player) => startingScores.set(player, 0));
    return startingScores;
  }

  function nextTurn(): void {
    setCard(drawCard());
    setTurn(turn + 1);
  }

  function getCurrentPlayerTurn(): string {
    return players[turn % players.length];
  }

  function pointsEarned() {
    scores.set(getCurrentPlayerTurn(), getScore(getCurrentPlayerTurn()) + 1);
    setScores(scores);
    nextTurn();
  }

  function getScore(player: string) {
    const score = scores.get(player);
    if (score === undefined) {
      throw ReferenceError(`Score for player is undefined! player: ${player}`);
    }

    return score;
  }

  // TODO: Put styles in class
  return (
    <div className={classes.contentStyle}>
      <Grid container direction="column">
        <Grid container item>
          {players.map((player) => getPlayerStatCard(player, getScore(player)))}
        </Grid>
        <Grid
          item
          alignItems="center"
          justify="center"
          style={{ display: "flex" }}
        >
          <Card
            variant="outlined"
            style={{
              width: "50%",
              minWidth: "16vw",
              height: "32vh",
              overflow: "auto",
              maxHeight: "20%",
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
            }}
          >
            <CardContent>
              <Typography
                color="textSecondary"
                gutterBottom
                style={{ marginBottom: theme.spacing(6) }}
              >
                <b>{card.type}</b>
              </Typography>
              <Typography>{card.text}</Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                size="small"
                onClick={() => nextTurn()}
                style={{
                  marginLeft: theme.spacing(3),
                }}
              >
                Incorrect 😓
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => pointsEarned()}
                style={{
                  marginLeft: "auto",
                  marginRight: theme.spacing(3),
                }}
              >
                Correct 🙂
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => init()}
            style={{ marginTop: theme.spacing(15) }}
          >
            Reset
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

// TODO: duplicate functionality
{
  /* function GameStats({
  players,
  currentPlayerTurn,
  scores,
}: {
  players: string[];
  currentPlayerTurn: string;
  scores: { [k: string]: number };
}): JSX.Element {
  const allCards =
    constants.GUESS_LIST.length + constants.CHALLENGE_LIST.length;
  const cardsTodo = JSON.parse(getFromStorage(constants.INDEXES_KEY)).length;

  const scoreStrings = Object.entries(scores).map(
    (score) => `${score[0]}: ${score[1]}`
  );

  const listItems = scoreStrings.map((score) => <li key={score}>{score}</li>);

  return (
    <div>
      <p>
        Card: {cardsTodo}/{allCards}
      </p>
      <ul>{listItems}</ul>
    </div>
  );
} */
}

function getPlayerStatCard(player: string, score: number) {
  return (
    <Grid item>
      <Card>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            <b>{player}</b>
          </Typography>
          <Typography>{score}</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

function getFromStorage(key: string): string {
  const val = localStorage.getItem(constants.INDEXES_KEY);
  if (val === null) {
    throw ReferenceError(`Value is null! key: ${key}`);
  }

  return val;
}

function resetCards(): void {
  const size = constants.GUESS_LIST.length + constants.CHALLENGE_LIST.length;
  const possibleIndexes = Array.from(Array(size).keys());

  localStorage.setItem(constants.INDEXES_KEY, JSON.stringify(possibleIndexes));
}

function drawCard(): CardObj {
  const index = getRandomIndexAndUpdateStorage();
  if (index === -1) {
    return new CardObj("GAME OVER", "All cards completed!");
  }

  if (typeof constants.GUESS_LIST[index] !== "undefined") {
    return new CardObj(constants.GUESS_CARD, constants.GUESS_LIST[index]);
  } else {
    const challengeIndex = index - constants.GUESS_LIST.length;
    return new CardObj(
      constants.CHALLENGE_CARD,
      constants.CHALLENGE_LIST[challengeIndex]
    );
  }
}

// TODO: This still needed?
class CardObj {
  type: string;
  text: string;

  constructor(cardType: string, cardText: string) {
    this.type = cardType;
    this.text = cardText;
  }
}

function getRandomIndexAndUpdateStorage(): number {
  const possibleIndexes: number[] = JSON.parse(
    getFromStorage(constants.INDEXES_KEY)
  );
  if (possibleIndexes.length === 0) {
    return -1;
  }

  const index = getRandomIndex(possibleIndexes.length);
  const cardsIndex = possibleIndexes[index];

  possibleIndexes.splice(index, 1);

  localStorage.setItem(constants.INDEXES_KEY, JSON.stringify(possibleIndexes));

  return cardsIndex;
}

function getRandomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}
