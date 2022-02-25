// The main Express server file. Still lacks database integration.
// DB requests should be handled using API endpoints

const express = require('express');
const path = require('path');

const env = process.env.NODE_ENV

const app = express();

// Mongoose connection:
const { mongoose } = require('./db/mongoose');
mongoose.set('bufferCommands', false);

// Mongoose models:
const { Event } = require('./models/event');
const { User } = require("./models/user");
const { Post } = require("./models/post");
const { Reported } = require("./models/reported");


// to validate object IDs
// const { ObjectId } = require('mongodb')
const  ObjectID = require('mongodb').ObjectId;

// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// express-session for managing user sessions
const session = require("express-session");
const MongoStore = require('connect-mongo')



//MIDDLEWARE

const mongoChecker = (req, res, next) => {
    if (mongoose.connection.readyState != 1) {
        console.log('Issue with mongoose connection')
        res.status(500).send('Internal server error')
        return;
    } else {
        next()
    }
}

const authenticate = (req, res, next) => {
    if (req.session.user) {
        User.findById(req.session.user).then((user) => {
            if (!user) {
                return Promise.reject()
            } else {
                req.user = user
                next()
            }
        }).catch((error) => {
            res.status(401).send("Unauthorized")
        })
    } else {
        res.status(401).send("Unauthorized")
    }
}

// checks for first error returned by promise rejection if Mongo database suddently disconnects
function isMongoError(error) {
	return typeof error === 'object' && error !== null && error.name === "MongoNetworkError";
}

// Configuring our static middleware directory (the React app)
app.use(express.static(path.join(__dirname, 'client/build')));

// ====== All API endpoints should go below ==========================================

// *** LOGIN FUNCTIONALITY ***
// Create a session and session cookie
app.use(
    session({
        secret: process.env.SESSION_SECRET || "our hardcoded secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 120000,
            httpOnly: true
        },
        store: env === 'production' ? MongoStore.create({  mongoUrl: process.env.MONGODB_URI ||
					'mongodb+srv://team52:csc309bfclub2021@breakfastclub.sehwf.mongodb.net/bfclubAPI?retryWrites=true&w=majority'}) : null
    })
);

//login user
app.post("/api/users/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findByUsernamePassword(username, password)
        .then(user => {
            req.session.user = user._id;
            req.session.userdata = user;
			res.send({ currentUser: user });
        })
        .catch(error => {
            res.status(400).send()
        });
});

//logout user
app.get("/api/users/logout", (req, res) => {
    req.session.destroy(error => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.send()
        }
    });
});

//check if user is logged in
app.get("/api/users/check-session", (req, res) => {
    if (req.session.user) {
        res.send({ currentUser: req.session.userdata });
    } else {
        res.status(401).send();
    }
});


// *** USER RESOURCE ROUTES ***
//create a user
app.post('/api/users', mongoChecker, async (req, res) => {
    const user = new User({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      isAdmin: req.body.isAdmin,
      isRstrnt: req.body.isRstrnt,
      following: [],
      followers: [],
			resfollowing: [],
      resfollowers: [],
			profileInfo: req.body.profileInfo
    })
    try {
      const newUser = await user.save()
      res.send(newUser)
    } catch (error) {
      if (isMongoError(error)) {
          res.status(500).send('Internal server error')
      } else {
          console.log(error)
          res.status(400).send('Bad Request')
      }
    }
})

//get all users
app.get('/api/users', mongoChecker, async (req, res) => {
	try {
		const users = await User.find()
		res.send({users})
	} catch(error) {
		console.log(error)
		res.status(500).send("Internal Server Error")
	}
})

//get specific user
app.get('/api/users/:id', mongoChecker, async (req, res) => {
	const id = req.params.id
	if (!ObjectID.isValid(id)) {
		res.status(404).send()
		return;
	}
	try {
		const user = await User.findById(id)
		if (!user) {
			res.status(404).send('Resource not found')
		} else {
			res.send({user: user})
		}
	} catch(error) {
		console.log(error)
		res.status(500).send('Internal Server Error')
	}
})

