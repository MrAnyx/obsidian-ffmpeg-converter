import { App, TFile } from "obsidian";
import File from "src/files/File";
import { Type } from "src/formats";

export default class Loader
{
    protected app: App;
    protected extensions: string[];
    protected filterCallback: ((arg: TFile) => boolean | Promise<boolean>) | undefined;
    public type: Type;

    constructor(app: App, type: Type, extensions: string[], filterCallback?: (arg: TFile) => boolean | Promise<boolean>)
    {
        this.app = app;
        this.type = type;
        this.extensions = extensions;
        this.filterCallback = filterCallback;
    }

    async getFiles(): Promise<File[]>
    {
        const files = this.app.vault.getFiles();
        const result: File[] = [];

        for (const f of files)
        {
            const extensionIncluded = this.extensions.includes(f.extension);
            const filterCallbackResult = this.filterCallback ? await this.filterCallback(f) : true;

            if (extensionIncluded && filterCallbackResult)
            {
                result.push(new File(f, this.type));
            }
        }

        return result;
    }
}
