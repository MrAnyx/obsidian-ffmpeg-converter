import { PluginSettingTab, App, Setting } from "obsidian";
import FfmpegCompressPlugin from "./main";
import { AudioExtensions, AvifImageExtensions, BmpImageExtensions, FlacAudioExtensions, GifImageExtensions, ImageExtensions, JpgImageExtensions, M4aAudioExtensions, MkvVideoExtensions, MovVideoExtensions, Mp3AudioExtensions, Mp4VideoExtensions, PngImageExtensions, VideoExtensions, WavAudioExtensions, WebmAudioExtensions, WebmVideoExtensions, WebpImageExtensions } from "./formats";

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
    includeVideoWebm: boolean;
    outputVideoFormat: string;

    // Audio
    audioBitrateForAudio: number;
    includeAudioFlac: boolean;
    includeAudioWav: boolean;
    includeAudioM4a: boolean;
    includeAudioMp3: boolean;
    includeAudioWebm: boolean;
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
    includeVideoWebm: false,
    outputVideoFormat: "webm",

    audioBitrateForAudio: 32, // k
    includeAudioFlac: true,
    includeAudioWav: true,
    includeAudioM4a: true,
    includeAudioMp3: true,
    includeAudioWebm: false,
    outputAudioFormat: "webm",
};

export class SettingTab extends PluginSettingTab
{
    plugin: FfmpegCompressPlugin;

    constructor(app: App, plugin: FfmpegCompressPlugin)
    {
        super(app, plugin);
        this.plugin = plugin;
    }

