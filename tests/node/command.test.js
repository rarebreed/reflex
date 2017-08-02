const command = require("../../build/src/")


test("Tests that the Promise based command launcher works", t => {
    let cmd = new command.Command("iostat", ["2", "4"])
    cmd.runp(false)
    .then(res => { 
        console.log(`Process exited with a value of: ${res}`)
        return cmd.output
    })
    .then(outp => console.log(outp))
})