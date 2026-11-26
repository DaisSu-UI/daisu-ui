import { readdir, readFile, lstat } from "node:fs/promises";
import { resolve, relative } from "node:path";
import { zipSync } from "fflate";

export async function starterArchive(directory) {
  const files = {};
  const excluded = new Set([
    "node_modules",
    ".git",
    "dist",
    "dist-web",
    "h5-dist",
    ".dart_tool",
    ".flutter-plugins-dependencies",
    ".flutter-plugins",
    ".packages",
    "build",
  ]);
  async function visit(path) {
    for (const item of await readdir(path, { withFileTypes: true })) {
      if (excluded.has(item.name)) continue;
      const target = resolve(path, item.name);
      if ((await lstat(target)).isSymbolicLink())
        throw Error("Starter archive must not contain symlinks");
      if (item.isDirectory()) await visit(target);
      else if (item.isFile())
        files[relative(directory, target).replaceAll("\\", "/")] = [
          new Uint8Array(await readFile(target)),
          { mtime: new Date("2026-01-01T00:00:00Z") },
        ];
    }
  }
  await visit(directory);
  if (!files["package.json"] && !files["pubspec.yaml"])
    throw Error("Starter metadata is missing");
  return zipSync(files, { level: 6 });
}
