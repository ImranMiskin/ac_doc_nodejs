const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    name: { type: String },
    icon: { type: String },
    isActive: { type: Number, default: 0 },
    description: [{}],
    // description: { type: String },
    terms: [{}],
    banner_image: { type: String },
    category: { type: String },
});

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
