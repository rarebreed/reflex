// @flow 
/**
 * This module is used to run child processes on a system
 */

import { ChildProcess, child_process$spawnOpts, spawn } from "child_process"
import Rx from "rxjs";
const buffer = require("buffer");
const fs = require("fs");
const stream = require("stream");

type SpawnOpts = child_process$spawnOpts;


class Command {
    cmd: string;
    args: ?Array<string>;
    options: ?SpawnOpts;
    child: ChildProcess;
    station: Rx.BehaviorSubject;

    constructor(cmd: string, opts?: SpawnOpts) {
        this.cmd = cmd;
        if (!!opts)
            this.options = opts;

    }

    /**
     * Launches a subprocess and captures the stdout and stores it to both an in-memory buffer and a file
     */
    run(): Rx.Observable<string> {
        this.child = spawn(this.cmd, this.args, this.options);

        // This is where we rx-ify it
        let stream = Rx.Observable.fromEvent(this.child.stdout.on, "data");
       
        

        return stream;
    }
}