/*

 Settings Class
 Author: Guillaume Dumoulin @Frulko
 Date: 19/02/2015

 */

var fs          = require('fs'),
	path        = require('path');


var u = new(require('./utils'))();
u.debug = true;

var settings_config_file = '.spriteconfig';
var default_settings = {
    working_directory : '',
    save_settings     : true,
    debug             : false,
    log               : false,
    backup_previous   : true,
    output            : {
        up_directory : false,
        stylesheet    : false,
        spritesheet   : false
    },
    delay             : 0,
    style             : {
        type : 'css',
		name : '',
		retina: false,
        icon : false,
        prefix : 's-',
        rules : [
            {'_hover' : ':hover'},
            {'_active' : ':active'}
        ],

    },
    hook: {
        each: (function () {}),
        after: (function () {})
    },
    sprite            : {
        name          : 'sprite',
		path		  : false,
        compression   : true,
        engine        : 'pngquant', //In the futur
        arrangement   : 'vertical', //horizontal , auto
        preview_directory : 'SpritePreview',
        html_preview  : false,
        margin       : {
            top   : 5,
            left  : 5
        }
    }
};


var Settings = function Settings(settings){

    //Properties
	this.settings_loaded = false;

    //Todo Add 3 control - sprite, style, conf.
    //Todo Force to specify a working directory
	//u.extend(default_settings, settings);
    //console.log(default_settings.style)
    this.override(settings);
	u.debug = default_settings.debug;

	u.log('Settings: constructor');
};

Settings.prototype.override = function (settings) {


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
Settings.prototype.getConfigPath = function () {
	return path.join(default_settings.working_directory, settings_config_file);

};

Settings.prototype.checkConfigFile = function (cb){
	cb = cb || (function () {});
	u.log('Settings: checkConfigFile');

	fs.exists(this.getConfigPath(), function(exists) {
		cb(exists);
	});

}

Settings.prototype.getDefaultSettings = function () {
	return default_settings;
};


Settings.prototype.loadConfig = function(cb){
	cb = cb || (function () {});
	var self = this;
	u.log('Settings: loadJSONFile');


	this.checkConfigFile(function(exist){
		if(exist) {
			fs.readFile(self.getConfigPath(), 'utf8', function (err, data) {
				if (err) {
					console.log('Error: ' + err);
					return;
				}

				var data_parsed = {};
				try {
					data_parsed = JSON.parse(data);

				} catch (e) {
					console.error('Error when parsed JSON');
				} finally {
					cb(data_parsed);
				}


			});
		} else {
			cb(false);
		}

	});


}

Settings.prototype.saveConfigFile = function (){
	u.log('Settings: generateConfigFile');

    var function_handler = function(key, value) {
        if (typeof value === 'function') {
            return value.toString();
        } else {
            return value;
        }
    };

	fs.writeFile(this.getConfigPath(), JSON.stringify(default_settings, function_handler, '\t'), function(err) {
		if(err) {
			console.log(err);
		} else {
			u.log('[SUCCESS] settings saved');
		}
	});
};

Settings.prototype.getOutputPath = function (context) {

	var final_path = '';
	if (!default_settings.output.up_directory) {
		var preview_directory = default_settings.sprite.preview_directory.length < 1 ? 'SpritePreview' : default_settings.sprite.preview_directory;
		final_path = path.join(default_settings.working_directory, preview_directory);
	}

	switch (context) {
		case 'sprite':

			if (default_settings.output.spritesheet) {
				final_path = path.join(default_settings.output.spritesheet);
			}
			break;
		case 'stylesheet':
			if (default_settings.output.stylesheet) {
				final_path = path.join(default_settings.output.stylesheet);
			}
			break;
		case 'html':

			break;
		default:


		break;
	}
	//console.log(final_path);
	return final_path;
};

Settings.prototype.getRelativePath = function (from_foler, to_folder) {

	var folders = {
		sprite : path.resolve(this.getOutputPath('sprite')),
		style : path.resolve(this.getOutputPath('stylesheet')),
		html : path.resolve(this.getOutputPath('html'))
	};



	if(typeof from_foler === 'undefined' || typeof to_folder === 'undefined' || typeof folders[from_foler] === 'undefined' || typeof folders[to_folder] === 'undefined') {
		console.log('Error getRelativePath');
		return false;
	} 



	return path.relative(folders[from_foler], folders[to_folder]);
};


Settings.prototype.getStylesheetFilename = function () {
	if(default_settings.style.name.length < 1){
		return default_settings.sprite.name  + '.' +  default_settings.style.type;
	}

	return default_settings.style.name + '.' + default_settings.style.type;
};



module.exports = Settings;
