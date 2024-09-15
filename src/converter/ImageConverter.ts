import Converter from "./Converter";
import File from "src/files/File";
import FfmpegManager from "src/utils/FfmpegManager";

export default class ImageConverter extends Converter
{
    public async convert(inputFile: File, outputFile: File)
    {
        const command = FfmpegManager.create()
            .outputOptions([
                "-q:v", this.settings.imageQuality.toString(),
                "-loop", "0"
            ])
            .filterGraph({
                filter: "scale",
                options: {
                    w: `if(gt(iw,${this.settings.imageMaxSize}),${this.settings.imageMaxSize},-1)`,
                    h: `if(gt(ih,${this.settings.imageMaxSize}),${this.settings.imageMaxSize},-1)`,
                    force_original_aspect_ratio: "decrease"
                }
            });

        await this.execute(inputFile, outputFile, command);
    }
}
