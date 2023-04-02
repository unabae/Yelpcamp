const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const axios = require('axios').default;

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

async function seedImg() {
  try {
    const resp = await axios.get('https://api.unsplash.com/photos/random', {
      params: {
        client_id: 'Va2En5b4OVf1ht6Nh4VPDPvBjATAAN5RbOvI05CMEus',
        collections: 1114848,
      },
    })
    return resp.data.urls.small
  } catch (err) {
    console.error(err)
  }
}


const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: '6386d6d6b6c59024890270d6', // YOUR USER ID
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      // image: await seedImg(),
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas, ea maiores autem minima magnam voluptas obcaecati doloremque commodi eligendi sunt doloribus similique quae, nostrum quam quo cum itaque adipisci alias.',
      price,
      geometry:
      {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ]
      },
      images: [
        {
          url: 'https://res.cloudinary.com/dftcixsmz/image/upload/v1675314166/Yelpcamp/vtnsxpzhjstm2dvqw6yo.jpg',
          filename: 'Yelpcamp/vtnsxpzhjstm2dvqw6yo',
        },
        {
          url: 'https://res.cloudinary.com/dftcixsmz/image/upload/v1675314167/Yelpcamp/bwldnrez3jk4edbafrzg.jpg',
          filename: 'Yelpcamp/bwldnrez3jk4edbafrzg',
        },
        {
          url: 'https://res.cloudinary.com/dftcixsmz/image/upload/v1675314168/Yelpcamp/vd1ufux029ziohyddjqb.jpg',
          filename: 'Yelpcamp/vd1ufux029ziohyddjqb',
        }
      ]
    })
    await camp.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
})