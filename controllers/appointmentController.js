
const db = require('../config/db');

// Create an appointment (Patients and Admins)
async function createAppointment(req, res) {
  const { doctorId, patientId, date, status } = req.body;
  try {
    await db.query('INSERT INTO appointments (doctor_id, patient_id, date, status) VALUES (?, ?, ?, ?)', [doctorId, patientId, date, status]);
    res.status(201).json({ message: 'Appointment created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error creating appointment' });
  }
}

// Get appointments based on role
async function getAppointments(req, res) {
  const { id, role } = req.user;

  try {
    let query;
    let params = [];

    if (role === 'Admin') {
      // Admin can view all appointments
      query = 'SELECT * FROM appointments';
    } else if (role === 'Doctor') {
      // Doctor can view appointments assigned to them
      query = 'SELECT * FROM appointments WHERE doctor_id = ?';
      params = [id];
    } else if (role === 'Patient') {
      // Patient can view their own appointments
      query = 'SELECT * FROM appointments WHERE patient_id = ?';
      params = [id];
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching appointments' });
  }
}

// Update appointment (Patients and Doctors)
async function updateAppointment(req, res) {
  const { appointmentId } = req.params;
  const { date, status } = req.body;
  const { role, id: userId } = req.user;

  try {
    if (role === 'Patient') {
      const [ownAppointment] = await db.query('SELECT * FROM appointments WHERE id = ? AND patient_id = ?', [appointmentId, userId]);
      if (!ownAppointment.length) return res.status(403).json({ error: 'Access denied' });
    } else if (role === 'Doctor') {
      const [assignedAppointment] = await db.query('SELECT * FROM appointments WHERE id = ? AND doctor_id = ?', [appointmentId, userId]);
      if (!assignedAppointment.length) return res.status(403).json({ error: 'Access denied' });
    }

    await db.query('UPDATE appointments SET date = ?, status = ? WHERE id = ?', [date, status, appointmentId]);
    res.json({ message: 'Appointment updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating appointment' });
  }
}

// Delete appointment (Admins only)
async function deleteAppointment(req, res) {
  const { appointmentId } = req.params;
  try {
    await db.query('DELETE FROM appointments WHERE id = ?', [appointmentId]);
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting appointment' });
  }
}

module.exports = { createAppointment, getAppointments, updateAppointment, deleteAppointment };
