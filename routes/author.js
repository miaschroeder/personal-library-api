const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// get all authors
router.get('/', async (req, res) => {
    try {
        const allAuthors = await pool.query(
            "SELECT * FROM author"
        );
        res.status(200).json(allAuthors.rows);
    } catch (err) {
        res.status(500).json({ msg: err});
        console.log(err);
    }
});

// create author
router.post('/', async (req, res) => {
    try {
        const {
            fname,
            lname,
            birthDate,
            birthCountry,
            favorite
        } = req.body;
        console.log(
            fname, lname, birthDate, birthCountry, favorite
        );
        const newAuthor = await pool.query(
            `INSERT INTO author (author_id, first_name, last_name, date_of_birth, country_of_birth, favorite)
            VALUES (uuid_generate_V4(), $1, $2, $3, $4, $5) RETURNING *`,
            [fname, lname, birthDate ? birthDate : null, birthCountry ? birthCountry : null, favorite ? favorite : null]
        );
        res.status(201).json(newAuthor.rows);
    } catch (err) {
        res.status(500).json({ msg: err});
        console.log(err);
    }
});

// get single author
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const author = await pool.query(
            `SELECT * FROM author WHERE author_id = $1`, [id]
        );
        res.status(200).json(author.rows);
    } catch (err) {
        res.status(500).json({ msg: err});
        console.log(err);
    }
});

// update author
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            fname,
            lname,
            birthDate,
            birthCountry,
            favorite
        } = req.body;
        const updatedAuthor = await pool.query(
            `UPDATE author SET first_name = $1, last_name = $2, date_of_birth = $3, country_of_birth = $4, favorite = $5
            WHERE author_id = $6
            RETURNING *`,
            [fname, lname, birthDate ? birthDate : null, birthCountry ? birthCountry : null, favorite ? favorite : null, id]
        );
        res.status(200).json(updatedAuthor.rows);
    } catch (err) {
        res.status(500).json({ msg: err});
        console.log(err);
    }
});

// delete author
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAuthor = await pool.query(
            `DELETE FROM author WHERE author_id = $1 RETURNING *`, [id]
        );
        res.status(200).json(deletedAuthor.rows);
    } catch (err) {
        res.status(500).json({ msg: err});
        console.log(err);
    }
});

module.exports = router;