# Obsidian FFMPEG Converter

Optimize your vault space by converting your images, video and audio into a more compact format or with reduced quality.

Most users can redice the size of their vault by 70%.

The conversion of your assets is optimized thanks to FFMPEG, a powerful open-source tool.

> ⚠️ Disclaimer : You should always backup your vault before using this plugin.

## Supported formated

### Image

-   Avif
-   Bmp
-   Png
-   Jpg
-   Jpeg
-   Gif
-   Webp

### Video

-   Mp4
-   Mkv
-   Mov
-   Webm

### Audio

Not available yet

## Requirements

To use this plugin, you must install FFMPEG >= 0.9. Any newer version will work properly.

## Installation

To install this plugin, simply go to the officiel plugin store from Obsidian and search for **Ffmpeg Converter**.

You must install [FFMPEG](https://ffmpeg.org/download.html) first in order to use this plugin properly. Once downloaded, simply add the `bin` folder of FFMPEG to your environment variables and you're good to go !

## Manually installing the plugin

Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/obsidian-ffmpeg-converter/`.

## Development

-   Clone this repo.
-   Make sure your NodeJS is at least v16 (`node --version`).
-   `pnpm i` to install dependencies.
-   `pnpm dev` to start compilation in watch mode.

> Please refer to the [official documentation](https://docs.obsidian.md/Home) for more details about obsidian plugins.
