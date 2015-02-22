/* 
	
	Spritesheet Class
	Author: Guillaume Dumoulin @Frulko
	Date: 19/02/2015
	
*/


var fs          = require('fs'),
    path        = require('path'),
    Canvas      = require('node-canvas-bin'),
    binpacking  = require('binpacking'),
    Image = Canvas.Image;

var execFile = require('child_process').execFile;
var pngquant = require('pngquant-bin').path;


var u = new(require('./utils'))(); //Call and create a new Utils
u.debug = false;

var _CONFIGURATION_ = {

    extensions           : ['jpg', 'jpeg', 'png'],
    logs                 : true,
    prevent_erase        : true,
    folder_permission    : '0766',
    sprite_suffix        : '_optimize',
    sprite_output_dir    : 'SpriteOutput',
    export_filename      : 'sprite',
    export_extension     : '.png',
    optimizing_image     : true,


};



var Spritesheet = function Spritesheet(settings){
    u.log('Spritesheet: constructor');

	//Properties
    //TODO var Packer = binpacking.Packer; WHY ? Read doc !
    var GrowingPacker = binpacking.GrowingPacker;
    this.packer = new GrowingPacker;
    this.canvas = new Canvas(0, 0);
    this.ctx = this.canvas.getContext('2d');

    this.settings = settings; //TODO NEED A CONTROL
    this.settings_loaded = false;


    u.log('Spritesheet: config', _CONFIGURATION_);
};

Spritesheet.prototype.processing = function(callback){
    u.log('Spritesheet: processing');

    var that = this;

    that.verifyingSettings();

    that.grabImageAssetsFromDirectory(that.settings.dir,function(e){
        //u.log('Spritesheet: outFromDirectory', e);

        var dimensions = that.fitCanvasDimensionsWithImageAssets(e.blocks);
        u.log('Spritesheet: res', dimensions);
        that.generateSprite(e.blocks, dimensions);
        that.saveSpriteSheet(function(){
            u.log('Spritesheet: SAVED');

            callback(e.blocks);
        });

    });
};

Spritesheet.prototype.setSettings = function(settings){
    u.log('Spritesheet: setSettings');
    this.settings = settings;

    u.log('Spritesheet: settings', settings);

    this.verifyingSettings();
};

Spritesheet.prototype.verifyingSettings = function(){
    u.log('Spritesheet: verifyingSettings');

    this.settings_loaded = true;

};

Spritesheet.prototype.grabImageAssetsFromDirectory = function (directory,callback){
    u.log('Spritesheet: grabImageAssetsFromDirectory');
    var settings = this.settings;


    if(settings.dir.length > 0 && fs.lstatSync(settings.dir).isDirectory()){
        var dir_path = settings.dir;

        var files = fs.readdirSync(dir_path);
        var images = [];
        var blocks = [];
        for(var i in files) {
            var filename = files[i];
            var extension = u.getExtensionName(filename);
            var full_path = dir_path+path.sep+filename;

            if(_CONFIGURATION_.extensions.indexOf(u.getExtensionName(filename)) != -1){



                //var raw_img = image2Base64(full_path);
                var raw_img = fs.readFileSync(full_path);

                var img = new Image();
                img.src = raw_img;

                var block = {
                    w:img.width + this.settings.padding_x,
                    h:img.height + this.settings.padding_y,
                    img:img,
                    name : u.formatName(filename)
                };

                images.push(img);

                blocks.push(block);



            }
        }
    }

    if(typeof callback != "undefined")
        callback({'files' : files, 'images' : images, 'blocks' : blocks});
};

Spritesheet.prototype.fitCanvasDimensionsWithImageAssets = function(img_assets){
    u.log('Spritesheet: fitCanvasDimensionsWithImageAssets');
    

    img_assets.sort(function(a, b){ console.log(a.h, b.h); return (a.h < b.h); });


    this.packer.fit(img_assets);




    return {
        c_width  : this.packer.root.w - this.settings.padding_x,
        c_height : this.packer.root.h - this.settings.padding_y
    };
};


Spritesheet.prototype.generateSprite = function(img_assets, dimensions){

    var that = this;
    this.packer.fit(img_assets);

    this.canvas = new Canvas(dimensions.c_width, dimensions.c_height); //TODO MAYBE NOT NEED AND JUST SET WIDTH AND HEIGHT
    this.ctx = this.canvas.getContext('2d');


    that.drawAllImageAssets(img_assets, function(){

        u.log('DRAW END');

    });

};


Spritesheet.prototype.drawAllImageAssets = function(img_assets, callback){
    u.log('Spritesheet: drawAllImageAssets');

    for(var n = 0 ; n < img_assets.length ; n++) {
        var img_asset = img_assets[n];
        if (img_asset.fit) {
            this.ctx.drawImage(img_asset.img, img_asset.fit.x, img_asset.fit.y, img_asset.img.width, img_asset.img.height);
        }
    }


    //TODO ADD CALLBACK

    callback();
};




Spritesheet.prototype.saveSpriteSheet = function (callback){
    u.log('Spritesheet: saveSpriteSheet');

    var that = this;
    var name = this.settings.sprite_name;

    this.output_dir = this.settings.dir + path.sep + _CONFIGURATION_.sprite_output_dir;
    this.export_path = this.output_dir + path.sep + name + _CONFIGURATION_.export_extension;


    u.log(this.output_dir)

    if(!fs.existsSync(this.output_dir)){
        fs.mkdirSync(this.output_dir, _CONFIGURATION_.folder_permission, function(err){
            if(err){
                throw(err);
            }
        });
    }




    var bufs = [],
        out = fs.createWriteStream(this.export_path),
        stream = this.canvas.createPNGStream();


    stream.on('data', function(chunk){
        out.write(chunk);
        bufs.push(chunk);
    });

    stream.on('end',function(){
        var streamSize = bufs.reduce(function(sum, buf){
            return sum + buf.length;
        }, 0);

        var size = u.formatSize(streamSize);
        u.log('[SUCCESS] sprite image saved ['+size+']');

        if(!_CONFIGURATION_.optimizing_image){
            callback();
        }else{

            that.optimizingSpritesheet(callback);

        }



    });

};


Spritesheet.prototype.optimizingSpritesheet = function(callback){
    u.log('Spritesheet: optimizingSpritesheet');

    var old_file = this.export_path;
    var optimized_file = this.output_dir + path.sep + this.settings.sprite_name + _CONFIGURATION_.sprite_suffix + _CONFIGURATION_.export_extension; //TODO ADD BY DEFAULT IN CONF BUT CAN BE SETTING FILE

    if(fs.existsSync(optimized_file))
        fs.unlinkSync(optimized_file); //Remove if exist

    execFile(pngquant, ['-o', optimized_file, old_file], function (err) {

        if (err) {
            throw err;
        }

        var file_stat = fs.statSync(optimized_file);
        var file_size = u.formatSize(file_stat.size);
        u.log('[SUCCESS] optimized sprite ['+file_size+']');

        callback();
    });

};



module.exports = Spritesheet;