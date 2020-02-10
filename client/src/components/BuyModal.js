import Cookies from 'js-cookie';
import axios from 'axios';
import React, { useEffect } from 'react';

import constants from '../constants';

function BuyModal(props) {
    let stock = props.stock;
    let stockIndex = props.stockIndex;
    let keepId = props.keepId;
    let orderPlacedFunction = props.orderPlacedFunction;
    let buyQuantityInputRef = React.createRef();
    let buyRateInputRef = React.createRef();

    useEffect(() => {
        setTimeout(() => {
            if (document.querySelectorAll('.modal'))
                window.M.Modal.init(document.querySelectorAll('.modal'));
        }, 500);
    });

    function handleSubmit(event) {
        event.preventDefault();
        let quantity = buyQuantityInputRef.current.value;
        let rate = buyRateInputRef.current.value;
        if (!quantity || !rate) {
            window.M.toast({ html: "Please fill in all fields", classes: "toast-error" });
            return;
        } else {
            let order = {
                orderId: String(Math.round(Math.random() * 1000000)),
                quantity: -1 * Number(quantity),
                rate: Number(rate),
                stockIndex
            }
            axios.post(`${constants.DOMAIN}/placeOrder`, {
                userToken: Cookies.get(constants.tokenCookieName),
                ...order
            })
                .then(function (response) {
                    response = response.data;
                    if (response.ok) {
                        window.M.toast({ html: "Pending Order Successfully Placed", classes: "toast-success" });
                        orderPlacedFunction(order);
                    } else {
                        window.M.toast({ html: response.message, classes: "toast-error" });
                    }
                })
                .catch(console.log);
        }
    }
    return (
        <div id={keepId} className="modal">
            <form onSubmit={handleSubmit}>
                <div className="modal-content">
                    <h4>Buy '{stock.name}'</h4>
                    <div>Current Market Rate: {(stock.rate).toFixed(2)}</div>

                    <div className="input-field">
                        <label htmlFor="quantity" className="active">Quantity</label>
                        <input ref={buyQuantityInputRef} type="number" className="validate" name="quantity" min="1" step="1" defaultValue={10} />
                    </div>
                    <div className="input-field">
                        <label htmlFor="rate" className="active">Buying Price</label>
                        <input ref={buyRateInputRef} type="number" className="validate" name="rate" defaultValue={Math.round(stock.rate)} />
                    </div>
                </div>
                <div className="modal-footer">
                    <a href="#!" className="mx-2 modal-close waves-effect waves-green btn-flat">Close</a>
                    <button href="#!" type="submit" className="mx-2 modal-close waves-effect waves-green btn-flat">Buy</button>
                </div>
            </form>
        </div>
    );
}

export default BuyModal;
