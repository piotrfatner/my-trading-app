import { LitElement, html, css } from 'lit';

export class NavBar extends LitElement {
    static styles = css`
        :host {
            display: block;
            width: 100%;
            position: fixed;  
            top: 0;
            left: 0;
            z-index: 1000;
            background-color: #1e1e1e;
            color: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        nav {
            display: flex;
            padding: 12px 24px;
            gap: 16px;
            align-items: center;
            justify-content: flex-start;
        }

        a {
            color: white;
            text-decoration: none;
            font-weight: 500;
            cursor: pointer;
            padding: 6px 12px;
            border-radius: 4px;
            transition: background-color 0.2s;
        }

        a:hover {
            background-color: #333;
        }

        a.active {
            background-color: #555;
        }
  `;

    static properties = {
        activeTab: { type: String }
    };

    constructor() {
        super();
        this.activeTab = 'home';
    }

    _onTabClick(tab) {
        const map = { home: '#/home', orders: '#/orders', buy: '#/buy' };
        window.location.hash = map[tab];
    }

    render() {
        const tabs = [
            { name: 'Strona domowa', id: 'home' },
            { name: 'Złożone zlecenia', id: 'orders' },
            { name: 'Kup instrument', id: 'buy' }
        ];
        return html`
      <nav>
        ${tabs.map(tab => html`
          <a 
            class=${this.activeTab === tab.id ? 'active' : ''} 
            @click=${() => this._onTabClick(tab.id)}>
            ${tab.name}
          </a>
        `)}
      </nav>
    `;
    }
}

customElements.define('nav-bar', NavBar);
