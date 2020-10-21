import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React from 'react';
import Combined from '../components/combined';

function Description() {
  const description =  
  "1. Pay $1 using any of the methods below \n" + 
  "2. See how many other beautiful people also paid $1 \n" +
  "3. Celebrate in your new found wisdom \n" + 
  "(or charge others 50 cents for your new wisdom 😉)"

  return (
    <div>
        <p className={styles.description} style={{textAlign: "left"}}>
          {description}
        </p>
    </div>
  )
}

export default function Home() {


  return (
    <div className={styles.container}>
      <Head>
        <title>One Dollar Site</title>
        {/*TODO: Change this*/}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to my One Dollar Site
        </h1>

        <Description/>
        <Combined/>
      </main>

      {/* TODO: Update this */}
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
