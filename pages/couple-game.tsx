import styles from '../styles/Home.module.css'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import * as constants from '../constants/couple-game'
import { Stats } from 'node:fs'

// TODO linting...

export default function CoupleGame() {
  const [players, setPlayers] = useState<string[]>([])
  const [cardsTodo, setCardsTodo] = useState(-1)
  const [cont, setCont] = useState(false)
  const playerInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const savedPlayersJSON = localStorage.getItem(constants.PLAYERS_KEY)
    if (savedPlayersJSON !== null) {
      const savedCardsToDo = JSON.parse(localStorage.getItem(constants.INDEXES_KEY)!).length
      setPlayers(JSON.parse(savedPlayersJSON))
      setCardsTodo(savedCardsToDo)
    }
  }, [])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const inputPlayers = playerInput.current!.value.split(',').map(s => s.trim())
    if (inputPlayers.length < 2 || inputPlayers.includes('')) {
      alert(`Not enough players detected or an empty player detected! Players: ${inputPlayers.join(', ')}`)
    } else {
      setPlayers(inputPlayers)
      setCont(true)
      resetCards()
      localStorage.setItem(constants.PLAYERS_KEY, JSON.stringify(inputPlayers))
      event.preventDefault()
    }
  }

  let content: JSX.Element

  if (players.length > 0 && cont) {
    console.log(`PLAYERS: ${players}, ${players.length}`)
    content =  <ActualCoupleGame players={players}/>
  } else {
    let cont = <div></div>
    if (players.length > 0) {
      cont = (
        <div>
          <label>
            Saved game detected, continue as: {players.join(", ")}? ({cardsTodo} cards left)
            <br/>
            <button onClick={() => setCont(true)}>
            Continue
          </button>
          </label>
        </div>
      )
    }

    content = (
      <div>
        <form onSubmit={handleSubmit}>
          <label title="Enter comma separated names, e.g. 'Alan,Jen'">
            Input player names:
            <input type="text" ref={playerInput}/>
          </label>
          <input type="submit" value="Start new game!" />
        </form>
        <p>
          Enter comma separated names, e.g. 'Alan,Jen'
        </p>
        {cont}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Welcome to the couple game! 💕😘</h1>
        <br />
        {content}
      </main>
      <footer>
        <p>Dedicated to my wonderful girlfriend, Jen 😳😽</p>
      </footer>
    </div>
  )
}

function ActualCoupleGame({ players }: { players: string[] }) {
  const [card, setCard] = useState(() => drawCard())
  const [turn, setTurn] = useState(0)

  function init() {
    resetCards()
    setCard(drawCard())
  }

  function nextTurn() {
    setCard(drawCard())
    setTurn(turn + 1)
  }

  return (
    <Fragment>
      <p>
        Players: {players.join(" ❤️ ")}
      </p>
      <GameStats players={players} turn={turn}/>
      <p>
        Card type: <b>{card.type}</b> 😉🧐
      </p>
      <p>
        {card.text}
      </p>
      <button onClick={() => nextTurn()}>
        Next turn
      </button>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <button onClick={() => init()}>
        Reset
      </button>
    </Fragment>
  )
}

function GameStats({players, turn}: {players: string[], turn: number}) {
  const currentPlayerTurn = players[turn % players.length]
  const allCards = constants.GUESS_LIST.length + constants.CHALLENGE_LIST.length
  const cardsTodo = JSON.parse(localStorage.getItem(constants.INDEXES_KEY)!).length

  return (
    <p>
      Player turn: {players[turn % players.length]}, Card: {cardsTodo}/{allCards}
    </p>
  )
}

function resetCards() {
  const size = constants.GUESS_LIST.length + constants.CHALLENGE_LIST.length
  const possibleIndexes = Array.from(Array(size).keys())

  localStorage.setItem(constants.INDEXES_KEY, JSON.stringify(possibleIndexes))
}

function drawCard(): Card {
  const index = getRandomIndexAndUpdateStorage()
  if (index === -1) {
    return new Card('GAME OVER', 'All cards completed!')
  }

  if (typeof constants.GUESS_LIST[index] !== 'undefined') {
    return new Card(constants.GUESS_CARD, constants.GUESS_LIST[index])
  } else {
    const challengeIndex = index - constants.GUESS_LIST.length
    return new Card(constants.CHALLENGE_CARD, constants.CHALLENGE_LIST[challengeIndex])
  }
}

class Card {
  type: string
  text: string

  constructor(cardType: string, cardText: string) {
    this.type = cardType
    this.text = cardText
  }
}

function getRandomIndexAndUpdateStorage(): number {
  const possibleIndexes: number[] = JSON.parse(localStorage.getItem(constants.INDEXES_KEY)!)
  if (possibleIndexes.length == 0) {
    return -1
  }

  const index = getRandomIndex(possibleIndexes.length)
  const cardsIndex = possibleIndexes[index]

  possibleIndexes.splice(index, 1)

  localStorage.setItem(constants.INDEXES_KEY, JSON.stringify(possibleIndexes))

  return cardsIndex
}

function getRandomIndex (length: number) {
  return Math.floor(Math.random() * length)
}