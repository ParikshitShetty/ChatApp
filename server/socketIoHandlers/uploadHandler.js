const fs = require('fs');

const uploadHandler = async(file) => {
    try {
        const StringArray = String(file.type).split('/');
        const name = file.name;
        let folderName = '';

        if (file.type === '') folderName = `./public/common`;
        else folderName = `./public/${StringArray[0]}/${StringArray[1]}`;

        if (!fs.existsSync(folderName)) fs.mkdirSync(folderName, { recursive:true });
        const fileBuffer = Buffer.from(new Uint8Array(file.file));

        fs.writeFileSync(`${folderName}/${name}`, fileBuffer);

        const returnObject = { ...file?.messgeObj , path:`${folderName}/${name}`};
        // console.log("returnObject",returnObject);
        return returnObject;
    } catch (error) {
        console.error("Error while uploading: ",error)
    }
}

module.exports = uploadHandler;