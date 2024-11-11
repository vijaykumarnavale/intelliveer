
const db = require('../config/db');

// Create a patient record (Doctors and Admins only)
async function createPatientRecord(req, res) {
  const { name, age, doctorId } = req.body;
  try {
    await db.query('INSERT INTO patient_records (name, age, doctor_id) VALUES (?, ?, ?)', [name, age, doctorId]);
    res.status(201).json({ message: 'Patient record created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error creating patient record' });
  }
}

// Read patient records
async function getPatientRecords(req, res) {
  const { id, role } = req.user; // user info from JWT

  try {
    let query;
    let params = [];

    if (role === 'Admin') {
      // Admins can view all patient records
      query = 'SELECT * FROM patient_records';
    } else if (role === 'Doctor') {
      // Doctors can view records assigned to them
      query = 'SELECT * FROM patient_records WHERE doctor_id = ?';
      params = [id];
    } else if (role === 'Patient') {
      // Patients can view their own records
      query = 'SELECT * FROM patient_records WHERE id = ?';
      params = [id];
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching patient records' });
  }
}

// Update patient records (Doctors and Admins)
async function updatePatientRecord(req, res) {
  const { recordId } = req.params;
  const { name, age } = req.body;
  const { role, id: userId } = req.user;

  try {
    // Check if doctor is only updating their assigned patient
    if (role === 'Doctor') {
      const [assignedRecord] = await db.query('SELECT * FROM patient_records WHERE id = ? AND doctor_id = ?', [recordId, userId]);
      if (!assignedRecord.length) return res.status(403).json({ error: 'Access denied' });
    }

    await db.query('UPDATE patient_records SET name = ?, age = ? WHERE id = ?', [name, age, recordId]);
    res.json({ message: 'Patient record updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating patient record' });
  }
}

// Delete patient records (Admins only)
async function deletePatientRecord(req, res) {
  const { recordId } = req.params;
  try {
    await db.query('DELETE FROM patient_records WHERE id = ?', [recordId]);
    res.json({ message: 'Patient record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting patient record' });
  }
}

module.exports = { createPatientRecord, getPatientRecords, updatePatientRecord, deletePatientRecord };
