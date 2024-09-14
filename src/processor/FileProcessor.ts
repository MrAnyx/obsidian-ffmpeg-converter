import { App } from "obsidian";
import File from "src/files/File";
import { ImageExtensions, VideoExtensions, AudioExtensions, Type } from "src/formats";
import AudioLoader from "src/loaders/AudioLoader";
import ImageLoader from "src/loaders/ImageLoader";
import Loader from "src/loaders/Loader";
import VideoLoader from "src/loaders/VideoLoader";
import { SettingType } from "src/settings/SettingType";
import { findPath } from "src/utils/pathFinder";
import { generateUniqueId } from "src/utils/uniqueId";

export default class AssetProcessor
{
    private app: App;
    private settings: SettingType;
    private loaders: Loader[];

    constructor(app: App, settings: SettingType)
    {
        this.app = app;
        this.settings = settings;
        this.loaders = [
            new ImageLoader(this.app, [
                ...(this.settings.includeImageAvif ? ImageExtensions.avif : []),
                ...(this.settings.includeImageBmp ? ImageExtensions.bmp : []),
                ...(this.settings.includeImagePng ? ImageExtensions.png : []),
                ...(this.settings.includeImageJpg ? ImageExtensions.jpg : []),
                ...(this.settings.includeImageGif ? ImageExtensions.gif : []),
                ...(this.settings.includeAudioWebp ? ImageExtensions.webp : []),
            ]),
            new VideoLoader(this.app, [
                ...(this.settings.includeVideoMp4 ? VideoExtensions.mp4 : []),
                ...(this.settings.includeVideoMkv ? VideoExtensions.mkv : []),
                ...(this.settings.includeVideoMov ? VideoExtensions.mov : []),
                ...(this.settings.includeVideoWebm ? VideoExtensions.webm : []),
                ...(this.settings.includeVideoOgv ? VideoExtensions.ogv : []),
            ]),
            new AudioLoader(this.app, [
                ...(this.settings.includeAudioFlac ? AudioExtensions.flac : []),
                ...(this.settings.includeAudioWav ? AudioExtensions.wav : []),
                ...(this.settings.includeAudioM4a ? AudioExtensions.m4a : []),
                ...(this.settings.includeAudioMp3 ? AudioExtensions.mp3 : []),
                ...(this.settings.includeAudioWebm ? AudioExtensions.webm : []),
                ...(this.settings.includeAudioOgg ? AudioExtensions.ogg : []),
                ...(this.settings.includeAudio3gp ? AudioExtensions["3gp"] : []),
            ]),
        ];
    }

    private getNewFileExtension(file: File)
    {
        const fileType = file.type;

        switch (fileType)
        {
            case Type.image:
                return this.settings.outputImageFormat;
            case Type.video:
                return this.settings.outputVideoFormat;
            case Type.audio:
                return this.settings.outputAudioFormat;
            default:
                throw new Error(`Unsupported file type ${file.extension}`);
        }
    }

    private async generateWorkFiles(file: File)
    {
        const uniqueId = generateUniqueId(this.settings.uniqueIdLength);

        const tmpFile = file.clone({
            name: `${file.name}_${file.extension}_${uniqueId}`,
            extension: "tmp",
        });

        const newFile = file.clone({
            extension: this.getNewFileExtension(file),

            // Update the name to make it unique if overwrite is disabled
            ...(!this.settings.overwrite ? { name: `${file.name}_${uniqueId}` } : {})
        });

        return {
            originalFile: file,
            tmpFile,
            newFile
        };
    }

    async process()
    {
        for (const loader of this.loaders)
        {
            // const files = await loader.getFiles();

            const ffmpegPath = await findPath("ffmpeg", this.settings.customFfmpegPath.trim());

            if (ffmpegPath === undefined)
            {
                new Notice("Ffmpeg is not installed on your system. Please check your environment variable or the settings path.");
                return;
            }

            const ffmpeg = new FfmpegUtility(
                ffmpegPath,

                this.settings.imageQuality,
                this.settings.imageMaxSize,

                this.settings.videoBitrateForVideo,
                this.settings.audioBitrateForVideo,
                this.settings.videoMaxSize,

                this.settings.audioBitrateForAudio
            );

            const files = this.getFilesToConvert();

            new Notice(`Found ${files.length} files to convert`);

            if (files.length > 0)
            {
                let fileIndex = 1;
                let progressNotice: Notice | undefined;

                // Use of traditional for of to prevent file conflict in async programming
                for (const f of files)
                {
                    if (progressNotice)
                    {
                        progressNotice.setMessage(`Processing file ${fileIndex}/${files.length} (${f.name})`);
                    }
                    else
                    {
                        progressNotice = new Notice(`Processing file ${fileIndex}/${files.length} (${f.name})`, 0);
                    }

                    const { originalFile, newFile, tmpFile } = await this.generateWorkFiles(f);

                    try
                    {
                        // Copy original file to temporary file
                        await this.app.vault.copy(originalFile.file, tmpFile.getVaultPathWithExtension());

                        if (fs.existsSync(newFile.getFullPathWithExtension()))
                        {
                            // Rename original file to new file
                            await this.app.vault.adapter.remove(newFile.getVaultPathWithExtension());
                        }

                        await this.app.fileManager.renameFile(originalFile.file, newFile.getVaultPathWithExtension());

                        // Remove original renamed file
                        await this.app.vault.adapter.remove(newFile.getVaultPathWithExtension());

                        // Convert to new format using ffmpeg
                        await ffmpeg.convert(tmpFile, newFile);

                        // Remove temporary file
                        await this.app.vault.adapter.remove(tmpFile.getVaultPathWithExtension());

                        fileIndex++;
                    }
                    catch (e: any)
                    {
                        new Notice("An error occured, please check the developer console for more details (Ctrl+Shift+I for Windows or Linux or Cmd+Shift+I for Mac)");
                        console.error(`An error occured. Check the validity of the file ${f.path}. You can delete all temporary files generated during the operation.`);
                        console.error(e);
                        break;
                    }
                }
                new Notice("Ffmpeg conversion ended successfully");
                setTimeout(() => (progressNotice as Notice).hide(), 3000);
            }
        }
    }
}
