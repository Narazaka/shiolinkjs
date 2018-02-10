[ShiolinkJS - SHIOLINK interface for JavaScript](https://github.com/Narazaka/shiolinkjs)
=============================================

[![npm](https://img.shields.io/npm/v/shiolinkjs.svg)](https://www.npmjs.com/package/shiolinkjs)
[![npm license](https://img.shields.io/npm/l/shiolinkjs.svg)](https://www.npmjs.com/package/shiolinkjs)
[![npm download total](https://img.shields.io/npm/dt/shiolinkjs.svg)](https://www.npmjs.com/package/shiolinkjs)
[![npm download by month](https://img.shields.io/npm/dm/shiolinkjs.svg)](https://www.npmjs.com/package/shiolinkjs)

[![Dependency Status](https://david-dm.org/Narazaka/shiolinkjs/status.svg)](https://david-dm.org/Narazaka/shiolinkjs)
[![devDependency Status](https://david-dm.org/Narazaka/shiolinkjs/dev-status.svg)](https://david-dm.org/Narazaka/shiolinkjs?type=dev)
[![Travis Build Status](https://travis-ci.org/Narazaka/shiolinkjs.svg?branch=master)](https://travis-ci.org/Narazaka/shiolinkjs)
[![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/Narazaka/shiolinkjs?svg=true&branch=master)](https://ci.appveyor.com/project/Narazaka/shiolinkjs)
[![codecov.io](https://codecov.io/github/Narazaka/shiolinkjs/coverage.svg?branch=master)](https://codecov.io/github/Narazaka/shiolinkjs?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/203584ecb10d4dc29105951014b92bd1)](https://www.codacy.com/app/narazaka/shiolinkjs?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Narazaka/shiolinkjs&amp;utm_campaign=Badge_Grade)
[![Greenkeeper badge](https://badges.greenkeeper.io/Narazaka/shiolinkjs.svg)](https://greenkeeper.io/)

Installation
--------------------------

```
npm install shiolinkjs
```

What is ShiolinkJS ?
--------------------------

ShioriJK is a library for using SHIOLINK.dll for making SHIORI subsystem.

Synopsys
--------------------------

```typescript
import * as ShioriJK from "shiorijk";

class ShioriEngine {
    load(dirpath: string) { return 1; }

    unload() { return 1; }

    request(request: ShioriJK.Message.Request) {
        return "SHIORI/3.0 400 Bad Request\r\n\r\n";
    }
}

export default new ShioriEngine();
```

```bash
shiolinkjs ./shioriEngine.js
```

API Document
--------------------------

[https://narazaka.github.io/shiolinkjs/](https://narazaka.github.io/shiolinkjs/)

License
--------------------------

This is released under [MIT License](https://narazaka.net/license/MIT?2017).
