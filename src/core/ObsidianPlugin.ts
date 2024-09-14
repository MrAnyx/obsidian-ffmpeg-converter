import { Plugin } from "obsidian";
import { DefaultSettings, SettingType } from "src/settings/SettingType";

export default abstract class ObsidianPlugin extends Plugin
{
    settings: SettingType;

    async onload()
    {
        await this.loadSettings();
    }

    async loadSettings()
    {
        this.settings = Object.assign(
            {},
            DefaultSettings,
            await this.loadData(),
        );
    }

    async saveSettings()
    {
        await this.saveData(this.settings);
    }
}
