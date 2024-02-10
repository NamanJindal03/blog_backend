const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blogs');

dotenv.config(); //this code will bring environemnt variables
const app = express();
app.use(express.json())
app.use(cors());

async function connectDatabase(){
    try{
        await mongoose.connect(process.env.DB_URL)
        console.log('db connected')
    }
    catch(err){
        console.log(err)
    }
}
connectDatabase();

app.get('/root', (req, res) => {
    res.send('here')
})
app.use('/user', userRoute);
app.use('/blog', blogRoute)

app.listen(process.env.PORT, () => {
    console.log('listening at port 3000')
})