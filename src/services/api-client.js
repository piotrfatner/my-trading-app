export class ApiClient {
    constructor(baseUrl = 'http://localhost:8090/api') {
        this.baseUrl = baseUrl;
    }

    async getOrders() {
        const response = await fetch(`${this.baseUrl}/orders`);
        if (!response.ok) throw new Error(`Błąd sieci: ${response.status}`);
        return response.json();
    }

    async getInstruments() {
        const response = await fetch(`${this.baseUrl}/instruments`);
        if (!response.ok) throw new Error(`Błąd sieci: ${response.status}`);
        return response.json();
    }

    async getCurrentPrices() {
        const response = await fetch(`${this.baseUrl}/instruments/prices/current`);
        if (!response.ok) throw new Error(`Błąd sieci: ${response.status}`);
        return response.json();
    }

    async getOrderDetails(orderId) {
        const response = await fetch(`${this.baseUrl}/orders/`+ orderId);
        if (!response.ok) throw new Error(`Błąd sieci: ${response.status}`);
        return response.json();
    }

    async createOrder(data) {
        const response = await fetch(`${this.baseUrl}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            let errorMessage = `Nie udało sie utworzyć zamówienia - Błąd API (${response.status})`;
            errorMessage = await this.backendErrorMessageHandling(response, errorMessage);
            throw new Error(errorMessage);
        }
        return response.json();
    }

    async backendErrorMessageHandling(response, errorMessage) {
        try {
            const errorBody = await response.json();

            if (errorBody && errorBody.errorMessage) {
                errorMessage = errorBody.errorMessage;
            } else if (errorBody && errorBody.message) {
                errorMessage = errorBody.message;
            } else if (typeof errorBody === 'object' && errorBody !== null) {
                const knownFields = ['apiPath', 'errorCode', 'errorTime'];
                const messages = Object.entries(errorBody)
                    .filter(([field]) => !knownFields.includes(field))
                    .map(([field, msg]) => `${field}: ${msg}`)
                    .join(', ');

                if (messages) errorMessage = messages;
                else errorMessage = JSON.stringify(errorBody);
            } else {
                errorMessage = JSON.stringify(errorBody);
            }
        } catch (e) {
            // If response is not JSON, try text
            const errorText = await response.text();
            if (errorText) errorMessage = errorText;
        }
        return errorMessage;
    }
}

export const api = new ApiClient();