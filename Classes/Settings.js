/*

 Settings Class
 Author: Guillaume Dumoulin @Frulko
 Date: 19/02/2015

 */

var u = new(require('./utils'))();
u.debug = false;


var Settings = function Settings(settings){
	u.log('Settings: constructor');
    //Properties
	return settings;
};

/*

	GET A SETTING FOR A FILE
	SAVE A SETTING


 */


//Settings.prototype.testSprite = function(){};


module.exports = Settings;
