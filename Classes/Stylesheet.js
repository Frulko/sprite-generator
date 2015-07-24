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
u.debug = true;


var css_rules = [
 {'_hover' : ':hover'},
 {'_active' : ':active'}
];

var Stylesheet = function Stylesheet(settings){
 u.log('Stylesheet: constructor');
    //Properties

 this.settings_loaded = false;

    if(u.isUndefined(settings)){
        console.log('You need to specify settings object');
        return [];
    }
    this.settings_instance = settings;
    this.settings = settings.getSettings();

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

Stylesheet.prototype.generateCSS = function (blocks, cb){
 u.log('Stylesheet: generateCSS');

    var callback = cb || (function () {});
 var date = moment().format('MMMM Do YYYY, h:mm:ss a');
 var prefix = this.settings.style.css_prefix;
 var that = this;

 var relative_sprite = this.settings_instance.getRelativePath('sprite_directory');
 console.log(relative_sprite);
 var sprite_filename =  path.join(relative_sprite, this.settings.sprite.name + '.png');

 var css = "/* GENERATED CSS - "+date+" */ \n";
    css_rules = this.settings.style.rules;

 if(that.settings.style.icon){
     css += '.icon{ display:inline-block; *display:inline; *zoom:1; } \n';
 }

 css += '[class^="' + this.settings.style.prefix + '"],[class*="' + this.settings.style.prefix + '"] { background:url('+ sprite_filename +') no-repeat top left;} \n';

 var css_items = [];


 for(var i in blocks){

  var block = blocks[i];
  var classname = block.name;

  var custom_rule = false;

  for(var j in css_rules){

     var rule = css_rules[j];

     var keys = Object.keys(rule);
     //classname = classname.replace(j, rule);

      //u.log(classname.indexOf(keys[0]) + ' --- ' + keys[0].length);
     if(classname.indexOf(keys[0]) > -1){
        classname = classname.replace(keys[0], rule[keys]);
         custom_rule = true;

      break;
     }



  }

     if(!custom_rule){
         css_items.push(that.settings.style.prefix + classname);
     }



      css += '.' + that.settings.style.prefix + classname + "{ width: " + (block.width - that.settings.sprite.padding.left) + "px; height: " + (block.height - that.settings.sprite.padding.top) + "px; background-position: -"+block.left+"px -"+block.top+"px; } \n";



 }
    //Todo custom dir / default inside
    var output_directory = this.settings_instance.getOutputPath('stylesheet');



 fs.writeFile(path.join(output_directory, 'sprite.css'), css, function(err) {
  if(err) {
   u.log(err);
  } else {
   u.log('Stylesheet: SUCCESS - css file saved');
   that.generateHTML(css_items);
    callback();
  }
 });



};


Stylesheet.prototype.generateHTML = function (css_items){

    var output_directory = this.settings_instance.getOutputPath('html');
    var self = this;
    if(output_directory.length > 0 && !fs.existsSync(output_directory)){
        fs.mkdirSync(output_directory, '0766', function(err){
            if(err){
                throw(err);
            }
        });
    }

    var tpl = path.join(__dirname , '..' + path.sep + 'templates' + path.sep +'html_generate.dot');
    //console.log()



    u.loadTemplate(tpl, function(d){
        var tempFn = doT.template(d);
        var style_path = path.join(self.settings_instance.getRelativePath('style_directory'), 'sprite.css');
        var resultText = tempFn({items: css_items, css_path: style_path});

        var prettyData = html.prettyPrint(resultText, {indent_size: 2});

        fs.writeFile(path.join(output_directory,'sprite.html'), prettyData, function(err) {
            if(err) {
                u.log(err);
            } else {
                u.log('Stylesheet: SUCCESS - html file saved');

            }
        });
    });



};



module.exports = Stylesheet;
