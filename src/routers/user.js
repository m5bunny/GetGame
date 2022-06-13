const express = require('express');
const pool = require('../db/connection');

const router = new express.Router();

router.get('/:id', async (req, res) =>
{
  try
  {
    const sqlQuery = 'SELECT id, email, password FROM User WHERE id=?';
    const rows = await pool.query(sqlQuery, req.params.id);
    if (rows.length === 0)
      return res.status(404).send();
    res.send(rows[0]);
  }
  catch (error)
  {
    res.send(error);
  }
});

module.exports = router;