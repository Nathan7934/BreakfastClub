// A collection of functions to be used by the report button front-end to communicate with the database

function getReports(app) {
    // Unlike the other functions with no return values, this function returns a promise
    
    const url = '/api/reporteds';

     fetch(url)
    .then((res) => {
        if (res.status === 200) {
            return res.json();
        } else {
            alert('Could not get reports');
        }
    })
    .then((json) => {
        app.setState({reported:json.reports});
    }).catch((error) => {
        console.log(error);
    });
}

function createReport(content) {
    console.log(content)
    const url = '/api/reporteds';
    const request = new Request(url, {
        method: 'post',
        body: JSON.stringify(content),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
    });

    fetch(request)
    .then(function(res) {
        if (res.status === 200) {
            console.log('report successfully added');
        } else {
            console.log('Couldn\'t add report');
        }
    }).catch((error) => {
        console.log(error);
    });
}

function getReportById(repId) {

    const url = `/api/reporteds/${repId}`;

    return fetch(url)
    .then((res) => {
        if (res.status === 200) {
            return res.json();
        } else {
            console.log('Could not get report');
            return null;
        }
    })
    .then((json) => {
        return json.report;
    }).catch((error) => {
        console.log(error);
    });
}

function deleteReport(repId) {
    const url = `/api/reporteds/${repId}`;

    fetch(url, {method: 'delete'})
    .then((res) => { res.json(); })
    .then((res) => { console.log(res); })
    .catch((error) => { console.log(error); });
}

export {getReports, createReport, getReportById, deleteReport};