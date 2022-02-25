// A collection of functions to be used by the posts front-end to communicate with the database

function getPosts() {
    // Unlike the other functions with no return values, this function returns a promise
    
    const url = '/api/posts';

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

function createPost(post, mode) {

    const url = '/api/posts';

    const request = new Request(url, {
        method: 'post',
        body: JSON.stringify(post),
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

function editPost(post, postId) {

    const url = `/api/posts/${postId}`;

    const request = new Request(url, {
        method: 'post',
        body: JSON.stringify(post),
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

function deletePost(postId) {
    const url = `/api/posts/${postId}`;

    fetch(url, {method: 'delete'})
    .then((res) => { res.json(); })
    .then((res) => { console.log(res); })
    .catch((error) => { console.log(error); });
}

export {getPosts, createPost, editPost, deletePost};