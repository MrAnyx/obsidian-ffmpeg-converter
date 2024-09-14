import { App, FileSystemAdapter, TFile } from "obsidian";
import Loader from "./Loader";
import { hasVideoCodec } from "src/ffmpeg/FormatChecker";
import { Type } from "src/formats";

export default class VideoLoader extends Loader
{
    constructor(app: App, extensions: string[])
    {
        super(app, Type.video, extensions, f => this.isVideo(f));
    }

    private isVideo(f: TFile): boolean | Promise<boolean>
    {
        if (this.app.vault.adapter instanceof FileSystemAdapter)
        {
            return hasVideoCodec(this.app.vault.adapter.getFullPath(f.path));
        }

        return false;
    }
}
