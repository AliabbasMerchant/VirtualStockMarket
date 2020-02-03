import React from 'react';
import { connect } from 'react-redux';
import { fundsChange } from '../reducers/funds';

const VSM = ({ funds, fundsChange }) => {
    return (
        <div className="mx-0 center container" style={{ width: '100%', maxWidth: '100%' }}>
            VSM
            <div>Funds: {funds}</div>
            <div onClick={() => { fundsChange(50); }}>Change by 50</div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    funds: state.funds
});

const mapDispatchToProps = { fundsChange };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VSM);


// import { StocksContext } from '../contexts/stocks';
// import StocksListElement from './StocksListElement';
// function VSM() {
//     return (
//         <StocksContext.Consumer>
//             {(stocksContext) =>
//                 stocksContext.stocks ?
//                     <div className="mx-0 center container" style={{ width: '100%', maxWidth: '100%' }}>
//                         <table className="row">
//                             <tbody>
//                                 {stocksContext.stocks.map((stock, stockIndex) => {
//                                     return <StocksListElement key={stockIndex} data={stock} id={stockIndex} />
//                                 })}
//                             </tbody>
//                         </table>
//                     </div> :
//                     <div className="center container">No stocks</div>
//             }
//         </StocksContext.Consumer>
//     );
// }
