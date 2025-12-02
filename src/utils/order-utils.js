export function translateStatus(status) {
    switch (status) {
        case 'SUBMITTED':
            return 'Złożone';
        case 'FILLED':
            return 'Zrealizowane';
        case 'EXPIRED':
            return 'Wygasło';
        default:
            return status;
    }
}

export function formatDate(isoString) {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleString('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}