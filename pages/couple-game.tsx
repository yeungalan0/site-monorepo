import styles from '../styles/Home.module.css'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import * as constants from '../constants/couple-game'

export default function CoupleGame() {
  const [players, setPlayers] = useState<string[]>([])
  const playerInput = useRef<HTMLInputElement>(null)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    setPlayers(playerInput.current!.value.split(","))
    event.preventDefault()
  }

  let content: JSX.Element

  if (players.length > 0) {
    console.log(`PLAYERS: ${players}, ${players.length}`)
    content =  <ActualCoupleGame players={players}/>
  } else {
    content = (
      <div>
        <form onSubmit={handleSubmit}>
          <label title="Enter comma separated names, e.g. 'Alan,Jen'">
            Input player names:
            <input type="text" ref={playerInput}/>
          </label>
          <input type="submit" value="Let's play!" />
        </form>
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
        <p>Dedicated to my wonderful girlfriend, Jen 😳</p>
      </footer>
    </div>
  )
}

type CoupleGameProps = {
  players: string[]
}

function ActualCoupleGame({ players }: CoupleGameProps) {
  const [card, setCard] = useState(new Card("Game hasn't started", "Are you ready to play?"))
  const [turn, setTurn] = useState(0)

  useEffect(() => {
    if (localStorage.getItem(constants.INDEXES_KEY) === null) {
      init()
    }
  })

  function init() {
    const size = constants.GUESS_LIST.length + constants.CHALLENGE_LIST.length
    const possibleIndexes = Array.from(Array(size).keys())
  
    localStorage.setItem(constants.INDEXES_KEY, JSON.stringify(possibleIndexes))
  
    setCard(getCard())
  }

  function nextTurn() {
    setCard(getCard())
    setTurn(turn + 1)
  }

  return (
    <Fragment>
      <p>
        Players: {players.join(", ")}
      </p>
      <p>
        Player turn: {players[turn % players.length]}
      </p>
      <p>
        Card type: {card.type} 😉🧐
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

function getCard(): Card {
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