const path = require('path');
const fs = require('fs');

const getFile = async(req, res) => {
  try{
      const { file } = req.body;
      const filePath = path.join(__dirname, '..', file);
      // console.log("filePath",filePath)

      if(!fs.existsSync(filePath)) throw new Error("File doesn't exist");

      const image = fs.readFileSync(filePath,'base64');
  
      res.status(200).json({ image })
  } catch(error){
      console.log("Error while downloading: ",error)
      res.json({"message":"Error while getting Image",error});
  }
};

module.exports = { getFile };