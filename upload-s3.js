var AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});
var s3 = new AWS.S3();
var fs = require('fs');
//var bitmap = fs.readFileSync('/Users/mithundas/Downloads/me3.jpg');

// var params = {
//   Body: bitmap,
//   Bucket: "raspi118528",
//   Key: "HappyFace.jpg"
//  };
//  s3.putObject(params, function(err, data) {
//    if (err) console.log(err, err.stack); // an error occurred
//    else     console.log(data);           // successful response
//    /*
//    data = {
//     ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"",
//     VersionId: "tpf3zF08nBplQK1XLOefGskR7mGDwcDk"
//    }
//    */
//  });

 module.exports.upload = function(fileName, cb){
   var bitmap = fs.readFileSync('./photos/'+fileName);
   var params = {
     Body: bitmap,
     Bucket: "raspi118528",
     Key: fileName
    };
    s3.putObject(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        cb(err);
      }else{
        console.log(data);
        cb(null,data);           // successful response
      }

      /*
      data = {
       ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"",
       VersionId: "tpf3zF08nBplQK1XLOefGskR7mGDwcDk"
      }
      */
    });
 }
