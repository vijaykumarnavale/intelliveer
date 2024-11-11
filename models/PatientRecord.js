
const db = require('../config/db');

const PatientRecord = {
  async createRecord(name, age, doctorId) {
    const [result] = await db.query('INSERT INTO patient_records (name, age, doctor_id) VALUES (?, ?, ?)', [name, age, doctorId]);
    return result.insertId;
  },
  async getRecordById(recordId) {
    const [rows] = await db.query('SELECT * FROM patient_records WHERE id = ?', [recordId]);
    return rows[0];
  },
 
};

module.exports = PatientRecord;
