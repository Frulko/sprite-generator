var Spritesheet = require('./Classes/Spritesheet');
var Settings    = require('./Classes/Settings');
var Stylesheet  = require('./Classes/Stylesheet');




var settings = new Settings({

    dir : './test_folder'

});


var sprite = new Spritesheet(Settings);
sprite.setSettings(settings);

/*sprite.grabImageAssetsFromDirectory('./test_folder', function(){
    console.log('SUCCESS GRABBING')
});*/

