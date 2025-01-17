const express = require('express');
const { handleFetchData, handleScanPage } = require('../controllers/controller');
const router = express.Router();

router.post('/fetch-data', handleFetchData);
router.post('/scan-page', handleScanPage)

module.exports = router