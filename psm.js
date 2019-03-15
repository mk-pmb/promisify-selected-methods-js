/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var isFunc = require('is-fn'), pify = require('pify');

function promisifySelectedMethods(obj, mtdNames) {
  if (!obj) { return false; }
  var r, t = typeof mtdNames;
  if ((t === 'string') || (t === 'number')) {
    return pify(obj[mtdNames].bind(obj));
  }
  if (!mtdNames) { return false; }
  r = {};
  function p(s, d) { // source prop, dest prop
    var f = obj[s];
    if (!isFunc(f)) { return; }
    r[d] = pify(f.bind(obj));
  }
  if (Array.isArray(mtdNames)) {
    mtdNames.forEach(function (k) { p(k, k); });
    return r;
  }
  Object.keys(mtdNames).forEach(function (d) {
    var s = mtdNames[d];
    if (s === false) { return; }
    if (s === null) { return; }
    if (s === true) { s = d; }
    p(s, d);
  });
  return r;
}

module.exports = promisifySelectedMethods;