import './nav-bar.js';
import './pages/home-page.js';
import './pages/orders-page.js';
import './pages/buy-page.js';

const app = document.querySelector('#app');
app.innerHTML = `
  <nav-bar></nav-bar>
  <div id="app-content"></div>
`;

const navBar = document.querySelector('nav-bar');
const appContent = document.getElementById('app-content');
appContent.style.marginTop = '100px';

function renderPage() {
    const hash = window.location.hash || '#/home';
    navBar.activeTab = hash.replace('#/', '');

    switch (hash) {
        case '#/home':
            appContent.innerHTML = `<home-page></home-page>`;
            break;
        case '#/orders':
            appContent.innerHTML = `<orders-page></orders-page>`;
            break;
        case '#/buy':
            appContent.innerHTML = `<buy-page></buy-page>`;
            break;
        default:
            appContent.innerHTML = `<home-page></home-page>`;
            break;
    }
}

window.addEventListener('hashchange', renderPage);
renderPage();
