import { FileSystemAdapter, TFile } from "obsidian";
import path from "path";
import { Type } from "src/formats";

interface IFile
{
    name: string;
    extension: string;
}

export default class File implements IFile
{
    file: TFile;
    type: Type;
    name: string;
    extension: string;
    folderVaultPath: string;
    folderFullPath: string;

    constructor(file: TFile, type: Type = Type.unknown)
    {
        this.file = file;
        this.type = type;
        this.name = file.basename;
        this.extension = file.extension;
        this.folderVaultPath = path.dirname(file.path);
        this.folderFullPath = path.join((file.vault.adapter as FileSystemAdapter).getBasePath(), path.dirname(file.path));
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

    clone(overwriteOptions?: Partial<IFile>): File
    {
        const clone = new File(this.file, this.type);

        if (overwriteOptions)
        {
            Object.assign(clone, overwriteOptions);
        }

        return clone;
    }
}
