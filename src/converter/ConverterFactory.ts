import { SettingType } from "src/setting/SettingType";
import AudioConverter from "./AudioConverter";
import Converter from "./Converter";
import ImageConverter from "./ImageConverter";
import VideoConverter from "./VideoConverter";
import { Type } from "src/formats";

export class ConverterFactory
{
    static createConverter(fileType: Type, ffmpegPath: string, settings: SettingType): Converter
    {
        switch (fileType)
        {
            case Type.image:
                return new ImageConverter(ffmpegPath, settings);
            case Type.video:
                return new VideoConverter(ffmpegPath, settings);
            case Type.audio:
                return new AudioConverter(ffmpegPath, settings);
            default:
                throw new Error("Unsupported file type");
        }
    }
}