    displayGeneralSettings()
    {
        this.containerEl.createEl("h1", {
            text: "General Settings",
        });
        new Setting(this.containerEl)
            .setName("Ffmpeg path")
            .setDesc(
                "Overwrite the default Ffmpeg path. Leave empty to use the ffmpeg binary from the environment variables. This setting will be used only if the ffmpeg binary isn't found on your system using the environment variables.",
            )
            .addText(text =>
                text
                    .setValue(this.plugin.settings.customFfmpegPath)
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.customFfmpegPath = value.trim();
                        await this.plugin.saveSettings();
                    }),
            );
        new Setting(this.containerEl)
            .setName("Overwrite")
            .setDesc("Replace the output file if it already exist ?")
            .addToggle(text =>
                text
                    .setValue(this.plugin.settings.overwrite)
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.overwrite = value;
                        await this.plugin.saveSettings();
                    }),
            );
        new Setting(this.containerEl)
            .setName("Unique ID length")
            .setDesc("Length of the unique id generate to make converted file different. This option is used only when the overwrite option is not toggled.")
            .addSlider(text =>
                text
                    .setLimits(1, 100, 1)
                    .setDynamicTooltip()
                    .setValue(this.plugin.settings.uniqueIdLength)
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.uniqueIdLength = value;
                        await this.plugin.saveSettings();
                    }),
            );
    }

    displayImageSettings()
    {
        this.containerEl.createEl("h1", {
            text: "Image Settings",
        });
        new Setting(this.containerEl)
            .setName("Output image format")
            .setDesc("Select the output format of the images. Webp is the most performent image format as it is the most space efficient")
            .addDropdown(text =>
                text
                    .addOptions(
                        ImageExtensions.reduce(
                            (acc, curr) =>
                            {
                                acc[curr] = curr;
                                return acc;
                            }, {} as { [key: string]: string }
                        )
                    )
                    .setValue(this.plugin.settings.outputImageFormat)
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.outputImageFormat = value.trim();
                        await this.plugin.saveSettings();
                    }),
            );

        new Setting(this.containerEl)
            .setName("Output quality")
            .setDesc("Output quality used during the conversion")
            .addSlider(slider =>
                slider
                    .setLimits(0, 100, 5)
                    .setValue(this.plugin.settings.imageQuality)
                    .setDynamicTooltip()
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.imageQuality = value;
                        await this.plugin.saveSettings();
                    }),
            );

        new Setting(this.containerEl)
            .setName("Output max size")
            .setDesc("Specify the max width of height of the output file")
            .addSlider(slider =>
                slider
                    .setLimits(100, 10000, 100)
                    .setValue(this.plugin.settings.imageMaxSize)
                    .setDynamicTooltip()
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.imageMaxSize = value;
                        await this.plugin.saveSettings();
                    }),
            );

        this.containerEl.createEl("h3", {
            text: "Image formats",
        });
        new Setting(this.containerEl)
            .setName("Include AVIF")
            .setDesc(`Include all avif files formats (${AvifImageExtensions.join(", ")})`)
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.includeImageAvif)
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.includeImageAvif = value;
                        await this.plugin.saveSettings();
                    }),
            );
        new Setting(this.containerEl)
            .setName("Include BMP")
            .setDesc(`Include all bmp files formats (${BmpImageExtensions.join(", ")})`)
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.includeImageBmp)
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.includeImageBmp = value;
                        await this.plugin.saveSettings();
                    }),
            );
        new Setting(this.containerEl)
            .setName("Include PNG")
            .setDesc(`Include all png files formats (${PngImageExtensions.join(", ")})`)
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.includeImagePng)
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.includeImagePng = value;
                        await this.plugin.saveSettings();
                    }),
            );
        new Setting(this.containerEl)
            .setName("Include JPG")
            .setDesc(`Include all jpg files formats (${JpgImageExtensions.join(", ")})`)
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.includeImageJpg)
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.includeImageJpg = value;
                        await this.plugin.saveSettings();
                    }),
            );
        new Setting(this.containerEl)
            .setName("Include GIF")
            .setDesc(`Include all gif files formats (${GifImageExtensions.join(", ")})`)
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.includeImageGif)
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.includeImageGif = value;
                        await this.plugin.saveSettings();
                    }),
            );
        new Setting(this.containerEl)
            .setName("Include WEBP")
            .setDesc(`Include all webp files formats (${WebpImageExtensions.join(", ")})`)
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.includeAudioWebp)
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.includeAudioWebp = value;
                        await this.plugin.saveSettings();
                    }),
            );
    }

    displayVideoSettings()
    {
        this.containerEl.createEl("h1", {
            text: "Video Settings",
        });
        new Setting(this.containerEl)
            .setName("Output video format")
            .setDesc("Select the output format of the videos. Webm is the most performent image format as it is the most space efficient")
            .addDropdown(text =>
                text
                    .addOptions(
                        VideoExtensions.reduce(
                            (acc, curr) =>
                            {
                                acc[curr] = curr;
                                return acc;
                            }, {} as { [key: string]: string }
                        )
                    )
                    .setValue(this.plugin.settings.outputVideoFormat)
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.outputVideoFormat = value.trim();
                        await this.plugin.saveSettings();
                    }),
            );

        new Setting(this.containerEl)
            .setName("Video bitrate of a video")
            .setDesc("Specify the video bitrate of a video. The value is in Kbit/s")
            .addSlider(slider =>
                slider
                    .setLimits(100, 10000, 100)
                    .setValue(this.plugin.settings.videoBitrateForVideo)
                    .setDynamicTooltip()
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.videoBitrateForVideo = value;
                        await this.plugin.saveSettings();
                    }),
            );
        new Setting(this.containerEl)
            .setName("Audio bitrate of a video")
            .setDesc("Specify the audio bitrate of a video. The value is in Kbit/s")
            .addSlider(slider =>
                slider
                    .setLimits(5, 1000, 5)
                    .setValue(this.plugin.settings.audioBitrateForVideo)
                    .setDynamicTooltip()
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.audioBitrateForVideo = value;
                        await this.plugin.saveSettings();
                    }),
            );

        new Setting(this.containerEl)
            .setName("Output max size")
            .setDesc("Specify the max width of height of the output file")
            .addSlider(slider =>
                slider
                    .setLimits(100, 10000, 100)
                    .setValue(this.plugin.settings.videoMaxSize)
                    .setDynamicTooltip()
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.videoMaxSize = value;
                        await this.plugin.saveSettings();
                    }),
            );
        this.containerEl.createEl("h3", {
            text: "Video formats",
        });
        new Setting(this.containerEl)
            .setName("Include MP4")
            .setDesc(`Include all mp4 files formats (${Mp4VideoExtensions.join(", ")})`)
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.includeVideoMp4)
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.includeVideoMp4 = value;
                        await this.plugin.saveSettings();
                    }),
            );
        new Setting(this.containerEl)
            .setName("Include MKV")
            .setDesc(`Include all mkv files formats (${MkvVideoExtensions.join(", ")})`)
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.includeVideoMkv)
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.includeVideoMkv = value;
                        await this.plugin.saveSettings();
                    }),
            );
        new Setting(this.containerEl)
            .setName("Include MOV")
            .setDesc(`Include all mov files formats (${MovVideoExtensions.join(", ")})`)
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.includeVideoMov)
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.includeVideoMov = value;
                        await this.plugin.saveSettings();
                    }),
            );
        new Setting(this.containerEl)
            .setName("Include WEBM")
            .setDesc(`Include all webm files formats (${WebmVideoExtensions.join(", ")})`)
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.includeVideoWebm)
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.includeVideoWebm = value;
                        await this.plugin.saveSettings();
                    }),
            );
    }

    displayAudioSettings()
    {
        this.containerEl.createEl("h1", {
            text: "Audio Settings",
        });
        new Setting(this.containerEl)
            .setName("Output audio format")
            .setDesc("Select the output format of the audios. Webm is the most performent image format as it is the most space efficient")
            .addDropdown(text =>
                text
                    .addOptions(
                        AudioExtensions.reduce(
                            (acc, curr) =>
                            {
                                acc[curr] = curr;
                                return acc;
                            }, {} as { [key: string]: string }
                        )
                    )
                    .setValue(this.plugin.settings.outputAudioFormat)
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.outputAudioFormat = value.trim();
                        await this.plugin.saveSettings();
                    }),
            );

        new Setting(this.containerEl)
            .setName("Audio bitrate of an audio")
            .setDesc("Specify the audio bitrate of an audio. The value is in Kbit/s")
            .addSlider(slider =>
                slider
                    .setLimits(5, 1000, 5)
                    .setValue(this.plugin.settings.audioBitrateForAudio)
                    .setDynamicTooltip()
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.audioBitrateForAudio = value;
                        await this.plugin.saveSettings();
                    }),
            );

        this.containerEl.createEl("h3", {
            text: "Audio formats",
        });
        new Setting(this.containerEl)
            .setName("Include MP3")
            .setDesc(`Include all mp3 files formats (${Mp3AudioExtensions.join(", ")})`)
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.includeAudioMp3)
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.includeAudioMp3 = value;
                        await this.plugin.saveSettings();
                    }),
            );
        new Setting(this.containerEl)
            .setName("Include WAV")
            .setDesc(`Include all wav files formats (${WavAudioExtensions.join(", ")})`)
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.includeAudioWav)
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.includeAudioWav = value;
                        await this.plugin.saveSettings();
                    }),
            );
        new Setting(this.containerEl)
            .setName("Include M4A")
            .setDesc(`Include all m4a files formats (${M4aAudioExtensions.join(", ")})`)
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.includeAudioM4a)
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.includeAudioM4a = value;
                        await this.plugin.saveSettings();
                    }),
            );
        new Setting(this.containerEl)
            .setName("Include FLAC")
            .setDesc(`Include all flac files formats (${FlacAudioExtensions.join(", ")})`)
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.includeAudioFlac)
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.includeAudioFlac = value;
                        await this.plugin.saveSettings();
                    }),
            );
        new Setting(this.containerEl)
            .setName("Include WEBM")
            .setDesc(`Include all webm files formats (${WebmAudioExtensions.join(", ")})`)
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.includeAudioWebm)
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.includeAudioWebm = value;
                        await this.plugin.saveSettings();
                    }),
            );
    }

    display(): void
    {
        this.containerEl.empty();
        this.displayGeneralSettings();
        this.displayImageSettings();
        this.displayVideoSettings();
        this.displayAudioSettings();
    }
}