//update a user's info
// The body is an array that consists of a list of changes to make to the resource:
// [
//   { "op": "replace", "path": "/name", "value": 4 },
//   ...
// ]
app.post('/api/users/:id', mongoChecker, async (req, res) => {
	const id = req.params.id
    console.log(id)
	if (!ObjectId.isValid(id)) {
		res.status(404).send()
		return;
	}
	try {
        console.log(id)
		const result = await User.updateOne({_id: id}, {
            $set: {_id: id,
                name: req.body.name,
                username: req.body.username,
                password: req.body.password,
                isAdmin: req.body.isAdmin,
                isRstrnt: req.body.isRstrnt,
                followers: req.body.followers,
                following: req.body.following,
                resfollowers: req.body.resfollowers,
                resfollowing: req.body.resfollowing,
                profileInfo: req.body.profileInfo}
        });
        res.send(result)

		// if (!user) {
		// 	res.status(404).send('Resource not found')
		// } else {
        //     user.profileInfo.bio = req.body.profileInfo.bio
        //     user.profileInfo.location = req.body.profileInfo.location
        //     user.profileInfo.keywords = req.body.profileInfo.keywords
        //     console.log("-- in server --")
        //     console.log(user)
        //     console.log("----------------")
        //     user.save()
		// 	res.send(user)

	} catch (error) {
		console.log(error)
		if (isMongoError(error)) {
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request')
		}
	}
})

//delete specific user
app.delete('/api/users/:id', mongoChecker, async (req, res) => {
	const id = req.params.id
	if (!ObjectID.isValid(id)) {
		res.status(404).send('Resource not found')
		return;
	}
	try {
		const user = await User.findByIdAndRemove(id)
		if (!user) {
			res.status(404).send()
		} else {
			res.send(user)
		}
	} catch(error) {
		console.log(error)
		res.status(500).send()
	}
})

// *** POST RESOURCE ROUTES ***
//create a post
app.post('/api/posts', mongoChecker, async (req, res) => {
    // A post route to add Post to sepcific user
    // body:
    // {
    //     "userId": "userId1",
    //     "text": "its a sunny day",
    //     "restaurant": "restaurant1",
    //     "image": "imageLink1"
    // }
    const post = new Post({
        userId: req.body.userId,
        text: req.body.text,
        restaurant: req.body.restaurant,
        image: req.body.image
    })
    try {
      const newPost = await post.save()
      res.send(newPost)
    } catch (error) {
      if (isMongoError(error)) {
          res.status(500).send('Internal server error')
      } else {
          console.log(error)
          res.status(400).send('Bad Request')
      }
    }
})

app.post('/api/posts/:postId', async (req, res) => {
    // A POST route to update (edit) the Post at given postId
    // body:
    // {
    //     "userId": "userId1",
    //     "text": "its a sunny day",
    //     "restaurant": "restaurant1",
    //     "image": "imageLink1"
    // }
    if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

    const postId = req.params.postId;
    const userId = req.body.userId;
    const text = req.body.text;
    const restaurant = req.body.restaurant;
    const image = req.body.image;

    try {
        const result = await Post.updateOne({"_id": postId}, {
                $set: {userId: userId, text: text, restaurant: restaurant, image: image}
            });
        res.send(result);
    } catch(error) {
        console.log(error);
        if (isMongoError(error)) {
			res.status(500).send('Internal server error');
		} else {
			res.status(400).send('Bad Request');
		}
    }
});

//get all posts
app.get('/api/posts', mongoChecker, async (req, res) => {
	try {
		const posts = await Post.find()
		res.send({posts})
	} catch(error) {
		console.log(error)
		res.status(500).send("Internal Server Error")
	}
})

//get specific post
app.get('/api/posts/:id', mongoChecker, async (req, res) => {
	const id = req.params.id
	if (!ObjectID.isValid(id)) {
		res.status(404).send()
		return;
	}
	try {
		const post = await Post.findById(id)
		if (!post) {
			res.status(404).send('Resource not found')
		} else {
			res.send(post)
		}
	} catch(error) {
		console.log(error)
		res.status(500).send('Internal Server Error')
	}
})

//delete specific post
app.delete('/api/posts/:id', mongoChecker, async (req, res) => {
	const id = req.params.id
	if (!ObjectID.isValid(id)) {
		res.status(404).send('Resource not found')
		return;
	}
	try {
		const post = await Post.findByIdAndRemove(id)
		if (!post) {
			res.status(404).send()
		} else {
			res.send(post)
		}
	} catch(error) {
		console.log(error)
		res.status(500).send()
	}
})

