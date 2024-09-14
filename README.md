# Obsidian FFMPEG Converter

Optimize your vault space by converting your images, video and audio into a more compact format or with reduced quality.

Most users can reduce the size of their vault by 70%.

The conversion of your assets is optimized thanks to FFMPEG, a powerful open-source tool.

> ⚠️ Disclaimer : You should always backup your vault before using this plugin.

## Supported formated

Files supported by this plugin are the save as the [accepted files from Obsidian](https://help.obsidian.md/Files+and+folders/Accepted+file+formats).

**Image** : `.avif`, `.bmp`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`

**Video** : `.mp4`, `.mkv`, `.mov`, `.ogv`, `.webm`

**Audio** : `.flac`, `.m4a`, `.mp3`, `.ogg`, `.wav`, `.webm`, `.3gp`

## Requirements

To use this plugin, you must install FFMPEG >= 0.9. Any newer version will work properly.

## Installation

To install this plugin, simply go to the officiel plugin store from Obsidian and search for **Ffmpeg Converter**.

You must install [FFMPEG](https://ffmpeg.org/download.html) first in order to use this plugin properly. Once downloaded, simply add the `bin` folder of FFMPEG to your environment variables and you're good to go !

## Rollback image in case of error

Not available yet

## Manually installing the plugin

Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/obsidian-ffmpeg-converter/`.

## Development

-   Clone this repo.
-   Make sure your NodeJS is at least v16 (`node --version`).
-   `pnpm i` to install dependencies.
-   `pnpm dev` to start compilation in watch mode.

> Please refer to the [official documentation](https://docs.obsidian.md/Home) for more details about obsidian plugins.
