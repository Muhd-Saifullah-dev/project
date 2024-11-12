import ffmpeg from 'fluent-ffmpeg';


// Function to extract video duration using fluent-ffmpeg
const getVideoDuration = (LocalfilePath) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(LocalfilePath, (err, metadata) => {
            if (err) {
                reject('Error extracting video duration: ' + err.message);
             
            } else {
                // Extract the duration in seconds
                const duration = metadata.format.duration;
                resolve(duration); // Return the duration
            }
        });
    });
};

export {
    getVideoDuration
}