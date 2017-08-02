const command = require("../../build/src/libs/command")

function testObservable() {
    let cmd = new command.Command("iostat", ["2", "2"])
    let proc = cmd.run()
    let { data, done } = proc;

    data.subscribe(out => { 
        let output = out.toString("utf-8")
        //console.log(output)
        cmd.output += output
    });
    done.subscribe((evt) => { 
        console.log(evt)
        if (typeof evt == "object")
            cmd.result = evt.message
        else
            cmd.result = evt
    });
    return {command: cmd, proc: proc}
}


describe("Tests for the ability to run subprocesses", () => {
    test("Tests that the Promise based command launcher works", () => {
        let cmd = new command.Command("iostat", ["2", "2"])
        cmd.runp(false)
        .then(res => { 
            console.log(`Process exited with a value of: ${res}`)
            return cmd.res
        })
        .then(r => expect(r).toBe(0))
    })

    test("Tests that the Observable based command launcher works", () => {
        let {command, proc} = testObservable()
        setTimeout(() => {
            expect(command.result).toBe(0)
        }, 4500)
    })

    // Example of reactive stream
    test("Tests that we can pass in a new working directory", () => {
        let opts = { cwd: "/home/stoner/Projects/ansible-playground" 
                   , shell: true
                   }
        let cmd = new command.Command("source", ["venv/bin/activate"], opts)
        let { data, done } = cmd.run()
        let env;

        done.subscribe(res => {
            console.log(res)
            expect(res).toBe(0)
            //expect(process.env.PATH).toMatch(/\/home\/stoner\/Projects\/ansible-playground\/venv\/bin/)
        })
    })
})