import React from 'react';
import { connect } from 'react-redux';

import StocksListElement from './StocksListElement';

const VSM = ({ stocks }) => {
    return (
        stocks.length ?
            <div className="mx-0 center container" style={{ width: '100%', maxWidth: '100%' }}>
                <table className="row">
                    <tbody>
                        {stocks.map((stock, stockIndex) => {
                            return <StocksListElement key={stockIndex} stock={stock} id={stockIndex} />
                        })}
                    </tbody>
                </table>
            </div> :
            <div className="center container">No stocks</div>
    );
};

const mapStateToProps = (state) => ({
    stocks: state.stocks
});

export default connect(
    mapStateToProps,
    null
)(VSM);
