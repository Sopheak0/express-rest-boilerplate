const express = require('express');
// const path = require('path');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const categoryRoutes = require('./category.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/category', categoryRoutes);

module.exports = router;
