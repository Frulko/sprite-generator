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

        if (config) {
            override = new Settings(config);
        }



        self.process(settings, function (e) {
            if(!config || (typeof settingsObject.force_config !== 'undefined' && settingsObject.force_config)){
                settings.saveConfigFile(settings);
            }
            callback(e);
        });
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
            styleSheet.generateCSS(res.sprite.assets, function () {

                callback({
                    sprite: sprite.getOutputFile(),
                    style:  styleSheet.getOutputFile()
                });

            });
        }

    });
};


module.exports = new SpriteGenerator();
