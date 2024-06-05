document.getElementById('orderForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('name').textContent;
    const drink = document.getElementById('drink').value.split(' ')[0];  // Get drink type only

    // Send data to the backend
    await fetch('/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, drink })
    });

    // Clear form
    document.getElementById('drink').value = 'Bier';

    // Reload the table data
    loadOrders();
});

// Load stored name on page load
window.onload = async function() {
    const response = await fetch('/api/get-username');
    const data = await response.json();
    if (data.username) {
        document.getElementById('name').textContent = data.username;
    }
    loadOrders();
};

// Load orders from the server
async function loadOrders() {
    const storedName = document.getElementById('name').textContent;
    const response = await fetch(`/api/orders?name=${storedName}`);
    const orders = await response.json();
    const tbody = document.getElementById('orderTable').querySelector('tbody');
    const totalAmountElement = document.getElementById('totalAmount');
    tbody.innerHTML = '';

    let total = 0;
    orders.reverse().forEach(order => {  // Reverse the order of orders
        total += order.price;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${order.drink}</td>
            <td>${order.price.toFixed(2)} €</td>
            <td>${order.created_at}</td>
        `;
        tbody.appendChild(tr);
    });

    totalAmountElement.innerHTML = `<strong>Summe: ${total.toFixed(2)} €</strong>`;
}

// Initial load
loadOrders();
