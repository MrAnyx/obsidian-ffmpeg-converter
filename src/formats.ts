export type Type = "image" | "video" | "unsupported";
export const Type: Record<Type, Type> = {
    image: "image",
    video: "video",
    unsupported: "unsupported"
};

export const AvifExtensions = ["avif"];
export const BmpExtensions = ["bmp"];
export const PngExtensions = ["png"];
export const JpgExtensions = ["jpg", "jpeg"];
export const GifExtensions = ["gif"];
export const WebpExtensions = ["webp"];
export const ImageExtensions = [
    ...AvifExtensions,
    ...BmpExtensions,
    ...PngExtensions,
    ...JpgExtensions,
    ...GifExtensions,
    ...WebpExtensions
];

export const Mp4Extensions = ["mp4"];
export const MkvExtensions = ["mkv"];
export const MovExtensions = ["mov"];
export const WebmExtensions = ["webm"];
export const VideoExtensions = [
    ...Mp4Extensions,
    ...MkvExtensions,
    ...MovExtensions,
    ...WebmExtensions,
];

export const Extensions = [
    ...ImageExtensions,
    ...VideoExtensions
];
