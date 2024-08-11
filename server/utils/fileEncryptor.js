const fs = require('fs')

const fileEncryptor = ({ message }) => {
    try {
        if (message.path && (message.path.endsWith('.png') || message.path.endsWith('.jpg'))) {
            const image = fs.readFileSync(message.path,'base64');
  
            // JSON.parse() Method
            let clone = JSON.parse(JSON.stringify(message))
            clone.image = image
            return clone;
        }
        return message;
    } catch (error) {
        console.error("Error while converting image to bs64:",error);
        return null;
    }
}

module.exports = { fileEncryptor }