import { App } from "obsidian";
import Loader from "./Loader";
import { Type } from "src/formats";

export default class ImageLoader extends Loader
{
    constructor(app: App, extensions: string[])
    {
        super(app, Type.image, extensions);
    }
}
