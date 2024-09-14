import { customAlphabet } from "nanoid/non-secure"; // No need to add extra layer of security ad it is only used for file names

export const generateUniqueId = (length: number) =>
{
    // Unique must not contains "_" because it is used to separate the file name, the extension and the unique id.
    const nanoid = customAlphabet("0123456789abcdefghijklmnopkrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
    return nanoid(length);
};
