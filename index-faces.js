var AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});
var rekognition = new AWS.Rekognition();

var params = {
   "CollectionId": "raspifacecollection",
   "DetectionAttributes": [ "ALL" ],
   "ExternalImageId": "riya",
   "Image": {

      "S3Object": {
         "Bucket": "ai-dexter-faces",
         "Name": "riya.jpg"
      }
   }
}

rekognition.indexFaces(params, function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
   else     console.log(data);           // successful response

 });
