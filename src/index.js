const express = require('express');

const cors = require('cors');

const path = require('path');

const userRoutes = require('./routes/userRoutes')

require('dotenv').config({ path: path.join(__dirname, '../.env') });

require('./config/dbConnect');

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/user/', userRoutes)

app.get('/', (req, res) => {
    res.json({ Status: "Unauthorized !" });
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log("Server Working", port)
});

app.use('/public/', express.static(path.join(__dirname, '../uploads')));

const mail = require('./utils/sendMail');