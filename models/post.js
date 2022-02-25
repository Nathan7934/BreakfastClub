// Post mongoose model
const mongoose = require('mongoose')

const Post = mongoose.model('Post', {
	userId: {
		type: String,
		required: true,
	},
	text: {
		type: String
	},
	restaurant: {
		type: String,
	},
  image: {
    type: String
  }
})

module.exports = { Post }
