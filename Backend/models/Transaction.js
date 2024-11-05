const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  house: { type: mongoose.Schema.Types.ObjectId, ref: 'House' },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  purchaseDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
