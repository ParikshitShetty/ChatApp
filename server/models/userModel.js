const { 
  Schema,
  model } = require('mongoose');

const userSchema = new Schema({
  userName: {
    type: String,
    unique: true,
    required:true,
  },
  chatID: String, 
  status: String,
  timeStamp:{
    type:Date,
    default: Date.now,
  }
},{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

const userModel = model('users', userSchema);

module.exports = { userModel };