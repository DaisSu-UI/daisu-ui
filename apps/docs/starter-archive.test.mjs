import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { unzipSync, strFromU8 } from "fflate";
import { starterArchive } from "./starter-archive.mjs";
test("starter downloads contain maintained sources and exclude local dependency/cache paths", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "daisu-starter-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeFile(join(root, "pubspec.yaml"), "name: example");
  await writeFile(
    join(root, ".flutter-plugins-dependencies"),
    "/home/local/.pub-cache/private-path",
  );
  await mkdir(join(root, ".dart_tool"));
  await writeFile(join(root, ".dart_tool/package_config.json"), "machine path");
  await mkdir(join(root, "lib"));
  await writeFile(join(root, "lib/main.dart"), "void main() {}");
  const files = unzipSync(await starterArchive(root));
  assert.deepEqual(Object.keys(files).sort(), [
    "lib/main.dart",
    "pubspec.yaml",
  ]);
  assert.equal(strFromU8(files["lib/main.dart"]), "void main() {}");
});
