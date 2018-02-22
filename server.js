const express    = require('express');        // call express
const app        = express();                 // define our app using express
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');
const Raspistill = require('node-raspistill').Raspistill;
const camera = new Raspistill({
    width: 600,
    height: 600
});


const s3upload = require('./upload-s3');
const speaker = require('./speaker');
const faceSearch = require('./search-faces');


app.use(basicAuth({
    users: { 'raspi': 'secret' }
}))

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});
router.post('/capture', function(req, res) {
  var fileName = new Date().getTime()+".jpg";
  console.log('filename', fileName);
  camera.takePhoto(fileName).then((photo) => {
    console.log('photo captured');
    //speaker.speak('Image has been captured... ');
    s3upload.upload(fileName, function(err,data){
        if(err){
          res.json({ status: 'fail' });
        }else{
          console.log('uploaded image to s3 bucket: '+fileName);
          //speaker.speak('Image has been uploaded to S3 bucket raspi118528');
          faceSearch.search(photo, function(err, data){
            if(!err){

              if(data.FaceMatches && data.FaceMatches.length>0){
                  var text = 'Hello '+data.FaceMatches[0].Face.ExternalImageId + '. How are you?';
                  // text += Number.parseFloat(data.FaceMatches[0].Similarity).toFixed(2)+' % confident that you are '+
                  // data.FaceMatches[0].Face.ExternalImageId;
                  speaker.speak(text);

              }else{
                  speaker.speak("Hello! We never met before. What's your name?");
              }
            }else{
              speaker.speak("I can's see any faces. Are you human?");
            }
          })
          res.json({ status: 'pass', key: fileName });
        }
    })
  });

});
// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
