import React from 'react';
function rateChangeDiv(change) {
    if (change >= 0) {
        return <div className="green">{"+"}change</div>;
    }
    return <div className="red">change</div>;
}
function StocksListElement(props) {
    return (
        <div style={{ display: 'flex' }}>
            <div>props.data.scrip</div>
            <div>props.data.rate</div>
            {rateChangeDiv(props.data.rate - props.data.prevRate)}
        </div>
    );
}

export default StocksListElement;
