document.getElementById('orderForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const drink = document.getElementById('drink').value.split(' ')[0];  // Get drink type only
    
    // Save name in Local Storage
    localStorage.setItem('username', name);

    // Disable name input field
    document.getElementById('name').disabled = true;

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
window.onload = function() {
    const storedName = localStorage.getItem('username');
    if (storedName) {
        document.getElementById('name').value = storedName;
        document.getElementById('name').disabled = true;
    }
    loadOrders();
};

// Reset button functionality
document.getElementById('resetButton').addEventListener('click', function() {
    localStorage.removeItem('username');
    document.getElementById('name').value = '';
    document.getElementById('name').disabled = false;
});

// Load orders from the server
async function loadOrders() {
    const storedName = localStorage.getItem('username');
    const response = await fetch(`/api/orders?name=${storedName}`);
    const orders = await response.json();
    const tbody = document.getElementById('orderTable').querySelector('tbody');
    tbody.innerHTML = '';

    let total = 0;
    orders.forEach(order => {
        total += order.price;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${order.drink}</td>
            <td>${order.price.toFixed(2)} €</td>
        `;
        tbody.appendChild(tr);
    });

    const totalRow = document.createElement('tr');
    totalRow.innerHTML = `
        <td><strong>Summe</strong></td>
        <td><strong>${total.toFixed(2)} €</strong></td>
    `;
    tbody.appendChild(totalRow);
}

// Initial load
loadOrders();
