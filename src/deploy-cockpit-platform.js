// @flow
/** 
 * This script will create a cockpit test platform
 * - Create a new openstack nova instance by running rhsm_sut.yml playbook
 *   - The metadata will be inserted into the machine
 * - Run openstack.py to get IP address
 * - run ssh-copy-id to that IP Address
 * - Run the cockpit.yml playbook on it
 * - Optionally: Run the frp-project.yml playbook on it
 */
import Rx from "rxjs"
const express = require("express")
const graphqlHTTP = require("express-graphql")
const { buildSchema } = require("graphql")

const immutable = require("immutable")
const Map = immutable.Map
const command = require("./libs/command")

const playbook = require("./schema/playbook")
const schema = buildSchema(playbook.schema)


type SpawnOpts = Reflex$SpawnOpts
const defaultGlance = "0e9982da-0acd-4df8-8e54-9ae24020b898"

/**
 * Creates a command string to generate a dynamically created qeos openstack instance
 * 
 * @param {string} user Username for sudo on local machine
 * @param {string} image the glance image name or UUID
 * @param {string} systemName name to give the nova instance
 * @param {string} metadata will be passed to the nova meta command
 */
function testPlatformCmd( image: ?string
                        , systemName: string
                        , metadata: string = "cockpit_platform=true")
                        : Array<string> {
    if (image == null)
        image = defaultGlance
    return ["ansible-playbook", "-i", '"localhost,"', "rhsm-sut.yml", "-e", 
            `"glance_image=${image} sut_name=${systemName} metadata=${metadata}"`];
}


/**
 * Creates a command string to generate a new FRP-enabled project via ansible
 * 
 * @param {string} dynPath 
 * @param {string} user 
 * @param {string} projectName 
 * @param {string} verbosity 
 */
function frpProjectCmd( dynPath: string 
                      , user: string
                      , projectName: string
                      , verbosity: string = "-vvvv")
                      : Array<string> {
    return ["ansible-playbook", `${verbosity}`, "-i", `${dynPath}`, "-u", `${user}`, "frp-project.yml",
            "-e", `"project_name=${projectName} base_user=${user}"`];
}



/**
 * Launches a nodejs child process which will call an ansible-playbook
 * 
 * @param {string} name 
 * @param {?string} image 
 * @param {?string} meta 
 */
const makeMachine = ( name: string
                    , image: ?string
                    , meta: ?string )
                    : command.Command => {
    // TODO: Hard coding this path only makes sense if we have this running as a service
    const playpath = "/home/stoner/Projects/ansible-playground"
    let envcopy = {}
    for (let k in process.env) {
        envcopy[k] = process.env[k]
    }
    envcopy.PATH = `${playpath}/venv/bin:${envcopy.PATH}` 

    const playbookOpts: Reflex$SpawnOpts = {
        cwd: playpath, 
        env: envcopy
    }
    if (image == null)
        image = defaultGlance
    if (meta == null)
        meta = "cockpit_platform=true"
    
    const cmdline = testPlatformCmd(image, name, meta)
    let [tpPlayCmd, ...playArgs] = cmdline
    playArgs = playArgs.filter(i => i !== "")

    console.log(cmdline)
    let cmd = new command.Command(tpPlayCmd, playArgs, playbookOpts)
    return cmd
}

/**
 * The code below should be wrapped inside of a function which can be invoked via a GraphQL or websocket call.
 */

let cmd = makeMachine("stoner-ansible-created")
let { data, done, error } = cmd.run()
error.subscribe(e => console.log(`Spawn failed with error: ${e}`))
let doneObserver = {
    next: r => {
        if (r === 0) {
            console.log("playbook finished successfully")
        }
    },
    error: err => console.log(`Unable to run playbook: ${err}`)
}
data.subscribe(o => {
    let output = (typeof o === "string") ? o : o.toString("utf-8")
    console.log(output)
})
done.subscribe(doneObserver)
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * This is like a route in GraphQL.  It has to have fields that have the same name as the members from the Query
 * and Mutation types in the schema
 */
const root = {
    makeQeosMachine: makeMachine
}

module.exports = {
    "root": root,
    "makeMachine": makeMachine,
    "frpProjectCmd": frpProjectCmd,
    "testPlatformCmd": testPlatformCmd,
    "defaultGlance": defaultGlance
}