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
    {'_hover' : function (css_class) {    cb();}},
    {'_active' : ':active'}
];

var Stylesheet = function Stylesheet(settings){

    //Properties

    this.settings_loaded = false;

    if(u.isUndefined(settings)){
        console.log('You need to specify settings object');
        return [];
    }
    this.settings_instance = settings;
    this.settings = settings.getSettings();
    u.debug = this.settings.debug;

    u.log('Stylesheet: constructor');
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

Stylesheet.prototype.generateCSS = function (sprite, cb){
    var blocks = sprite.assets;

    u.log('Stylesheet: generateCSS');

    var callback = cb || (function () {});
    var date = moment().format('MMMM Do YYYY, h:mm:ss a');
    var prefix = this.settings.style.css_prefix;
    var that = this;

    var relative_sprite = this.settings_instance.getRelativePath('style', 'sprite');
    var sprite_filename =  path.join(relative_sprite, this.settings.sprite.name + '.png');

    if (this.settings.sprite.path) {
        var f_path = this.settings.sprite.path;
        sprite_filename = f_path + (f_path[f_path.length - 1] !== '/' ? '/' : '') + this.settings.sprite.name + '.png';
    }


    var bg_sprite_filename = sprite_filename.split(path.sep).join('/');
    var css = "/* GENERATED CSS - "+date+" */ \n";




    css_rules = this.settings.style.rules;

    if(that.settings.style.icon){
        css += '.icon{ display:inline-block; *display:inline; *zoom:1; } \n';
    }

    css += '.' + this.settings.sprite.name + ' { background:url('+ bg_sprite_filename +') no-repeat top left;} \n';
    css += '[class^="' + this.settings.style.prefix + '"],[class*="' + this.settings.style.prefix + '"] { background:url('+ bg_sprite_filename +') no-repeat top left;} \n';


    var css_items = [];

    var style_items = [];


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

        classname = classname.split(path.sep);
        classname = classname[classname.length-1];

        var css_item = '.' + that.settings.style.prefix + classname + "{ width: " + (block.width - that.settings.sprite.margin.left) + "px; height: " + (block.height - that.settings.sprite.margin.top) + "px; background-position: -"+block.left+"px -"+block.top+"px; } \n";

        //New feature : custom rules with function :)
        /*style_items.push({
            originalName : block.name,
            fullClass : that.settings.style.prefix + block.name,
            width : (block.width - that.settings.sprite.margin.left),
            height : (block.height - that.settings.sprite.margin.top),
            posX : block.left,
            posY : block.top,

        });*/

        var item = {
            originalName : block.name,
            className : that.settings.style.prefix + block.name,
            width : (block.width - that.settings.sprite.margin.left),
            height : (block.height - that.settings.sprite.margin.top),
            posX : block.left,
            posY : block.top,
            sprite: sprite,
            css: css_item,
            block: block
        };

        style_items.push(item);

        if (this.settings.hook.each && typeof this.settings.hook.each === 'function') {
            var tmp_item =  this.settings.hook.each.call(this, item);
            if(typeof tmp_item !== 'undefined' && tmp_item) {
                item = tmp_item;
                item.css += '\n';
            }

        }

        css += item.css;



    }
    //Todo custom dir / default inside
    var output_directory = this.settings_instance.getOutputPath('stylesheet');


    if (this.settings.style.retina) {
        css += this.retinaSupport(sprite.canvas, bg_sprite_filename);
    }

    if (this.settings.hook.after && typeof this.settings.hook.after === 'function') {
        this.settings.hook.after.call(this, style_items);
    }

    if (!this.settings.sprite.generate) {
        u.log('Stylesheet: Don\'t generate stylesheet');
        callback();
        return false;
    }

    fs.writeFile(path.join(output_directory, this.settings_instance.getStylesheetFilename()), css, function(err) {
        if(err) {
            u.log(err);
        } else {
            u.log('Stylesheet: SUCCESS - css file saved');

            if (that.settings.html_preview) {
                that.generateHTML(css_items);
            }

            callback();
        }
    });
};

//Process function at each items
Stylesheet.prototype.inlineProcess = function (item) {

};


Stylesheet.prototype.retinaSupport = function (canvas, filename) {
    var real_width = canvas.width/2;
    var real_height = canvas.height/2;

    var css = '\n';
    css += '\n';
    css += '@media only screen and (-webkit-min-device-pixel-ratio: 1.3),\n';
    css += 'only screen and (min--moz-device-pixel-ratio: 1.3),\n';
    css += 'only screen and (min-resolution: 210dpi),\n';
    css += 'only screen and (max-width: 767px) {\n';
    css += '.'+ this.settings.style.retina +' {\n';
    css += '        background-image: url("' + filename + '");\n';
    css += '        background-color: transparent;\n';
    css += '        background-repeat: no-repeat;\n';
    css += '        background-size: '+ real_width +'px ' + real_height + 'px;\n';
    css += '    }\n';
    css += '}\n';

    return css;
};


//Process function for all items just before write css
Stylesheet.prototype.postProcess = function (items) {
    this.settings_instance.execPostprocess.call(this, items);
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
        var style_path = path.join(self.settings_instance.getRelativePath('style', 'sprite'), this.settings_instance.getStylesheetFilename());
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

Stylesheet.prototype.getOutputFile = function () {
    return path.resolve(path.join(this.settings_instance.getOutputPath('stylesheet'), this.settings_instance.getStylesheetFilename()));
};



module.exports = Stylesheet;
