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
    if (fileName === undefined) {
        res.sendStatus(400);
        console.log("No file to upload");
        return
    }
    //delete all other files
    fs.readdirSync('uploads/').forEach(file => {
        if (file !== fileName && fs.existsSync('uploads/' + file)) {
            fs.unlinkSync('uploads/' + file);
        }
    });
    res.status(200).send("Uploaded " + fileName);
});

router.get('/download', (req, res) => {
    let fileName = req.query.file || fs.readdirSync('uploads/')[0];
    if (fileName === undefined) {
        res.sendStatus(404);
        console.log("No file to download");
        return
    }
    res.download(`uploads/${fileName}`);
});

router.get('/do', (req, res) => {
    let command = req.query.command;
    if(command === "list"){
        let files = fs.readdirSync('uploads/');
        res.send(files);
    } else if (command === "delete") {
        let fileName = req.query.file;
        if (fileName === undefined) {
            res.sendStatus(404);
            console.log("No file to delete");
            return
        }
        if (fs.existsSync('uploads/' + fileName)) {
            fs.unlinkSync('uploads/' + fileName);
            res.status(200).send("Deleted " + fileName);
        } else {
            res.sendStatus(404);
        }
    }
});

module.exports = router;
