document.addEventListener('DOMContentLoaded', () => {
    const passwordModal = document.getElementById('passwordModal');
    const adminSection = document.getElementById('adminSection');
    const submitPasswordButton = document.getElementById('submitPassword');
    const adminPasswordInput = document.getElementById('adminPassword');
    const errorElement = document.getElementById('error');
    const nameFilter = document.getElementById('nameFilter');
    const orderList = document.getElementById('adminOrderTable');
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
            const orderContainer = document.createElement('div');
            orderContainer.classList.add('card');

            const orderDate = Intl.DateTimeFormat('de-DE', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(order.created_at));
            orderContainer.innerHTML = `
                    <header class="card-header">
                        <p class="card-header-title">${order.name} ${order.drink} - ${orderDate}</p>
                        <button class="card-header-icon" aria-label="more options">
                            <span class="icon">
                            <i class="fas fa-angle-down" aria-hidden="true"></i>
                            </span>
                        </button>
                    </header>
                    <div class="card-content">
                        <button class="button remove is-small is-danger" data-id="${order._id}">Löschen</button>
                    </div>
            `;
            orderContainer.addEventListener('click', () => {
                activateCard(orderContainer.children[0]);
            });

            orderContainer.querySelector("button.remove").addEventListener('click', () => {
                console.log("Delete order");
                //TODO Call delete order API
            });

            orderList.appendChild(orderContainer);
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
    
    function hideTab(el) {
        el.classList.remove("activeTab");
        el.classList.add("hiddenTab");
    }

    function showTab(el) {
        el.classList.add("activeTab");
        el.classList.remove("hiddenTab");
    }
    
    function toggleActiveTab(el) {
        document.querySelector(".tabs .is-active").classList.remove("is-active");
        el.classList.add("is-active");
    }

    document.getElementById('eventsTabToogle').addEventListener('click', (el) => {
        hideTab(document.querySelector(".activeTab"));
        showTab(document.getElementById('eventContainer'));
        toggleActiveTab(document.getElementById('eventsTabToogle'));

    });

    document.getElementById('orderTabToogle').addEventListener('click', (el) => {
        hideTab(document.querySelector(".activeTab"));
        showTab(document.getElementById('orderContainer'));
        toggleActiveTab(document.getElementById('orderTabToogle'));
    });

    function activateCard(el){
        const cardContent = el.parentElement.children[1];
            
            if (cardContent.classList.contains('activeCard')) {
                cardContent.classList.remove("activeCard");
            }else {
                cardContent.classList.add("activeCard");
        }
    }

    document.querySelectorAll('.card-header').forEach((el) => {
        el.addEventListener("click", () => {
            activateCard(el);
        });
    });        

});
