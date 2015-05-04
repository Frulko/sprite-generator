/*

 Utils Class
 Author: Guillaume Dumoulin @Frulko
 Date: 19/02/2015

 */

var path = require('path'),
    fs   = require('fs'),
    filesize = require('file-size');


var Utils = function(){

    this.debug = false;


};


Utils.prototype.log = function(){
    var t_arguments = [];

    for(var i in arguments){
        var arg = arguments[i];

        if(typeof arg === 'object'){
            arg = JSON.stringify(arg, null, 2);
        }
        t_arguments.push(arg);
    }



    if(this.debug){
        console.log.apply(console, t_arguments);
    }
};


Utils.prototype.warn = function(){

};

Utils.prototype.error = function(){

};

Utils.prototype.extend = function(dest, source){
    for (var prop in source) {
        dest[prop] = source[prop];
    }


};

Utils.prototype.getExtensionName = function(filename){
    var ext = path.extname(filename||'').split('.');
    return ext[ext.length - 1];
};

Utils.prototype.isUndefined = function(vars){
    if(typeof vars === "undefined")
        return true;

    return false;
};

Utils.prototype.formatName = function(name){
    var name = name.replace('.'+this.getExtensionName(name),'');
    name = name.replace(/\s+/g,"_");

    return name;
};

Utils.prototype.formatSize = function(raw_size){
    if(!isNaN(raw_size))
        return filesize(raw_size).human({ jedec: true });
    else
        console.log('Require a NUMBER');
};


Utils.prototype.loadTemplate = function(template, callback){

    fs.readFile(template, 'utf8', function (err, html) {
        if (err) {
            console.log('Error: ' + err);
            return;
        }

        callback(html);
    });
};






module.exports = Utils;
