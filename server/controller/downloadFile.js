const path = require('path');

const downloadFile = async(req, res) => {
    try{
        const { file } = req.body;
        let filePath = path.join(__dirname, '..', file);
    
        res.download(filePath);
      }catch(error){
        console.log("Error while downloading: ",error)
        res.json({"message":"Error while downloading",error});
      }
};

module.exports = { downloadFile };