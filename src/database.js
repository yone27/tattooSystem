const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://yone:yone123@cluster0-t41nx.mongodb.net/test?retryWrites=true', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
    .then(db => console.log("db is connect"))
    .catch(err => console.error(err))
