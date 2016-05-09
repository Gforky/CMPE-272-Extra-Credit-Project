var cv = require('opencv');

// camera properties
var camWidth = 320;
var camHeight = 240;
var camFps = 10;
var camInterval = 1000 / camFps;

// face detection properties
var colors = {
        "face": [0, 0, 0],
        "mouth": [255, 0, 0],
        "nose": [255, 255, 255],
        "eyeLeft": [0, 0, 255],
        "eyeRight": [0, 255, 0]
    };
var rectThickness = 2;

// initialize camera
var camera = new cv.VideoCapture(0);
camera.setWidth(camWidth);
camera.setHeight(camHeight);

module.exports = function (socket) {
  setInterval(function() {
    camera.read(function(err, im) {
      if (err) throw err;

      //detect faces
      im.detectObject('./node_modules/opencv/data/haarcascade_frontalface_alt2.xml', {}, function(err, faces) {
        if (err) throw err;

        for (var i = 0; i < faces.length; i++) {
          face = faces[i];
          im.rectangle([face.x, face.y], [face.width, face.height], colors.face, rectThickness);
          socket.emit('frame', { buffer: im.toBuffer() });
        }
      });

      //detect mouths
      im.detectObject('./node_modules/opencv/data/haarcascade_mcs_mouth.xml', {}, function(err, mouths) {
          if (err) throw err;

          for(var j = 0; j < mouths.length; j++) {
            mouth = mouths[j];
            im.rectangle([mouth.x, mouth.y], [mouth.width, mouth.height], colors.mouth, rectThickness);
            socket.emit('frame', { buffer: im.toBuffer() });
        }
      });

      //detect noses
      im.detectObject('./node_modules/opencv/data/haarcascade_mcs_nose.xml', {}, function(err, noses) {
          if (err) throw err;

          for(var n = 0; n < noses.length; n++) {
            nose = noses[n];
            im.rectangle([nose.x, nose.y], [nose.width, nose.height], colors.nose, rectThickness);
            socket.emit('frame', { buffer: im.toBuffer() });
        }
      });

      //detect lefteyes
      im.detectObject('./node_modules/opencv/data/haarcascade_mcs_lefteye.xml', {}, function(err, lefteyes) {
          if (err) throw err;

          for(var l = 0; l < lefteyes.length; l++) {
            lefteye = lefteyes[l];
            im.rectangle([lefteye.x, lefteye.y], [lefteye.width, lefteye.height], colors.eyeLeft, rectThickness);
            socket.emit('frame', { buffer: im.toBuffer() });
        }
      }); 

      //detect righteyes
      im.detectObject('./node_modules/opencv/data/haarcascade_mcs_righteye.xml', {}, function(err, righteyes) {
          if (err) throw err;

          for(var r = 0; r < righteyes.length; r++) {
            righteye = righteyes[r];
            im.rectangle([righteye.x, righteye.y], [righteye.width, righteye.height], colors.eyeRight, rectThickness);
            socket.emit('frame', { buffer: im.toBuffer() });
        }
      });     
    });
  }, camInterval);
};
