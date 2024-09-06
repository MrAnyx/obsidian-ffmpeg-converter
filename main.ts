/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	addIcon,
	App,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	TFile,
} from "obsidian";
import ffmpeg from "fluent-ffmpeg";
import { lookpath } from "lookpath";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";

interface IFileEntry {
	name: string;
	extension: string;
	folderVaultPath: string;
	folderFullPath: string;
}

class FileEntry implements IFileEntry {
	name: string;
	extension: string;
	folderVaultPath: string;
	folderFullPath: string;
	file: TFile;

	constructor(file: TFile, overwriteOptions?: Partial<IFileEntry>) {
		this.name = overwriteOptions?.name || file.basename;
		this.extension = overwriteOptions?.extension || file.extension;
		this.folderVaultPath =
			overwriteOptions?.folderVaultPath || path.dirname(file.path);
		this.folderFullPath =
			overwriteOptions?.folderFullPath ||
			path.join(
				(file.vault.adapter as any).basePath,
				path.dirname(file.path)
			);
		this.file = file;
	}

	getFileNameWithExtension(): string {
		return `${this.name}.${this.extension}`;
	}
	getVaultPathWithExtension(): string {
		return path.join(this.folderVaultPath, this.getFileNameWithExtension());
	}
	getFullPathWithExtension(): string {
		return path.join(this.folderFullPath, this.getFileNameWithExtension());
	}
}

interface SettingType {
	customFfmpegPath: string;
	quality: number;
	includePng: boolean;
	includeJpg: boolean;
	includeWebp: boolean;
	includeGif: boolean;
	outputFormat: string;
}

const DEFAULT_SETTINGS: SettingType = {
	customFfmpegPath: "",
	quality: 80,
	includePng: true,
	includeJpg: true,
	includeGif: true,
	includeWebp: false,
	outputFormat: "webp",
};

export default class FfmpegCompressPlugin extends Plugin {
	settings: SettingType;

	async convertImages() {
		const ffmpegFromEnv = await lookpath("ffmpeg");
		let ffmpegPath: string | undefined = undefined;

		if (ffmpegFromEnv) {
			ffmpegPath = ffmpegFromEnv;
		} else if (fs.existsSync(this.settings.customFfmpegPath.trim())) {
			ffmpegPath = this.settings.customFfmpegPath.trim();
		}

		if (ffmpegPath === undefined) {
			new Notice(
				"Ffmpeg is not installed on your system. Please check your environment variable or the settings path."
			);
			return;
		}

		ffmpeg.setFfmpegPath(ffmpegPath);

		const files = this.app.vault
			.getFiles()
			.filter((f) =>
				[
					// https://developer.mozilla.org/fr/docs/Web/Media/Formats/Image_types
					...(this.settings.includePng ? ["png"] : []),
					...(this.settings.includeJpg ? ["jpg", "jpeg", "jfif", "pjpeg", "pjp"] : []),
					...(this.settings.includeGif ? ["gif"] : []),
					...(this.settings.includeWebp ? ["webp"] : []),
				].includes(f.extension)
			);

		// Use of traditional for of to prevent file conflict in async programming
		for (const f of files) {
			const originalFile = new FileEntry(f);
			const tmpFile = new FileEntry(f, {
				name: `${originalFile.name}_${nanoid(6)}`,
				extension: "tmp",
			});
			const newFile = new FileEntry(f, {
				extension: this.settings.outputFormat,
			});

			// Copy original file to temporary file
			await this.app.vault.copy(
				originalFile.file,
				tmpFile.getVaultPathWithExtension()
			);

			// Rename original file to new file
			await this.app.fileManager.renameFile(
				originalFile.file,
				newFile.getVaultPathWithExtension()
			);

			// Remove original renamed file
			await this.app.vault.adapter.remove(
				newFile.getVaultPathWithExtension()
			);

			// Convert to webp using ffmpeg
			await new Promise((resolve, reject) => {
				ffmpeg()
					.outputOptions([
						'-loop', '0',
						'-qscale', this.settings.quality.toString()
					])
					.input(tmpFile.getFullPathWithExtension())
					.output(newFile.getFullPathWithExtension())
					.on("end", resolve)
					.on("error", reject)
					.run();
			});

			// Remove temporary file
			await this.app.vault.adapter.remove(
				tmpFile.getVaultPathWithExtension()
			);
		}
	}

