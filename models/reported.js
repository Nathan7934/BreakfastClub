// Reported mongoose model
const mongoose = require('mongoose')

const Reported = mongoose.model('Reported', {
	contentId: {
        type: String,
		required: true
    },
    contentOwner:{
        type: String,
		required: true
    },
    contentType:{
        type: String,
		required: true
    }
})
module.exports = { Reported }
