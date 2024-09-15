import { App } from "obsidian";
import Loader from "src/loader/Loader";
import { SettingType } from "src/setting/SettingType";

export default abstract class Processor
{
    protected app: App;
    protected settings: SettingType;
    protected loaders: Loader[];

    constructor(app: App, settings: SettingType)
    {
        this.app = app;
        this.settings = settings;
        this.loaders = [];
    }

    public abstract process(): void | Promise<void>;
}
