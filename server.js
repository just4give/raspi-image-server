const express    = require('express');        // call express
const app        = express();                 // define our app using express
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');
const Raspistill = require('node-raspistill').Raspistill;
const camera = new Raspistill({
    width: 600,
    height: 600
});
var AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});

var s3upload = require('./upload-s3');

app.use(basicAuth({
    users: { 'raspi': 'secret' }
}))

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 80;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});
router.post('/capture', function(req, res) {
  var fileName = new Date()+".jpg";
  console.log('filename', fileName);
  camera.takePhoto(fileName).then((photo) => {
    console.log('photo captured');
    s3upload.upload(fileName, function(err,data){
        if(err){
          res.json({ status: 'fail' });
        }else{
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
