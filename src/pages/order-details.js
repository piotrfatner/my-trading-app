import {LitElement, html, css} from 'lit';
import {api} from '../services/api-client.js';
import { translateStatus, formatDate } from '../utils/order-utils.js';

export class OrderDetails extends LitElement {
    static properties = {
        orderId: {type: String},
        order: {type: Object},
        open: {type: Boolean},   // true jeśli modal ma być widoczny
        loading: {type: Boolean},
        error: {type: String}
    };

    static styles = css`     :host {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        z-index: 1000;
    }

        .modal {
            background: white;
            padding: 20px;
            border-radius: 8px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .hidden {
            display: none;
        }

        button {
            margin-top: 12px;
            padding: 6px 12px;
            cursor: pointer;
        }
    `;

    constructor() {
        super();
        this.open = false;
        this.orderId = '';
        this.order = null;
        this.loading = false;
        this.error = '';
    }

// wywoływane przy zmianie property
    updated(changedProps) {
        if (changedProps.has('open') && this.open && this.orderId) {
            this.fetchOrderDetails();
        }
    }

    async fetchOrderDetails() {
        this.loading = true;
        this.error = '';
        this.order = null;
        try {
            this.order = await api.getOrderDetails(this.orderId); // GET /orders/{orderId}
        } catch (err) {
            this.error = err.message;
        } finally {
            this.loading = false;
        }
    }

    close() {
        this.open = false;
        this.order = null;
        this.dispatchEvent(new CustomEvent('close', {bubbles: true, composed: true}));
    }

    render() {
        return html`
            <div class=${this.open ? '' : 'hidden'}>
                <div class="modal"><h3>Szczegóły zamówienia ${this.orderId}</h3>
                    ${this.loading ? html`<p>Ładowanie...</p>` : ''}
                    ${this.error ? html`<p style="color:red">${this.error}</p>` : ''}
                    ${this.order ? html` 
                        <p>Numer zlecenia: ${this.order.orderId}</p> 
                        <p>Status: ${translateStatus(this.order.status)}</p> 
                        <p>ISIN: ${this.order.isin}</p> 
                        <p>Waluta: ${this.order.tradeCurrency}</p> 
                        <p>Kurs: ${this.order.executionPrice}</p> 
                        <p>Liczba: ${this.order.quantity}</p>
                        <p>Wartość zlecenia: ${this.order.quantity * this.order.executionPrice}</p>
                        <p>Data rejestracji: ${formatDate(this.order.registrationTime)}</p>
                        <p>Data wykonania: ${formatDate(this.order.executedTime)}</p>
                        <p>Prowizja: ${this.order.commission}</p>
                    ` : ''}
                    <button @click=${this.close}>Zamknij</button>
                </div>
            </div>
        `;
    }
}

customElements.define('order-details', OrderDetails);
