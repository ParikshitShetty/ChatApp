const express = require('express');
const router = express.Router();

router.post('/',(req,res)=>{
    const requestData = req.body;
    console.log(requestData)
    res.json({ message: 'Data submitted successfully.' });
});
module.exports=router;