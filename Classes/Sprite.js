/*

 Spritesheet Class
 Author: Guillaume Dumoulin @Frulko
 Date: 19/02/2015

 */


var fs          = require('fs'),
    path        = require('path'),
    execFile    = require('child_process').execFile,
    pngquant    = require('pngquant-bin').path,
    binPacking   = require('../packer'),
    imageHelper = require('node-imagehelper'),
    u           = new(require('./utils'))();


u.debug = true;





var Spritesheet = function Spritesheet(settings){
    u.log('Spritesheet: constructor');

    if(u.isUndefined(settings)){
        console.log('You need to specify settings object');
        return [];
    }
    this.settings_instance = settings;
    this.settings = settings.getSettings();


};

//TODO : transform into a promise
Spritesheet.prototype.getImages = function(cb){
    u.log('Spritesheet: getImages');
    var callback = cb || (function () {});
    imageHelper.getImagesFromFolder(this.settings.working_directory, function(files){
        callback(files);
    });
};


Spritesheet.prototype.processing = function(callback){
    u.log('Spritesheet: processing');
    var self = this;
    this.getImages(function(images){

        self.fitImagesIntoCanvas(images, function (images){

            self.saveSpriteSheet(images, callback);
        });
    });
};

Spritesheet.prototype.fitImagesIntoCanvas = function (images, cb){
    var callback = cb || (function () {});
    u.log('Spritesheet: fitImagesIntoCanvas');
    var self = this;

    //Transform to a good presentation for binPacking
    images = images.map(function(item){
        var name = item.filename.split('/').pop().replace('.png', '');

        return {
            filename: item.filename,
            name : name,
            w: item.width + self.settings.sprite.padding.left,
            h: item.height + self.settings.sprite.padding.top
        };
    });

    images.sort(function(a, b){ return (b.w - a.w); });
    images.sort(function(a, b){ return (b.h - a.h); });

    binPacking.fit(images);


    images = images.map(function(item){
        return {
            filename: item.filename,
            width: item.w,
            name : item.name,
            height: item.h,
            top: item.fit.y,
            left: item.fit.x
        };
    });

    callback(images);
};

Spritesheet.prototype.saveSpriteSheet = function (images, cb){
    var callback = cb || (function () {});
    u.log('Spritesheet: saveSpriteSheet');

    //Todo custom dir / default inside
    var output_directory = this.settings_instance.getOutputPath('sprite');

    if(output_directory.length > 0 && !fs.existsSync(output_directory)){
        fs.mkdirSync(output_directory, '0766', function(err){
            if(err){
                throw(err);
            }
        });
    }


    var spriteImage = {
        canvas : {
            name : path.join(output_directory, this.settings.sprite.name + '.png'), //Todo custom dir / default inside
            width : binPacking.root.w,
            height : binPacking.root.h
        },
        assets : images
    };

    imageHelper.generateSprite(spriteImage, function(res, err){
        if(err){
            console.log(err);
            return false;
        }

        res.sprite = spriteImage;
        callback(res, err);
    });
};






module.exports = Spritesheet;
