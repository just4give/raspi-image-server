var config = require('./config.json');
var AWS = require('aws-sdk');
AWS.config.update({region:config.awsRegion});
var s3 = new AWS.S3();
var fs = require('fs');



 module.exports.upload = function(fileName, cb){
   var bitmap = fs.readFileSync('./photos/'+fileName);
   
   var params = {
     Body: bitmap,
     Bucket: config.s3Bucket,
     Key: fileName
    };
    s3.putObject(params, function(err, data) {
      fs.exists('./photos/'+fileName, function(exists) {
        if(exists) {

          fs.unlink('./photos/'+fileName);
        }
        });

      if (err) {
        console.log(err, err.stack);
        cb(err);
      }else{
        //console.log(data);
        cb(null,data);           // successful response
      }

    });
 }
