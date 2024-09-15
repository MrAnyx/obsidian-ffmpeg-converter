import { SettingType } from "src/setting/SettingType";
import AudioConverter from "./AudioConverter";
import Converter from "./Converter";
import ImageConverter from "./ImageConverter";
import VideoConverter from "./VideoConverter";
import { Type } from "src/formats";

export class ConverterFactory
{
    static createConverter(fileType: Type, settings: SettingType): Converter
    {
        switch (fileType)
        {
            case Type.image:
                return new ImageConverter(settings);
            case Type.video:
                return new VideoConverter(settings);
            case Type.audio:
                return new AudioConverter(settings);
            default:
                throw new Error("Unsupported file type");
        }
    }
}
