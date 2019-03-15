
<!--#echo json="package.json" key="name" underline="=" -->
promisify-selected-methods
==========================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Given an object with methods and a list of method names, return a new object
with promisified bound versions of those methods.
<!--/#echo -->



API
---

This module exports one function with two modes:

### prFunc = promisifySelectedMethods(obj, oneMethodName)

`obj` can be anything. If it's false-y, `prFunc` will be `false`.

`oneMethodName` can be:
* false-y, then `prFunc` will be `false`.
* a string or number, then a method of that name is looked up in `obj`,
  bound to `obj`, promisified and returned as `prFunc`.


### prFuncs = promisifySelectedMethods(obj, methodNames)

`obj` can be anything. If it's false-y, `prFuncs` will be `false`.

`prFuncs` will be a dictionary object if you provide proper `methodNames`,
i.e. either

* an array, then keys in `prFuncs` will refer to the same-named method
  in `obj`, no magic.
* a dictionary object, mapping desired method names (keys in `prFuncs`)
  to the callback methods' name (key in `obj`). Special values:
  * `true`: Use same method name.
  * `null`, `false`: Ignore this entry.

`methodNames` that point to something that doesn't look like a function,
will be ignored.



Usage
-----

from [test/usage.js](test/usage.js):

<!--#include file="test/usage.mjs" transform="mjsUsageDemo1802" -->
<!--#verbatim lncnt="17" -->
```javascript
import nodeFs from 'fs';
import pifyMtds from 'promisify-selected-methods';

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
```
<!--/include-->



<!--#toc stop="scan" -->



Known issues
------------

* Needs more/better tests and docs.




&nbsp;


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
