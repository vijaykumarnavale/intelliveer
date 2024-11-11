// models/Appointment.js
const db = require('../config/db');

const Appointment = {
  async createAppointment(doctorId, patientId, date, status) {
    const [result] = await db.query('INSERT INTO appointments (doctor_id, patient_id, date, status) VALUES (?, ?, ?, ?)', [doctorId, patientId, date, status]);
    return result.insertId;
  },
  async getAppointmentsByDoctor(doctorId) {
    const [rows] = await db.query('SELECT * FROM appointments WHERE doctor_id = ?', [doctorId]);
    return rows;
  },

};

module.exports = Appointment;
