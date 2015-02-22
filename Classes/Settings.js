/*

 Settings Class
 Author: Guillaume Dumoulin @Frulko
 Date: 19/02/2015

 */

var fs          = require('fs'),
	path        = require('path');


var u = new(require('./utils'))();
u.debug = false;


var Settings = function Settings(settings){
	u.log('Settings: constructor');
    //Properties
	this.settings_loaded = false;


	u.extend(this, settings);

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
