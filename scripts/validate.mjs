#!/usr/bin/env node
/**
 * Checks this Cursor kit. No dependencies: node scripts/validate.mjs
 * JSON files parse, the plugin manifest has its fields, the MCP URL is https without a trailing slash,
 * no literal credentials, every SKILL.md has name (matching its folder) and description, the rule has frontmatter.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const err = (m) => errors.push(m);
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => {
  try {
    return JSON.parse(read(p));
  } catch (e) {
    err(`${p}: ${e.message}`);
    return null;
  }
};
const SECRET = /(sk_live_|sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{30,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|Bearer\s+(?!YOUR_API_KEY)[A-Za-z0-9._-]{20,})/;
const LOCAL_PATH = /(\/Users\/[A-Za-z0-9._-]+|\/home\/[A-Za-z0-9._-]+|C:\\Users\\)/;

const manifest = json('.cursor-plugin/plugin.json');
if (manifest) {
  for (const k of ['name', 'description', 'version', 'author', 'homepage', 'repository', 'license', 'logo']) if (!manifest[k]) err(`plugin.json: ${k} is required`);
  if (manifest.logo && !fs.existsSync(path.join(root, manifest.logo))) err(`plugin.json: logo ${manifest.logo} not found`);
  if (manifest.version && !/^\d+\.\d+\.\d+$/.test(manifest.version)) err('plugin.json: version must be semver');
}
for (const f of ['mcp.json', '.mcp.json']) {
  const cfg = json(f);
  const servers = cfg?.mcpServers ?? {};
  if (Object.keys(servers).length === 0) err(`${f}: mcpServers must list a server`);
  for (const [name, s] of Object.entries(servers)) {
    try {
      const u = new URL(s.url);
      if (u.protocol !== 'https:') err(`${f}: ${name}.url must be https`);
      if (u.pathname !== '/' && s.url.endsWith('/')) err(`${f}: ${name}.url must not end with a slash`);
    } catch {
      err(`${f}: ${name}.url is not a URL`);
    }
  }
}
const skills = path.join(root, 'skills');
for (const dir of fs.readdirSync(skills)) {
  const file = `skills/${dir}/SKILL.md`;
  if (!fs.existsSync(path.join(root, file))) { err(`${file}: missing`); continue; }
  const fm = /^---\n([\s\S]*?)\n---\n/.exec(read(file));
  if (!fm) { err(`${file}: frontmatter missing`); continue; }
  const name = /^name:\s*(.+)$/m.exec(fm[1])?.[1].trim();
  if (name !== dir) err(`${file}: name "${name}" must match the folder "${dir}"`);
  if (!/^description:\s*\S/m.test(fm[1])) err(`${file}: description is required`);
}
for (const f of fs.readdirSync(path.join(root, 'rules'))) {
  if (!/^---\n(?:[\s\S]*?\n)?description:\s*\S[\s\S]*?\n---\n/.test(read(`rules/${f}`))) err(`rules/${f}: needs frontmatter with a description`);
}
for (const f of ['README.md', 'LICENSE', 'examples/prompts.md']) if (!fs.existsSync(path.join(root, f))) err(`${f}: missing`);
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.name === '.git' ? [] : e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
for (const file of walk(root)) {
  const rel = path.relative(root, file);
  if (/\.(md|mdc|json|mjs)$/.test(rel) && rel !== 'scripts/validate.mjs') {
    const t = fs.readFileSync(file, 'utf8');
    if (SECRET.test(t)) err(`${rel}: looks like a credential`);
    if (LOCAL_PATH.test(t)) err(`${rel}: contains a local filesystem path`);
  }
}
for (const e of errors) console.error(`error: ${e}`);
if (errors.length === 0) console.log('ok: plugin.json, mcp.json, .mcp.json, skills, rule');
process.exit(errors.length ? 1 : 0);
