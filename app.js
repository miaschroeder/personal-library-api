const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

// middleware
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3001;

app.listen(port, () => {
    `Server listening on ${port}...`
});
