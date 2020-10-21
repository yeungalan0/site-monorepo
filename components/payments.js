import React from "react";
import { PayPalButton } from "react-paypal-button-v2";
import PropTypes from 'prop-types';
import { displayCount } from "../lib/count-api"

export function PaypalButton(props) {
    return (
        <PayPalButton
            amount="1.00"
            onSuccess={(details, data) => {
                displayCount(data.orderID, props.updateCountCallback)
            }}
            options={{
                clientId: process.env.NEXT_PUBLIC_CLIENT_ID
            }}
        />
    )
}

PaypalButton.propTypes = {
    updateCountCallback: PropTypes.func.isRequired
}