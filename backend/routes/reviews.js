const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Review = require('../models/Review');

// ── GET avis d'un parfum ─────────────────────
router.get('/:productName', async (req, res) => {
  try {
    const reviews = await Review.find({
      productName: decodeURIComponent(req.params.productName)
    }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST ajouter un avis ─────────────────────
router.post('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const existing = await Review.findOne({
      productName: req.body.productName,
      userId: decoded.userId,
    });
    if (existing) {
      return res.status(400).json({ message: 'Vous avez déjà laissé un avis' });
    }

    const review = new Review({
      productName: req.body.productName,
      username: decoded.username,
      userId: decoded.userId,
      rating: req.body.rating,
      comment: req.body.comment,
    });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE supprimer son avis ─────────────────
router.delete('/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Avis introuvable' });
    if (review.userId !== decoded.userId.toString()) {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    await review.deleteOne();
    res.json({ message: 'Avis supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;