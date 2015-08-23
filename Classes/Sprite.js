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
    events      = require('events'),
    u           = new(require('./utils'))();


u.debug = true;





var Spritesheet = function Spritesheet(settings){


    if(u.isUndefined(settings)){
        console.log('You need to specify settings object');
        return [];
    }
    this.settings_instance = settings;
    this.settings = settings.getSettings();
    u.debug = this.settings.debug;

    u.log('Spritesheet: constructor');
};

Spritesheet.prototype = new events.EventEmitter;


//TODO : transform into a promise
Spritesheet.prototype.getImages = function(cb){
    u.log('Spritesheet: getImages');
    var callback = cb || (function () {});
    var self = this;

    if (this.settings.working_directory !== '') {
        imageHelper.getImagesFromFolder(this.settings.working_directory, function(files){
            files = files.filter(function (file) {
                var re = new RegExp(self.settings.sprite.name + '\.png$', 'i'); //exclude self file
                var match = file.filename.match(re);
                return !match;
            });


            callback(files);
        });
    } else {
        console.log('Spritesheet: no working directory specified');
    }

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
            w: item.width + self.settings.sprite.margin.left,
            h: item.height + self.settings.sprite.margin.top
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
    var self = this;
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

        if(self.settings.sprite.compression){
            self.optimizingSpritesheet(function () {
                res.sprite = spriteImage;
                callback(res, err);
            });
        } else {
            res.sprite = spriteImage;
            callback(res, err);
        }

    });
};


Spritesheet.prototype.optimizingSpritesheet = function(callback){
    u.log('Spritesheet: optimizingSpritesheet');


    var output_directory = this.settings_instance.getOutputPath('sprite');
    var optimized_sprite_path = path.join(output_directory, this.settings.sprite.name + '-pngquant.png');
    var sprite_path = path.join(output_directory, this.settings.sprite.name + '.png');
    var self = this;
    if(fs.existsSync(optimized_sprite_path))
        fs.unlinkSync(optimized_sprite_path); //Remove if exist

    execFile(pngquant, ['-o', optimized_sprite_path, sprite_path], function (err) {

        if (err) {
            throw err;
        }

        var optimized_stat = fs.statSync(optimized_sprite_path);
        var original_stat = fs.statSync(sprite_path);
        var file_size = u.formatSize(optimized_stat.size);
        self.emit('optimizing', {
            original : u.formatSize(original_stat.size),
            optimized : u.formatSize(optimized_stat.size)
        } );
        u.log('[SUCCESS] optimized sprite ['+optimized_stat+']');

        fs.unlinkSync(sprite_path);
        fs.renameSync(optimized_sprite_path, sprite_path);

        callback();
    });

};


Spritesheet.prototype.getOutputFile = function () {
    return path.resolve(path.join(this.settings_instance.getOutputPath('sprite'), this.settings.sprite.name + '.png'));
};



module.exports = Spritesheet;
