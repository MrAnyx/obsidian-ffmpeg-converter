import { App, Notice } from "obsidian";
import { ConverterFactory } from "src/converter/ConverterFactory";
import File from "src/files/File";
import { ImageExtensions, VideoExtensions, AudioExtensions, Type } from "src/formats";
import AudioLoader from "src/loader/AudioLoader";
import ImageLoader from "src/loader/ImageLoader";
import Loader from "src/loader/Loader";
import VideoLoader from "src/loader/VideoLoader";
import { SettingType } from "src/setting/SettingType";
import { generateUniqueId } from "src/utils/UniqueId";
import fs from "fs";

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
                ...(this.settings.includeVideoOgv ? VideoExtensions.ogv : []),
                ...(this.settings.includeVideoWebm ? VideoExtensions.webm : []),
            ]),
            new AudioLoader(this.app, [
                ...(this.settings.includeAudioMp3 ? AudioExtensions.mp3 : []),
                ...(this.settings.includeAudioWav ? AudioExtensions.wav : []),
                ...(this.settings.includeAudioM4a ? AudioExtensions.m4a : []),
                ...(this.settings.includeAudioFlac ? AudioExtensions.flac : []),
                ...(this.settings.includeAudioOgg ? AudioExtensions.ogg : []),
                ...(this.settings.includeAudio3gp ? AudioExtensions["3gp"] : []),
                ...(this.settings.includeAudioWebm ? AudioExtensions.webm : []),
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
            newFile,
            tmpFile
        };
    }

    async process()
    {
        for (const loader of this.loaders)
        {
            const files = await loader.getFiles();

            new Notice(`Found ${files.length} files to convert of type ${loader.type}`);

            const converter = ConverterFactory.createConverter(loader.type, this.settings);

            if (files.length === 0)
            {
                continue;
            }

            let fileIndex = 1;
            let progressNotice: Notice | undefined;

            // Use of traditional for of to prevent file conflict in async programming
            for (const originalFile of files)
            {
                if (progressNotice)
                {
                    progressNotice.setMessage(`Processing file ${fileIndex}/${files.length} (${originalFile.name})`);
                }
                else
                {
                    progressNotice = new Notice(`Processing file ${fileIndex}/${files.length} (${originalFile.name})`, 0);
                }

                const { newFile, tmpFile } = await this.generateWorkFiles(originalFile);

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
                    await converter.convert(tmpFile, newFile);

                    // Remove temporary file
                    await this.app.vault.adapter.remove(tmpFile.getVaultPathWithExtension());

                    fileIndex++;
                }
                catch (e: unknown)
                {
                    new Notice(`An error occured when converting ${originalFile.file.path}, please check the developer console for more details (Ctrl+Shift+I for Windows or Linux or Cmd+Shift+I for Mac)`, 5000);
                    console.error(e);
                    break;
                }
            }
            new Notice("Ffmpeg conversion ended successfully");
            setTimeout(() => (progressNotice as Notice).hide(), 3000);
        }
    }
}
