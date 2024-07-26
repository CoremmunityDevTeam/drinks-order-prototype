document.addEventListener('DOMContentLoaded', function() {
    
    function switchEventDate(tab, date) {
       activeTab =  document.querySelector('li.is-active');
       activeTab.classList.remove('is-active');
       tab.classList.add('is-active');
       tab.scrollIntoView({behavior: "smooth", inline: "center"});
    }
    
    async function loadUsername() {
        const response = await fetch('/api/get-username');
        const data = await response.json();
        if (data.username) {
            document.getElementById('welcomeMessage').innerHTML = `Willkommen, ${data.username}`;
            document.getElementById('loginButton').style.display = 'none';
            document.getElementById('orderButton').style.display = 'block';
            document.getElementById('logoutButton').style.display = 'block';
            
        } else {
            document.getElementById('welcomeMessage').innerHTML = '';
            document.getElementById('loginButton').style.display = 'block';
            document.getElementById('orderButton').style.display = 'none';
            document.getElementById('logoutButton').style.display = 'none';
            document.getElementById('adminButton').style.display = 'none';
        }

        if(data.admin){
            document.getElementById('adminButton').style.display = 'block';
        } else {
            document.getElementById('adminButton').style.display = 'none';
        }
    }
    loadUsername();
    loadEventDates()

    async function loadEventDates() {
        const response = await fetch('/api/events/date');
        const dates = await response.json();
        dates.sort();
        const eventDateTabs = document.getElementById('event-dates');
        eventDateTabs.innerHTML = '';

        const dateFormat = {year: 'numeric', month: '2-digit', day: 'numeric' };
        const currentDate = new Date().toLocaleDateString('DE-de',dateFormat);
        var hasCurrentDate = false;
        dates.sort().forEach(date => {
            const tab = document.createElement('li');
            tab.innerHTML = `<a><span>${date.date}</span></a>`;
            eventDateTabs.appendChild(tab);
            tab.addEventListener('click', () => {
                switchEventDate(tab,date);
                loadEventsForDate(date.search)
            });
            if(currentDate == date.date){
                tab.classList.add('is-active');
                loadEventsForDate(dates[0].search)
                hasCurrentDate = true;
            }
        });

        if(!hasCurrentDate) {
            eventDateTabs.children[0].classList.add('is-active')
            loadEventsForDate(dates[0].search)
        }

        
    }
    


    async function loadEventsForDate(date){
        const response = await fetch(`api/events/date/${date}`);
        const events = await response.json();
        const eventList = document.getElementById('eventList');
        eventList.innerHTML = '';

        const groupedEvents = events.reduce((acc, event) => {
            const eventDate = new Date(Date.parse(event.start_time));
            const day = eventDate.toLocaleDateString('de-DE', { weekday: 'long' });
            if (!acc[day]) acc[day] = [];
            acc[day].push(event);
            return acc;
        }, {});

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

        const endLi = document.createElement('li');
        endLi.classList.add('timeline-header');
        endLi.innerHTML = '<span class="tag is-medium is-primary">Ende</span>';
        eventList.appendChild(endLi);
    }

    function showSection() {
        document.getElementById('contentContainer').style.display = 'block';
        document.querySelector('.background-container').classList.add('blurry-bg');
        document.querySelector('.menu-container').style.display = 'none';
        document.getElementById('backButton').style.display = 'block';
    }

    function hideSection() {
        document.getElementById('contentContainer').style.display = 'none';
        document.querySelector('.background-container').classList.remove('blurry-bg');
        document.querySelector('.menu-container').style.display = 'flex';
        document.getElementById('backButton').style.display = 'none';
        loadUsername(); // Benutzerinformationen neu laden
    }

    document.getElementById('eventsButton').addEventListener('click', function() {
        showSection();
        document.querySelector('li.is-active').scrollIntoView({ inline: 'center' });
    });

    document.getElementById('backButton').addEventListener('click', function() {
        hideSection();
    });
});
