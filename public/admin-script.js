document.addEventListener('DOMContentLoaded', () => {
    const passwordModal = document.getElementById('passwordModal');
    const adminSection = document.getElementById('adminSection');
    const submitPasswordButton = document.getElementById('submitPassword');
    const adminPasswordInput = document.getElementById('adminPassword');
    const errorElement = document.getElementById('error');
    const nameFilter = document.getElementById('nameFilter');
    const orderList = document.getElementById('adminOrderTable').querySelector('tbody');
    const totalAmount = document.getElementById('totalAmount');
    
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
            loadEvents();
        } else {
            errorElement.style.display = 'block';
        }
    });
    
    adminPasswordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitPasswordButton.click();
        }
    });

    nameFilter.addEventListener('input', loadAllOrders);

    async function loadAllOrders() {
        const filter = nameFilter.value.toLowerCase();
        const response = await fetch('/api/all-orders');
        const orders = await response.json();
        orderList.innerHTML = '';

        let total = 0;
        const filteredOrders = orders.filter(order => order.name.toLowerCase().includes(filter));
        filteredOrders.forEach(order => {
            total += order.price;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${order.name}</td>
                <td>${order.drink}</td>
                <td>${order.price.toFixed(2)} €</td>
                <td>${order.created_at}</td>
            `;
            orderList.appendChild(tr);
        });

        totalAmount.innerHTML = `<strong>Gesamtsumme: ${total.toFixed(2)} €</strong>`;
    }

    document.getElementById('eventForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const title = document.getElementById('eventTitle').value;
        const start_time = document.getElementById('eventStartTime').value;
        const end_time = document.getElementById('eventEndTime').value;

        // Konvertiere Datum und Uhrzeit in das ISO-Format (YYYY-MM-DDTHH:mm)
        const formattedStartTime = new Date(start_time).toISOString();
        const formattedEndTime = new Date(end_time).toISOString();

        await fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, start_time: formattedStartTime, end_time: formattedEndTime })
        });

        document.getElementById('eventForm').reset();
        loadEvents();
    });

    async function loadEvents() {
        const response = await fetch('/api/events');
        const events = await response.json();
        const eventList = document.getElementById('eventList');
        eventList.innerHTML = '';

        events.forEach(event => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${event.title}:</strong> ${new Date(event.start_time).toLocaleString()} - ${new Date(event.end_time).toLocaleString()}`;
            eventList.appendChild(li);
        });
    }
});
