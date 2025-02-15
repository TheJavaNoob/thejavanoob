var express = require('express');
var cors = require('cors');
var router = express.Router();
require('dotenv').config();

const RtcTokenBuilder = require("../src/RtcTokenBuilder2").RtcTokenBuilder;
const RtcRole = require("../src/RtcTokenBuilder2").Role;

const appId = process.env.AGORA_APP_ID;
const appCertificate = process.env.AGORA_APP_CERTIFICATE;
const channelName = "";
const role = RtcRole.PUBLISHER;
const tokenExpirationInSecond = 86400;
const privilegeExpirationInSecond = 86400;

router.use(cors());

router.post('/getToken/:userID', async (req, res) => {
    var userID = req.params.userID;
    const tokenWithUid = RtcTokenBuilder.buildTokenWithRtm(appId, appCertificate, userID, userID, role, tokenExpirationInSecond, privilegeExpirationInSecond);
    console.log("userID:", userID);
    res.end(tokenWithUid);
});

module.exports = router;