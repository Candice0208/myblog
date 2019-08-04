/**
 * Created by candice on 2017/6/19.
 */

var mongoose = require('mongoose');

var contentSchema = require('../schemas/contents');

module.exports = mongoose.model('Content',contentSchema);