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
const command = require("../build/lib/src/libs/command")

// Build the schema
const playbook = require("./schema/playbook")
const schema = buildSchema(playbook.schema)
const defaultGlance = "0e9982da-0acd-4df8-8e54-9ae24020b898"

type SpawnOpts = Reflex$SpawnOpts

/**
 * This is like a route in GraphQL.  It has to have fields that have the same name as the members from the Query
 * and Mutation types in the schema
 */
const root = {
    makeQeosMachine: makeMachine
}

/**
 * 
 * @param {string} user Username for sudo on local machine
 * @param {string} image the glance image name or UUID
 * @param {string} systemName name to give the nova instance
 * @param {string} metadata will be passed to the nova meta command
 */
function testPlatformCmd( user: string 
                        , image: string
                        , systemName: string
                        , metadata: string = "cockpit_platform=true") {
    return `ansible-playbook -i "localhost," -u ${user} rhsm-sut.yml -e "glance_image=${image} sut_name=${systemName} metadata=${metadata}"`;
}


function frpProjectCmd( dynPath: string 
                      , user: string
                      , projectName: string
                      , verbosity: string = "-vvvv") {
    return `ansible-playbook ${verbosity} -i ${dynPath} -u ${user} frp-project.yml -e "project_name=${projectName} base_user=${user}"`;
}

const makeOpts = () =>  Map({"shell": true})

const makeMachine = (name: string, image: ?string, meta: ?string): Reflex$QeosMachine => {
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
    
    let process: command.ProcessInfo = command.launch(tpPlayCmd, playArgs, opts)
    let { data, done } = process;

}

// This function does two things.  It creates both the Observable stream **and** the Observer that will handle the
// result when it is emitted.  This is what the client calls
function makeObserver() {
    
}

