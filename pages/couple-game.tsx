import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'
import * as constants from '../constants/couple-game'

export default function CoupleGame() {
  const [card, setCard] = useState(new Card("Game hasn't started", "Are you ready to play?"))

  useEffect(() => {
    if (localStorage.getItem(constants.INDEXES_KEY) === null) {
      init()
    }
  })

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Welcome to the couple game! 💕😘</h1>
        <br />
        <p>
          Card type: {card.type} 😉🧐
        </p>
        <p>
          {card.text}
        </p>
        <button onClick={() => setCard(getCard())}>
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
      </main>
    </div>
  )
}

function init() {
  const size = constants.GUESS_LIST.length + constants.CHALLENGE_LIST.length
  const possibleIndexes = Array.from(Array(size).keys())

  localStorage.setItem(constants.INDEXES_KEY, JSON.stringify(possibleIndexes))

  window.location.reload()
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