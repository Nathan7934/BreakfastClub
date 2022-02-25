// User mongoose model
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
  },
	username: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		minlength: 4
	},
  isAdmin: {
    type: Boolean,
    required: true
  },
  isRstrnt: {
    type: Boolean,
    required: true
  },
  following : [{
	name : String,
	username : String
  }],
  followers: [{
	name : String,
	username : String
  }],
  resfollowing : [{
	name : String,
	username : String
  }],
  resfollowers: [{
	name : String,
	username : String
  }],
  profileInfo: {type: Map}
})


UserSchema.pre('save', function(next) {
	const user = this;

	if (user.isModified('password')) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash
				next()
			})
		})
	} else {
		next()
	}
})

UserSchema.statics.findByUsernamePassword = function(username, password) {
	const User = this

	return User.findOne({ username: username }).then((user) => {
		if (!user) {
			return Promise.reject()
		}
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, result) => {
				if (result) {
					resolve(user)
				} else {
					reject()
				}
			})
		})
	})
}

const User = mongoose.model('User', UserSchema)
module.exports = { User }
