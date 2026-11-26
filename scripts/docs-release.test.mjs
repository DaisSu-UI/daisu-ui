import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtemp,
  mkdir,
  writeFile,
  readFile,
  readlink,
  rm,
  symlink,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  packSite,
  deploySite,
  rollbackSite,
  verifySite,
} from "./docs-release.mjs";

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), "daisu-docs-release-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const source = join(root, "source");
  await mkdir(source);
  for (const path of [
    "index.html",
    "content.json",
    "search-index.json",
    "llms.txt",
  ])
    await writeFile(join(source, path), path);
  return { root, source, deployment: join(root, "deployment") };
}
test("immutable releases, isolated previews and rollback reuse verified artifacts", async (t) => {
  const { root, source, deployment } = await fixture(t);
  const first = join(root, "first"),
    second = join(root, "second");
  await packSite({ source, output: first, id: "v1", version: "1" });
  await deploySite({ source: first, root: deployment, channel: "production" });
  await writeFile(join(source, "index.html"), "updated");
  await packSite({ source, output: second, id: "v2", version: "2" });
  await deploySite({
    source: second,
    root: deployment,
    channel: "previews/developer",
  });
  assert.equal(
    await readFile(join(deployment, "production/index.html"), "utf8"),
    "index.html",
  );
  await deploySite({ source: second, root: deployment, channel: "production" });
  assert.equal(
    await readFile(join(deployment, "production/index.html"), "utf8"),
    "updated",
  );
  await rollbackSite({ root: deployment, channel: "production", id: "v1" });
  assert.equal(await readlink(join(deployment, "production")), "releases/v1");
  assert.equal(
    await readFile(join(deployment, "previews/developer/index.html"), "utf8"),
    "updated",
  );
});
test("corrupt resources, conflicting IDs, symlinks and invalid channels cannot activate", async (t) => {
  const { root, source, deployment } = await fixture(t);
  const output = join(root, "site");
  await packSite({ source, output, id: "v1", version: "1" });
  await deploySite({ source: output, root: deployment, channel: "production" });
  const before = await readlink(join(deployment, "production"));
  await writeFile(join(deployment, "releases/v1/index.html"), "corrupt");
  await assert.rejects(
    rollbackSite({ root: deployment, channel: "production", id: "v1" }),
    /integrity/,
  );
  await assert.rejects(
    deploySite({ source: output, root: deployment, channel: "../elsewhere" }),
    /channel/,
  );
  await assert.rejects(
    rollbackSite({ root: deployment, channel: "production", id: "missing" }),
  );
  assert.equal(await readlink(join(deployment, "production")), before);
  await writeFile(join(output, "unexpected.txt"), "not in manifest");
  await assert.rejects(verifySite(output), /integrity/);
  await symlink("/etc/passwd", join(source, "outside.txt"));
  await assert.rejects(
    packSite({ source, output: join(root, "other"), id: "v2", version: "2" }),
    /symlink/,
  );
});
