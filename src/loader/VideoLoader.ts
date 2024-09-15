import { App, FileSystemAdapter, TFile } from "obsidian";
import Loader from "./Loader";
import { Type } from "src/formats";
import { hasVideoCodec } from "src/utils/FormatChecker";

export default class VideoLoader extends Loader
{
    constructor(app: App, extensions: string[])
    {
        super(app, Type.video, extensions, f => this.isVideo(f));
    }

    private async isVideo(f: TFile): Promise<boolean>
    {
        if (this.app.vault.adapter instanceof FileSystemAdapter)
        {
            try
            {
                return await hasVideoCodec(this.app.vault.adapter.getFullPath(f.path));
            }
            catch
            {
                return false;
            }
        }

        return false;
    }
}
