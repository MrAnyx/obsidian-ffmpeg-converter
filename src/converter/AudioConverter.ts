import FfmpegManager from "src/utils/FfmpegManager";
import Converter from "./Converter";
import File from "src/files/File";

export default class AudioConverter extends Converter
{
    public async convert(inputFile: File, outputFile: File)
    {
        const command = FfmpegManager.create()
            .audioBitrate(`${this.settings.audioBitrateForAudio}k`);

        await this.execute(inputFile, outputFile, command);
    }
}
