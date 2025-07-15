const express = require('express');
const { searchWeb } = require('../services/searchService');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ message: 'Missing query parameter q' });
    const results = await searchWeb(q);
    res.json({ results });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
