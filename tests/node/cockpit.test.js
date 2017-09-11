// @flow
const wdio = require("webdriverio");
// Need to figure out a way to pass the host IP Address
let opts: Webdriverio$Options = { desiredCapabilities: {browserName: "chrome", platform: "LINUX"},
                                  acceptSslCerts: true };

const client = wdio.remote(opts);
client
  .init()
  .url('https://10.8.175.92:9090')
  .setValue('#login-user-input', 'dev')
  .setValue('#login-password-input', 'redHAT2017')
  .click('#login-button')
  .getTitle().then(function(title) {
      console.log('Title is: ' + title);
    // outputs: "Title is: WebdriverIO (Software) at DuckDuckGo"
  })
  .end();