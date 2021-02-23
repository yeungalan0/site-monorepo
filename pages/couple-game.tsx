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
  Tooltip,
  Typography,
} from "@material-ui/core";

import Header from "../src/header";
import { makeStyles } from "@material-ui/styles";
import theme from "../src/theme";

// style={{ border: "solid 1px", backgroundColor: "orange" }}

const useStyles = makeStyles(() => ({
  footer: {
    top: "auto",
    bottom: 0,
    background: "transparent",
    boxShadow: "none",
    color: "black",
    textAlign: "center",
  },
  contentContainer: {
    height: "92vh",
  },
  title: {
    padding: theme.spacing(2),
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    flex: "1",
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
  },
  start: {
    paddingBottom: theme.spacing(3),
  },
  cardGrid: {
    display: "flex",
  },
  gameCard: {
    width: "50%",
    minWidth: "16vw",
    height: "32vh",
    overflow: "auto",
    maxHeight: "20%",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
  },
  cardType: {
    marginBottom: theme.spacing(3),
  },
  cardButtons: {
    justifyContent: "center",
  },
  playerStats: {
    boxShadow: "none",
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
      <Grid container direction="column" className={classes.contentContainer}>
        <Grid item>
          <Header />
        </Grid>
        <Grid item>
          <Typography variant="h4" align="center" className={classes.title}>
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
      <AppBar position="sticky" className={classes.footer}>
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
      <div className={classes.content}>
        <form onSubmit={handleSubmit} className={classes.start}>
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
  const [playerStats, setPlayerStats] = useState(() => resetPlayerStats());

  function init(): void {
    resetCards();
    setPlayerStats(resetPlayerStats());
    setCard(drawCard());
  }

  function resetPlayerStats() {
    return players.map((player) => new PlayerStat(player, 0));
  }

  function nextTurn(): void {
    setCard(drawCard());
    setTurn((turn + 1) % players.length);
  }

  function pointsEarned() {
    playerStats[turn].incrementScore();
    setPlayerStats(playerStats);
    nextTurn();
  }

  const allCards =
    constants.GUESS_LIST.length + constants.CHALLENGE_LIST.length;
  const cardsTodo = JSON.parse(getFromStorage(constants.INDEXES_KEY)).length;

  return (
    <div className={classes.content}>
      <Grid container direction="column">
        <Grid container item justify="center" spacing={2}>
          {getPlayerStatCards(playerStats, turn)}
        </Grid>
        <Grid item>
          Card: {cardsTodo}/{allCards}
        </Grid>
        <Grid
          item
          alignItems="center"
          justify="center"
          className={classes.cardGrid}
        >
          <Card variant="outlined" className={classes.gameCard}>
            <CardContent>
              <Typography
                color="textSecondary"
                gutterBottom
                className={classes.cardType}
              >
                <b>{card.type}</b>
              </Typography>
              <Typography>{card.text}</Typography>
            </CardContent>
            <CardActions className={classes.cardButtons}>
              {/* TODO: Buttons outside card since content size shifts them */}
              <Button
                variant="contained"
                size="small"
                onClick={() => nextTurn()}
              >
                Incorrect 😓
              </Button>
              <Box padding={theme.spacing(0.2)}></Box>
              <Button
                variant="contained"
                size="small"
                onClick={() => pointsEarned()}
              >
                Correct 🙂
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Box
          height="13vh"
          display="flex"
          alignItems="center"
          alignContent="center"
          justifyContent="center"
          textAlign="center"
          flex="1 0 auto"
        >
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => init()}
            >
              Reset
            </Button>
          </Grid>
        </Box>
      </Grid>
    </div>
  );
}

function getPlayerStatCards(playerStats: PlayerStat[], turnIndex: number) {
  const classes = useStyles();
  const playerStatCards: JSX.Element[] = [];

  playerStats.forEach((playerStat, index) => {
    let props: {
      color: "initial" | "textSecondary";
      gutterBottom: boolean;
      variant: "outlined" | undefined;
      title: string;
    } = {
      color: "textSecondary",
      gutterBottom: true,
      variant: undefined,
      title: "",
    };
    if (turnIndex === index) {
      props = {
        color: "initial",
        gutterBottom: false,
        variant: "outlined",
        title: "Your turn to earn points!",
      };
    }

    playerStatCards.push(
      <Grid item>
        <Tooltip title={props.title}>
          <Card variant={props.variant} className={classes.playerStats}>
            <CardContent>
              <Typography color={props.color} gutterBottom={props.gutterBottom}>
                <b>{playerStat.name}</b>
              </Typography>
              <Typography>{playerStat.score}</Typography>
            </CardContent>
          </Card>
        </Tooltip>
      </Grid>
    );

    if (index !== playerStats.length - 1) {
      playerStatCards.push(
        <Grid item>
          <Box display="flex" alignItems="center" height="100%">
            ❤️
          </Box>
        </Grid>
      );
    }
  });

  return playerStatCards;
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

function drawCard(): GameCard {
  const index = getRandomIndexAndUpdateStorage();
  if (index === -1) {
    return new GameCard("GAME OVER", "All cards completed!");
  }

  if (typeof constants.GUESS_LIST[index] !== "undefined") {
    return new GameCard(constants.GUESS_CARD, constants.GUESS_LIST[index]);
  } else {
    const challengeIndex = index - constants.GUESS_LIST.length;
    return new GameCard(
      constants.CHALLENGE_CARD,
      constants.CHALLENGE_LIST[challengeIndex]
    );
  }
}

class PlayerStat {
  name: string;
  score: number;

  constructor(name: string, score: number) {
    this.name = name;
    this.score = score;
  }

  incrementScore() {
    this.score += 1;
  }
}

class GameCard {
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
