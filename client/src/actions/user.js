// Functions to help with user actions.

// environment configutations
// import ENV from './../config.js'
// const API_HOST = ENV.api_host
// console.log('Current environment:', ENV.env)

// request to check if a user is logged in through the session cookie
export const checkSession = (app) => {
    const url = `/api/users/check-session`;
    fetch(url)
    .then(res => {
        if (res.status === 200) {
            return res.json();
        }
    })
    .then((json) => {
        app.setState({ sessionUser: json.currentUser });
    }).catch(error => {
        console.log(error);
    });

};


// send POST request with new user
export const signUp = (user) => {
  const request = new Request(`/api/users`, {
    method: "post",
    // body: JSON.stringify(loginComp.state),
    body: JSON.stringify(user),
    headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
    }
  });
  // Send request
  fetch(request)
    .then(res => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then(json => {
      if (json.currentUser !== undefined) {
        // app.setState({currentUser: json.currentUser});
      }
    })
    .catch(error => {
      console.log(error);
    })
}

// send POST request with the user to be logged in
export const login = (loginComp, app) => {
      const loginput = {
        username: loginComp.state.username,
        password: loginComp.state.password
      }
    const request = new Request(`/api/users/login`, {
      method: "post",
      body: JSON.stringify(loginput),
      headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
      }
    });
    fetch(request)
      .then(res => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then(json => {
        if (json.currentUser !== undefined) {
          app.setState({ sessionUser: json.currentUser });
        }
      })
      .catch(error => {
        console.log(error);
      });
};

// send GET request to logout the current user
export const logout = (app) => {
  const url = `/api/users/logout`;
  fetch(url)
    .then(res => {
      if (res.status === 200) {
        console.log("Successfully logged out")
        app.setState({ sessionUser: null });
      }
    })

    .catch(error => {
      console.log(error);
    });
};

//get all users
export const getUsers = (app) => {
  const url = `/api/users`;
   fetch(url)
  .then(res => {
      if (res.status === 200) {
          return res.json();
      } else {
          alert("Could not get users");
      }
  })
  .then(json => {
      // app.setState({ users: json.users });
      app.setState({users: json.users});
  })
  .catch(error => {
      console.log(error);
  });
}

// send PATCH request to update user
export const updateUser = (user, app) => {
  const request = new Request(`/api/users/${user._id}`, {
    method: "post",
    // body: JSON.stringify(loginComp.state),
    body: JSON.stringify(user),
    headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
    }
  });
  // Send request
  fetch(request)
    .then(res => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then(json => {
      app.setState({ sessionUser: user });

    })
    .catch(error => {
      console.log(error);
    })
}

function getUserById(logInComp, uId) {

  const url = `/api/users/${uId}`;

   fetch(url)
  .then((res) => {
      if (res.status === 200) {
          return res.json();
      } else {
          console.log('Could not get user');
      }
  })
  .then((json) => {
      logInComp.setState({user: json.user});
  }).catch((error) => {
      console.log(error);
  });
}

//delete specific user
export const deleteUser = (userId, app) => {
    const url = `/api/users/${userId}`;
    console.log(url)

    fetch(url,
      {method: 'delete'}
    )
    .then((res) => { res.json(); })
    .then((res) => {
      console.log(res);
      app.setState({adminDeleted: true})
    })
    .catch((error) => { console.log(error); });
}

export {getUserById};