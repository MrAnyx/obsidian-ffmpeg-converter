export interface SettingType
{
    // General
    customFfmpegPath: string;
    customFfprobePath: string;
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
    videoFps: number;
    includeVideoMp4: boolean;
    includeVideoMkv: boolean;
    includeVideoMov: boolean;
    includeVideoOgv: boolean;
    includeVideoWebm: boolean;
    outputVideoFormat: string;

    // Audio
    audioBitrateForAudio: number;
    includeAudioMp3: boolean;
    includeAudioWav: boolean;
    includeAudioM4a: boolean;
    includeAudioFlac: boolean;
    includeAudioOgg: boolean;
    includeAudio3gp: boolean;
    includeAudioWebm: boolean;
    outputAudioFormat: string;
}

export const DefaultSettings: SettingType = {
    customFfmpegPath: "",
    customFfprobePath: "",
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
    videoFps: 60,
    includeVideoMp4: true,
    includeVideoMkv: true,
    includeVideoMov: true,
    includeVideoOgv: true,
    includeVideoWebm: false,
    outputVideoFormat: "webm",

    audioBitrateForAudio: 32, // k
    includeAudioMp3: true,
    includeAudioWav: true,
    includeAudioM4a: true,
    includeAudioOgg: true,
    includeAudio3gp: true,
    includeAudioFlac: true,
    includeAudioWebm: false,
    outputAudioFormat: "webm",
};
