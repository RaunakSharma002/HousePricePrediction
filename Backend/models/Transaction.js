const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  house: { type: mongoose.Schema.Types.ObjectId, ref: 'House' },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  purchaseDate: { type: Date, default: Date.now },
  location: { type: String, default: 'other' },
  price: { type: Number, default: 0 },
  year: { type: Number } // Year of transaction, extracted from purchaseDate
});

module.exports = mongoose.model('Transaction', transactionSchema);
