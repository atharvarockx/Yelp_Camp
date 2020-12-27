const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelpcampnew', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author:'5fe09d5a980e3708d02c15d9',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: { coordinates: [ cities[random1000].longitude,cities[random1000].latitude ], type: 'Point' },
            images:[ 
                { 
                    url:
                    'https://res.cloudinary.com/ath/image/upload/v1608955824/YelpCamp/y8tmgnerd2wcaybbdgle.jpg',
                    filename: 'YelpCamp/y8tmgnerd2wcaybbdgle' 
                },
                { 
                    url:
                    'https://res.cloudinary.com/ath/image/upload/v1608955830/YelpCamp/lxwf2hnfgbxaprrfteps.jpg',
                    filename: 'YelpCamp/lxwf2hnfgbxaprrfteps' 
                } ],
            description:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, placeat rerum! Nobis mollitia soluta laborum natus. Ut explicabo obcaecati officiis deleniti, sint laboriosam. Ratione qui illo voluptate minima eum dolorum!',
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})