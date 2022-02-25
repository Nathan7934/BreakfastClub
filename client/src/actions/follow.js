//////////////////////////////////////////////////////////////////////////////////////////////////////
// A collection of functions to be used by the following.js  front-end to communicate with the database
// function  to delete following/resfollowing
export const deleteFollowing = (isRes, app, username, followUserName, followstate) => {
    let url;
    if (isRes) {
        url = `/api/resfollowing/${username}/${followUserName}`;
    } else {
        url = `/api/following/${username}/${followUserName}`;
    }
    fetch(url, {method: 'delete'})
        .then(res => {
        if (res.status === 200) {
            console.log("successfully deleted")
            return res.json();
        }
        })
        .then(json => {
        console.log("deletefollowing action" , json.currentUser)
        app.setState({ sessionUser: json.currentUser });
        if (isRes) {
            followstate.setState({ currUserResFollowing: json.currentUser.resfollowing });
        } else {
            followstate.setState({ currUserFollowing: json.currentUser.following });
        }
        })
        .catch(error => {
        console.log(error);
        });
};

// function  to add following/resfollowing
export const addFollowing = (isRes, app, userId, addedName, addedUsername, followstate) => {
    let url;
    if (isRes) {
        url = `/api/resfollowing/${userId}`;
    } else {
        url = `/api/following/${userId}`;
    }
    const loginput = {
        name: addedName,
        username: addedUsername
      }

    const request = new Request(url, {
        method: 'post',
        body: JSON.stringify(loginput),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
    });

    fetch(request)
    .then(res => {
        if (res.status === 200) {
            console.log("successfully added")
            return res.json();
        }
        })
        .then(json => {
        console.log("addfollowing action" , json.currentUser)
        app.setState({ sessionUser: json.currentUser });
        if (isRes) {
            followstate.setState({ currUserResFollowing: json.currentUser.resfollowing });
        } else {
            followstate.setState({ currUserFollowing: json.currentUser.following });
        }
        })
        .catch(error => {
        console.log(error);
        });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// A collection of functions to be used by the profile.js  front-end to communicate with the database
// function  to delete following/resfollowing
export const deleteFollowinginProfile = (isRes, app, username, followUserName) => {
    let url;
    if (isRes) {
        url = `/api/resfollowing/${username}/${followUserName}`;
    } else {
        url = `/api/following/${username}/${followUserName}`;
    }
    fetch(url, {method: 'delete'})
        .then(res => {
        if (res.status === 200) {
            console.log("successfully deleted")
            return res.json();
        }
        })
        .then(json => {
        console.log("deletefollowing action" , json.currentUser)
        app.setState({ sessionUser: json.currentUser });
        })
        .catch(error => {
        console.log(error);
        });
};

// function  to add following/resfollowing
export const addFollowinginProfile = (isRes, app, userId, addedName, addedUsername) => {
    let url;
    if (isRes) {
        url = `/api/resfollowing/${userId}`;
    } else {
        url = `/api/following/${userId}`;
    }
    const loginput = {
        name: addedName,
        username: addedUsername
      }

    const request = new Request(url, {
        method: 'post',
        body: JSON.stringify(loginput),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
    });

    fetch(request)
    .then(res => {
        if (res.status === 200) {
            console.log("successfully added")
            return res.json();
        }
        })
        .then(json => {
        console.log("addfollowing action" , json.currentUser)
        app.setState({ sessionUser: json.currentUser });
        })
        .catch(error => {
        console.log(error);
        });
}