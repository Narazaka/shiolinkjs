/// <reference types="mocha" />
// tslint:disable completed-docs no-implicit-dependencies
import * as assert from "power-assert";
import * as ShioriJK from "shiorijk";
import * as sinon from "sinon";
import { ShiolinkJS } from "../lib/shiolink";

class FakeShioriEngine {
    // tslint:disable-next-line prefer-function-over-method
    load(_: string) { return 1; }

    // tslint:disable-next-line prefer-function-over-method
    unload() { return 1; }

    // tslint:disable-next-line prefer-function-over-method
    request(request: ShioriJK.Message.Request) {
        if (request.request_line.version === "3.0") {
            if (request.headers.get("ID") === "version") {
                const response = new ShioriJK.Message.Response();
                response.status_line.version = "3.0";
                response.status_line.code = 200;
                response.headers.set("Charset", "UTF-8");
                response.headers.set("Value", "0.1");

                return response;
            } else {
                const response = new ShioriJK.Message.Response();
                response.status_line.version = "3.0";
                response.status_line.code = 400;
                response.headers.set("Charset", "UTF-8");

                return response;
            }
        } else {
            const response = new ShioriJK.Message.Response();
            response.status_line.version = "3.0";
            response.status_line.code = 400;
            response.headers.set("Charset", "UTF-8");

            return response;
        }
    }
}

const heredoc = (str: string) =>
    str
    .replace(/^\r?\n/, "")
    .replace(/  +/g, "")
    .replace(/\r?\n/g, "\r\n");

describe("shiolinkjs", () => {
    let shiolink: ShiolinkJS;
    let engine: FakeShioriEngine;
    let spyLoad: sinon.SinonSpy;
    let spyUnload: sinon.SinonSpy;
    let spyRequest: sinon.SinonSpy;

    beforeEach(() => {
        engine = new FakeShioriEngine();
        spyLoad = sinon.spy(engine, "load");
        spyUnload = sinon.spy(engine, "unload");
        spyRequest = sinon.spy(engine, "request");
        shiolink = new ShiolinkJS(engine);
    });

    it("can parse shiolink load/unload", async () => {
        await shiolink.addChunk(heredoc(`
            *L:C:\\ukagaka
            *U:
        `));
        assert(spyLoad.callCount === 1);
        assert(spyUnload.callCount === 1);
        assert(spyLoad.calledWith("C:\\ukagaka"));
    });

    it("can parse shiolink", async () => {
        const result = await shiolink.addChunk(heredoc(`
            *L:C:\\ukagaka
            *S:qawsedrftgyhujikolp
            GET Version SHIORI/2.6
            Charset: UTF-8
            Sender: SSP

            *S:1234
            GET SHIORI/3.0
            ID: version
            Charset: UTF-8
            Sender: SSP

            *U:
        `));
        assert(result === heredoc(`
            *S:qawsedrftgyhujikolp
            SHIORI/3.0 400 Bad Request
            Charset: UTF-8

            *S:1234
            SHIORI/3.0 200 OK
            Charset: UTF-8
            Value: 0.1

        `));
        assert(spyLoad.callCount === 1);
        assert(spyUnload.callCount === 1);
        assert(spyLoad.calledWith("C:\\ukagaka"));
        assert(spyRequest.callCount === 2);
        const requests = [spyRequest.getCall(0), spyRequest.getCall(1)];
        const request = new ShioriJK.Message.Request();
        request.request_line.protocol = "SHIORI";
        request.request_line.version = "2.6";
        request.request_line.method = "GET Version";
        request.headers.set("Charset", "UTF-8");
        request.headers.set("Sender", "SSP");
        assert.deepEqual(requests[0].args, [request]);
        const request2 = new ShioriJK.Message.Request();
        request2.request_line.protocol = "SHIORI";
        request2.request_line.version = "3.0";
        request2.request_line.method = "GET";
        request2.headers.set("ID", "version");
        request2.headers.set("Charset", "UTF-8");
        request2.headers.set("Sender", "SSP");
        assert.deepEqual(requests[1].args, [request2]);
    });
});
