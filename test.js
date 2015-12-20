/*var Sprite      = require('./Classes/Sprite'),
    Settings    = require('./Classes/Settings'),
    Stylesheet  = require('./Classes/Stylesheet'),
    u           = new(require('./Classes/utils'))();


u.debug = false;



var settings = new Settings({
    working_directory: 'themes/theme_nq/img/sprite/',
    output: {
        //stylesheet: 'themes/theme_nq/css/',
    },
    style: {
        type: 'scss'
    },
    sprite: {
        name: 'sprite_spi0n',
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
*/


var sprite = require('./index');

var settings = {
    working_directory : 'themes/theme_nq/img/sprite/',
    force_config: true,
    output: {
        stylesheet: 'themes/theme_nq/img/',
        spritesheet: 'themes/theme_nq/img/'
    },
    style: {

    },
    hook : {
        each : function (item) {
            item.css = '.' + item.className + '_hacked { width: ' + item.width + 'px; height: ' + item.height + 'px; background-position: -'+ item.posX +'px -'+ item.posY+'px; }';
            return item;
        }
    }
};


sprite.generate(settings, function () {
    console.log('End generation');


    settings = {
        working_directory : 'themes/theme_nq/img/sprite_retina/',
        force_config: true,
        delay: 150,
        style: {
            retina: 'sprite'
        },
        output: {
            stylesheet: 'themes/theme_nq/img/',
            spritesheet: 'themes/theme_nq/img/'
        },
        hook: {
            each: false,
        },
        sprite: {
            path: 'the',
            name: 'sprite_retina'
        }
    };

    sprite.generate(settings, function () {
        console.log('End generation retina');
    });

});



