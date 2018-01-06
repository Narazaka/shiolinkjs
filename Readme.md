[ShiolinkJS - SHIOLINK interface for JavaScript](https://github.com/Narazaka/shiolinkjs)
=============================================

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
import { ShiolinkJS } from "shiolinkjs";
import * as ShioriJK from "shiorijk";

class ShioriEngine {
    load(dirpath: string) { return 1; }

    unload() { return 1; }

    request(request: ShioriJK.Message.Request) {
        return "SHIORI/3.0 400 Bad Request\r\n\r\n";
    }
}

const shiolink = new ShiolinkJS(new ShioriEngine());

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', async (chunk) => {
    const response = await shiolink.addChunk(chunk);
    if (response.length) process.stdout.write(response);
});
```

API Document
--------------------------

[https://narazaka.github.io/shiolinkjs/](https://narazaka.github.io/shiolinkjs/)

License
--------------------------

This is released under [MIT License](https://narazaka.net/license/MIT?2017).
