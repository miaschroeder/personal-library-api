const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// summary of reader's yearly statistics
router.get('/:year', async (req, res) => {
    try {
        const { year } = req.params;

        // number of books read
        const numBooks = await pool.query(
            `SELECT COUNT(*)
            FROM book
            WHERE end_reading_date BETWEEN $1 AND $2`,
            [`${year}-01-01`, `${year + 1}-01-01`]
        );

        // most & least read genres (1)
        const genreStats = await pool.query(
            `SELECT genre, COUNT(*)
            FROM book
            WHERE end_reading_date BETWEEN $1 AND $2
            GROUP BY genre
            ORDER BY COUNT(*) DESC`,
            [`${year}-01-01`, `${year + 1}-01-01`]
        );
        const mostGenre = genreStats.rows[0];
        const leastGenre = genreStats.rows[genreStats.rows.length - 1];

        // most & least read authors (1)
        const authorStats = await pool.query(
            `SELECT first_name, last_name, favorite, COUNT(*)
            FROM author LEFT JOIN book ON author.author_id = book.author_id
            WHERE end_reading_date BETWEEN $1 AND $2
            GROUP BY author.author_id
            ORDER BY COUNT(*) DESC`,
            [`${year}-01-01`, `${year + 1}-01-01`]
        );
        const mostAuthor = authorStats.rows[0];
        const leastAuthor = authorStats.rows[authorStats.rows.length - 1];

        // longest & shortest books (1)
        const lengthStats = await pool.query(
            `SELECT *
            FROM book
            WHERE end_reading_date BETWEEN $1 AND $2
            ORDER BY page_length DESC`,
            [`${year}-01-01`, `${year + 1}-01-01`]
        );
        const longestBook = lengthStats.rows[0];
        const shortestBook = lengthStats.rows[lengthStats.rows.length - 1];

        // highest & lowest rated books (1)
        
        res.status(200).json({
            "booksRead": numBooks.rows[0].count,
            "mostReadGenre": mostGenre,
            "leastReadGenre": leastGenre,
            "mostReadAuthor": mostAuthor,
            "leastReadAuthor": leastAuthor,
            longestBook,
            shortestBook
        });
    } catch (err) {
        res.status(500).json({ msg: err});
        console.log(err);
    }
});

module.exports = router;