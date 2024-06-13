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

router.post('/upload', upload.single('file'), (req, res) => {
    let fileName = req.file.originalname
    //delete all other files
    fs.readdirSync('uploads/').forEach(file => {
        if (file !== fileName) {
            fs.unlinkSync('uploads/' + file);
        }
    });
    res.status(200).send("Uploaded " + fileName);
});

router.get('/download', (req, res) => {
    let fileName = fs.readdirSync('uploads/')[0];
    if (fileName === undefined) {
        res.sendStatus(404);
        console.log("No file to download");
        return
    }
    res.download(`uploads/${fileName}`);
});

router.get('/ls', (req, res) => {
    let files = fs.readdirSync('uploads/');
    res.send(files);
});

module.exports = router;
