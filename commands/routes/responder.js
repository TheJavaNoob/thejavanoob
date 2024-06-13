var express = require('express');
const fs = require('fs');
const axios = require('axios');
var router = express.Router();
const multer  = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })

var state = {}
var fileName = ""

router.post('/upload', upload.single('file'), (req, res) => {
    fileName = req.file.originalname
    //delete all other files
    fs.readdirSync('uploads/').forEach(file => {
        if (file !== fileName) {
            fs.unlinkSync('uploads/' + file);
        }
    });
    console.log(`Received file ${req.file.originalname}`);
    res.sendStatus(200);
});

router.get('/download', (req, res) => {
    if (fileName === "") {
        res.sendStatus(404);
        return
    }
    res.download(`uploads/${fileName}`);
});

module.exports = router;
