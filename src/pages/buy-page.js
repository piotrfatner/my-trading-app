import {LitElement, html, css} from 'lit';
import {api} from '../services/api-client.js';
import {live} from 'lit/directives/live.js';
import '@lion/ui/define/lion-form.js';
import '@lion/ui/define/lion-input.js';
import '@lion/ui/define/lion-input-amount.js';
import '@lion/ui/define/lion-select.js';
import '@lion/ui/define/lion-option.js';
import '@lion/ui/define/lion-select.js';
import { MinNumber } from '@lion/ui/form-core.js';

import { Required, MinDate, MinLength, MaxLength, DefaultSuccess, EqualsLength } from '@lion/ui/form-core.js';

class CustomMinDate extends MinDate {
    static async getMessage(data) {
        return `Data nie może być wcześniejsza niż ${new Date().toLocaleString()}`;
    }
}

export class BuyPage extends LitElement {
    static properties = {
        formData: {type: Object},
        instruments: {type: Array},
        instrumentPrices: {type: Array},
        currentPrice: {type: Number},
        loading: {type: Boolean},
        success: {type: String},
        error: {type: String}
    };

    static styles = css`     :host {
        display: block;
        font-family: sans-serif;
        padding: 16px;
    }

        form {
            display: flex;
            flex-direction: column;
            max-width: 400px;
            gap: 12px;
        }
        lion-form {
            display: flex;
            flex-direction: column;
            max-width: 400px;
            gap: 12px;
        }

        input, select {
            padding: 6px 8px;
            font-size: 14px;
        }

        button {
            padding: 8px 12px;
            cursor: pointer;
        }

        .success {
            color: green;
        }

        .error {
            color: red;
        }
    `;

    constructor() {
        super();
        this.formData = {
            isin: '',
            side: 'BUY',
            tradeCurrency: 'PLN',
            quantity: 1,
            expiresAt: Math.floor(Date.now() / 1000) + 900, // Adding 15 minutes to current time as on stock market timing
            orderType: 'LMT',
            limitPrice: 0
        };
        this.instruments = [];
        this.instrumentPrices = [];
        this.currentPrice = null;
        this.loading = false;
        this.success = '';
        this.error = '';
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadInstrumentsData();
    }

    async loadInstrumentsData() {
        try {
            const [instruments, prices] = await Promise.all([
                api.getInstruments(),
                api.getCurrentPrices()
            ]);
            this.instruments = instruments;
            this.instrumentPrices = prices;
        } catch (err) {
            console.error('Failed to load data', err);
            this.error = 'Nie udało się pobrać danych.';
        }
    }


    handleInput(e) {
        const name = e.target.name;
        let value = e.target.modelValue;

        if (name === 'expiresAt') {
            const timestamp = Math.floor(new Date(value).getTime() / 1000);
            this.formData = { ...this.formData, [name]: timestamp };
        }else if (name === 'isin') {
            // When ISIN changes, update currency and price
            const selectedInstrument = this.instruments.find(i => i.isin === value);
            const priceObj = this.instrumentPrices.find(p => p.isin === value);

            this.currentPrice = priceObj ? priceObj.price : null;

            this.formData = {
                ...this.formData,
                [name]: value,
                tradeCurrency: selectedInstrument ? selectedInstrument.tradeCurrency : this.formData.tradeCurrency
            };
        } else {
            this.formData = {...this.formData, [name]: value};
        }
    }

