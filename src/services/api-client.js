export class ApiClient {
    constructor(baseUrl = 'http://localhost:8090/api') {
        this.baseUrl = baseUrl;
    }

    async getOrders() {
        const response = await fetch(`${this.baseUrl}/orders`);
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
        if (!response.ok) throw new Error(`Nie udało się utworzyć zamówienia`);
        return response.json();
    }

}

export const api = new ApiClient();