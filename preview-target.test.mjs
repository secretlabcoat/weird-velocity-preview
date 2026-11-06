import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const read = name => readFileSync(new URL(name, import.meta.url), 'utf8');
test('preview editor cannot accidentally target the production repository or main branch', () => {
  const editor = read('./devbot.js');
  assert.match(editor, /const REPO = "secretlabcoat\/weird-velocity-preview"/);
  assert.match(editor, /const BRANCH = "preview"/);
  assert.doesNotMatch(editor, /secretlabcoat\/weird-velocity["/]|ref=main|branch: "main"/);
  assert.equal((editor.match(/encodeURIComponent\(BRANCH\)/g) || []).length, 2);
  assert.match(editor, /branch: BRANCH/);
  assert.match(editor, /repos\/\$\{REPO\}\/pages\/builds\/latest/);
  assert.doesNotMatch(editor, /"wv\.dev\./);
  assert.match(read('./save.js'), /weird-velocity-preview-larry-save-test-v1/);
});
