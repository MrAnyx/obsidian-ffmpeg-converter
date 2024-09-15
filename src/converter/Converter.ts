import { FfmpegCommand } from "fluent-ffmpeg";
import File from "src/files/File";
import { SettingType } from "src/setting/SettingType";

export default abstract class Converter
{
    protected settings: SettingType;

    constructor(settings: SettingType)
    {
        this.settings = settings;
    }

    public abstract convert(inputFile: File, outputFile: File): Promise<void>;

    protected execute(inputFile: File, outputFile: File, command: FfmpegCommand)
    {
        return new Promise((resolve, reject) =>
        {
            command
                .addOption("-y")
                .input(inputFile.getFullPathWithExtension())
                .output(outputFile.getFullPathWithExtension())
                .on("end", resolve)
                .on("error", reject)
                .run();
        });
    }
}
