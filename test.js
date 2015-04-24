var Spritesheet = require('./Classes/Spritesheet');
var Settings    = require('./Classes/Settings');
var Stylesheet  = require('./Classes/Stylesheet');

var u           = new(require('./Classes/utils'))(); //Call and create a new Utils
u.debug = false;

//TODO GULP OR BRUNCH JSHINT
var settings = new Settings({

    dir              : './test_folder',
    sprite_name      : 's_sprite_new',
    generate_HTML    : true,
    css_rules        : true,
    css_prefix       : 'sg-',
    css_span_block   : true,
    padding_x            : 5,
    padding_y            : 5


});

settings.loadJSONFile(function(json){
    u.log(json);
});

//settings.generateConfigFile();



var sprite = new Spritesheet(settings);
sprite.setSettings(settings);
sprite.processing(function(e){

    var stylesheet = new Stylesheet(settings);
    stylesheet.setSettings(settings);
    stylesheet.generateCSS(e);
    
});


var settings = {
    working_directory : '',
    save_settings     : true,
    debug             : false,
    log               : true,
    backup_previous   : true,
    output            : {
        up_directory : false,
        style    : '',
        sprite   : ''
    },
    style             : {
        type : 'css',
        icon : true,
        prefix : 's-',
        rules : [
            {'_hover' : ':hover'},
            {'_active' : ':active'}
        ]
    },
    sprite            : {
        name        : 'sprite',
        compression : true,
        engine      : 'pngquant', //In the futur
        arrangement : 'vertical', //horizontal , auto
        out_directory : 'SpriteGeneration',
        html_preview : true,
        padding           : {
            top     : 0,
            left    : 0
        }
    }
};

/*spriteGen(settings, function () {

});*/

/*sprite.grabImageAssetsFromDirectory('./test_folder', function(){
    console.log('SUCCESS GRABBING')
});*/