	async onload() {
		await this.loadSettings();

		addIcon(
			"progress-bolt",
			`<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-progress-bolt"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 20.777a8.942 8.942 0 0 1 -2.48 -.969" /><path d="M14 3.223a9.003 9.003 0 0 1 0 17.554" /><path d="M4.579 17.093a8.961 8.961 0 0 1 -1.227 -2.592" /><path d="M3.124 10.5c.16 -.95 .468 -1.85 .9 -2.675l.169 -.305" /><path d="M6.907 4.579a8.954 8.954 0 0 1 3.093 -1.356" /><path d="M12 9l-2 3h4l-2 3" /></svg>`
		);

		this.addRibbonIcon(
			"progress-bolt",
			"Compress images",
			async (evt: MouseEvent) => await this.convertImages()
		);

		this.addCommand({
			id: "open-sample-modal-simple",
			name: "Open sample modal (simple)",
			callback: async () => await this.convertImages(),
		});

		this.addSettingTab(new SettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SettingTab extends PluginSettingTab {
plugin: FfmpegCompressPlugin;

	constructor(app: App, plugin: FfmpegCompressPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}
	
	display(): void {
		const { containerEl } = this;
		containerEl.empty();

	new Setting(containerEl)
		.setName("Ffmpeg path")
			.setDesc(
				"Overwrite the default Ffmpeg path. Leave empty to use the ffmpeg binary from the environment variables. This setting will be used only if the ffmpeg binary isn't found on your system using the environment variables."
			)
			.addText((text) =>
				text
					.setValue(this.plugin.settings.customFfmpegPath)
					.onChange(async (value) => {
						this.plugin.settings.customFfmpegPath = value.trim();
						await this.plugin.saveSettings();
					})
			);
	
	
	new Setting(containerEl)
		.setName("Output format")
			.setDesc("Select the output format of the images. Webp is the most performent image format as it is the most space efficient")
			.addDropdown((text) =>
				text
					.addOptions({
						png: "png",
						jpg: "jpg",
						gif: "gif",
						webp: "webp",
					})
					.setValue(this.plugin.settings.outputFormat)
					.onChange(async (value) => {
						this.plugin.settings.outputFormat = value.trim();
						await this.plugin.saveSettings();
					})
			);
		
	new Setting(containerEl)
		.setName("Output quality")
		.setDesc("Output quality used during the conversion")
		.addSlider((slider) =>
			slider
				.setLimits(0, 100, 5)
				.setValue(this.plugin.settings.quality)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.quality = value;
					await this.plugin.saveSettings();
				})
		);

		new Setting(containerEl)
			.setName("Include PNG")
			.setDesc("Include all png image formats (png)")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.includePng)
					.onChange(async (value) => {
						this.plugin.settings.includePng = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(containerEl)
			.setName("Include JPEG")
			.setDesc("Include all jpeg image formats (jpg, jpeg, jfif, pjpeg and pjp)")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.includeJpg)
					.onChange(async (value) => {
						this.plugin.settings.includeJpg = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(containerEl)
			.setName("Include GIF")
			.setDesc("Include all gif image format (gif)")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.includeGif)
					.onChange(async (value) => {
						this.plugin.settings.includeGif = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(containerEl)
			.setName("Include WEBP")
			.setDesc("Include all webp image format (webp)")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.includeWebp)
					.onChange(async (value) => {
						this.plugin.settings.includeWebp = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