// *** EVENT RESOURCE ROUTES ***

app.get('/api/events', async (req, res) => {
    // A GET route to get all the events in the events collection

    // check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

    try {
        const events = await Event.find();
        res.send({events});
    } catch(error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/api/events', async (req, res) => {
    // A POST route to create an event

	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

    const event = new Event({id: req.body.id, owner: req.body.owner, name: req.body.name,
        desc: req.body.desc, date: req.body.date, time: req.body.time,
        location: req.body.location, attendees: req.body.attendees, isEditing: req.body.isEditing});

    try {
        const result = await event.save();
        res.send(result);
    } catch(error) {
        console.log(error);
        if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error');
		} else {
			res.status(400).send('Bad Request'); // 400 for bad request gets sent to client.
		}
    }
});

app.post('/api/events/:index', async (req, res) => {
    // A POST route to update (edit) the event at the given index (i.e. the event's id) paremeter

    if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

    const index = req.params.index;
    const event = new Event({id: req.body.id, owner: req.body.owner, name: req.body.name,
        desc: req.body.desc, date: req.body.date, time: req.body.time,
        location: req.body.location, attendees: req.body.attendees, isEditing: req.body.isEditing});

    try {
        // Replaces the document with id === index with the updated event
        const result = await Event.updateOne({id: index}, {
                $set: {id: req.body.id, owner: req.body.owner, name: req.body.name,
                    desc: req.body.desc, date: req.body.date, time: req.body.time,
                    location: req.body.location, attendees: req.body.attendees,
                    isEditing: req.body.isEditing}
            });
        res.send(result);
    } catch(error) {
        console.log(error);
        if (isMongoError(error)) {
			res.status(500).send('Internal server error');
		} else {
			res.status(400).send('Bad Request');
		}
    }
});

app.delete('/api/events/:index', async (req, res) => {
    // A DELETE route to remove the event at the given index (i.e. the event's id) parameter

    if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

    const index = req.params.index;

    try {
        const result = await Event.deleteOne({id: index});
        // Decrements all the id's greater than the one removed to ensure there are no gaps
        await Event.updateMany({id: {$gt: index}}, {$inc: {id: -1}});
        res.send(result);
    } catch(error) {
        console.log(error);
		res.status(500).send('Server error');
    }
});

// *** REPORTED RESOURCE ROUTES ***
//create a report
app.post('/api/reporteds', mongoChecker, async (req, res) => {
    // A reported route to add report of sepcific content
    // body:
    // {
    //     "contentId": "contentId",
    //     "contentOwner": contentOwner".
    //     "contentType": "contentType"
    // }
    const report = new Reported({
        contentId: req.body.contentId,
        contentOwner: req.body.contentOwner,
        contentType: req.body.contentType
    })
    try {
      const newReport = await report.save()
      res.send(newReport)
    } catch (error) {
      if (isMongoError(error)) {
          res.status(500).send('Internal server error')
      } else {
          console.log(error)
          res.status(400).send('Bad Request')
      }
    }
})

//get all reports
app.get('/api/reporteds', mongoChecker, async (req, res) => {
	try {
		const reports = await Reported.find()
		res.send({reports})
	} catch(error) {
		console.log(error)
		res.status(500).send("Internal Server Error")
	}
})

//get specific report
app.get('/api/reporteds/:id', mongoChecker, async (req, res) => {
	const id = req.params.id
	if (!ObjectID.isValid(id)) {
		res.status(404).send()
		return;
	}
	try {
		const report = await Reported.findOne({contentId: id })
		if (!report) {
			res.status(404).send('Resource not found')
		} else {
			res.send(report)
		}
	} catch(error) {
		console.log(error)
		res.status(500).send('Internal Server Error')
	}
})

//delete specific report
app.delete('/api/reporteds/:id', mongoChecker, async (req, res) => {
	const id = req.params.id
	if (!ObjectID.isValid(id)) {
		res.status(404).send('Resource not found')
		return;
	}
	try {
		const report = await Reported.findByIdAndRemove(id)
		if (!report) {
			res.status(404).send()
		} else {
			res.send(report)
		}
	} catch(error) {
		console.log(error)
		res.status(500).send()
	}
})

