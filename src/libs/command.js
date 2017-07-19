// @flow 
/**
 * This module is used to run child processes on a system
 */

import { ChildProcess, spawn } from "child_process"
import Rx from "rxjs";
const buffer = require("buffer");
const fs = require("fs");
const stream = require("stream");

function openFile(path: string) {
    return new Promise((resolve, reject) => {
        fs.open("path", "r+", 0666, (err: ?Error, fd: number) => {
            if (err)
                reject(err)
            else
                resolve(fd)
        })
    })
}

function closeFile(fd: number) {
    return Promise.resolve(fd => {
        fs.close(fd)
        return true
    })
}

function fileExists(path) {
    return openFile(path)
        .then(closeFile)
        .catch(e => {
            console.log("File does not exist, or is not open for reading")
            console.log(e)
            return false
        })
}

function openFile$(path: string): Rx.Observable<boolean> {
    let obs: Rx.Observable<boolean> = Rx.Observable.bindNodeCallback(fs.open)
    return obs(path, "r+")
}





// I have no idea why this type wasn't declared in flow
type SpawnOpts = {
  cwd?: string;
  env?: Object;
  argv0?: string;
  stdio?: string | Array<any>;
  detached?: boolean;
  uid?: number;
  gid?: number;
  shell?: boolean | string;
};

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
        let args: Array<string> = [];
        let opts: SpawnOpts = {};
        if (this.args != null)
            args = this.args;
        if (this.options != null)
            opts = this.options;
        this.child = spawn(this.cmd, args, opts);

        // This is where we rx-ify it
        let stream = Rx.Observable.fromEvent(this.child.stdout.on, "data");
        return stream;
    }
}