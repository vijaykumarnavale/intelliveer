
const express = require('express');
const { createAppointment, getAppointments, updateAppointment, deleteAppointment } = require('../controllers/appointmentController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authenticateToken, authorizeRole('Patient', 'Admin'), createAppointment);
router.get('/', authenticateToken, getAppointments);
router.put('/:appointmentId', authenticateToken, authorizeRole('Patient', 'Doctor'), updateAppointment);
router.delete('/:appointmentId', authenticateToken, authorizeRole('Admin'), deleteAppointment);

module.exports = router;
