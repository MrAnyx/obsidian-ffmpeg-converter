import Ffmpeg, { FfmpegCommand } from "fluent-ffmpeg";

export default class FfmpegManager
{
    static ffmpegPath: string;
    static ffprobePath: string;

    static initialize(ffmpegPath: string, ffprobePath: string)
    {
        if (ffmpegPath)
        {
            FfmpegManager.ffmpegPath = ffmpegPath;
        }
        if (ffprobePath)
        {
            FfmpegManager.ffprobePath = ffprobePath;
        }
    }

    static create(): FfmpegCommand
    {
        return Ffmpeg()
            .setFfmpegPath(FfmpegManager.ffmpegPath)
            .setFfprobePath(FfmpegManager.ffprobePath);
    }
}
