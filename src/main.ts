import { addIcon, Notice, Plugin, TFile } from "obsidian";
import { nanoid } from "nanoid";
import { DefaultSettings, SettingTab, SettingType } from "./settings";
import FileEntry from "./fileEntry";
import PathFinder from "./pathFinder";
import FfmpegUtility from "./ffmpegUtility";
import { GifExtensions, JpgExtensions, Mp4Extensions, PngExtensions, Type, WebmExtensions, WebpExtensions } from "./formats";

export default class FfmpegCompressPlugin extends Plugin
{
    settings: SettingType;

    getFilesToConvert()
    {
        return this.app.vault
            .getFiles()
            .filter(f =>
                [
                    // TODO Améliorer
                    ...(this.settings.includePng ? PngExtensions : []),
                    ...(this.settings.includeJpg ? JpgExtensions : []),
                    ...(this.settings.includeGif ? GifExtensions : []),
                    ...(this.settings.includeWebp ? WebpExtensions : []),
                    ...(this.settings.includeMp4 ? Mp4Extensions : []),
                    ...(this.settings.includeWebm ? WebmExtensions : []),
                ].includes(f.extension),
            );
    }

    getNewFileExtension(file: FileEntry)
    {
        switch (file.type)
        {
            case Type.image:
                return this.settings.outputImageFormat;
            case Type.video:
                return this.settings.outputVideoFormat;
            default:
                throw new Error(`Unsupported file type ${file.extension}`);
        }
    }

    generateWorkFiles(file: TFile)
    {
        const originalFile = new FileEntry(file);
        const tmpFile = new FileEntry(file, {
            name: `${originalFile.name}_${nanoid(6)}`,
            extension: "tmp",
        });

        const newFile = new FileEntry(file, {
            extension: this.getNewFileExtension(originalFile),
        });

        return {
            originalFile,
            tmpFile,
            newFile
        };
    }

    async convertImages()
    {
        const ffmpegPath = await PathFinder.getPath("ffmpeg", this.settings.customFfmpegPath.trim());

        if (ffmpegPath === undefined)
        {
            new Notice(
                "Ffmpeg is not installed on your system. Please check your environment variable or the settings path.",
            );
            return;
        }

        const ffmpeg = new FfmpegUtility(ffmpegPath, this.settings.imageQuality, this.settings.imageMaxSize);

        const files = this.getFilesToConvert();

        // Use of traditional for of to prevent file conflict in async programming
        for (const f of files)
        {
            const { originalFile, newFile, tmpFile } = this.generateWorkFiles(f);

            try
            {
                // Copy original file to temporary file
                await this.app.vault.copy(
                    originalFile.file,
                    tmpFile.getVaultPathWithExtension(),
                );

                // Rename original file to new file
                await this.app.fileManager.renameFile(
                    originalFile.file,
                    newFile.getVaultPathWithExtension(),
                );

                // Remove original renamed file
                await this.app.vault.adapter.remove(
                    newFile.getVaultPathWithExtension(),
                );

                // Convert to new format using ffmpeg
                await ffmpeg.convert(tmpFile, newFile);

                // Remove temporary file
                await this.app.vault.adapter.remove(
                    tmpFile.getVaultPathWithExtension(),
                );
            }
            catch (e: any)
            {
                new Notice("An error occured, please check the developer console for more details (Ctrl+Shift+I for Windows or Linux or Cmd+Shift+I for Mac)");
                console.error(`An error occured. Check the validity of the file ${f.path}. You can delete all temporary files generated during the operation.`);
                console.error(e);
                break;
            }
        }
    }

    async onload()
    {
        await this.loadSettings();

        addIcon(
            "progress-bolt",
            `<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-progress-bolt"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 20.777a8.942 8.942 0 0 1 -2.48 -.969" /><path d="M14 3.223a9.003 9.003 0 0 1 0 17.554" /><path d="M4.579 17.093a8.961 8.961 0 0 1 -1.227 -2.592" /><path d="M3.124 10.5c.16 -.95 .468 -1.85 .9 -2.675l.169 -.305" /><path d="M6.907 4.579a8.954 8.954 0 0 1 3.093 -1.356" /><path d="M12 9l-2 3h4l-2 3" /></svg>`,
        );

        this.addRibbonIcon(
            "progress-bolt",
            "Convert images",
            async () => await this.convertImages(),
        );

        this.addCommand({
            id: "convert-images",
            name: "Convert images",
            callback: async () => await this.convertImages(),
        });

        this.addSettingTab(new SettingTab(this.app, this));
    }

    onunload() {}

    async loadSettings()
    {
        this.settings = Object.assign(
            {},
            DefaultSettings,
            await this.loadData(),
        );
    }

    async saveSettings()
    {
        await this.saveData(this.settings);
    }
}
