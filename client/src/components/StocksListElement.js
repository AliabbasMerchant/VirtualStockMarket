import {
    useHistory,
} from "react-router-dom";
import React from 'react';

function format(number, length = 5, sign = true, pad = '0') {
    let n = Math.abs(number).toFixed(2).padStart(length, pad);
    if (sign) {
        if (number < 0) {
            n = "-" + n;
        } else {
            n = "+" + n;
        }
    }
    return n;
}

function rateChangeDiv(change) {
    if (change >= 0) {
        return <td className="green-text px-2 textAlignRight"> {format(change)} </td>;
    }
    return <td className="red-text px-2 textAlignRight"> {format(change)} </td>;
}

function StocksListElement(props) {
    let history = useHistory();
    return <tr className="stocksListElement" onClick={() => history.push(`/vsm/stock?stockIndex=${props.id}`)} style={{ cursor: 'pointer' }}>
        <td className="px-2"><b>{props.data.scrip}</b></td>
        <td className="px-2 center">{format(props.data.rate, 7, false, ' ')}</td>{rateChangeDiv(props.data.rate - props.data.prevRate)}
    </tr>;
}

export default StocksListElement;