/**
 * Created by candice on 2017/6/19.
 */

var mongoose = require('mongoose');

var categoriesSchema = require('../schemas/categories');

module.exports = mongoose.model('Category',categoriesSchema);