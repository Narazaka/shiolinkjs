/* (C) 2017 Narazaka : Licensed under The MIT License - https://narazaka.net/license/MIT?2017 */
import * as ShioriJK from "shiorijk";

/**
 * Engine
 */
export interface Engine {
    /**
     * SHIORI(SHIOLINK) load
     * @param dllpath SHIORI DLL's path
     */
    load(dllpath: string): number | Promise<number>;

    /**
     * SHIORI(SHIOLINK) request
     * @param request SHIORI Request Message (can treat as string)
     * @return SHIORI Response (return value or Promise resolved value must be able to treat as string)
     */
    request(request: ShioriJK.Message.Request):
        string | ShioriJK.Message.Response | Promise<string> | Promise<ShioriJK.Message.Response>;

    /**
     * SHIORI(SHIOLINK) unload
     */
    unload(): number | Promise<number>;
}

/**
 * SHIOLINK protocol interface.
 *
 * This parses SHIOLINK protocol and passes data to basic "SHIORI engine" and response to out.
 */
export class ShiolinkJS {
    /** engine */
    engine: Engine;

    /** state */
    state: "shiolink" | "request";

    /** request parser */
    private requestParser: ShioriJK.Shiori.Request.Parser;

    /**
     * @param engine SHIORI engine
     */
    constructor(engine: Engine) {
        this.engine = engine;
        this.requestParser = new ShioriJK.Shiori.Request.Parser();
        this.state = "shiolink";
    }

    /**
     * append SHIOLINK protocol chunk
     * @param chunk SHIOLINK protocol chunk
     * @return addLine()'s result
     */
    async addChunk(chunk: string) {
        const lines = chunk.split(/\r\n/);
        if (chunk.match(/\r\n$/)) {
            lines.pop();
        }

        return await this.addLines(lines);
    }

    /**
     * append SHIOLINK protocol chunk lines
     * @param lines SHIOLINK protocol chunk lines separated by \r\n
     * @return Array of addLine()'s result. It may be empty string.
     */
    async addLines(lines: string[]) {
        const results = [];
        for (const line of lines) {
            const result = await this.addLine(line);
            if (result) results.push(result);
        }

        return results.join("");
    }

    /**
     * append SHIOLINK protocol chunk line
     * @param line [String] SHIOLINK protocol chunk line
     * @return If request transaction is completed, response transaction string, and if not, undefined.
	 *         If Engine throws error, Promise resolved value will be 500 Internal Server Error string.
     */
    async addLine(line: string) {
        if (this.state === "shiolink") {
            const result = line.match(/^\*(L|S|U):(.*)$/);
            if (result) {
                // tslint:disable-next-line switch-default
                switch (result[1]) {
                    case "L": return await this.shiolinkLoad(result[2]);
                    case "S": return await this.shiolinkRequest(result[2]);
                    case "U": return await this.shiolinkUnload();
                }
            }
        } else {
            const parserResult = this.requestParser.parse_line(line);
            if (parserResult.state === "end") {
                this.state = "shiolink";
                try {
                    const response = await this.engine.request(parserResult.result);

                    return response.toString();
                } catch (error) {
                    const response = new ShioriJK.Message.Response();
                    response.status_line.protocol = "SHIORI";
                    response.status_line.version = "3.0";
                    response.status_line.code = 500;
                    response.headers.set(
                        "X-ShiolinkJS-Error",
                        error.toString().replace(/\r/g, "\\r").replace(/\n/g, "\\n"),
                    );

                    return response.toString();
                }
            }
        }
    }

    /** internal load */
    private async shiolinkLoad(directory: string) {
        await this.engine.load(directory);
    }

    /** internal request */
    private async shiolinkRequest(id: string) {
        this.state = "request";

        return `*S:${id}\r\n`;
    }

    /** internal unload */
    private async shiolinkUnload() {
        await this.engine.unload();
    }
}
