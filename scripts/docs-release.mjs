import {
  cp,
  mkdir,
  readFile,
  readdir,
  lstat,
  rename,
  symlink,
  unlink,
  access,
  rm,
} from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import { resolve, dirname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const validId = (id) =>
  typeof id === "string" &&
  /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,100}$/.test(id) &&
  !id.includes("..");
async function exists(path) {
  try {
    await access(path);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}
async function filesIn(root) {
  const result = Object.create(null);
  async function visit(directory) {
    for (const item of (await readdir(directory)).sort()) {
      const path = resolve(directory, item),
        stat = await lstat(path);
      if (stat.isSymbolicLink())
        throw Error("Site releases cannot contain symlinks");
      if (stat.isDirectory()) await visit(path);
      else if (stat.isFile()) {
        const name = relative(root, path).split(sep).join("/");
        if (name !== "site-manifest.json")
          result[name] = createHash("sha256")
            .update(await readFile(path))
            .digest("hex");
      } else throw Error("Unsupported site file");
    }
  }
  await visit(root);
  return result;
}
export async function verifySite(directory) {
  if ((await lstat(directory)).isSymbolicLink())
    throw Error("Release directory cannot be a symlink");
  const manifest = JSON.parse(
    await readFile(resolve(directory, "site-manifest.json"), "utf8"),
  );
  if (
    manifest.schemaVersion !== 1 ||
    !validId(manifest.id) ||
    typeof manifest.version !== "string" ||
    !manifest.files ||
    Array.isArray(manifest.files)
  )
    throw Error("Invalid site manifest");
  const actual = await filesIn(directory);
  for (const required of [
    "index.html",
    "content.json",
    "search-index.json",
    "llms.txt",
  ])
    if (!actual[required]) throw Error(`Missing site resource: ${required}`);
  if (
    JSON.stringify(Object.entries(actual).sort()) !==
    JSON.stringify(Object.entries(manifest.files).sort())
  )
    throw Error("Site resource integrity check failed");
  return manifest;
}
export async function packSite({ source, output, id, version, commit = "" }) {
  source = resolve(source);
  output = resolve(output);
  if (
    !validId(id) ||
    source === output ||
    source.startsWith(output + sep) ||
    output.startsWith(source + sep)
  )
    throw Error("Invalid release ID or overlapping paths");
  const files = await filesIn(source);
  const manifest = { schemaVersion: 1, id, version, commit, files };
  if (await exists(output)) {
    const previous = await verifySite(output);
    if (JSON.stringify(previous) !== JSON.stringify(manifest))
      throw Error(
        "Release output already exists with different contents; use a new ID and output directory",
      );
    return previous;
  }
  await mkdir(dirname(output), { recursive: true });
  await cp(source, output, {
    recursive: true,
    errorOnExist: true,
    force: false,
  });
  const { writeFile } = await import("node:fs/promises");
  await writeFile(
    resolve(output, "site-manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );
  return verifySite(output);
}
function channelPath(root, channel) {
  if (
    channel !== "production" &&
    !/^previews\/[a-zA-Z0-9][a-zA-Z0-9_-]{0,100}$/.test(channel)
  )
    throw Error("Invalid site channel");
  return resolve(root, channel);
}
async function activate(root, channel, id) {
  if (!validId(id)) throw Error("Invalid release ID");
  const release = resolve(root, "releases", id);
  const manifest = await verifySite(release);
  if (manifest.id !== id) throw Error("Release ID does not match directory");
  const destination = channelPath(root, channel);
  await mkdir(dirname(destination), { recursive: true });
  const temporary = resolve(dirname(destination), ".activate-" + randomUUID());
  await symlink(relative(dirname(destination), release), temporary, "dir");
  try {
    await rename(temporary, destination);
  } catch (error) {
    await unlink(temporary);
    throw error;
  }
  return manifest;
}
async function deployUnlocked({ source, root, channel }) {
  root = resolve(root);
  channelPath(root, channel);
  const manifest = await verifySite(resolve(source));
  const release = resolve(root, "releases", manifest.id);
  if (await exists(release)) {
    const old = await verifySite(release);
    if (JSON.stringify(old) !== JSON.stringify(manifest))
      throw Error("Immutable release ID already has different contents");
  } else {
    await mkdir(dirname(release), { recursive: true });
    const staging = resolve(root, ".incoming-" + randomUUID());
    await cp(source, staging, {
      recursive: true,
      errorOnExist: true,
      force: false,
    });
    await verifySite(staging);
    await rename(staging, release);
  }
  return activate(root, channel, manifest.id);
}
async function withReleaseLock(root, action) {
  await mkdir(root, { recursive: true });
  const lock = resolve(root, ".release-lock");
  let acquired = false;
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      await mkdir(lock);
      acquired = true;
      break;
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
  if (!acquired)
    throw Error(
      "Another documentation deployment holds .release-lock; retry after it finishes",
    );
  try {
    return await action();
  } finally {
    await rm(lock, { recursive: true });
  }
}
export async function deploySite(options) {
  return withReleaseLock(resolve(options.root), () => deployUnlocked(options));
}
export async function rollbackSite({ root, channel, id }) {
  return withReleaseLock(resolve(root), () =>
    activate(resolve(root), channel, id),
  );
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    options: Object.fromEntries(
      ["source", "output", "id", "version", "commit", "root", "channel"].map(
        (name) => [name, { type: "string" }],
      ),
    ),
  });
  const command = positionals[0];
  try {
    let result;
    if (command === "pack")
      result = await packSite({
        source: values.source || "apps/docs/dist",
        output: values.output || "artifacts/docs-site",
        id: values.id,
        version:
          values.version ||
          JSON.parse(await readFile("packages/daisu-ui/package.json", "utf8"))
            .version,
        commit: values.commit,
      });
    else if (command === "verify")
      result = await verifySite(values.source || "artifacts/docs-site");
    else if (command === "deploy") result = await deploySite(values);
    else if (command === "rollback") result = await rollbackSite(values);
    else throw Error("Use pack, verify, deploy or rollback");
    console.log(
      `Documentation release ${result.id}: ${command} passed (${Object.keys(result.files).length} files)`,
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
