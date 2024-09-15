import { App, FileSystemAdapter, TFile } from "obsidian";
import Loader from "./Loader";
import { Type } from "src/formats";
import { hasAudioCodecOnly } from "src/utils/FormatChecker";

export default class AudioLoader extends Loader
{
    constructor(app: App, extensions: string[])
    {
        super(app, Type.audio, extensions, f => this.isAudio(f));
    }

    private async isAudio(f: TFile): Promise<boolean>
    {
        if (this.app.vault.adapter instanceof FileSystemAdapter)
        {
            try
            {
                return await hasAudioCodecOnly(this.app.vault.adapter.getFullPath(f.path));
            }
            catch
            {
                return false;
            }
        }

        return false;
    }
}
