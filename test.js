var Sprite      = require('./Classes/Sprite'),
    Settings    = require('./Classes/Settings'),
    Stylesheet  = require('./Classes/Stylesheet'),
    u           = new(require('./Classes/utils'))();


u.debug = false;



var settings = new Settings({
    style : {
        type : 'less'
    }
});


var sprite = new Sprite(settings);
var styleSheet = new Stylesheet(settings);



sprite.processing(function (res, err){
    if(err){
        console.log(err);
        return [];
    }

    if(parseInt(res.code[0], 10) === 2){
        styleSheet.generateCSS(res.sprite.assets);
    }

});


