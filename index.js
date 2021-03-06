var Sprite      = require('./Classes/Sprite'),
    Settings    = require('./Classes/Settings'),
    Stylesheet  = require('./Classes/Stylesheet'),
    events      = require('events'),
    u           = new(require('./Classes/utils'))();


u.debug = false;








var SpriteGenerator = function () {

};

SpriteGenerator.prototype = new events.EventEmitter;

SpriteGenerator.prototype.generate = function (settingsObject, callback){
    callback = callback || (function () {});
    settingsObject = settingsObject || {};
    var self = this;
    var settings = new Settings(settingsObject);

    settings.loadConfig(function (config) {

        if (typeof config.working_directory !== 'undefined' && !(typeof settingsObject.force_config !== 'undefined' && settingsObject.force_config)) {
            override = new Settings(config);
        }

        var local_settings = settings.getSettings();
        var process_delay = setTimeout(function (){
            clearTimeout(process_delay);
            self.process(settings, function (e) {
                if(!config || (typeof settingsObject.force_config !== 'undefined' && settingsObject.force_config)){
                    settings.saveConfigFile(settings);
                }
                callback(e);
            });

        }, local_settings.delay);
    });
};



SpriteGenerator.prototype.process = function (settings, callback) {
    var sprite = new Sprite(settings);
    var styleSheet = new Stylesheet(settings);
    var self = this;

    sprite.on('optimizing', function (e) {
        self.emit('sprite:optimizing', e);
    });


    sprite.processing(function (res, err){
        if(err){
            console.log(err);
            return [];
        }

        if(parseInt(res.code[0], 10) === 2){
            styleSheet.generateCSS(res.sprite, function () {

                callback({
                    sprite: sprite.getOutputFile(),
                    style:  styleSheet.getOutputFile()
                });

            });
        }

    });
};


module.exports = new SpriteGenerator();
