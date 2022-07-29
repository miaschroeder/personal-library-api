const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const { route } = require('./author');

// get all books
router.get('/', async (req, res) => {
    try {
        const allBooks = await pool.query(
            `SELECT * FROM book`
        );
        res.status(200).json(allBooks.rows);
    } catch (err) {
        res.status(500).json({ msg: err });
        console.log(err);
    }
});

// create book
router.post('/', async (req, res) => {
    try {
        const {
            title, authorID, genre, publicationDate, publisher,
            ISBN, seriesID, pageLength, rating, readingStatus,
            startReadingDate, endReadingDate } = req.body;

            const newBook = await pool.query(
                `INSERT INTO book (book_id, book_title, author_id, genre, publication_date, publisher,
                    ISBN, series_id, page_length, rating, reading_status, start_reading_date,
                    end_reading_date) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                    RETURNING *`,
                    [title, authorID, genre, publicationDate, publisher ? publisher : null,
                    ISBN, seriesID ? seriesID : null, pageLength ? pageLength : null,
                     rating ? rating : null, readingStatus ? readingStatus : null,
                    startReadingDate ? startReadingDate : null, endReadingDate ? endReadingDate : null]
            );
            res.status(201).json(newBook.rows);
    } catch (err) {
        res.status(500).json({ msg: err });
        console.log(err);
    }
});

// get single book
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await pool.query(
            `SELECT * FROM book WHERE book_id = $1`, [id]
        );
        res.status(200).json(book.rows);
    } catch (err) {
        res.status(500).json({ msg: err });
        console.log(err);
    }
});

// update book
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title, authorID, genre, publicationDate, publisher,
            ISBN, seriesID, pageLength, rating, readingStatus,
            startReadingDate, endReadingDate } = req.body;
        
        const updatedBook = await pool.query(
            `UPDATE book SET book_title = $1, author_id = $2, genre = $3,
            publication_date = $4, publisher = $5, ISBN = $6, series_id = $7,
            page_length = $8, rating = $9, reading_status = $10,
            start_reading_date = $11, end_reading_date = $12 WHERE book_id = $13
            RETURNING *`,
            [title, authorID, genre, publicationDate, publisher ? publisher : null,
            ISBN, seriesID ? seriesID : null, pageLength ? pageLength : null,
            rating ? rating : null, readingStatus ? readingStatus : null,
            startReadingDate ? startReadingDate : null,
            endReadingDate ? endReadingDate : null, id] 
        );
        res.status(200).json(updatedBook.rows);
             
    } catch (err) {
        res.status(500).json({ msg: err });
        console.log(err);
    }
});

// delete book
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBook = await pool.query(
            `DELETE FROM book WHERE book_id = $1 RETURNING *`, [id]
        );
        res.status(200).json(deletedBook.rows);
    } catch (err) {
        res.status(500).json({ msg: err });
        console.log(err);
    }
});

module.exports = router;