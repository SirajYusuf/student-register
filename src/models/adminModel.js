const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Admin = new Schema({}, { strict: false });
const AdminCollection = mongoose.model('admin-user', Admin,'admin-user');

module.exports = AdminCollection