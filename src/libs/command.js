// @flow 
/**
 * This module is used to run child processes on a system
 */

import { ChildProcess, spawn, exec } from "child_process"
const Rx = require("rxjs")
const buffer = require("buffer")
const fs = require("fs")
const stream = require("stream")
const immutable = require("immutable")

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

    constructor( cmd: string
               , args?: ?Array<string>
               , opts?: SpawnOpts) {
        this.cmd = cmd;
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
     * Launches a subprocess and captures the stdout and stores it to both an in-memory buffer and a file
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
        return { data: dataStream$
               , done: doneStream$
               };
    }

    /**
     * A Promise based version.  The caller passing in the resolve funcion
     */
    runp( onDone: (output: string)
        , showoutput: boolean = true
        , timeout?: number) {
        let output = ""
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
                output += data
                if (showoutput)
                    console.log(data)
            })
            this.child.on("exit", resolve)
        })
        p.then(onDone)
        return p
    }
}


function launch(cmdname: string, args?: ?Array<string>, opts?: SpawnOpts) {
    let cmd = new Command(cmdname, args, opts);
    return cmd.run();
}


const done = (output: string) => 
  (result: string | number)  => {
    console.log(output)
    console.log(`Process exited with a value of: ${result}`)
    return { output: output, result: result }
}

/**
 * 
 */
function processWatcher(proc: ProcessInfo<string, number | string>): Rx.BehaviorSubject<string> {
    let { data, done } = proc;
    let subject$ = Rx.BehaviorSubject();

    subject$.subscribe({
        next: (out) => {

        }
    })

    // In a more serious program, the observer here would accumulate the output
    data.subscribe(out => { 
        console.log(out)
    });
    done.subscribe((evt) => { 
        console.log(evt)
    });
}


module.exports = {
    "Command": Command,
    "launch": launch
}