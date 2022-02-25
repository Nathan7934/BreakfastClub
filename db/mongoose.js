// A node module holding our connection to the Mongoose API
// To connect using MongoDB Compass, use the URI:
// 'mongodb+srv://team52:csc309bfclub2021@breakfastclub.sehwf.mongodb.net/test'

const mongoose = require('mongoose');
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://team52:csc309bfclub2021@breakfastclub.sehwf.mongodb.net/bfclubAPI?retryWrites=true&w=majority';

mongoose.connect(mongoURI)
	.catch((error) => { 
		console.log('Error connecting to mongodb. Timeout reached.');
		console.log(error);
	});

module.exports = { mongoose };
