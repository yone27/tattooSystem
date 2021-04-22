const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/portafolio', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
    .then(db => console.log("db is connect"))
    .catch(err => console.error(err))
