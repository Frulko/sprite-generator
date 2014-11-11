/**  SPRITE GEN  **/


var fs     = require('fs'),
	path   = require('path'),
	colors = require('colors'),
	Canvas = require('Canvas'),
	binpacking = require('binpacking');






var SpriteGen = module.export;


var a_images = [],
	options  = {},
	settings = {
		auth_extensions : ['png','jpg'],
		config_filename : 'spriteSettings.json',
		working_directory : ''
	},
	Image = Canvas.Image,
	blocks = [];


verifyConfigFile = function (){
	
}

verfiyOptions = function (args){
	if(args.length > 0){
		if(typeof args[0] == "object"){
			if(args[0].hasOwnProperty('dir')){
				settings.working_directory = args[0]['dir'];
				return true;
			}else{
				console.log('[ERROR] Missing directory path !'.red);
			}
		}
		
	}
	return false;
	
}

directoryProcessing = function (callback){
	
	if(settings.working_directory.length > 0 && fs.lstatSync(settings.working_directory).isDirectory()){
            dir_path = settings.working_directory;
            var files = fs.readdirSync(dir_path);
            var images = [];
            for(var i in files) {
	            var filename = files[i];
                var ext_file = getExtension(filename);
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
	                    name : filename.replace(ext_file,'')
	                };
                    
                    images.push(img); 
                    blocks.push(block);
                    
                }
            }
        }

        if(typeof callback != "undefined")
            callback();
};

getExtension = function (filename){
	var ext = path.extname(filename||'').split('.');
    return ext[ext.length - 1];
};

image2Base64 = function(img){
	var base64Image,
            image_data = fs.readFileSync(img);
        base64Image = new Buffer(image_data, 'binary').toString('base64');
        base64Image ='data:image/png;base64,'+base64Image;

    return base64Image;
};

getConfigFile = function (){};

generateConfigFile = function (){};

generateCSS = function (){};

generateSprite = function (){

	var Packer = binpacking.Packer;
	var GrowingPacker = binpacking.GrowingPacker;
	var packer = new GrowingPacker;
	packer.fit(blocks);

	
	var canvas = new Canvas(200, 200),
    ctx = canvas.getContext('2d');
    
    var maxWidth = 0;
    var maxHeight = 0;


    for(var n = 0 ; n < blocks.length ; n++) {
        var block = blocks[n];
        if (block.fit) {
            if(block.fit.x > maxWidth)
                maxWidth = block.fit.x + block.img.width;

            if(block.fit.y > maxHeight)
                maxHeight = block.fit.y + block.img.height;
                
            if(block.fit.y == 0)
            	maxHeight = block.img.height;
        }
    }
    

    ctx.canvas.width  = maxWidth;
    ctx.canvas.height = maxHeight;
	
	
	
    for(var n = 0 ; n < blocks.length ; n++) {
        var block = blocks[n];
        if (block.fit) {
            ctx.drawImage(block.img, block.fit.x, block.fit.y, block.img.width, block.img.height);
        }
    }
    
    saveCanvas(canvas, 'sprite_old');
	
};

    

makeSpriteSheet = function (){
	
	if(verfiyOptions(arguments)){
		
		directoryProcessing(function(){
			generateSprite();
		});
		
	}
};


var saveCanvas = function(canvas,name){
	var export_path =__dirname+path.sep+ name +'.png';
	var out = fs.createWriteStream(export_path),
		stream = canvas.createPNGStream();
	
	stream.on('data', function(chunk){
		out.write(chunk);
	});
	
	stream.on('end',function(){
		console.log(export_path);
	});
};

var optimizeImage = function(){
	
}


module.exports = {
	makeSpriteSheet : makeSpriteSheet,
}