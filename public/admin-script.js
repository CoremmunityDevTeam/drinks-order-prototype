async function loadAllOrders() {
    const nameFilter = document.getElementById('nameFilter').value.toLowerCase();
    const response = await fetch('/api/all-orders');
    const orders = await response.json();
    const tbody = document.getElementById('adminOrderTable').querySelector('tbody');
    const totalAmountElement = document.getElementById('totalAmount');
    tbody.innerHTML = '';

    let total = 0;
    const filteredOrders = orders.filter(order => order.name.toLowerCase().includes(nameFilter));
    filteredOrders.forEach(order => {
        total += order.price;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${order.name}</td>
            <td>${order.drink}</td>
            <td>${order.price.toFixed(2)} €</td>
        `;
        tbody.appendChild(tr);
    });

    totalAmountElement.innerHTML = `<strong>Gesamtsumme: ${total.toFixed(2)} €</strong>`;
}

// Initial load
loadAllOrders();
