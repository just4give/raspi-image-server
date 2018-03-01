const config = require('./config.json');
const AWS = require('aws-sdk');
AWS.config.update({region:config.awsRegion});
const rekognition = new AWS.Rekognition();


var params = {
   "CollectionId": config.awsFaceCollection,
   "MaxResults": 20
}

rekognition.listFaces(params, function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
   else     {
     console.log(data);
     var faceIds=[];
     data.Faces.forEach(function(face){
        faceIds.push(face.FaceId);
     })

     if(faceIds.length>0){
       var params = {
         CollectionId: config.awsFaceCollection,
         FaceIds: faceIds
        };
        rekognition.deleteFaces(params, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else     console.log(data);           // successful response
          
        });
     }

   }

 });


 var params = {
   CollectionId: "raspifacecollection",
   FaceIds: [
      "5f64bbd7-1c5d-4f52-bfb3-83b8fb04c0b8"
   ]
  };
  rekognition.deleteFaces(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
    /*
    data = {
     DeletedFaces: [
        "ff43d742-0c13-5d16-a3e8-03d3f58e980b"
     ]
    }
    */
  });
