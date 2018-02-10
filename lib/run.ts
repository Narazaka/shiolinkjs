import { Engine, ShiolinkJS } from "./shiolink";

/**
 * run shiolinkified SHIORI
 * @param shiori SHIORI Engine
 */
export function runShiori(shiori: Engine) {
    runShiolink(new ShiolinkJS(shiori));
}

/**
 * run shiolinkified SHIORI
 * @param shiolink ShiolinkJS instance
 */
export function runShiolink(shiolink: ShiolinkJS) {
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", async (chunk) => {
        const response = await shiolink.addChunk(chunk);
        if (response.length) process.stdout.write(response);
    });
}
