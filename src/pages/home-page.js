import { LitElement, html, css } from 'lit';

export class HomePage extends LitElement {
    static styles = css`p { font-size: 1.2rem; }`;

    render() {
        return html`<p>Witaj na stronie domowej!</p>`;
    }
}

customElements.define('home-page', HomePage);
