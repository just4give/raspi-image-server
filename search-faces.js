const config = require('./config.json');
const AWS = require('aws-sdk');
AWS.config.update({region:config.awsRegion});
const rekognition = new AWS.Rekognition();



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
  console.log('1.searching');

  rekognition.searchFacesByImage(params, function(err, data) {
    console.log('2.searching');
   if (err) {
     console.log('error in searchFacesByImage',err); // an error occurred
     cb(err);

    } else {
       cb(null,data);

      }
  });

}
