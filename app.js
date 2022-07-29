const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authorRouter = require('./routes/author');
const seriesRouter = require('./routes/series');
const bookRouter = require('./routes/book');
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routing
app.use('/api/v1/author', authorRouter);
app.use('/api/v1/series', seriesRouter);
app.use('/api/v1/book', bookRouter);

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Server listening on ${port}...`);
});
