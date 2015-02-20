var Canvas = require('node-canvas-bin'),
    fs = require('fs')
    , Image = Canvas.Image
    , canvas = new Canvas(200,200)
    , ctx = canvas.getContext('2d');

fs.readFile(__dirname + '/chrome.jpg', function(err, loaded){
    if (err) throw err;
    img = new Image;
    img.src = squid;

        console.log('JPG loaded', img.width, img.height, loaded);
});