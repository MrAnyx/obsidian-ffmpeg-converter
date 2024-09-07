import { PluginSettingTab, App, Setting } from "obsidian";
import FfmpegCompressPlugin from "./main";
import { GifExtensions, ImageExtensions, JpgExtensions, Mp4Extensions, PngExtensions, VideoExtensions, WebmExtensions, WebpExtensions } from "./formats";

export interface SettingType
{
    // General
    customFfmpegPath: string;

    // Image
    imageQuality: number;
    imageMaxSize: number;
    includePng: boolean;
    includeJpg: boolean;
    includeGif: boolean;
    includeWebp: boolean;
    outputImageFormat: string;

    // Video
    videoMaxSize: number;
    videoBitrateForVideo: number;
    audioBitrateForVideo: number;
    includeMp4: boolean;
    includeWebm: boolean;
    outputVideoFormat: string;
}

export const DefaultSettings: SettingType = {
    customFfmpegPath: "",
    imageQuality: 80,
    imageMaxSize: 2000,
    includePng: true,
    includeJpg: true,
    includeGif: true,
    includeWebp: false,
    outputImageFormat: "webp",
    videoMaxSize: 2000,
    videoBitrateForVideo: 2000, // k
    audioBitrateForVideo: 32, // k
    includeMp4: true,
    includeWebm: false,
    outputVideoFormat: "webm"
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
        this.containerEl.createEl("h3", {
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
    }

    displayImageSettings()
    {
        this.containerEl.createEl("h3", {
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

        new Setting(this.containerEl)
            .setName("Include PNG")
            .setDesc(`Include all png files formats (${PngExtensions.join(", ")})`)
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.includePng)
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.includePng = value;
                        await this.plugin.saveSettings();
                    }),
            );
        new Setting(this.containerEl)
            .setName("Include JPEG")
            .setDesc(`Include all jpeg files formats (${JpgExtensions.join(", ")})`)
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.includeJpg)
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.includeJpg = value;
                        await this.plugin.saveSettings();
                    }),
            );
        new Setting(this.containerEl)
            .setName("Include GIF")
            .setDesc(`Include all gif files formats (${GifExtensions.join(", ")})`)
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.includeGif)
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.includeGif = value;
                        await this.plugin.saveSettings();
                    }),
            );
        new Setting(this.containerEl)
            .setName("Include WEBP")
            .setDesc(`Include all webp files formats (${WebpExtensions.join(", ")})`)
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.includeWebp)
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.includeWebp = value;
                        await this.plugin.saveSettings();
                    }),
            );
    }

    displayVideoSettings()
    {
        this.containerEl.createEl("h3", {
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
        new Setting(this.containerEl)
            .setName("Include MP4")
            .setDesc(`Include all mp4 files formats (${Mp4Extensions.join(", ")})`)
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.includeMp4)
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.includeMp4 = value;
                        await this.plugin.saveSettings();
                    }),
            );
        new Setting(this.containerEl)
            .setName("Include WEBM")
            .setDesc(`Include all webm files formats (${WebmExtensions.join(", ")})`)
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.includeWebm)
                    .onChange(async (value) =>
                    {
                        this.plugin.settings.includeWebm = value;
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
    }
}
