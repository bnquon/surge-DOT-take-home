import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const icon = await readFile(new URL("../src/app/icon.svg", import.meta.url));
const artwork = await readFile(new URL("../assets/opengraph.svg", import.meta.url));

await sharp(icon)
  .resize(180, 180)
  .png()
  .toFile(new URL("../src/app/apple-icon.png", import.meta.url).pathname);
await sharp(artwork)
  .png()
  .toFile(new URL("../src/app/opengraph-image.png", import.meta.url).pathname);

// Package PNG icons in an ICO directory for browsers that request favicon.ico.
const sizes = [16, 32, 48];
const images = await Promise.all(
  sizes.map((size) => sharp(icon).resize(size, size).png().toBuffer()),
);
const directory = Buffer.alloc(6 + sizes.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(sizes.length, 4);
let offset = directory.length;

for (const [index, image] of images.entries()) {
  const entry = 6 + index * 16;
  directory[entry] = sizes[index];
  directory[entry + 1] = sizes[index];
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(image.length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += image.length;
}

await writeFile(
  new URL("../src/app/favicon.ico", import.meta.url),
  Buffer.concat([directory, ...images]),
);
