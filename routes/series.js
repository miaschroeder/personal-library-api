const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// get all series
router.get('/', async (req, res) => {
    try {
        const allSeries = await pool.query(
            `SELECT * FROM series`
        );
        res.status(200).json(allSeries.rows);
    } catch (err) {
        res.status(500).json({ msg: err });
        console.log(err);
    }
});

// create series
router.post('/', async (req, res) => {
    try {
        const { title, authorID, numWorks } = req.body;
        const newSeries = await pool.query(
            `INSERT INTO series (series_id, series_title, author_id, number_of_works) VALUES (uuid_generate_v4(), $1, $2, $3)
            RETURNING *`,
            [title, authorID, numWorks]
        );
        res.status(201).json(newSeries.rows);
    } catch (err) {
        res.status(500).json({ msg: err });
        console.log(err);
    }
});

// get single series
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const series = await pool.query(
            `SELECT * FROM series WHERE series_id = $1`, [id]
        );
        res.status(200).json(series.rows);
    } catch (err) {
        res.status(500).json({ msg: err });
        console.log(err);
    }
});

// update series
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, authorID, numWorks } = req.body;
        const updatedSeries = await pool.query(
            `UPDATE series SET series_title = $1, author_id = $2, number_of_works = $3 WHERE series_id = $4
            RETURNING *`,
            [title, authorID, numWorks, id]
        );
        res.status(200).json(updatedSeries.rows);
    } catch (err) {
        res.status(500).json({ msg: err });
        console.log(err);
    }
});

// delete series
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSeries = await pool.query(
            `DELETE FROM series WHERE series_id = $1 RETURNING *`, [id]
        );
        res.status(200).json(deletedSeries.rows);
    } catch (err) {
        res.status(500).json({ msg: err });
        console.log(err);
    }
});

module.exports = router;