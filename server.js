// Load dependencies
const aws = require('aws-sdk');
const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config()
const app = express();

aws.config.update({
    accessKeyId: process.env.do_key_id,
    secretAccessKey: process.env.do_secret_key
});

const spacesEndpoint = new aws.Endpoint(process.env.do_endpoint);
const s3 = new aws.S3({
  endpoint: spacesEndpoint
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.do_space,
    acl: 'public-read',
    key: function (request, file, cb) {
      // console.log(file);
      cb(null, file.originalname);
    }
  })
}).array('upload', 1)

app.post('/upload', function (request, response) {
  upload(request, response, function (error) {
    if (error) {
      console.log(error);
      response.json({message: "Error on upload", error: error, success: false})
    }
    response.json({message: "File Uploaded", success: true});
  })
})

app.listen(3000, function () {
  console.log('Server listening on port 3000.');
})