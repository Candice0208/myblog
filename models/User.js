/**
 * Created by candice on 2017/6/19.
 */

var mongoose = require('mongoose');

var usersSchema = require('../schemas/users');

module.exports = mongoose.model('User',usersSchema);