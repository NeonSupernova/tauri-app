import { readFileSync, writeFileSync } from "node:fs";

const tag = process.env.GITHUB_REF_NAME;
const repo = process.env.GITHUB_REPOSITORY;
const publicKey = process.env.TAURI_UPDATER_PUBLIC_KEY?.trim();
// This template has one stable channel. Prereleases need a separate endpoint.
if (!tag || !/^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(tag)) {
  throw new Error("Release requires a stable semver tag such as v0.1.0");
}
if (!repo || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo)) {
  throw new Error("GITHUB_REPOSITORY must be owner/repository");
}
if (!publicKey) throw new Error("Set the TAURI_UPDATER_PUBLIC_KEY GitHub Actions variable");
const version = tag.slice(1);
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const workspace = readFileSync("Cargo.toml", "utf8").split("[workspace.package]")[1]?.split(/\n\[/)[0];
const rustVersion = workspace?.match(/^version\s*=\s*"([^"]+)"/m)?.[1];
if (pkg.version !== version || rustVersion !== version) {
  throw new Error("Commit matching package.json and workspace.package versions before tagging");
}
const release = {
  version,
  bundle: { createUpdaterArtifacts: true },
  plugins: { updater: {
    pubkey: publicKey,
    endpoints: [`https://github.com/${repo}/releases/latest/download/latest.json`],
    windows: { installMode: "passive" }
  }}
};
writeFileSync("src-tauri/tauri.release.conf.json", JSON.stringify(release, null, 2) + "\n");
console.log(`Prepared signed release ${tag} for ${repo}`);
