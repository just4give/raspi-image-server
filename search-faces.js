const config = require('./config.json');
const AWS = require('aws-sdk');
AWS.config.update({region:config.awsRegion});
const rekognition = new AWS.Rekognition();
const speaker = require('./speaker');



module.exports.search = function(fileName,cb){

  var params = {
    "CollectionId": config.awsFaceCollection,
     "FaceMatchThreshold": 90,
     "MaxFaces": 1,
     "Image": {
        "S3Object": {
           "Bucket": config.s3Bucket,
            "Name": fileName
        }
     }
  };


  rekognition.searchFacesByImage(params, function(err, data) {
   if (err) {
     console.log('error in searchFacesByImage',err); // an error occurred
     cb(err);

    } else {
       cb(null,data);

      }
  });

}
