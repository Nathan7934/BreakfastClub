// A collection of functions to be used by the events front-end to communicate with the database

function getEvents() {
    // Unlike the other functions with no return values, this function returns a promise
    
    const url = '/api/events';

    return fetch(url)
    .then((res) => {
        if (res.status === 200) {
            return res.json();
        } else {
            alert('Could not get events');
        }
    })
    .then((json) => {
        return json.events;
    }).catch((error) => {
        console.log(error);
    });
}

function createEditEvent(event, mode) {
    let url;
    if (mode === 'create') {
        url = '/api/events';
    } else {
        url = `/api/events/${event.id}`;
    }

    const request = new Request(url, {
        method: 'post',
        body: JSON.stringify(event),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
    });

    fetch(request)
    .then(function(res) {
        if (res.status === 200) {
            console.log('Event successfully added');
        } else {
            console.log('Couldn\'t add event');
        }
    }).catch((error) => {
        console.log(error);
    });
}

function deleteEvent(index) {
    const url = `/api/events/${index}`;

    fetch(url, {method: 'delete'})
    .then((res) => { res.json(); })
    .then((res) => { console.log(res); })
    .catch((error) => { console.log(error); });
}

export {getEvents, createEditEvent, deleteEvent};