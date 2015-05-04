/*

 Settings Class
 Author: Guillaume Dumoulin @Frulko
 Date: 19/02/2015

 */

var fs          = require('fs'),
	path        = require('path');


var u = new(require('./utils'))();
u.debug = true;


var default_settings = {
    working_directory : 'test_folder',
    save_settings     : true,
    debug             : false,
    log               : true,
    backup_previous   : true,
    output            : {
        up_directory : false,
        stylesheet    : '',
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
        name          : 'sprite',
        compression   : true,
        engine        : 'pngquant', //In the futur
        arrangement   : 'vertical', //horizontal , auto
        out_directory : 'SpriteGeneration',
        html_preview  : true,
        padding       : {
            top       : 0,
            left      : 0
        }
    }
};


var Settings = function Settings(settings){
	u.log('Settings: constructor');
    //Properties
	this.settings_loaded = false;

    //Todo Add 3 control - sprite, style, conf.
    //Todo Force to specify a working directory
	//u.extend(default_settings, settings);
    //console.log(default_settings.style)
    this.override(settings);
};

Settings.prototype.override = function (settings) {

    u.log('Settings: override');
    this.parseObject(default_settings, settings);

    //u.log(Object.keys(default_settings));
};

Settings.prototype.parseObject = function (object, compareObject){
    for(var i in object){

        if(compareObject.hasOwnProperty(i)){
            if(typeof object[i] === 'object'){
                for(var j in object[i]){
                    if(compareObject[i].hasOwnProperty(j)){
                        object[i][j] = compareObject[i][j];
                    }
                }
            }else{
                object[i] = compareObject[i];
            }

            if(typeof object[i] === 'object'){
                this.parseObject(object[i], compareObject);
            }
        }


    }
};

Settings.prototype.getSettings = function (){
    return default_settings;
};

//Settings.prototype.testSprite = function(){};


Settings.prototype.checkConfigFile = function (file_path, cb){
	u.log('Settings: checkConfigFile');

	fs.exists(file_path, function(exists) {
		cb(exists);
	});

}


Settings.prototype.loadJSONFile = function(cb){
	u.log('Settings: loadJSONFile');
	var sprite_dir = this.dir + path.sep + "SpriteOutput" + path.sep + 'settings.json';

	this.checkConfigFile(sprite_dir, function(){
		fs.readFile(sprite_dir, 'utf8', function (err, data) {
			if (err) {
				console.log('Error: ' + err);
				return;
			}

			cb(JSON.parse(data));
		});
	});




}

Settings.prototype.generateConfigFile = function (){
	u.log('Settings: generateConfigFile');

	var sprite_dir = this.dir + path.sep + "SpriteOutput";
	u.log(sprite_dir);

	fs.writeFile(sprite_dir + path.sep + 'settings.json', JSON.stringify(this, null, '\t'), function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log('[SUCCESS] settings saved');
		}
	});
};



module.exports = Settings;
