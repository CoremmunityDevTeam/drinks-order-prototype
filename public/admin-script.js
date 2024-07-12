document.addEventListener('DOMContentLoaded', () => {
    const nameFilter = document.getElementById('nameFilter');
    const orderList = document.getElementById('adminOrderTable');
    const totalAmount = document.getElementById('totalAmount');
    
    nameFilter.addEventListener('input', loadAllOrders);

    async function loadAllOrders() {
        const filter = nameFilter.value.toLowerCase();
        const response = await fetch('/api/all-orders');
        const orders = await response.json();
        const orderDeletionModal = document.getElementById('orderDeletetionModal');

        orderList.innerHTML = '';

        let total = 0;
        const filteredOrders = orders.filter(order => order.name.toLowerCase().includes(filter));
        filteredOrders.forEach(order => {
            total += order.price;
            const orderContainer = document.createElement('div');
            orderContainer.classList.add('card');

            orderContainer.innerHTML = `
                    <header class="card-header">
                        <p class="card-header-title">${order.name} ${order.drink} - ${convertOrderDate(order)}</p>
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
                openOrderModal(orderDeletionModal, order);
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
        const eventDeletionModal = document.getElementById('eventDeletetionModal');
        eventList.innerHTML = '';

        events.forEach(event => {
            const eventContainer = document.createElement('div');
            eventContainer.classList.add('card');

            eventContainer.innerHTML = `
                    <header class="card-header">
                        <p class="card-header-title">${event.title} ${new Date(event.start_time).toLocaleString()} - ${new Date(event.end_time).toLocaleString()}</p>
                        <button class="card-header-icon" aria-label="more options">
                            <span class="icon">
                            <i class="fas fa-angle-down" aria-hidden="true"></i>
                            </span>
                        </button>
                    </header>
                    <div class="card-content">
                        <button class="button remove is-small is-danger" data-id="${event._id}">Löschen</button>
                    </div>
            `;
            eventContainer.addEventListener('click', () => {
                activateCard(eventContainer.children[0]);
            });

            eventContainer.querySelector("button.remove").addEventListener('click', () => {
                openEventModal(eventDeletionModal, event);
            });
            eventList.appendChild(eventContainer);
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
    
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
        const $target = $close.closest('.modal');
    
        $close.addEventListener('click', () => {
          closeModal($target);
        });
    });

    function openEventModal($el, event) {
        $el.classList.add('is-active');
        const modalText = document.getElementById('eventDeletionText');
        modalText.innerHTML = `Möchtest du das Event ${event.title} von ${new Date(event.start_time).toLocaleString()} bis ${new Date(event.end_time).toLocaleString()} wirklich löschen`;
        
        const deletionConfirmationButton = document.getElementById('eventDeletetionConfirmation');
        deletionConfirmationButton.addEventListener("click", () => {
            deleteEvent(event);
            closeModal($el);
        });
    }


function openOrderModal($el, order) {
    $el.classList.add('is-active');
    const modalText = document.getElementById('orderDeletionText');
    modalText.innerHTML = `Möchtest du die ${order.drink} Bestellung von ${order.name} um ${convertOrderDate(order)} wirklich löschen`;
    
    const deletionConfirmationButton = document.getElementById('orderDeletetionConfirmation');
    deletionConfirmationButton.addEventListener("click", () => {
        deleteOrder(order);
        closeModal($el);
    });
}

async function deleteEvent(event) {
    const response = await fetch(`/api/events/${event.id}`, {
        method:"DELETE",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (response.status === 204){
        loadEvents();   
    }    
}    

async function deleteOrder(order) {
    const response = await fetch(`/api/orders/${order.id}`, {
        method:"DELETE",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (response.status === 204){
        loadAllOrders();   
    }    
}    


function closeModal($el) {
    $el.classList.remove('is-active');
}


function convertOrderDate(order) {
    return Intl.DateTimeFormat('de-DE', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(order.created_at)); 
}


loadAllOrders();
loadEvents();
});