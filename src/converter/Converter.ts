import { FfmpegCommand } from "fluent-ffmpeg";
import File from "src/files/File";
import { SettingType } from "src/setting/SettingType";

export default abstract class Converter
{
    private ffmpegPath: string;
    protected settings: SettingType;

    constructor(ffmpegPath: string, settings: SettingType)
    {
        this.ffmpegPath = ffmpegPath;
        this.settings = settings;
    }

    public abstract convert(inputFile: File, outputFile: File): Promise<void>;

    protected execute(inputFile: File, outputFile: File, command: FfmpegCommand)
    {
        return new Promise((resolve, reject) =>
        {
            command
                .input(inputFile.getFullPathWithExtension())
                .output(outputFile.getFullPathWithExtension())
                .on("end", resolve)
                .on("error", reject)
                .run();
        });
    }
}
