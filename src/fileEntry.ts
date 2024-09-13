import { TFile } from "obsidian";
import path from "path";
import { AudioExtensions, DuplicatFormats, ImageExtensions, Type, VideoExtensions } from "./formats";
import Ffmpeg from "fluent-ffmpeg";

interface IFileEntry
{
    name: string;
    extension: string;
    folderVaultPath: string;
    folderFullPath: string;
    file: TFile;
    mime: string;
}

export default class FileEntry implements IFileEntry
{
    name: string;
    extension: string;
    folderVaultPath: string;
    folderFullPath: string;
    file: TFile;
    mime: string;

    constructor(file: TFile, overwriteOptions?: Partial<IFileEntry>)
    {
        this.name = overwriteOptions?.name || file.basename;
        this.extension = overwriteOptions?.extension || file.extension;
        this.folderVaultPath = overwriteOptions?.folderVaultPath || path.dirname(file.path);
        this.folderFullPath = overwriteOptions?.folderFullPath || path.join((file.vault.adapter as any).basePath, path.dirname(file.path));
        this.file = file;
    }

    async getFileType(): Promise<Type>
    {
        return new Promise((resolve, reject) =>
        {
            if (ImageExtensions.includes(this.extension))
            {
                resolve(Type.image);
            }
            else if (VideoExtensions.includes(this.extension))
            {
                if (DuplicatFormats.includes(this.extension))
                {
                    Ffmpeg.ffprobe(this.getFullPathWithExtension(), (err, metadata) =>
                    {
                        if (err)
                        {
                            reject(err);
                            return;
                        }
                        const videoStream = metadata.streams.find(stream => stream.codec_type === "video");
                        const audioStream = metadata.streams.find(stream => stream.codec_type === "audio");

                        if (videoStream)
                        {
                            resolve(Type.video);
                        }
                        else if (audioStream)
                        {
                            resolve(Type.audio);
                        }
                        else
                        {
                            resolve(Type.unknown);
                        }
                    });
                }
                else
                {
                    resolve(Type.video);
                }
            }
            else if (AudioExtensions.includes(this.extension))
            {
                if (DuplicatFormats.includes(this.extension))
                {
                    // If it's a WebM file, check with ffprobe if it's video or audio
                    Ffmpeg.ffprobe(this.getFullPathWithExtension(), (err, metadata) =>
                    {
                        if (err)
                        {
                            reject(err);
                            return;
                        }
                        const videoStream = metadata.streams.find(stream => stream.codec_type === "video");
                        const audioStream = metadata.streams.find(stream => stream.codec_type === "audio");

                        if (videoStream)
                        {
                            resolve(Type.video);
                        }
                        else if (audioStream)
                        {
                            resolve(Type.audio);
                        }
                        else
                        {
                            resolve(Type.unknown);
                        }
                    });
                }
                else
                {
                    resolve(Type.audio);
                }
            }
            else
            {
                resolve(Type.unknown);
            }
        });
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
