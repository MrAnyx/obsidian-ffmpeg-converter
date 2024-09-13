import ffmpeg from "fluent-ffmpeg";
import FileEntry from "./fileEntry";
import { Type } from "./formats";

export default class FfmpegUtility
{
    private ffmpegPath: string;

    private imageQuality: number;
    private imageMaxSize: number;

    private videoBitrateForVideo: number;
    private audioBitrateForVideo: number;
    private videoMaxSize: number;

    private audioBitrateForAudio: number;

    constructor(ffmpegPath: string, imageQuality: number, imageMaxSize: number, videoBitrateForVideo: number, audioBitrateForVideo: number, videoMaxSize: number, audioBitrateForAudio: number)
    {
        this.ffmpegPath = ffmpegPath;

        this.imageQuality = imageQuality;
        this.imageMaxSize = imageMaxSize;

        this.videoBitrateForVideo = videoBitrateForVideo;
        this.audioBitrateForVideo = audioBitrateForVideo;
        this.videoMaxSize = videoMaxSize;

        this.audioBitrateForAudio = audioBitrateForAudio;
    }

    private imageCommand()
    {
        // ffmpeg -i image.png -vf "scale='if(gt(iw,{maxSize}),{maxSize},-1)':'if(gt(ih,{maxSize}),{maxSize},-1)':force_original_aspect_ratio=decrease" -q:v {quality} output.webp
        return ffmpeg()
            .outputOptions([
                "-q:v", this.imageQuality.toString(),
                "-loop", "0" // TODO changer et utiliser la méthode loop(0)
            ])
            .filterGraph({
                filter: "scale",
                options: {
                    w: `if(gt(iw,${this.imageMaxSize}),${this.imageMaxSize},-1)`,
                    h: `if(gt(ih,${this.imageMaxSize}),${this.imageMaxSize},-1)`,
                    force_original_aspect_ratio: "decrease"
                }
            })
        ;
    }

    private videoCommand()
    {
        // ffmpeg -i input.mp4 -vf "scale='min({maxSize},iw*min({maxSize}/iw,{maxSize}/ih))':'min({maxSize},ih*min({maxSize}/iw,{maxSize}/ih))':force_original_aspect_ratio=decrease" -b:v {videoBitrate} -b:a {audioBitrate} output.webm
        return ffmpeg()
            .videoBitrate(`${this.videoBitrateForVideo}k`)
            .audioBitrate(`${this.audioBitrateForVideo}k`)
            .filterGraph({
                filter: "scale",
                options: {
                    w: `if(gt(iw,${this.videoMaxSize}),${this.videoMaxSize},-1)`,
                    h: `if(gt(ih,${this.videoMaxSize}),${this.videoMaxSize},-1)`,
                    force_original_aspect_ratio: "decrease"
                }
            })
        ;
    }

    private audioCommand()
    {
        // ffmpeg -i input.mp3  -b:a {audioBitrate} output.wav
        return ffmpeg()
            .audioBitrate(`${this.audioBitrateForAudio}k`)
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
                case Type.audio:
                    command = this.audioCommand();
                    break;
                default:
                    reject(`Unknown format ${outputFile.extension}`);
                    return;
            }

            command
                .setFfmpegPath(this.ffmpegPath)
                .addOptions([
                    "-y" // To overwrite output file if it exist
                ])
                .input(inputFile.getFullPathWithExtension())
                .output(outputFile.getFullPathWithExtension())
                .on("end", resolve)
                .on("error", reject)
                .run();
        });
    }
}
