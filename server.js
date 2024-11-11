// server.js
const express = require('express');
const dotenv = require('dotenv');
const patientRecordRoutes = require('./routes/patientRecords');
const appointmentRoutes = require('./routes/appointments');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api/patient-records', patientRecordRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
