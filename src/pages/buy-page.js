import {LitElement, html, css} from 'lit';
import {api} from '../services/api-client.js';

export class BuyPage extends LitElement {
    static properties = {
        formData: {type: Object},
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
            quantity: 0,
            expiresAt: Math.floor(Date.now() / 1000) + 900, // Adding 15 minutes to current time as on stock market timing
            orderType: 'LMT',
            limitPrice: 0
        };
        this.loading = false;
        this.success = '';
        this.error = '';
    }

    handleInput(e) {
        const {name, value} = e.target;
        if (name === 'expiresAt') {
            const timestamp = Math.floor(new Date(value).getTime() / 1000);
            this.formData = { ...this.formData, [name]: timestamp };
        } else {
            this.formData = {...this.formData, [name]: value};
        }
    }

    async submitForm(e) {
        e.preventDefault();
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
            await api.createOrder(dataToSend); // POST /api/orders
            this.success = 'Zamówienie złożone pomyślnie!';
            this.formData = {
                isin: '',
                side: 'BUY',
                tradeCurrency: 'PLN',
                quantity: 0,
                expiresAt: Math.floor(Date.now() / 1000),
                orderType: 'LMT',
                limitPrice: 0
            };
        } catch (err) {
            this.error = err.message;
        } finally {
            this.loading = false;
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

    render() {
        return html`
            <h2>Złóż zamówienie</h2>
            ${this.success ? html`<p class="success">${this.success}</p>` : ''}
            ${this.error ? html`<p class="error">${this.error}</p>` : ''}
            <form @submit=${this.submitForm}>
                <label>
                    ISIN:
                    <input type="text" name="isin" .value=${this.formData.isin} @input=${this.handleInput} required>
                </label>
                <label>
                    Liczba do zakupu: <input type="number" name="quantity" .value=${this.formData.quantity}
                                             min="1"
                                   @input=${this.handleInput}
                                   required>
                </label>
                <label>
                    Strona: <select name="side" .value=${this.formData.side} @change=${this.handleInput}>
                    <option value="BUY">Kupno</option>
                    <option value="SELL">Sprzedaż</option>
                </select>
                </label>
                <label>
                    Typ zlecenia: <select name="orderType" .value=${this.formData.orderType}
                                          @change=${this.handleInput}>
                    <option value="LMT">Limit</option>
                    <option value="MKT">Market</option>
                    <option value="PCK">Po każdej cenie</option>
                </select>
                </label>
                <label>
                    Limit ceny: <input type="number" name="limitPrice" .value=${this.formData.limitPrice}
                                       ?disabled="${this.formData.orderType !== 'LMT'}"
                                       min="1"
                                        @input=${this.handleInput}>
                </label>
                <label>
                    Zlecenie ważne do: <input type="datetime-local" name="expiresAt"
                                              .value=${this.getFormattedExpiresAt()}
                                              min=${this.getMinDateTime()}
                                            @input=${this.handleInput}>
                </label>
                <label>
                    Waluta: <input type="text" name="tradeCurrency" .value=${this.formData.tradeCurrency}
                                   @input=${this.handleInput} required>
                </label>
                
                <button type="submit" ?disabled=${this.loading}>Złóż zamówienie</button>
            </form>
        `;
    }
}

customElements.define('buy-page', BuyPage);
