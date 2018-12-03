// Base js code for my Yelp Camp

// Modules
const express = require('express');
const bodyParser = require('body-parser');

// Run Express App
const app = express();

//Connect to ejs
app.set('view engine', 'ejs');
//Connect to style sheet and other assets
app.use(express.static('public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//Camp DataBase
let campgrounds = [
    {name: 'Salmon Creek', image: 'https://farm1.staticflickr.com/68/180073544_af9816aeff.jpg'},
    {name: 'Guzape Valley', image: 'https://farm8.staticflickr.com/7268/7121859753_e7f787dc42.jpg'},
    {name: 'Kubwa Reserves', image: 'https://farm9.staticflickr.com/8671/16642502436_e6d611bcb5.jpg'},
    {name: 'Salmon Creek', image: 'https://farm1.staticflickr.com/68/180073544_af9816aeff.jpg'},
    {name: 'Guzape Valley', image: 'https://farm8.staticflickr.com/7268/7121859753_e7f787dc42.jpg'},
    {name: 'Kubwa Reserves', image: 'https://farm9.staticflickr.com/8671/16642502436_e6d611bcb5.jpg'},
    {name: 'Salmon Creek', image: 'https://farm1.staticflickr.com/68/180073544_af9816aeff.jpg'},
    {name: 'Guzape Valley', image: 'https://farm8.staticflickr.com/7268/7121859753_e7f787dc42.jpg'},
    {name: 'Kubwa Reserves', image: 'https://farm9.staticflickr.com/8671/16642502436_e6d611bcb5.jpg'}
];

/*
*    ROUTES
*/
app.get('/', (req,res) => {
    res.render('home');
});

app.get('/campgrounds', (req, res) => {
    res.render('campgrounds', {campgrounds: campgrounds});
});

//to follow the restful convention the post request must be the same with the get 
app.post('/campgrounds', (req, res) => {
    // Save input from form
    let name = req.body.name;
    let image = req.body.image;
    let newCampground = {name: name, image: image};
    //Add new Camp ground details to database
    campgrounds.push(newCampground);
    //Redirect back to campgrounds page
    res.redirect('/campgrounds');
});
//restful convention
app.get('/campgrounds/new', (req, res) => {
    res.render('new.ejs');
});

// Listening Server
const port = 8181;
app.listen(port, () => {
    console.log('Yelp Camp Server has started on http://localhost:8181');
});