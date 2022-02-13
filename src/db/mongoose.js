const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('db connection was successful')
}).catch((e) => {
    console.log('error: ' + e)
})