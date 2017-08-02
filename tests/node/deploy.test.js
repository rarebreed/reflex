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
})