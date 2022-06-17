import * as Compress from "../Compress/Compress.js";
import { join } from "node:path";

export const package_ = async ({
  highestCompression = false,
  cwd = process.cwd(),
} = {}) => {
  const outFile = join(cwd, `extension.tar.br`);
  if (highestCompression) {
    await Compress.compress(cwd, outFile);
  } else {
    await Compress.compressFasterButWithLowerCompression(cwd, outFile);
  }
};
