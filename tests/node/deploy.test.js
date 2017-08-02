const deploy = require("../../build/src/deploy-cockpit-platform")

describe("Test suite for the deploy-cockpit-platform module", () => {
    test("Tests the testPlatformCmd", () => {
        let ans = 'ansible-playbook -i "localhost," -u stoner rhsm-sut.yml -e "' + 
                `glance_image=${deploy.defaultGlance} sut_name=stoner-test ` +
                `metadata=cockpit_platform=true"` 
        expect(deploy.testPlatformCmd("stoner", null, "stoner-test")).toBe(ans)
    })
    
    test("Tests the ", () => {
        let ans = `ansible-playbook -vvvv -i scripts/openstack.py -u stoner frp-project.yml -e "project_name=stoner-project base_user=stoner"`

        expect(deploy.frpProjectCmd("scripts/openstack.py", "stoner", "stoner-project")).toBe(ans)
    })

    test("Test that a new project is created successfully", () => {
        let { data, done } = deploy.makeMachine("", "", "")
        let doneObserver = {
            next: r => {
                expect(r).toBe(0)
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
    })
})