import { App } from "obsidian";
import Loader from "./Loader";
import { TemporaryExtensions, Type } from "src/formats";

export default class TemporaryLoader extends Loader
{
    constructor(app: App)
    {
        super(app, Type.unknown, TemporaryExtensions.tmp);
    }
}
