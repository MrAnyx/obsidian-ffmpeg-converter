import { addIcon } from "obsidian";
import { SettingTab } from "./setting/SettingTab";
import ObsidianPlugin from "./core/ObsidianPlugin";
import AssetProcessor from "./processor/AssetProcessor";

export default class Main extends ObsidianPlugin
{
    async onload()
    {
        await super.loadSettings();

        addIcon(
            "progress-bolt",
            `<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-progress-bolt"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 20.777a8.942 8.942 0 0 1 -2.48 -.969" /><path d="M14 3.223a9.003 9.003 0 0 1 0 17.554" /><path d="M4.579 17.093a8.961 8.961 0 0 1 -1.227 -2.592" /><path d="M3.124 10.5c.16 -.95 .468 -1.85 .9 -2.675l.169 -.305" /><path d="M6.907 4.579a8.954 8.954 0 0 1 3.093 -1.356" /><path d="M12 9l-2 3h4l-2 3" /></svg>`,
        );

        this.addRibbonIcon(
            "progress-bolt",
            "Convert images",
            async () => await (new AssetProcessor(this.app, this.settings)).process(),
        );

        this.addCommand({
            id: "convert-images",
            name: "Convert images",
            callback: async () => await (new AssetProcessor(this.app, this.settings)).process(),
        });

        this.addSettingTab(new SettingTab(this.app, this));
    }
}
