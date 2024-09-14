export type Type = "image" | "video" | "audio" | "unknown";
export const Type: Record<Type, Type> = {
    image: "image",
    video: "video",
    audio: "audio",
    unknown: "unknown"
};

export type ImageType = "avif" | "bmp" | "png" | "jpg" | "gif" | "webp";
export const ImageExtensions: Record<ImageType, string[]> = {
    avif: ["avif"],
    bmp: ["bmp"],
    png: ["png"],
    jpg: ["jpg", "jpeg"],
    gif: ["gif"],
    webp: ["webp"],
};

export type VideoType = "mp4" | "mkv" | "mov" | "ogv" | "webm";
export const VideoExtensions: Record<VideoType, string[]> = {
    mp4: ["mp4"],
    mkv: ["mkv"],
    mov: ["mov"],
    ogv: ["ogv"],
    webm: ["webm"],
};

export type AudioType = "mp3" | "wav" | "m4a" | "flac" | "webm" | "ogg" | "3gp";
export const AudioExtensions: Record<AudioType, string[]> = {
    mp3: ["mp3"],
    wav: ["wav"],
    m4a: ["m4a"],
    flac: ["flac"],
    webm: ["webm"],
    ogg: ["ogg"],
    "3gp": ["3gp"],
};
