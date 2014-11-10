var SpriteGenerator = (function($, window, undefined){

    var config = {
        project_path : "/Users/guillaume/sprite/",
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

    };

    // Node.JS Modules
    var fs = require('fs'),
        path = require('path');

    var auth_extension = ['PNG','JPG'];


    var init = function(){
        initDebug(); //Enable debug
    };

    var initEvent = function(){

    };

    var initDebug = function(){
        var pathW = './';
        fs.watch(pathW, [], function() {
            if (location)
                location.reload(false);
        });
    };


    var onDropEvent = function (e){
        if (!e) {
            var fichier = document.getElementById('fileinput').files;
        }
        else {
            var fichier = e.dataTransfer.files;
        }

        directoryProcessing(fichier[0].path,function(){

            var packer = new GrowingPacker();


            //blocks.sort(function(a,b) { return (b.h < a.h); }); // sort inputs for best results
            packer.fit(blocks);

            console.log(blocks);

            var c=document.getElementById("canvas");
            var ctx=c.getContext("2d");

            var maxWidth = 0;
            var maxHeight = 0;


            for(var n = 0 ; n < blocks.length ; n++) {
                var block = blocks[n];
                if (block.fit) {
                    if(block.fit.x > maxWidth)
                        maxWidth = block.fit.x + block.imgo.width;

                    if(block.fit.y > maxHeight)
                        maxHeight = block.fit.y + block.imgo.height;

                }
            }

            ctx.canvas.width  = maxWidth;
            ctx.canvas.height = maxHeight;

            for(var n = 0 ; n < blocks.length ; n++) {
                var block = blocks[n];
                if (block.fit) {
                    ctx.drawImage(block.imgo,block.fit.x,block.fit.y);
                }
            }

            //console.log(c.toDataURL(),maxWidth,maxHeight);
            saveSpriteSheet(c.toDataURL(),fichier[0].path);

        });
    };

    var generateCanvas = function(callback){
        var data;


        if(typeof callback != "undefined" && callback)
            callback(data);
    };

    //
    var generateCSS = function(){
        var css = "GENERATED CSS - 00/00/00 \n";
        var prefix = "sg-";
        var pos = [{x:651,y:1,name:"sep_109"},{x:12,y:465,name:"btn_b_78"},{x:546,y:18,name:"bordure"},{x:81,y:56,name:"oki"}];

        for(i in pos){
            var s_pos = pos[i];
            css += prefix+s_pos.name+"{background-position: "+s_pos.x+"px "+s_pos.y+"px;} \n";
        }
    };

    // Generate config file of the project
    var generateConfig = function(){
        console.log(JSON.stringify(config, null, '\t'));
    };

    // get base64 from an img
    var img2base64 = function(img){
        var base64Image,
            image_data = fs.readFileSync(img);
        base64Image = new Buffer(image_data, 'binary').toString('base64');
        base64Image ='data:image/png;base64,'+base64Image;

        return base64Image;
    };

    // EXPLICIT ...
    var getExtension = function(){
        var ext = path.extname(filename||'').split('.');
        return ext[ext.length - 1];
    };

    //Save image, json, css
    var saveSpriteSheet = function(spriteBase64){
        var data = spriteBase64,
            base64Data,
            binaryData,
            output_file;

        base64Data  =   data.replace(/^data:image\/png;base64,/, "");
        base64Data  +=  base64Data.replace('+', ' ');
        binaryData  =   new Buffer(base64Data, 'base64').toString('binary');

        output_file = config.project_path+path.sep+config.sprite_name+".png";


        fs.writeFile(output_file, binaryData, "binary", function (err) {
            console.log(err); // writes out file without error, but it's not a valid image
        });
    };

    //
    var directoryProcessing = function(dir,callback){
        if(fs.lstatSync(dir).isDirectory()){
            dir_path = dir;
            var files = fs.readdirSync(dir);
            var images = [];
            for(var i in files) {
                var ext_file = getExtension(files[i]);
                var full_path = dir_path+path.sep+files[i];
                if(files[i] != '.DS_Store'){ //EXCEPTION MAC
                    //console.log(ext_file);
                    var block = {};
                    var image_base64 = file2Base64(full_path);
                    images.push(img = new Image());


                    img.src = image_base64;

                    blocks.push({w:img.width , h:img.height,imgo:img});
                }

                if(in_array(ext_file,auth_extension)){

                }
            }
        }

        if(typeof callback != "undefined")
            callback();
    };

    //
    var makeProject = function(){

        if(makeFolder()){
            generateCanvas(function(e){
                generateCSS(e);
                generateConfig(e);
            });
        }



    };


    //
    var makeFolder = function (){

    };

    var getDate = function(){

    };


    return {
        init : init,
        drop : onDropEvent,
        config : config
    };

})(jQuery, window, undefined);




