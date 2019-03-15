// -*- coding: utf-8, tab-width: 2 -*-

import 'p-fatal';
import test from 'p-tape';
import absdir from 'absdir';

// ¦mjsUsageDemo¦+
import nodeFs from 'fs';
import pifyMtds from '..';
// ¦mjsUsageDemo¦- importPkgName

import pkgMeta from '../package.json';

function wrapErr(err) { return { err }; }
function catchErr(pr) { return pr.then(null, wrapErr); }
// ¦mjsUsageDemo¦+

const readLinkPr = pifyMtds(nodeFs, 'readlink');
const promising = {
  ...pifyMtds(nodeFs, ['chmod', 'stat']),
  ...pifyMtds(nodeFs, {
    readFile: true,       // keep original name
    readDir: 'readdir',   // rename to camelCase
    ignored: null,
    alsoIgnored: false,
  }),
};
const expectedMethodNames = ['chmod',
  'readDir', 'readFile', 'stat'];
// ¦mjsUsageDemo¦-

const pkgDirPath = absdir(import.meta, '..');

test('check method names', async(t) => {
  t.deepEqual(Object.keys(promising).sort(), expectedMethodNames);
});

test('Can read package.json', async(t) => {
  t.plan(1);
  const path = pkgDirPath('package.json');
  const text = await promising.readFile(path, 'utf8');
  const data = JSON.parse(text);
  t.deepEqual(data.bugs, pkgMeta.bugs);
});

test('package.json is not a symlink', async(t) => {
  t.plan(1);
  const linkPr = readLinkPr(pkgDirPath('package.json'));
  const maybe = await catchErr(linkPr);
  t.deepEqual(maybe.err.code, 'EINVAL');
});

test('There is no spoon', async(t) => {
  t.plan(1);
  const spoonPr = promising.readDir(pkgDirPath('spoon'));
  const maybe = await catchErr(spoonPr);
  t.equal(maybe.err.code, 'ENOENT');
});












// console.info('+OK usage test passed.');
