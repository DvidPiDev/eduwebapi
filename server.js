// configuration is in the .env file!

require('dotenv').config();
const bodyparser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const apiRoutes = require('./routes/api');

morgan.token('username', (req) => {
    return req.body.username || 'No Username';
});

const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(morgan(process.env.LOG_FORMAT));
app.use('/api', apiRoutes);

app.get('/', async (req, res) => {
    try {
        res.status(200).json({message: process.env.DEFAULT_MESSAGE});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: `Internal server error: ${error}`});
    }
});

app.get('/favicon.ico', async (req, res) => {
    res.status(204);
});

app.listen(process.env.PORT, () => {
    console.log(`Server started on port http://localhost:${process.env.PORT}`);
});