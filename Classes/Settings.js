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
        stylesheet    : false,
        sprite   : false
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
	console.log(default_settings);
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

Settings.prototype.getOutputPath = function (context) {

	var final_path = '';
	if (!default_settings.output.up_directory) {
		final_path = path.join(default_settings.working_directory, default_settings.sprite.out_directory);
	}

	switch (context) {
		case 'sprite':

			if (default_settings.output.sprite) {
				final_path = path.join(default_settings.output.sprite);
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

Settings.prototype.getRelativePath = function (type) {
	var out = {
		sprite_directory : this.getOutputPath('sprite'),
		style_directory : this.getOutputPath('stylesheet'),
		html_directory : this.getOutputPath('html')
	};


	//console.log({html: html_directory, sprite: sprite_directory, style: style_directory});
	var nb_sub_folder = out.html_directory.split( path.sep ).length;
	var t_reverse = [];
	for(var i =0; i<nb_sub_folder;  i++){
		t_reverse.push('..');
	}
	t_reverse.push(out[type]);

	var t = '';
	if( out.html_directory.indexOf(out[type]) == -1) {
		t = path.join.apply(this, t_reverse);
	} else {
		t =  out.html_directory;
	}

	return t;
};



module.exports = Settings;
