import { LitElement, html, css } from 'lit';
import { api } from '../services/api-client.js';
import './order-details.js';
import { translateStatus } from '../utils/order-utils.js';

export class OrdersPage extends LitElement {
    static properties = {
        orders: { type: Array },
        loading: { type: Boolean },
        error: { type: String },
        selectedOrderId: { type: String }
    };

    static styles = css`
    :host { display: block; font-family: sans-serif; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
    }
    th, td {
      padding: 8px 12px;
      border: 1px solid #ddd;
      text-align: left;
    }
    th {
      background-color: #f4f4f4;
    }
    tr:nth-child(even) { background-color: #fafafa; }
    .error { color: red; }
    button {
      margin-top: 12px;
      padding: 6px 12px;
      cursor: pointer;
    }
  `;

    constructor() {
        super();
        this.orders = [];
        this.loading = false;
        this.error = '';
        this.selectedOrderId = '';
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadOrders();
    }

    openDetails(orderId) {
        this.selectedOrderId = orderId;
    }

    closeDetails() {
        this.selectedOrderId = '';
    }

    async loadOrders() {
        this.loading = true;
        this.error = '';
        try {
            this.orders = await api.getOrders();
        } catch (err) {
            this.error = err.message;
        } finally {
            this.loading = false;
        }
    }

    render() {
        if (this.loading) return html`<p>Ładowanie zamówień...</p>`;
        if (this.error) return html`<p class="error">Błąd: ${this.error}</p>`;
        if (this.orders.length === 0) return html`<p>Brak zamówień.</p>`;

        return html`
      <h2>Twoje zamówienia:</h2>
      <table>
          <thead>
          <tr>
              <th>Numer zlecenia</th>
              <th>Status</th>
              <th>Isin</th>
              <th>Liczba</th>
              <th>Limit</th>
              <th>Szczegóły</th>
          </tr>
          </thead>
          <tbody>
          ${this.orders.map(order => html`
              <tr>
                  <td>${order.orderId}</td>
                  <td>${translateStatus(order.status)}</td>
                  <td>${order.isin}</td>
                  <td>${order.quantity}</td>
                  <td>${order.limitPrice || ''}</td>
                  <td>${order.status === 'FILLED'
                          ? html`<button @click=${() => this.openDetails(order.orderId)}>Szczegóły</button>`
                          : '-'}</td>
              </tr>
          `)}
          </tbody>
      </table>
      ${this.selectedOrderId ? html`
              <order-details
                  .orderId=${this.selectedOrderId}
                  .open=${true}
                  @close=${() => this.selectedOrderId = ''}>
              </order-details>
          ` : ''}
      <button @click=${this.loadOrders}>Odśwież</button>
    `;
    }
}

customElements.define('orders-page', OrdersPage);
