/*

 Spritesheet Class
 Author: Guillaume Dumoulin @Frulko
 Date: 19/02/2015

 */


var fs          = require('fs'),
    path        = require('path'),
    execFile    = require('child_process').execFile,
    pngquant    = require('pngquant-bin').path,
    imageHelper = require('node-imagehelper'),
    u           = new(require('./utils'))();


u.debug = false;





var Spritesheet = function Spritesheet(settings){
    u.log('Spritesheet: constructor');
};


Spritesheet.prototype.getImages = function(dir){
    imageHelper.getImageFromFolder(dir, function(files){
        console.log(files);
    });
};


Spritesheet.prototype.processing = function(callback){

};



Spritesheet.prototype.saveSpriteSheet = function (callback){
};






module.exports = Spritesheet;