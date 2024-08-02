const orderModal = document.getElementById('orderConfirmation');

document.getElementById('orderForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    openModal(orderModal);
});


(document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
});

document.getElementById('orderConfirmationButton').addEventListener('click', () => {
    placeOrder();
    closeModal(orderModal)
});

function convertOrderDate(order) {
    return Intl.DateTimeFormat('de-DE', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(order.created_at)); 
}

function openModal($el) {
    $el.classList.add('is-active');
    const drink = document.getElementById('drink').value.split(' ')[0];
    const modalText = document.getElementById('confirmationText');

    modalText.innerHTML = 'Ein '+ drink + ' wird hinzugefügt';

  }


function closeModal($el) {
    $el.classList.remove('is-active');
}

async function placeOrder() {
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
}


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
        console.log(order)
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${order.drink}</td>
            <td>${order.price.toFixed(2)} €</td>
            <td>${convertOrderDate(order)}</td>
        `;
        tbody.appendChild(tr);
    });

    totalAmountElement.innerHTML = `<strong>Summe: ${total.toFixed(2)} €</strong>`;
}

// Initial load
loadOrders();