// *** Follower/Following RESOURCE ROUTES ***

app.get('/api/:follow/:id', mongoChecker, async (req, res) => {
    // A get route to follow obj with specific user
    const userId = req.params.id
    const followType = req.params.follow

    if (!ObjectID.isValid(userId)) {
		res.status(404).send()
		return;
	}
    try {
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).send("user not found")
        } else {
            if (followType == 'following') {
                res.send(user)
            } else if (followType == 'followers') {
                res.send(user)
            } else if (followType == 'resfollowing') {
                res.send(user)
            } else if (followType == 'resfollowers') {
                res.send(user)
            } else {
                res.status(404).send("wrong follow parameter")
            }
        }
    } catch(error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})

app.post('/api/:follow/:id', mongoChecker, async (req, res) => {
    // A post route to add follow to sepcific user
    // body:
    // {
    //     "name": "Brian",
    //     "username": "user3"
    // }
    const nameToAdd = req.body.name;
    const usernameToAdd = req.body.username;
    const userId = req.params.id
    const followType = req.params.follow

    if (!ObjectID.isValid(userId)) {
		res.status(404).send()
		return;
	}
    try {
        if (followType == 'following') {
            const result = await User.updateOne({"_id": userId}, {
                $push: {
                    following: [ {"name": nameToAdd, "username": usernameToAdd}]
                }
            })
        } else if (followType == 'followers') {
            const result = await User.updateOne({"_id": userId}, {
                $push: {
                    followers: [ {"name": nameToAdd, "username": usernameToAdd}]
                }
            })
        } else if (followType == 'resfollowing') {
            const result = await User.updateOne({"_id": userId}, {
                $push: {
                    resfollowing: [ {"name": nameToAdd, "username": usernameToAdd}]
                }
            })
        } else if (followType == 'resfollowers') {
            const result = await User.updateOne({"_id": userId}, {
                $push: {
                    resfollowers: [ {"name": nameToAdd, "username": usernameToAdd}]
                }
            })
        } else {
            res.status(404).send("wrong follow parameter")
        }
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).send("user not found")
        } else {
            res.send({ currentUser: user })
        }
    }
    catch(error) {
        console.log(error);
        if (isMongoError(error)) {
			res.status(500).send('Internal server error');
		} else {
			res.status(400).send('Bad Request');
		}
    }
})


app.delete('/api/:follow/:id/:followUserName', mongoChecker, async (req, res) => {
// A delete route to delete follow to sepcific user
    const userId = req.params.id
    const followUserName = req.params.followUserName
    const followType = req.params.follow

    try {
        if (followType == 'following') {
            const result = await User.updateOne(
                {"username": userId},
                {
                    $pull: {
                        following: {
                            "username" : followUserName
                        }
                    }
              }
            )
            // res.send(result);
        } else if (followType == 'followers') {
            const result = await User.updateOne(
                {"username": userId},
                {
                    $pull: {
                        followers: {
                            "username" : followUserName
                        }
                    }
              }
            )
            // res.send(result);
        } else if (followType == 'resfollowing') {
            const result = await User.updateOne(
                {"username": userId},
                {
                    $pull: {
                        resfollowing: {
                            "username" : followUserName
                        }
                    }
              }
            )
            // res.send(result);
        } else if (followType == 'resfollowers') {
            const result = await User.updateOne(
                {"username": userId},
                {
                    $pull: {
                        resfollowers: {
                            "username" : followUserName
                        }
                    }
              }
            )
            // res.send(result);
        } else {
            // res.status(404).send("wrong follow parameter")
            res.status(404)
        }

        await User.find({username: userId})
        .then(user => {
			res.send({ currentUser: user[0] });
        })
    }
    catch(error) {
        console.log(error);
        if (isMongoError(error)) {
            res.status(500).send('Internal server error');
        } else {
            res.status(400).send('Bad Request');
        }
    }
})


// ===================================================================================

// A catchall handler. Sends the react app in response to to all requests that don't match any API endpoints
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Breakfast Club listening on port ${port}...`);
});
