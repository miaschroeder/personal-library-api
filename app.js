const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authorRouter = require('./routes/author');
const seriesRouter = require('./routes/series');
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routing
app.use('/api/v1/author', authorRouter);
app.use('/api/v1/series', seriesRouter);

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Server listening on ${port}...`);
});
