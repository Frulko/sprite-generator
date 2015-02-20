/* 
	
	Spritesheet Class
	Author: Guillaume Dumoulin @Frulko
	Date: 19/02/2015
	
*/
/*  var ,
    path   = require('path'),
    colors = require('colors'),
   */

var fs     = require('fs'),
    path   = require('path'),
    Canvas = require('node-canvas-bin'),
    binpacking = require('binpacking'),

     u = new(require('./utils'))();
    u.debug = true;

var _CONFIGURATION_ = {

    extensions : ['jpg', 'jpeg', 'png'],
    logs : true,
    prevent_erase : true

};



var sprite_dir = '';

var Spritesheet = function Spritesheet(settings){
    u.log('Spritesheet: constructor');

	//Properties
    //TODO var Packer = binpacking.Packer; WHY ? Read doc !
    var GrowingPacker = binpacking.GrowingPacker;

    this.settings = settings; //TODO NEED A CONTROL
    this.packer = new GrowingPacker;
    this.canvas = new Canvas(0, 0);
    this.ctx = this.canvas.getContext('2d');
    this.autorized_extensions = ['jpg','png'];
    this.img_assets = [];


    this.sprite_dir = settings.working_directory+"SpriteGenOutput";
    this.export_path = sprite_dir+path.sep+'sprite.png';

    u.log('Spritesheet:', _CONFIGURATION_);
};

Spritesheet.prototype.setSettings = function(settings){
    u.log('Spritesheet: setSettings');
    this.settings = settings;

    u.log(settings);
};

Spritesheet.prototype.grabImageAssetsFromDirectory = function (directory,callback){
    u.log('Spritesheet: grabImageAssetsFromDirectory');

    if(settings.working_directory.length > 0 && fs.lstatSync(settings.working_directory).isDirectory()){
        dir_path = settings.working_directory;
        var files = fs.readdirSync(dir_path);
        var images = [];
        for(var i in files) {
            var filename = files[i];
            var extension = utils.getExtensionName(filename);
            var full_path = dir_path+path.sep+filename;

            if(settings.auth_extensions.indexOf(getExtension(filename)) != -1){



                //var raw_img = image2Base64(full_path);
                var raw_img = fs.readFileSync(full_path);

                var img = new Image();
                img.src = raw_img;

                var block = {
                    w:img.width ,
                    h:img.height,
                    img:img,
                    name : formatName(filename)
                };

                images.push(img);
                blocks.push(block);

            }
        }
    }

    if(typeof callback != "undefined")
        callback();
};

Spritesheet.prototype.fitCanvasDimensionsWithImageAssets = function(img_assets){
    u.log('Spritesheet: fitCanvasDimensionsWithImageAssets');
    this.packer.fit(img_assets);

    var maxWidth = 0;
    var maxHeight = 0;

    for(var n = 0 ; n < img_assets.length ; n++) {
        var img_asset = img_assets[n];

        //Change this to detect tall or with of element and adapt canvas dimension to this.
        if (img_asset.fit) {
            if(img_asset.fit.x > maxWidth)
                maxWidth = img_asset.fit.x + img_asset.img.width;

            if(img_asset.fit.y > maxHeight)
                maxHeight = img_asset.fit.y + img_asset.img.height;

            if(img_asset.fit.y == 0)
                maxHeight = img_asset.img.height;
        }
    }


    return {
        c_width  : maxWidth,
        c_height : maxHeight
    };
};


Spritesheet.prototype.drawAllImageAssets = function(img_assets){
    u.log('Spritesheet: drawAllImageAssets');

    for(var n = 0 ; n < img_assets.length ; n++) {
        var img_asset = img_assets[n];
        if (img_asset.fit) {
            this.ctx.drawImage(img_asset.img, img_asset.fit.x, img_asset.fit.y, img_asset.img.width, img_asset.img.height);
        }
    }
};

Spritesheet.prototype.processing = function(){
    u.log('Spritesheet: setSettings');
    this.grabImageAssetsFromDirectory(this.settings.directory,function(){

    });
};


Spritesheet.prototype.saveSpriteSheet = function (canvas,name,callback){
    u.log('Spritesheet: saveSpriteSheet');

    var folder_permission = '0766';
    if(!fs.existsSync(this.sprite_dir)){
        fs.mkdirSync(this.sprite_dir, folder_permission, function(err){
            if(err){
                throw(err);
            }
        });
    }


    var bufs = [],
        out = fs.createWriteStream(this.export_path),
        stream = canvas.createPNGStream();


    stream.on('data', function(chunk){
        out.write(chunk);
        bufs.push(chunk);
    });

    stream.on('end',function(){
        var streamSize = bufs.reduce(function(sum, buf){
            return sum + buf.length;
        }, 0);

        var size = utils.formatSize(streamSize);
        utils.log('[SUCCESS] sprite image saved ['+size+']');

        if(!utils.isUndefined())
            callback();


    });
};


Spritesheet.prototype.optimizingSpritesheet = function(working_directory,filename,callback){
    u.log('Spritesheet: optimizingSpritesheet');

    var old_file = dir+path.sep+name+'.png';
    var optimized_file = dir+path.sep+name+'_opti.png';

    if(fs.existsSync(optimized_file))
        fs.unlinkSync(optimized_file); //Remove if exist

    execFile(pngquant, ['-o', optimized_file, old_file], function (err) {
        if (err) {
            throw err;
        }

        var file_stat = fs.statSync(optimized_file);
        var file_size = utils.formatSize(file_stat.size);
        log('[SUCCESS] optimized sprite ['+file_size+']');

        if(!utils.isUndefined())
            callback();
    });

};



module.exports = Spritesheet;