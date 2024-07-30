const { 
  Schema,
  model } = require('mongoose');

const groupMessageSchema = new Schema({
  room: String, 
  sender: String,
  content: String,
  path: String,
  timeStamp:{
    type:Date,
    default: Date.now,
  }
},{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

const groupMessageModel = model('groupMessage', groupMessageSchema);

module.exports = { groupMessageModel };