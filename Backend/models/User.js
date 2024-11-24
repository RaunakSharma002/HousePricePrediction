// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   isAdmin: { type: Boolean, default: false },
// });

// module.exports = mongoose.model('User', userSchema);

//----------------------------------------------------------------------------

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  phone: { type: String }, // Seller's phone number
  listings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'House' }], // Houses listed by the seller
});

module.exports = mongoose.model('User', userSchema);
