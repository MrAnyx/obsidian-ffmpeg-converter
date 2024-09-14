import { App, TFile } from "obsidian";
import File from "src/files/File";
import { Type } from "src/formats";

export default class Loader
{
    protected app: App;
    protected extensions: string[];
    protected filterCallback: ((arg: TFile) => boolean | Promise<boolean>) | undefined;
    protected type: Type;

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

        const filteredFiles = await Promise.all(
            files.map(async (f) =>
            {
                const extensionIncluded = this.extensions.includes(f.extension);
                const filterCallbackResult = this.filterCallback ? await this.filterCallback(f) : true;

                return extensionIncluded && filterCallbackResult ? f : null;
            })
        );

        return filteredFiles
            .filter((file): file is TFile => file !== null)
            .map(f => new File(f, this.type));
    }
}
