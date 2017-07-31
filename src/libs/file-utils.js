// @flow

import Rx from "rxjs"
const fs = require("fs")

// Default Observer type for reading files.  The error and complete fields are optional
type FileObserver = {
  next: (data: string) => void,
  error?: (err: Error) => void,
  complete?: () => void
}

function openFile(path: string) {
    return new Promise((resolve, reject) => {
        fs.open(path, "r+", 0x144, (err: ?Error, fd: number) => {
            if (err)
                reject(err)
            else
                resolve(fd)
        })
    })
}

// happy path function for openFile.  We know this will be called with a valid value
function closeFile(fd: number) {
    fs.close(fd)
    return true
}

function fileExists(path: string): Promise<boolean> {
    return openFile(path)
        .then(closeFile)
        .catch(e => {
            console.log("File does not exist, or is not open for reading");
            console.log(e)
            return false
        })
}

/**
 * An rxjs style of reading a file
 */
function readFile$( path: string
                  , observer: Rx.Subject) {
  let output = ""
  const _rF$ = Rx.Observable.bindNodeCallback(fs.readFile)
  return _rF$(path).reduce((acc: string, next: string) => acc + next, "")
}

function reader(stream: Rx.Observable): Rx.Subject {
  let subject = Rx.Subject()
  subject.next = (data) => console.log(data)
  stream.subscribe(subject)
}

function openFile$(path: string): Rx.Observable<boolean> {
    let obs: Rx.Observable<boolean> = Rx.Observable.bindNodeCallback(fs.open);
    return obs(path, "r+")
}
