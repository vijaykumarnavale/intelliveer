
const express = require('express');
const { createPatientRecord, getPatientRecords, updatePatientRecord, deletePatientRecord } = require('../controllers/patientRecordController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authenticateToken, authorizeRole('Doctor', 'Admin'), createPatientRecord);
router.get('/', authenticateToken, getPatientRecords);
router.put('/:recordId', authenticateToken, authorizeRole('Doctor', 'Admin'), updatePatientRecord);
router.delete('/:recordId', authenticateToken, authorizeRole('Admin'), deletePatientRecord);

module.exports = router;
