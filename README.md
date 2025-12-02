# System Tradingowy - tradingmy-trading-app Implementacja frontendu do systemu trading-system

## Architektura projektu oraz opis implementacji

Ten projekt implementuje **Single Page Application (SPA)** do handlu akcjami, zbudowaną w oparciu o nowoczesne standardy webowe — **bez użycia ciężkich frameworków frontendowych** takich jak React czy Angular.  
Wykorzystuje **Web Components** poprzez bibliotekę **Lit** oraz **@lion/ui** do obsługi formularzy.

---

## Architektura komponentowa (Lit)

Aplikacja korzysta z Web Components (`LitElement`).  
Każda strona (`HomePage`, `OrdersPage`, `BuyPage`) oraz element UI (`NavBar`, `OrderDetails`) to samodzielny, wielokrotnego użytku komponent.

**Dlaczego:**
- pełna enkapsulacja dzięki Shadow DOM
- zgodność ze standardami przeglądarek
- wysoka wydajność przy minimalnej ilości boilerplate’u

---

## Routing (oparty o hash)

Nawigacją zarządza prosty router oparty na hash w pliku `main.js`  
(ścieżki: `#/home`, `#/orders`, `#/buy`).

**Dlaczego:**
- lekkie rozwiązanie idealne dla małych i średnich SPA
- brak konieczności używania złożonych bibliotek routingu
- wsparcie dla historii przeglądarki

---

## Zarządzanie stanem

Stan przechowywany jest lokalnie w komponentach poprzez **właściwości reaktywne** Lit.

**Dlaczego:**
- prosta i przewidywalna architektura
- aktualizacje UI następują automatycznie po zmianie właściwości
- brak potrzeby stosowania zewnętrznych bibliotek typu Redux/MobX

---

## Integracja z API

Wszystkie zapytania HTTP obsługuje scentralizowana klasa `ApiClient`.

**Dlaczego:**
- oddzielenie logiki UI od logiki komunikacji z backendem
- łatwiejsza konserwacja dzięki wspólnej obsłudze błędów
- jedno miejsce na konfigurację (np. base URL)

---

## Formularze i walidacja (@lion/ui)

Formularz składania zlecenia kupna wykorzystuje komponenty Lion Web Components  
(`lion-form`, `lion-input`, `lion-select`).

**Dlaczego:**
- wbudowana dostępność (a11y)
- deklaratywny i rozbudowany system walidacji (`Required`, `MinNumber`, własne `MinDate`)
- automatyczne zarządzanie stanem formularza (dirty/touched)
- znaczne uproszczenie złożonej logiki walidacji  

## Wymagania
- Node.js (wersja 18 lub nowsza)
- npm 

## Jak uruchomić
1. `npm install`
2. `npm run dev`

Aplikacja uruchomi się na `http://localhost:5173`.

