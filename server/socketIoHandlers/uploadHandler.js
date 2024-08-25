const fs = require('fs');

const uploadHandler = async(file) => {
    // console.log("file",typeof(file.file))
    try {
        let paths = [];
        for (let index = 0; index < file.file.length; index++) {
            const element = file.file[index];

            const StringArray = String(element.type).split('/');
            let folderName = '';
    
            if (element.type === '') folderName = `./public/common`;
            else folderName = `./public/${StringArray[0]}/${StringArray[1]}`;
    
            if (!fs.existsSync(folderName)) fs.mkdirSync(folderName, { recursive:true });
            const fileBuffer = Buffer.from(new Uint8Array(element.fileBuf));
    
            fs.writeFileSync(`${folderName}/${element.name}`, fileBuffer);
            paths.push(`${folderName}/${element.name}`)
        }
        if (paths.length === 0) paths = null;
        return { ...file?.messgeObj, path:paths };
    } catch (error) {
        console.error("Error while uploading: ",error)
    }
}

module.exports = uploadHandler;