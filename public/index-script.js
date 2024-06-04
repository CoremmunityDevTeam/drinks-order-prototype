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

            events.forEach(event => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${event.title}:</strong> ${event.start_time} - ${event.end_time}`;
                eventList.appendChild(li);
            });
        }

        // Initiales Laden der Events
        loadEvents();