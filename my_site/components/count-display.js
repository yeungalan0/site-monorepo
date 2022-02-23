/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styles from "../styles/Home.module.css";

export default function CountDisplay(props) {
  let count = props.count;
  let tip;
  if (count === null) {
    count = "???";
    tip = <span className={styles.tooltip}>Pay below to see!</span>;
  }

  return (
    <Fragment>
      <div className={styles.countBox}>
        {count}
        {tip}
      </div>
      <CountDescription
        isNewCount={props.isNewCount}
        count={props.count}
      ></CountDescription>
    </Fragment>
  );
}

CountDisplay.propTypes = {
  count: PropTypes.number,
  isNewCount: PropTypes.bool,
};

function CountDescription(props) {
  let countDescription;
  if (props.isNewCount === true) {
    // TODO: Nicely wrap this text
    countDescription = `${props.count} people have paid $1 to see how many other people have paid $1 (including you)!`;
  } else if (props.isNewCount === false) {
    countDescription = `(Old news) ${props.count} people have paid $1 to see how many other people have paid $1 (including you)!`;
  } else {
    countDescription =
      "Note: after payment please wait a few seconds and the count should appear on the page. Do not refresh!";
  }

  return <div className={styles.countDescription}>{countDescription}</div>;
}

CountDescription.propTypes = {
  count: PropTypes.number,
  isNewCount: PropTypes.bool,
};
