export interface SettingType
{
    // General
    customFfmpegPath: string;
    overwrite: boolean;
    uniqueIdLength: number;

    // Image
    imageQuality: number;
    imageMaxSize: number;
    includeImageAvif: boolean;
    includeImageBmp: boolean;
    includeImagePng: boolean;
    includeImageJpg: boolean;
    includeImageGif: boolean;
    includeAudioWebp: boolean;
    outputImageFormat: string;

    // Video
    videoMaxSize: number;
    videoBitrateForVideo: number;
    audioBitrateForVideo: number;
    includeVideoMp4: boolean;
    includeVideoMkv: boolean;
    includeVideoMov: boolean;
    includeVideoOgv: boolean;
    includeVideoWebm: boolean;
    outputVideoFormat: string;

    // Audio
    audioBitrateForAudio: number;
    includeAudioFlac: boolean;
    includeAudioWav: boolean;
    includeAudioM4a: boolean;
    includeAudioMp3: boolean;
    includeAudioWebm: boolean;
    includeAudioOgg: boolean;
    includeAudio3gp: boolean;
    outputAudioFormat: string;
}

export const DefaultSettings: SettingType = {
    customFfmpegPath: "",
    overwrite: true,
    uniqueIdLength: 20,

    imageQuality: 80,
    imageMaxSize: 2000,
    includeImageAvif: true,
    includeImageBmp: true,
    includeImagePng: true,
    includeImageJpg: true,
    includeImageGif: true,
    includeAudioWebp: false,
    outputImageFormat: "webp",

    videoMaxSize: 2000,
    videoBitrateForVideo: 2000, // k
    audioBitrateForVideo: 32, // k
    includeVideoMp4: true,
    includeVideoMkv: true,
    includeVideoMov: true,
    includeVideoOgv: true,
    includeVideoWebm: false,
    outputVideoFormat: "webm",

    audioBitrateForAudio: 32, // k
    includeAudioFlac: true,
    includeAudioWav: true,
    includeAudioM4a: true,
    includeAudioMp3: true,
    includeAudioOgg: true,
    includeAudio3gp: true,
    includeAudioWebm: false,
    outputAudioFormat: "webm",
};
