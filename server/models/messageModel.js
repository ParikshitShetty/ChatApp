const { 
  Schema,
  model } = require('mongoose');
  
  const messageSchema = new Schema({
    senderUserName: {
      type: String,
      required:true,
    }, 
    recieverUserName: {
      type: String,
      required:true,
    },
    content: String,
    path: String,
    timeStamp:{
      type:Date,
      default: Date.now,
    }
  },{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});
  
  const messageModel = model('message', messageSchema);
  
  module.exports = { messageModel };