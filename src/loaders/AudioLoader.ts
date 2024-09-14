import { App, FileSystemAdapter, TFile } from "obsidian";
import Loader from "./Loader";
import { hasAudioCodecOnly } from "src/ffmpeg/FormatChecker";
import { Type } from "src/formats";

export default class AudioLoader extends Loader
{
    constructor(app: App, extensions: string[])
    {
        super(app, Type.audio, extensions, f => this.isAudio(f));
    }

    isAudio(f: TFile): boolean | Promise<boolean>
    {
        if (this.app.vault.adapter instanceof FileSystemAdapter)
        {
            return hasAudioCodecOnly(this.app.vault.adapter.getFullPath(f.path));
        }

        return false;
    }
}
