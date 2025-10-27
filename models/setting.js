const mongoose = require('mongoose');


const settingSchema = new mongoose.Schema({
  website_title: {
    type: String,
    required: true
  },
  website_logo: {
    type: String,
  },
  footer_description: {
    type: String,
    required: true
  }
});
const SettingModel = mongoose.model('Setting', settingSchema);

module.exports = SettingModel;