const express = require('express');
const router = express.Router();
const data = require('../data.json');

const removeDuplicates = (arr) => {
  return arr.filter((p, index, self) =>
    index === self.findIndex((t) => t.Name === p.Name)
  );
};

router.get('/search', async (req, res) => {
  try {
    const { q = '' } = req.query;
    if (!q || q.length < 2) {
      return res.json(removeDuplicates(data));
    }
    const results = data.filter((p) =>
      p.Name.toLowerCase().includes(q.toLowerCase()) ||
      p.Brand.toLowerCase().includes(q.toLowerCase()) ||
      p['Main Accords']?.some(a => a.toLowerCase().includes(q.toLowerCase())) ||
      p['General Notes']?.some(n => n.toLowerCase().includes(q.toLowerCase()))
    );
    res.json(removeDuplicates(results));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const decoded = decodeURIComponent(name);
    const product = data.find((p) =>
      p.Name.toLowerCase() === decoded.toLowerCase()
    );
    if (!product) {
      return res.status(404).json({ message: 'Parfum introuvable' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;