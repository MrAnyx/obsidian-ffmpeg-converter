import FfmpegManager from "src/utils/FfmpegManager";
import Converter from "./Converter";
import File from "src/files/File";

export default class VideoConverter extends Converter
{
    public async convert(inputFile: File, outputFile: File)
    {
        const command = FfmpegManager.create()
            .videoBitrate(`${this.settings.videoBitrateForVideo}k`)
            .audioBitrate(`${this.settings.audioBitrateForVideo}k`)
            .outputFPS(this.settings.videoFps)
            .filterGraph({
                filter: "scale",
                options: {
                    w: `if(gt(iw,${this.settings.videoMaxSize}),${this.settings.videoMaxSize},-1)`,
                    h: `if(gt(ih,${this.settings.videoMaxSize}),${this.settings.videoMaxSize},-1)`,
                    force_original_aspect_ratio: "decrease"
                }
            });

        await this.execute(inputFile, outputFile, command);
    }
}
