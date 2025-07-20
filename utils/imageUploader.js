const cloudinary = require('cloudinary').v2;

exports.uploadImageToCloduinary = async (File,folder,height,quality)=>  {
     const options = {folder};
     console.log(folder);
     console.log(options.folder);
        if(height){
            options.height = height;
        }
        if(quality){
            options.quality = quality;
        }

        options.resource_type = 'auto';

        const result = await cloudinary.uploader.upload(File.tempFilePath,options);
        console.log(result.folder,'33');
        return result;
}