    getFormattedExpiresAt() {
        if (!this.formData.expiresAt) return '';
        const date = new Date(this.formData.expiresAt * 1000);
        const offset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - offset).toISOString().slice(0, 16);
    }

    getMinDateTime() {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        return new Date(now.getTime() - offset).toISOString().slice(0, 16);
    }

    async submitForm(e) {
        if (e.target.hasFeedbackFor.includes('error')) {
            return;
        }

        this.loading = true;
        this.success = '';
        this.error = '';

        try {
            const dataToSend = {
                ...this.formData,
                quantity: Number(this.formData.quantity),
                limitPrice: Number(this.formData.limitPrice),
                expiresAt: Number(this.formData.expiresAt)
            };
            await api.createOrder(dataToSend);
            this.success = 'Zamówienie złożone pomyślnie!';

            // Reset form
            this.formData = {
                isin: '',
                side: 'BUY',
                tradeCurrency: 'PLN',
                quantity: 1,
                expiresAt: Math.floor(Date.now() / 1000) + 900,
                orderType: 'LMT',
                limitPrice: 0
            };

            // Also clear Lion form states (dirty, touched, etc.)
            const form = this.shadowRoot.querySelector('lion-form');
            form.resetGroup();

        } catch (err) {
            this.error = err.message;
        } finally {
            this.loading = false;
        }
    }

    render() {
        return html`
            <h2>Złóż zamówienie (Lion)</h2>
            ${this.success ? html`<p class="success">${this.success}</p>` : ''}
            ${this.error ? html`<p class="error">${this.error}</p>` : ''}

            <lion-form @submit=${this.submitForm}>
                <form>
                    <lion-select
                            name="isin"
                            label="Instrument"
                            .modelValue=${live(this.formData.isin)}
                            .validators=${[new Required()]}
                            @model-value-changed=${this.handleInput}>
                        <select slot="input">
                            <option value="" disabled selected>Wybierz instrument</option>
                            ${this.instruments.map(inst => html`
                                <option value=${inst.isin}>${inst.name} (${inst.ticker})</option>
                            `)}
                        </select>
                    </lion-select>

                    <lion-input
                            name="quantity"
                            type="number"
                            label="Liczba do zakupu"
                            .modelValue=${live(this.formData.quantity)}
                            .validators=${[
                                new MinNumber(1, { getMessage: () => 'Minimalna liczba do zakupu to 1!' })
                            ]}
                            @model-value-changed=${this.handleInput}>
                    </lion-input>

                    <lion-select
                            name="side"
                            label="Strona"
                            .modelValue=${live(this.formData.side)}
                            .validators=${[new Required()]}
                            @model-value-changed=${this.handleInput}>
                        <select slot="input">
                            <option value="BUY">Kupno</option>
                            <option value="SELL">Sprzedaż</option>
                        </select>
                    </lion-select>

                    <lion-select
                            name="orderType"
                            label="Typ zlecenia"
                            .modelValue=${live(this.formData.orderType)}
                            @model-value-changed=${this.handleInput}>
                        <select slot="input">
                            <option value="LMT">Limit</option>
                            <option value="MKT">Market</option>
                            <option value="PCK">Po każdej cenie</option>
                        </select>
                    </lion-select>

                    <lion-input-amount
                            name="limitPrice"
                            type="number"
                            label="Limit ceny"
                            .modelValue=${live(this.formData.limitPrice)}
                            .validators=${[new MinNumber(0.01, { getMessage: () => html`<div><b>Note</b> Minimalna cena musi być większa od 0!</div>` }),]}
                            ?disabled="${this.formData.orderType !== 'LMT'}"
                            @model-value-changed=${this.handleInput}>
                    </lion-input-amount>

                    <lion-input
                            name="expiresAt"
                            type="datetime-local"
                            label="Zlecenie ważne do"
                            .modelValue=${live(this.getFormattedExpiresAt())}
                            min=${this.getMinDateTime()}
                            @model-value-changed=${this.handleInput}>
                    </lion-input>

                    ${this.currentPrice !== null ? html`
                        <p><strong>Aktualna cena:</strong> ${this.currentPrice} ${this.formData.tradeCurrency}</p>
                    ` : ''}

                    <lion-input
                            name="tradeCurrency"
                            label="Waluta"
                            .modelValue=${live(this.formData.tradeCurrency)}
                            .validators=${[new Required()]}
                            @model-value-changed=${this.handleInput}>
                    </lion-input>

                    <button type="submit" ?disabled=${this.loading}>Złóż zamówienie</button>
                </form>
            </lion-form>
        `;
    }
}

customElements.define('buy-page', BuyPage);
