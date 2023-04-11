const mongooose = require('mongoose');

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:admin1@users.v61xcek.mongodb.net/User?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Connected to MongoDB");
    }).catch((error) => {
        console.log(error);
    });

module.exports = mongoose;
