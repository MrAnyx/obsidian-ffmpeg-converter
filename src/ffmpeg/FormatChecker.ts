import Ffmpeg from "fluent-ffmpeg";

// Common method to get metadata using ffprobe
const getMetadata = async (filePath: string): Promise<Ffmpeg.FfprobeData> =>
{
    return new Promise((resolve, reject) =>
    {
        Ffmpeg.ffprobe(filePath, (err, metadata) =>
        {
            if (err)
            {
                reject(err);
            }
            else
            {
                resolve(metadata);
            }
        });
    });
};

// Check if the file has a video codec
export const hasVideoCodec = async (filePath: string): Promise<boolean> =>
{
    const metadata = await getMetadata(filePath);
    return metadata.streams.some(stream => stream.codec_type === "video");
};

// Check if the file has an audio codec
export const hasAudioCodec = async (filePath: string): Promise<boolean> =>
{
    const metadata = await getMetadata(filePath);
    return metadata.streams.some(stream => stream.codec_type === "audio");
};

// Check if the file has only a video codec (no audio)
export const hasVideoCodecOnly = async (filePath: string): Promise<boolean> =>
{
    const metadata = await getMetadata(filePath);
    const hasVideo = metadata.streams.some(stream => stream.codec_type === "video");
    const hasAudio = metadata.streams.some(stream => stream.codec_type === "audio");
    return hasVideo && !hasAudio;
};

// Check if the file has only an audio codec (no video)
export const hasAudioCodecOnly = async (filePath: string): Promise<boolean> =>
{
    const metadata = await getMetadata(filePath);
    const hasVideo = metadata.streams.some(stream => stream.codec_type === "video");
    const hasAudio = metadata.streams.some(stream => stream.codec_type === "audio");
    return !hasVideo && hasAudio;
};
