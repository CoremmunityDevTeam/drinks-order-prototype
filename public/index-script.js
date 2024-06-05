// Load stored name on page load
window.onload = async function() {
    const response = await fetch('/api/get-username');
    const data = await response.json();
    if (data.username) {
        document.getElementById('welcomeMessage').innerHTML = `Willkommen, ${data.username}`;
        document.getElementById('loginButton').style.display = 'none';
        document.getElementById('orderButton').style.display = 'block';
        document.getElementById('logoutButton').style.display = 'block';
        document.getElementById('adminButton').style.display = 'block';
    } else {
        document.getElementById('orderButton').style.display = 'none';
    }
};

// Events laden
async function loadEvents() {
    const response = await fetch('/api/events');
    const events = await response.json();
    const eventList = document.getElementById('eventList');
    eventList.innerHTML = '';

    // Group events by day
    const groupedEvents = events.reduce((acc, event) => {
        const eventDate = new Date(Date.parse(event.start_time));
        const day = eventDate.toLocaleDateString('de-DE', { weekday: 'long' });
        if (!acc[day]) acc[day] = [];
        acc[day].push(event);
        return acc;
    }, {});

    // Add events
    Object.keys(groupedEvents).forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.classList.add('timeline-header');
        dayHeader.innerHTML = `<span class="tag is-medium is-primary">${day}</span>`;
        eventList.appendChild(dayHeader);

        groupedEvents[day].forEach(event => {
            const startTime = new Date(Date.parse(event.start_time));
            const endTime = new Date(Date.parse(event.end_time));

            const li = document.createElement('li');
            li.classList.add('timeline-item');
            li.innerHTML = `
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <p class="heading">${startTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</p>
                    <p>${event.title}</p>
                </div>
            `;
            eventList.appendChild(li);
        });
    });

    // Add "Ende" marker
    const endLi = document.createElement('li');
    endLi.classList.add('timeline-header');
    endLi.innerHTML = '<span class="tag is-medium is-primary">Ende</span>';
    eventList.appendChild(endLi);
}

// Initiales Laden der Events
loadEvents();
