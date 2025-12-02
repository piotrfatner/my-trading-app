import { LitElement, html, css } from 'lit';

export class BuyPage extends LitElement {
    static styles = css`p { font-size: 1.2rem; }`;

    render() {
        return html`<p>Wybierz instrument do kupienia.</p>`;
    }
}

customElements.define('buy-page', BuyPage);
