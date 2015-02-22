/*

 Stylesheet Class
 Author: Guillaume Dumoulin @Frulko
 Date: 19/02/2015

 */
var fs          = require('fs'),
    path        = require('path'),
    moment      = require('moment'),
    doT         = require('dot'),
    html        = require('html');

var u = new(require('./utils'))();
u.debug = false;


var css_rules = [
 {'_hover' : ':hover'},
 {'_active' : ':active'}
];

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

 var date = moment().format('MMMM Do YYYY, h:mm:ss a'); //TODO REPLACE WITH MOMENT.JS
 var prefix = this.settings.css_prefix;
 var that = this;

 var name = this.settings.sprite_name;
 var sprite_filename =  name + '.png';


 var css = "/* GENERATED CSS - "+date+" */ \n";

 if(that.settings.css_span_block){
     css += '.icon{ display:block } \n';
 }

 css += '[class^="' + prefix + '"],[class*="' + prefix + '"] { background:url('+ sprite_filename +') no-repeat top left;} \n';

 var css_items = [];


 for(var i in blocks){

  var block = blocks[i];
  var classname = block.name;

  var custom_rule = false;

  for(var j in css_rules){

     var rule = css_rules[j];

     var keys = Object.keys(rule);
     //classname = classname.replace(j, rule);

      u.log(classname.indexOf(keys[0]) + ' --- ' + keys[0].length);
     if(classname.indexOf(keys[0]) > -1){
        classname = classname.replace(keys[0], rule[keys]);
         custom_rule = true;

      break;
     }



  }

     if(!custom_rule){
         css_items.push(that.settings.css_prefix + classname);
     }



      css += '.' + prefix + classname + "{ width: " + (block.w - that.settings.padding_x) + "px; height: " + (block.h - that.settings.padding_y) + "px; background-position: -"+block.fit.x+"px -"+block.fit.y+"px; } \n";



 }


 var sprite_dir = this.settings.dir + path.sep + "SpriteOutput";
 u.log(this.settings);

 fs.writeFile(sprite_dir + path.sep + 'sprite.css', css, function(err) {
  if(err) {
   u.log(err);
  } else {
   u.log('[SUCCESS] css file saved');

   that.generateHTML(css_items);

  }
 });



};


Stylesheet.prototype.generateHTML = function (css_items){


    var sprite_dir = this.settings.dir + path.sep + "SpriteOutput";
    u.loadTemplate('html_generate.dot', function(d){
        var tempFn = doT.template(d);
        var resultText = tempFn({items: css_items});

        var prettyData = html.prettyPrint(resultText, {indent_size: 2});

        fs.writeFile(sprite_dir + path.sep + 'sprite.html', prettyData, function(err) {
            if(err) {
                u.log(err);
            } else {
                u.log('[SUCCESS] html file saved');

            }
        });
    });



};



module.exports = Stylesheet;