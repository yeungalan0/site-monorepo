import Head from "next/head";
import React from "react";
import Combined from "../components/combined";
import styles from "../styles/Home.module.css";

function Description() {
  const description =
    "1. Pay $1 using any of the methods below \n" +
    "2. See how many other beautiful people also paid $1 \n" +
    "3. Celebrate in your new found wisdom \n" +
    "(or charge others 50 cents for your new wisdom 😉)";

  return (
    <div>
      <p className={styles.description} style={{ textAlign: "left" }}>
        {description}
      </p>
    </div>
  );
}

export default function Home(): JSX.Element {
  return (
    <div className={styles.container}>
      <Head>
        <title>One Dollar Site</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to my One Dollar Site</h1>

        <Description />
        <Combined />
      </main>
    </div>
  );
}
