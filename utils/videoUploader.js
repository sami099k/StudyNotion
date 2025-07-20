const cloudinary = require('cloudinary').v2;

exports.uploadVideoToCloudinary = async (file, folder) => {
    try {
        const options = {
            folder: folder,
            resource_type: 'video',
            chunk_size: 6000000, // 6MB chunks for better upload
            eager: [
                { width: 300, height: 300, crop: "pad", audio_codec: "none" },
                { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" }
            ],
            eager_async: true,
            eager_notification_url: "https://your-notification-url.com"
        };

        console.log('Uploading video to Cloudinary...');
        const result = await cloudinary.uploader.upload(file.tempFilePath, options);
        console.log('Video uploaded successfully:', result.secure_url);
        return result;
    } catch (error) {
        console.error('Error uploading video to Cloudinary:', error);
        throw error;
    }
}; 