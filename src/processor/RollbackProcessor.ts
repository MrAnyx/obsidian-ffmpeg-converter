import { App, Notice } from "obsidian";
import TemporaryLoader from "src/loader/TemporaryLoader";
import Processor from "./Processor";
import { SettingType } from "src/setting/SettingType";
import File from "src/files/File";
import fs from "fs";

export default class RollbackProcessor extends Processor
{
    constructor(app: App, settings: SettingType)
    {
        super(app, settings);
        this.loaders = [
            new TemporaryLoader(this.app)
        ];
    }

    private getFileMetadata(file: File)
    {
        const sections = file.name.split("_");

        const uniqueId = sections.pop();
        const extension = sections.pop();
        const originalFileName = sections.join("_");

        return {
            originalFileName,
            extension,
            uniqueId
        };
    }

    private generateOriginalFile(file: File)
    {
        const { extension, originalFileName, uniqueId } = this.getFileMetadata(file);

        const originalFile = file.clone({
            extension,

            // Update the name to make it unique if overwrite is disabled
            ...(!this.settings.overwrite ? { name: `${originalFileName}_${uniqueId}` } : { name: originalFileName })
        });

        return originalFile;
    }

    async process()
    {
        for (const loader of this.loaders)
        {
            const files = await loader.getFiles();

            new Notice(`Found ${files.length} temporary files to restore`);

            if (files.length === 0)
            {
                continue;
            }

            let fileIndex = 1;
            let progressNotice: Notice | undefined;

            // Use of traditional for of to prevent file conflict in async programming
            for (const tmpFile of files)
            {
                if (progressNotice)
                {
                    progressNotice.setMessage(`Processing  temporary file ${fileIndex}/${files.length} (${tmpFile.name})`);
                }
                else
                {
                    progressNotice = new Notice(`Processing  temporary file ${fileIndex}/${files.length} (${tmpFile.name})`, 0);
                }

                const originalFile = this.generateOriginalFile(tmpFile);

                try
                {
                    if (fs.existsSync(originalFile.getFullPathWithExtension()))
                    {
                        // Rename original file to new file
                        await this.app.vault.adapter.remove(originalFile.getVaultPathWithExtension());
                    }

                    // Copy original file to temporary file
                    await this.app.vault.rename(tmpFile.file, originalFile.getVaultPathWithExtension());

                    fileIndex++;
                }
                catch (e: unknown)
                {
                    new Notice(`An error occured when restoring ${tmpFile.file.path}, please check the developer console for more details (Ctrl+Shift+I for Windows or Linux or Cmd+Shift+I for Mac)`, 5000);
                    console.error(e);
                    break;
                }
            }

            new Notice("Temporary file restoration ended successfully");
            setTimeout(() => (progressNotice as Notice).hide(), 3000);
        }
    }
}
