document.addEventListener('DOMContentLoaded', () => {
    const passwordModal = document.getElementById('passwordModal');
    const adminSection = document.getElementById('adminSection');
    const submitPasswordButton = document.getElementById('submitPassword');
    const adminPasswordInput = document.getElementById('adminPassword');
    const errorElement = document.getElementById('error');
    
    passwordModal.classList.add('is-active');
    
    submitPasswordButton.addEventListener('click', async () => {
        const password = adminPasswordInput.value;
        const response = await fetch('/api/check-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        });
        const result = await response.json();
        if (result.success) {
            passwordModal.classList.remove('is-active');
            adminSection.style.display = 'block';
            loadAllOrders();
        } else {
            errorElement.style.display = 'block';
        }
    });
    
    adminPasswordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitPasswordButton.click();
        }
    });
});

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
            <td>${order.created_at}</td>
        `;
        tbody.appendChild(tr);
    });

    totalAmountElement.innerHTML = `<strong>Gesamtsumme: ${total.toFixed(2)} €</strong>`;
}
