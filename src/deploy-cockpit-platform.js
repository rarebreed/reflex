// @flow
/** 
 * This script will create a cockpit test platform
 * - Create a new openstack nova instance
 * - grab the IP address of the new instance
 * - run ssh-copy-id to it
 * - Run the cockpit.yml playbook on it
 * - Run the frp-project.yml playbook on it
 */
const express = require("express")
const graphqlHTTP = require("express-graphql")
const { buildSchema } = require("graphql")

const immutable = require("immutable")
const Map = immutable.Map
const command = require("../build/src/libs/command")

// Build the schema
const playbook = require("./schema/playbook")
const schema = buildSchema(playbook.schema)
const defaultGlance = "0e9982da-0acd-4df8-8e54-9ae24020b898"

type SpawnOpts = Reflex$SpawnOpts


/**
 * Creates a command string to generate a dynamically created qeos openstack instance
 * 
 * @param {string} user Username for sudo on local machine
 * @param {string} image the glance image name or UUID
 * @param {string} systemName name to give the nova instance
 * @param {string} metadata will be passed to the nova meta command
 */
function testPlatformCmd( user: string 
                        , image: string
                        , systemName: string
                        , metadata: string = "cockpit_platform=true")
                        : string {
    return `ansible-playbook -i "localhost," -u ${user} rhsm-sut.yml -e "glance_image=${image} sut_name=${systemName} metadata=${metadata}"`;
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
                      : string {
    return `ansible-playbook ${verbosity} -i ${dynPath} -u ${user} frp-project.yml -e "project_name=${projectName} base_user=${user}"`;
}


const makeOpts = () =>  Map({"shell": true})


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
                    : void => {
    // TODO: Hard coding this path only makes sense if we have this running as a service
    const pathToPlayground: string = "/home/stoner/Projects/ansible-playground";
    const playbookOpts = command.setOpts(makeOpts(), ["cwd", pathToPlayground]).toObject()
    if (image == null)
        image = defaultGlance
    if (meta == null)
        meta = "cockpit_platform=true"
    
    const cmdline = testPlatformCmd("stoner", image, name, meta)
    let [tpPlayCmd, ...playArgs] = cmdline.split(" ")

    let opts: SpawnOpts = {
        cwd: pathToPlayground,
        shell: true
    }

    let process: command.ProcessInfo = command.launchp(tpPlayCmd, playArgs, opts)
    
}

/**
 * This is like a route in GraphQL.  It has to have fields that have the same name as the members from the Query
 * and Mutation types in the schema
 */
const root = {
    makeQeosMachine: makeMachine
}