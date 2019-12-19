import {
    useHistory,
    useLocation,
} from "react-router-dom";
import React from 'react';

function rateChangeDiv(change) {
    if (change >= 0) {
        return <td className="green-text px-2 textAlignRight">{"+"}{change}</td>;
    }
    return <td className="red-text px-2 textAlignRight">{change}</td>;
}

function StocksListElement(props) {
    let history = useHistory();
    return (
        <tr className="stocksListElement"
            onClick={() => history.push(`/vsm/stock?stockId=${props.id}`)} style={{ cursor: 'pointer' }}>
            <td className="px-2">{props.data.scrip}</td>
            <td className="px-2 center">{props.data.rate}</td>
            {rateChangeDiv(props.data.rate - props.data.prevRate)}
        </tr>
    );
}

export default StocksListElement;
