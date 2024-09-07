import ffmpeg from "fluent-ffmpeg";
import FileEntry from "./fileEntry";
import { Type } from "./formats";

export default class FfmpegUtility
{
    private ffmpegPath: string;
    private quality: number;
    private maxSize: number;

    constructor(ffmpegPath: string, quality: number, maxSize: number)
    {
        this.ffmpegPath = ffmpegPath;
        this.quality = quality;
        this.maxSize = maxSize;
    }

    private imageCommand()
    {
        // ffmpeg -i image.png -vf "scale='if(gt(iw,{maxSize}),{maxSize},-1)':'if(gt(ih,{maxSize}),{maxSize},-1)':force_original_aspect_ratio=decrease" -q:v {quality} output.webp
        return ffmpeg()
            .outputOptions([
                "-loop", "0",
                "-q:v", this.quality.toString(),
            ])
            .filterGraph({
                filter: "scale",
                options: {
                    w: `if(gt(iw,${this.maxSize}),${this.maxSize},-1)`,
                    h: `if(gt(ih,${this.maxSize}),${this.maxSize},-1)`,
                    force_original_aspect_ratio: "decrease"
                }
            })
        ;
    }

    private videoCommand()
    {
        // ffmpeg -i input.mp4 -vf "scale='min({maxSize},iw*min({maxSize}/iw,{maxSize}/ih))':'min({maxSize},ih*min({maxSize}/iw,{maxSize}/ih))':force_original_aspect_ratio=decrease" -b:v {videoBitrate} -b:a {audioBitrate} output.webm
        return ffmpeg()
            .videoBitrate("100k")
            .audioBitrate("20k")
            .filterGraph({
                filter: "scale",
                options: {
                    w: `if(gt(iw,${this.maxSize}),${this.maxSize},-1)`,
                    h: `if(gt(ih,${this.maxSize}),${this.maxSize},-1)`,
                    force_original_aspect_ratio: "decrease"
                }
            })
        ;
    }

    public async convert(inputFile: FileEntry, outputFile: FileEntry)
    {
        await new Promise((resolve, reject) =>
        {
            let command: ffmpeg.FfmpegCommand;

            switch (outputFile.type)
            {
                case Type.image:
                    command = this.imageCommand();
                    break;
                case Type.video:
                    command = this.videoCommand();
                    break;
                default:
                    reject(`Unknown format ${outputFile.extension}`);
                    return;
            }

            command
                .setFfmpegPath(this.ffmpegPath)
                .input(inputFile.getFullPathWithExtension())
                .output(outputFile.getFullPathWithExtension())
                .on("end", resolve)
                .on("error", reject)
                .run();
        });
    }
}
