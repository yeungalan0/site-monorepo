import styles from "../styles/Home.module.css";
import React, { Fragment, useEffect, useRef, useState } from "react";
import * as constants from "../constants/couple-game";

export default function CoupleGame(): JSX.Element {
  const [players, setPlayers] = useState<string[]>([]);
  const [cardsTodo, setCardsTodo] = useState(-1);
  const [cont, setCont] = useState(false);
  const playerInput = useRef<HTMLInputElement>(null);

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
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Welcome to the couple game! 💕😘</h1>
        <br />
        <Content
          handleSubmit={handleSubmit}
          playerInput={playerInput}
          players={players}
          cardsTodo={cardsTodo}
          cont={cont}
          setCont={setCont}
        />
      </main>
      <footer>
        <p>Dedicated to my wonderful girlfriend, Jen 😳😽</p>
      </footer>
    </div>
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
  if (players.length > 0 && cont) {
    return <CoupleGameBoard players={players} />;
  } else {
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <label title="Enter comma separated names, e.g. 'Alan,Jen'">
            Input player names:
            <input type="text" ref={playerInput} />
          </label>
          <input type="submit" value="Start new game!" />
        </form>
        <p>Enter comma separated names, e.g. &apos;Alan,Jen&apos;</p>
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
      <label>
        Saved game detected, continue as: {players.join(", ")}? ({cardsTodo}{" "}
        cards left)
        <br />
        <button onClick={() => onContinue(true)}>Continue</button>
      </label>
    </div>
  );
}

function CoupleGameBoard({ players }: { players: string[] }): JSX.Element {
  const [card, setCard] = useState(() => drawCard());
  const [turn, setTurn] = useState(0);
  const [scores, setScores] = useState(() =>
    Object.fromEntries(players.map((player) => [player, 0]))
  );

  function init(): void {
    resetCards();
    setScores(Object.fromEntries(players.map((player) => [player, 0])));
    setCard(drawCard());
  }

  function nextTurn(): void {
    setCard(drawCard());
    setTurn(turn + 1);
  }

  function getCurrentPlayerTurn(): string {
    return players[turn % players.length];
  }

  function pointsEarned(): void {
    scores[getCurrentPlayerTurn()] += 1;
    setScores(scores);
    nextTurn();
  }

  return (
    <Fragment>
      <p>Players: {players.join(" ❤️ ")}</p>
      <GameStats
        currentPlayerTurn={getCurrentPlayerTurn()}
        turn={turn}
        scores={scores}
      />
      <p>
        Card type: <b>{card.type}</b> 😉🧐
      </p>
      <p>{card.text}</p>
      <button onClick={() => nextTurn()}>Incorrect :(</button>
      <button onClick={() => pointsEarned()}>Correct! :)</button>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <button onClick={() => init()}>Reset</button>
    </Fragment>
  );
}

function GameStats({
  currentPlayerTurn,
  scores,
}: {
  currentPlayerTurn: string;
  turn: number;
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
        Turn (to earn points): {currentPlayerTurn}, Card: {cardsTodo}/{allCards}
        <br />
      </p>
      <ul>{listItems}</ul>
    </div>
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

function drawCard(): Card {
  const index = getRandomIndexAndUpdateStorage();
  if (index === -1) {
    return new Card("GAME OVER", "All cards completed!");
  }

  if (typeof constants.GUESS_LIST[index] !== "undefined") {
    return new Card(constants.GUESS_CARD, constants.GUESS_LIST[index]);
  } else {
    const challengeIndex = index - constants.GUESS_LIST.length;
    return new Card(
      constants.CHALLENGE_CARD,
      constants.CHALLENGE_LIST[challengeIndex]
    );
  }
}

class Card {
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
