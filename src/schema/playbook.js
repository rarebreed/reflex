// @flow
// Contains the schema string that will be compiled

const schema = `
type QeosMachine {
    ipAddress: String
    image: ID
    meta: String
    name: String
}

type Query {
    makeQeosMachine(name: String!, image: String, meta: String): QeosMachine
}
`

module.exports = {
    schema: schema
}