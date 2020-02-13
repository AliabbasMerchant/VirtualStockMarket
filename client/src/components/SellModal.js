import axios from 'axios';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { placeOrder, deletePendingOrder } from '../reducers/orders';
import constants from '../constants';

const SellModal = ({ stock, holding, keepId, placeOrder, userToken, deletePendingOrder }) => {
    let sellQuantityInputRef = React.createRef();
    let sellRateInputRef = React.createRef();

    useEffect(() => {
        setTimeout(() => {
            if (document.querySelectorAll('.modal'))
                window.M.Modal.init(document.querySelectorAll('.modal'));
        }, 500);
    });

    function handleSubmit(event) {
        event.preventDefault();
        let quantity = sellQuantityInputRef.current.value;
        let rate = sellRateInputRef.current.value;
        if (!quantity || !rate) {
            window.M.toast({ html: "Please fill in all fields", classes: "toast-error" });
            return;
        } else {
            let order = {
                orderId: String(Math.round(Math.random() * 1000000000)),
                quantity: Number(quantity),
                rate: Number(rate),
                stockIndex: holding.stockIndex
            }
            placeOrder(order);
            axios.post(`${constants.DOMAIN}/placeOrder`, {
                userToken,
                ...order
            })
                .then(function (response) {
                    response = response.data;
                    if (response.ok) {
                        window.M.toast({ html: "Pending Order Successfully Placed", classes: "toast-success" });
                        // placeOrder(order);
                    } else {
                        window.M.toast({ html: response.message, classes: "toast-error" });
                        deletePendingOrder(order.orderId);
                    }
                })
                .catch(err => {
                    console.log(err);
                    deletePendingOrder(order.orderId);
                });
        }
    }
    return (
        <div id={keepId} className="modal">
            <form onSubmit={handleSubmit}>
                <div className="modal-content">
                    <h4>Sell '{stock.name}'</h4>
                    <div>Current Market Rate: {(stock.rate).toFixed(2)}</div>
                    <div className="input-field">
                        <label htmlFor="quantity" className="active">Quantity</label>
                        <input ref={sellQuantityInputRef} type="number" className="validate" name="quantity" min="1" step="1" max={Math.abs(holding.quantity)} defaultValue={Math.abs(holding.quantity)} />
                    </div>
                    <div className="input-field">
                        <label htmlFor="rate" className="active">Selling Price</label>
                        <input ref={sellRateInputRef} type="number" className="validate" name="rate" defaultValue={Math.round(stock.rate)} />
                    </div>
                </div>
                <div className="modal-footer">
                    <a href="#!" className="mx-2 modal-close waves-effect waves-green btn-flat">Close</a>
                    <button href="#!" type="submit" className="mx-2 modal-close waves-effect waves-green btn-flat">Sell</button>
                </div>
            </form>
        </div>
    );
}

const mapStateToProps = (state) => ({
    userToken: state.auth
});

const mapDispatchToProps = { placeOrder, deletePendingOrder };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SellModal);
