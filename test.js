var Sprite      = require('./Classes/Sprite'),
    Settings    = require('./Classes/Settings'),
    Stylesheet  = require('./Classes/Stylesheet'),
    u           = new(require('./Classes/utils'))();


u.debug = false;

//TODO GULP OR BRUNCH JSHINT
/*var settings = new Settings({

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



var sprite = new Spritesheet(settings);
sprite.setSettings(settings);
sprite.processing(function(e){

    var stylesheet = new Stylesheet(settings);
    stylesheet.setSettings(settings);
    stylesheet.generateCSS(e);
    
});*/


var settings = {
    working_directory : 'test_folder',
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


//Sprite.getImages(settings.working_directory);
var sprite = new Sprite(settings);
console.log(sprite.getImages(settings.working_directory));
/*spriteGen(settings, function () {

});*/

/*sprite.grabImageAssetsFromDirectory('./test_folder', function(){
    console.log('SUCCESS GRABBING')
});*/

