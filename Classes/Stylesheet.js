/*

 Stylesheet Class
 Author: Guillaume Dumoulin @Frulko
 Date: 19/02/2015

 */
var fs          = require('fs'),
    path        = require('path');

var u = new(require('./utils'))();
u.debug = false;



var Stylesheet = function Stylesheet(settings){
 u.log('Stylesheet: constructor');
    //Properties

 this.settings = settings; //TODO NEED A CONTROL
 this.settings_loaded = false;



};

Stylesheet.prototype.setSettings = function(settings){
 u.log('Stylesheet: setSettings');
 this.settings = settings;

 u.log('Stylesheet: settings', settings);

 this.verifyingSettings();
};


Stylesheet.prototype.verifyingSettings = function(){
 u.log('Stylesheet: verifyingSettings');

 this.settings_loaded = true;

};

Stylesheet.prototype.generateCSS = function (blocks){
 u.log('Stylesheet: generateCSS');

 var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''); //TODO REPLACE WITH MOMENT.JS
 var css = "/* GENERATED CSS - "+date+" */ \n";
 var prefix = "sg-";
 var pos = [{x:651,y:1,name:"sep_109"},{x:12,y:465,name:"btn_b_78"},{x:546,y:18,name:"bordure"},{x:81,y:56,name:"oki"}];
 u.log(blocks);
 for(i in blocks){
  var block = blocks[i];
  css += '.' + prefix+block.name + "{background-position: "+block.fit.x+"px "+block.fit.y+"px;} \n";
 }


 var sprite_dir = this.settings.dir + path.sep + "SpriteOutput";
 u.log(this.settings);

 fs.writeFile(sprite_dir + path.sep + 'sprite.css', css, function(err) {
  if(err) {
   u.log(err);
  } else {
   u.log('[SUCCESS] css file saved');
  }
 });
};




module.exports = Stylesheet;