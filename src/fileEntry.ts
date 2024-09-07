import { TFile } from "obsidian";
import path from "path";
import { ImageExtensions, Type, VideoExtensions } from "./formats";

interface IFileEntry
{
    name: string;
    extension: string;
    folderVaultPath: string;
    folderFullPath: string;
}

export default class FileEntry implements IFileEntry
{
    name: string;
    extension: string;
    folderVaultPath: string;
    folderFullPath: string;
    file: TFile;
    type: Type;

    constructor(file: TFile, overwriteOptions?: Partial<IFileEntry>)
    {
        this.name = overwriteOptions?.name || file.basename;
        this.extension = overwriteOptions?.extension || file.extension;
        this.folderVaultPath = overwriteOptions?.folderVaultPath || path.dirname(file.path);
        this.folderFullPath = overwriteOptions?.folderFullPath || path.join((file.vault.adapter as any).basePath, path.dirname(file.path));
        this.file = file;

        if (ImageExtensions.includes(this.extension))
        {
            this.type = Type.image;
        }
        else if (VideoExtensions.includes(this.extension))
        {
            this.type = Type.video;
        }
        else
        {
            this.type = Type.unsupported;
        }
    }

    getFileNameWithExtension(): string
    {
        return `${this.name}.${this.extension}`;
    }

    getVaultPathWithExtension(): string
    {
        return path.join(this.folderVaultPath, this.getFileNameWithExtension());
    }

    getFullPathWithExtension(): string
    {
        return path.join(this.folderFullPath, this.getFileNameWithExtension());
    }
}
