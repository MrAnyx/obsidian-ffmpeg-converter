export type Type = "image" | "video" | "unsupported";
export const Type: Record<Type, Type> = {
    image: "image",
    video: "video",
    unsupported: "unsupported"
};

export const PngExtensions = ["png"];
export const JpgExtensions = ["jpg", "jpeg", "jfif", "pjpeg", "pjp"];
export const GifExtensions = ["gif"];
export const WebpExtensions = ["webp"];
export const ImageExtensions = [
    ...PngExtensions,
    ...JpgExtensions,
    ...GifExtensions,
    ...WebpExtensions
];

export const Mp4Extensions = ["mp4"];
export const WebmExtensions = ["webm"];
export const VideoExtensions = [
    ...Mp4Extensions,
    ...WebmExtensions,
];

export const Extensions = [
    ...ImageExtensions,
    ...VideoExtensions
];
