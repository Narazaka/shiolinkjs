#!/usr/bin/env node
import * as path from "path";
import { runShiori } from "../lib";

const target =
    /[//\/]/.test(process.argv[2]) ?
    path.join(process.cwd(), process.argv[2]) :
    process.argv[2];

runShiori(require(target)); // tslint:disable-line no-var-requires
