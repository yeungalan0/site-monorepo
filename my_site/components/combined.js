/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { Fragment } from "react";
import CountDisplay from "./count-display";
import { PaypalButton } from "./payments";

class Combined extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: null, isNewCount: null };
  }

  updateCount(count, isNewCount) {
    this.setState({ count: count, isNewCount: isNewCount });
  }

  render() {
    return (
      <Fragment>
        <CountDisplay
          count={this.state.count}
          isNewCount={this.state.isNewCount}
        />
        <PaypalButton updateCountCallback={this.updateCount.bind(this)} />
      </Fragment>
    );
  }
}

export default Combined;
