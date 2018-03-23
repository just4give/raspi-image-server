const config = require('./config.json');
const AWS = require('aws-sdk');
AWS.config.update({region:config.awsRegion});
const rekognition = new AWS.Rekognition();





  var params = {
    "CollectionId": config.awsFaceCollection,
     "FaceMatchThreshold": 90,
     "MaxFaces": 1,
     "Image": {
        "S3Object": {
           "Bucket": config.s3Bucket,
            "Name": '1520085128494.jpg'
        }
     }
  };
  console.log('1.searching');

  rekognition.searchFacesByImage(params, function(err, data) {
    console.log('2.searching');
   if (err) {
     console.log('error in searchFacesByImage',err); // an error occurred


    } else {
       console.log(data.FaceMatches);

      }
  });
