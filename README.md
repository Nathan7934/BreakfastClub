# team52

[Web App Link](https://bfclub.herokuapp.com/)

## All User Features

- Sign up or log in to an account
- Edit profile info
- See posts of user they follow on main dashboard
- See posts of all users on the explore part of dashboard
- Create a post
- Sign up for events and cancel attendance for events
- Search for a user in the search bar
- Report a user

## Additional Restaurant User Features

- Create and edit events
- Add or remove attendees from their event

## Additional Admin User Features

- Delete a user when on their profile

## Login Credentials

- Username: user1, Password: user1
- Username: user2, Password: user2
- Username: user3, Password: user3
- Username: user4, Password: user4
- Username: user5, Password: user5
- Username: user6, Password: user6
- Username: admin, Password: admin

## Third Party Libraries

Axios - library for external HTTP requests

## API Routes

### User

- Login user
  - POST /api/users/login
  - {username: req.body.username, password: req.body.password}
- Logout user
  - GET /api/user/logout
- Check if user is logged in
  - GET /api/users/check-session
- Create a user
  - POST /api/users
  - {
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      isAdmin: req.body.isAdmin,
      isRstrnt: req.body.isRstrnt,
      profileInfo: req.body.profileInfo
    }
- Get all users
  - GET /api/users
- Get specific user
  - GET /api/users/:id
- Delete specific user
  - DELETE /api/user/:id

### Post

- Create a post
  - POST /api/posts
  - {
      userId: req.body.userId,
      text: req.body.text,
      restaurant: req.body.restaurant,
      image: req.body.image
    }
- Get all posts
  - GET /api/posts
- Get specific post
  - GET /api/posts/:id
- Delete specific post
  - DELETE /api/posts/:id

### Events

- Get all events
  - GET /api/events
- Create an event
  - POST /api/events
  - {
      id: req.body.id,
      owner: req.body.owner,
      name: req.body.name,
      desc: req.body.desc,
      date: req.body.date,
      time: req.body.time,
      location: req.body.location,
      attendees: req.body.attendees,
      isEditing: req.body.isEditing
    }
- Update specific event
  - POST /api/events/:index
  - {
      id: req.body.id,
      owner: req.body.owner,
      name: req.body.name,
      desc: req.body.desc,
      date: req.body.date,
      time: req.body.time,
      location: req.body.location,
      attendees: req.body.attendees,
      isEditing: req.body.isEditing
    }
- Delete specific event
  - DELETE /api/events/:index

### User Reports

- Create a report
  - POST /api/reporteds
  - {
      contentId: req.body.contentId,
      contentOwner: req.body.contentOwner,
      contentType: req.body.contentType
    }
- Get all reports
  - GET /api/reporteds
- Get specific report
  - GET /api/reporteds/:id
- Delete specific report
  - DELETE /api/reporteds/:id
