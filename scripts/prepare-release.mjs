import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const tag = process.env.GITHUB_REF_NAME;
const repo = process.env.GITHUB_REPOSITORY;
const publicKey = process.env.TAURI_UPDATER_PUBLIC_KEY;

if (!tag || !/^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(tag)) {
  throw new Error("Release requires a semver Git tag such as v0.1.0");
}
if (!repo || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo)) {
  throw new Error("GITHUB_REPOSITORY must be owner/repository");
}
if (!publicKey || !publicKey.trim()) {
  throw new Error("Set the TAURI_UPDATER_PUBLIC_KEY GitHub Actions variable");
}

const version = tag.slice(1);
const packageFile = JSON.parse(readFileSync("package.json", "utf8"));
packageFile.version = version;
writeFileSync("package.json", JSON.stringify(packageFile, null, 2) + "\n");

const cargo = "src-tauri/Cargo.toml";
const manifest = readFileSync(cargo, "utf8");
writeFileSync(cargo, manifest.replace(/^(version\s*=\s*")[^"]+(")/m, `$1${version}$2`));

const release = {
  version,
  bundle: { createUpdaterArtifacts: true },
  plugins: {
    updater: {
      pubkey: publicKey.trim(),
      endpoints: [`https://github.com/${repo}/releases/latest/download/latest.json`],
      windows: { installMode: "passive" }
    }
  }
};
writeFileSync("src-tauri/tauri.release.conf.json", JSON.stringify(release, null, 2) + "\n");
console.log(`Prepared signed release ${tag} for ${repo}`);
