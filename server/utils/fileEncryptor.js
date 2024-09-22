const fs = require('fs')
const pathlib = require('path');
const imageThumbnail = require('image-thumbnail');

const fileEncryptor = async ({ message }) => {
    try {
        if (message.path && (message.path.endsWith('.png') || message.path.endsWith('.jpg') || message.path.endsWith('.webp'))) {
            const absolutePath = pathlib.resolve(message.path);
            
            if (!fs.existsSync(absolutePath)) return message;

            const thumbnail = await thumbnailPromisehandler({ absolutePath });

            // JSON.parse() Method
            let clone = JSON.parse(JSON.stringify(message));
            clone.image = thumbnail.toString('base64'); // Convert Buffer to Base64
            return clone;  // Return the modified message with the thumbnail
        }
        return message;
    } catch (error) {
        console.error("Error while converting image to bs64:",error);
        return message;
    }
}

module.exports = { fileEncryptor }

// Promise to generate image thumnail
const thumbnailPromisehandler = ({ absolutePath }) => {
    return new Promise((resolve,reject) => {
        imageThumbnail(absolutePath,{percentage: 20}).
        then(thumbnail => resolve(thumbnail)).
        catch(err => reject(err))
    })
}