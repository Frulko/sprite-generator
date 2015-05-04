/**  SPRITE GEN  **/


var fs     = require('fs'),
	path   = require('path'),
	colors = require('colors'),
	Canvas = require('Canvas'),
	binpacking = require('binpacking'),
	filesize = require('file-size');
	
	var execFile = require('child_process').execFile;
	var pngquant = require('pngquant-bin').path;






var SpriteGen = module.export;


var a_images = [],
	options  = {
        offset : {
            x : 5,
            y : 5,
            linked : true
        },
        css_name : "global",
        sprite_name : "global",
        css_prefix : "sg-",
        generate_html : true,
        generate_css : true,
        pngquant : true,
        make_sub_folder : true,
        handle_hover : true
	},
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
				options.working_directory = settings.working_directory;
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

formatName = function(name){
	
	name = name.replace('.'+getExtension(name),'');
	name = name.replace(/\s+/g,"_");

	return name;
}

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

generateConfigFile = function (){
	var sprite_dir = settings.working_directory+"SpriteGenOutput";
	fs.writeFile(sprite_dir+path.sep+'settings.json', JSON.stringify(options, null, '\t'), function(err) {
		if(err) {
		  console.log(err);
		} else {
		  console.log('[SUCCESS] settings saved');
		}
	}); 
};

generateCSS = function (){
	var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
	var css = "GENERATED CSS - "+date+" \n";
        var prefix = "sg-";
        var pos = [{x:651,y:1,name:"sep_109"},{x:12,y:465,name:"btn_b_78"},{x:546,y:18,name:"bordure"},{x:81,y:56,name:"oki"}];

        for(i in blocks){
            var block = blocks[i];
            css += prefix+block.name+"{background-position: "+block.fit.x+"px "+block.fit.y+"px;} \n";
        }
        
        
        var sprite_dir = settings.working_directory+"SpriteGenOutput";
        fs.writeFile(sprite_dir+path.sep+'sprite.css', css, function(err) {
			if(err) {
			  console.log(err);
			} else {
			  console.log('[SUCCESS] css file saved');
			}
		}); 
};

generateSprite = function (callback){

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
    
    saveCanvas(canvas, 'sprite',function(){
	    generateCSS();
	    generateConfigFile();
	    callback();
    });
    
    
	
};

    

makeSpriteSheet = function (){
	
	if(verfiyOptions(arguments)){
		var start_time = new Date();
		directoryProcessing(function(){
			generateSprite(function(){
				
				var end_time = new Date();
				console.log('[SUCCESS] Executed in '+(end_time - start_time)+' ms');
			});
		});
		
	}
};


saveCanvas = function (canvas,name,callback){
	var sprite_dir = settings.working_directory+"SpriteGenOutput";

	 if(!fs.existsSync(sprite_dir)){
	     fs.mkdirSync(sprite_dir, 0766, function(err){
	       if(err){ 
	         console.log(err);
	         response.send("ERROR! Can't make the directory! \n");    // echo the result back
	       }
	     });   
	 }
	
	var export_path = sprite_dir+path.sep+ name +'.png';
	var out = fs.createWriteStream(export_path),
		stream = canvas.createPNGStream();
		
		
	var bufs = [];
	stream.on('data', function(chunk){
		out.write(chunk);
		bufs.push(chunk);
	});
	
	stream.on('end',function(){
		var contentLength = bufs.reduce(function(sum, buf){
		    return sum + buf.length;
		  }, 0);
				 
		var size = filesize(contentLength).human({ jedec: true });
		 callback();
		/*optimizeImage(sprite_dir,name,function(){
			callback();
		});*/
		console.log('[SUCCESS] sprite image saved ['+size+']');
		
		
		
	});
}

var optimizeImage = function(dir,name,callback){
	
	var old_file = dir+path.sep+name+'.png'
	var optimized_file = dir+path.sep+name+'_opti.png'
	
	if(fs.existsSync(optimized_file))
		fs.unlinkSync(optimized_file);
	
	execFile(pngquant, ['-o', optimized_file, old_file], function (err) {
	    if (err) {
	        throw err;
	    }
	    
		var stat = fs.statSync(optimized_file);
		var size = filesize(stat.size).human({ jedec: true });
		
	    console.log('[SUCCESS] optimized sprite ['+size+']');
	    callback();
	});
	
}


module.exports = {
	makeSpriteSheet : makeSpriteSheet,
}