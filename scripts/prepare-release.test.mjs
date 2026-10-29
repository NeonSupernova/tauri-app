import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
const script = resolve("scripts/prepare-release.mjs");
function run(overrides = {}, packageVersion = "0.1.0", rustVersion = "0.1.0") {
  const cwd = mkdtempSync(join(tmpdir(), "release-test-"));
  try {
    mkdirSync(join(cwd, "src-tauri"));
    writeFileSync(join(cwd, "package.json"), JSON.stringify({version:packageVersion}));
    writeFileSync(join(cwd, "Cargo.toml"), '[workspace.package]\nversion = "' + rustVersion + '"\n');
    const before = readFileSync(join(cwd, "package.json"), "utf8");
    const result = spawnSync(process.execPath,[script],{cwd,encoding:"utf8",env:{...process.env,GITHUB_REF_NAME:"v0.1.0",GITHUB_REPOSITORY:"owner/repo",TAURI_UPDATER_PUBLIC_KEY:"test-public-key",...overrides}});
    const file = join(cwd,"src-tauri/tauri.release.conf.json");
    return {status:result.status,stderr:result.stderr,config:existsSync(file)?JSON.parse(readFileSync(file,"utf8")):null,unchanged:before===readFileSync(join(cwd,"package.json"),"utf8")};
  } finally { rmSync(cwd,{recursive:true,force:true}); }
}
test("matching stable tag creates signing overlay without mutating manifests",()=>{
  const result=run();
  assert.equal(result.status,0,result.stderr);
  assert.equal(result.config.version,"0.1.0");
  assert.equal(result.config.bundle.createUpdaterArtifacts,true);
  assert.deepEqual(result.config.plugins.updater.endpoints,["https://github.com/owner/repo/releases/latest/download/latest.json"]);
  assert.equal(result.unchanged,true);
});
test("invalid and prerelease tags cannot publish to stable",()=>{
  for(const tag of ["v01.0.0","v1.0","v1.0.0-rc.1","v1.0.0+build","latest",""]){
    const result=run({GITHUB_REF_NAME:tag});assert.notEqual(result.status,0);assert.equal(result.config,null);
  }
});
test("missing signing settings and malformed repositories fail before writing",()=>{
  for(const env of [{TAURI_UPDATER_PUBLIC_KEY:" "},{GITHUB_REPOSITORY:"owner/repo/extra"},{GITHUB_REPOSITORY:""}]){
    const result=run(env);assert.notEqual(result.status,0);assert.equal(result.config,null);
  }
});
test("both committed versions must match the release tag",()=>{
  for(const versions of [["0.2.0","0.1.0"],["0.1.0","0.2.0"]]){
    const result=run({},...versions);assert.notEqual(result.status,0);assert.equal(result.config,null);assert.equal(result.unchanged,true);
  }
});
