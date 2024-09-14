import { lookpath } from "lookpath";
import fs from "fs";

export const findPath = async (envName: string, fallbackPath: string): Promise<string | undefined> =>
{
    const pathFromEnv = await lookpath(envName);
    let path: string | undefined = undefined;

    if (pathFromEnv)
    {
        path = pathFromEnv;
    }
    else if (fs.existsSync(fallbackPath))
    {
        path = fallbackPath;
    }

    return path;
};
