import {
    useHistory,
} from "react-router-dom";
import React from 'react';

import FlashContainer from './FlashContainer';

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
        return <td className="green-text px-2 textAlignRight">
            <FlashContainer value={format(change)} />
        </td>;
    }
    return <td className="red-text px-2 textAlignRight">
        <FlashContainer value={format(change)} />
    </td>;
}

const StocksListElement = ({ id, stock }) => {
    let history = useHistory();
    return <tr className="stocksListElement" onClick={() => history.push(`/vsm/stock?stockIndex=${id}`)} style={{ cursor: 'pointer' }}>
        <td className="px-2"><b>{stock.scrip}</b></td>
        <td className="px-2 center">
            <FlashContainer value={format(stock.rate, 7, false, ' ')} />
        </td>
        {rateChangeDiv(stock.rate - stock.prevRate)}
    </tr>;
}

export default StocksListElement;