var Sprite      = require('./Classes/Sprite'),
    Settings    = require('./Classes/Settings'),
    Stylesheet  = require('./Classes/Stylesheet'),
    u           = new(require('./Classes/utils'))();


u.debug = false;




function spriteProcess (settings, callback) {
    var sprite = new Sprite(settings);
    var styleSheet = new Stylesheet(settings);

    sprite.processing(function (res, err){
        if(err){
            console.log(err);
            return [];
        }

        if(parseInt(res.code[0], 10) === 2){
            styleSheet.generateCSS(res.sprite.assets, callback);
        }

    });
}

module.exports = {
    generate : function (settingsObject, callback){
        callback = callback || (function () {});
        settingsObject = settingsObject || {};

        var settings = new Settings(settingsObject);

        settings.loadConfig(function (config) {

            if (config) {
                override = new Settings(config);
            }



            spriteProcess(settings, function () {
                if(!config || (typeof settingsObject.force_config !== 'undefined' && settingsObject.force_config)){
                    settings.saveConfigFile(settings);
                }

                callback();
            });
        });


    }
};
