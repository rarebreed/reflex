// @flow 
/**
 * This module is used to run child processes on a system
 */

import { ChildProcess, spawn, exec } from "child_process"
import { Map, Record } from "immutable"
const Rx = require("rxjs")
const buffer = require("buffer")
const fs = require("fs")
const stream = require("stream")


type SpawnOpts = Reflex$SpawnOpts

/**
 * The ProcessInfo type includes the two most important pieces of data of a running process:
 * - The stdout Observable stream
 * - An Observable which might emit when the process completes with a return code
 */
type ProcessInfo<T1, T2> = { data: Rx.Observable<T1> 
                           , done: Rx.Observable<T2>
                           }


/**
 * The Command class is just a convenience wrapper to launch a subprocess
 */
class Command {
    cmd: string;
    args: ?Array<string>;
    options: ?SpawnOpts;
    child: ChildProcess;
    output: string;
    result: string | number | null;

    constructor( cmd: string
               , args?: ?Array<string>
               , opts?: SpawnOpts) {
        this.cmd = cmd
        this.output = ""
        this.result = null
        if (!!args)
            this.args = args;
        if (!!opts)
            this.options = opts;
    }

    _default(): [Array<string>, SpawnOpts] {
        let args: Array<string> = [];
        let opts: SpawnOpts = {};
        if (this.args != null)
            args = this.args;
        if (this.options != null)
            opts = this.options;
        return [args, opts]
    }

    /**
     * Launches a subprocess and captures the stdout and stores it to this.output
     * 
     * TODO: write another Observable stream that pipes output to a file
     */
    run(): ProcessInfo<string, ?number> {
        let [args, opts] = this._default()
        this.child = spawn(this.cmd, args, opts);

        // This is where we rx-ify it
        let dataStream$: Rx.Observable<string> = Rx.Observable.fromEvent(this.child.stdout, "data")
            .map((d: string | Buffer) => {
                if (typeof d === "string")
                    return d
                else
                    return d.toString("utf-8")
            })
        let doneStream$: Rx.Observable<number | string> = Rx.Observable.fromEvent(this.child, "exit");
        return { data: dataStream$, done: doneStream$ };
    }

    /**
     * A Promise based version.  The caller passing in the resolve funcion
     */
    runp( showoutput: ?boolean)
        : Promise<string> {
        let done = false
        let res: string | number;
        let [args, opts] = this._default()

        let p = new Promise((resolve, reject) => {
            try {
                this.child = spawn(this.cmd, args, opts)
            } 
            catch (err) {
                reject(err)
            }
            this.child.stdout.on("data", data => {
                let output = ""
                output += data.toString("utf-8")
                this.output += output
                if (showoutput)
                    console.log(output)
            })
            this.child.on("exit", resolve)
        })
        return p
    }
}


function launch( cmdname: string
               , args?: ?Array<string>
               , opts?: SpawnOpts)
               : ProcessInfo<string, ?number> {
    let cmd = new Command(cmdname, args, opts);
    return cmd.run();
}


module.exports = {
    "Command": Command,
    "launch": launch
}