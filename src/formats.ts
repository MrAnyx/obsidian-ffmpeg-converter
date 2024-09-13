export type Type = "image" | "video" | "audio" | "unknown";
export const Type: Record<Type, Type> = {
    image: "image",
    video: "video",
    audio: "audio",
    unknown: "unknown"
};

export const AvifImageExtensions = ["avif"];
export const BmpImageExtensions = ["bmp"];
export const PngImageExtensions = ["png"];
export const JpgImageExtensions = ["jpg", "jpeg"];
export const GifImageExtensions = ["gif"];
export const WebpImageExtensions = ["webp"];
export const ImageExtensions = [
    ...AvifImageExtensions,
    ...BmpImageExtensions,
    ...PngImageExtensions,
    ...JpgImageExtensions,
    ...GifImageExtensions,
    ...WebpImageExtensions
];

export const Mp4VideoExtensions = ["mp4"];
export const MkvVideoExtensions = ["mkv"];
export const MovVideoExtensions = ["mov"];
export const WebmVideoExtensions = ["webm"];
export const VideoExtensions = [
    ...Mp4VideoExtensions,
    ...MkvVideoExtensions,
    ...MovVideoExtensions,
    ...WebmVideoExtensions,
];

export const Mp3AudioExtensions = ["mp3"];
export const WavAudioExtensions = ["wav"];
export const M4aAudioExtensions = ["m4a"];
export const FlacAudioExtensions = ["flac"];
export const WebmAudioExtensions = ["webm"];
export const AudioExtensions = [
    ...Mp3AudioExtensions,
    ...WavAudioExtensions,
    ...M4aAudioExtensions,
    ...FlacAudioExtensions,
    ...WebmAudioExtensions,
];

export const Extensions = [
    ...ImageExtensions,
    ...VideoExtensions,
    ...AudioExtensions
];

export const DuplicatFormats = Extensions.filter((item, index) => Extensions.indexOf(item) !== index);
