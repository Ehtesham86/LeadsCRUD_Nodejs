const mongoose = require('mongoose');

const primeassetFormSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ["New", "Engaged", "Proposal Sent", "Closed-Won", "Closed-Lost"],
        default: "New",
    },
});

module.exports = mongoose.model('LeadsCRUD', primeassetFormSchema);
