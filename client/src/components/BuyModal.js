import Cookies from 'js-cookie';
import axios from 'axios';
import React, { useEffect } from 'react';
import constants from '../constants';

function BuyModal(props) {
    let stock = props.stock;
    let stockIndex = props.stockIndex;

    useEffect(() => {
        // setTimeout(() => { // Workaround
        window.M.Modal.init(document.querySelectorAll('.modal'));
        // }, 500);
    });

    function handleSubmit(event) {
        event.preventDefault();
        let quantity = document.getElementById("quantityInput").value;
        let rate = document.getElementById("rateInput").value;
        if (!quantity || !rate) {
            window.M.toast({ html: "Please fill in all fields", classes: "toast-error" });
            return;
        } else {
            axios.post(`${constants.DOMAIN}/placeOrder`, {
                userToken: Cookies.get(constants.tokenCookieName),
                orderId: String(Math.round(Math.random() * 1000000)),
                quantity: -1 * quantity,
                rate,
                stockIndex
            })
                .then(function (response) {
                    response = response.data;
                    console.log("placeOrder", response);
                    if (response.ok) {

                    } else {
                        window.M.toast({ html: response.message, classes: "toast-error" });
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
    return (
        <div id="buyModal" className="modal">
            <form onSubmit={handleSubmit}>
                <div className="modal-content">
                    <h4>Buy '{stock.name}'</h4>
                    <div className="input-field">
                        <input id="quantityInput" type="number" className="validate" name="quantity" min="1" step="1" />
                        <label htmlFor="quantity">Quantity</label>
                    </div>
                    <div className="input-field">
                        <input id="rateInput" type="number" className="validate" name="rate" />
                        <label htmlFor="rate">Buying Price</label>
                    </div>
                </div>
                <div className="modal-footer">
                    <button href="#!" className="mx-2 modal-close waves-effect waves-green btn-flat">Close</button>
                    <button href="#!" type="submit" className="mx-2 modal-close waves-effect waves-green btn-flat">Buy</button>
                </div>
            </form>
        </div>
    );
}

export default BuyModal;
