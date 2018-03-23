const config = require('./config.json');
const AWS = require('aws-sdk');
AWS.config.update({region:config.awsRegion});
const rekognition = new AWS.Rekognition();


var params = {
   "CollectionId": config.awsFaceCollection
}

rekognition.createCollection(params, function(err, data) {
  if (err) {
    console.log(err, err.stack);
  }
  else  {
    console.log('Collection created');           // successful response
  }

});
