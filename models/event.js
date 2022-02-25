// A mongoose model for an event object

const mongoose = require('mongoose');

const Event = mongoose.model('Event', {
    id: {
        type: Number,
        required: true
    },
    owner: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    desc: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        required: true,
        trim: true
    },
    time: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    attendees: [{type: String}],
    isEditing: {
        type: Boolean,
        required: true
    }
});

module.exports = { Event };