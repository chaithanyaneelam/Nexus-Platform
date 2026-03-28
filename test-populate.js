
const mongoose = require('mongoose');
const Enrollment = require('./nexus-upskill/src/models/Enrollment').default;
const Course = require('./nexus-upskill/src/models/Course').default;
const User = require('./nexus-upskill/src/models/User').default;

mongoose.connect('mongodb://localhost:27017/nexus-upskill-test');
// Wait, I can't run this without TS compilation anyway...

