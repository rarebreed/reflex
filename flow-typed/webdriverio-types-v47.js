/**
 * These are the types for webdriverio
 */

 // These are actually only the most common values.  Add any needed over time
 // See https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities for all options
 declare type Webdriverio$DesiredCapabilities = {
     browserName: "android" | "chrome" | "firefox" | "htmlunit" | "internet explorer" | "iPhone" | "iPad" | "opera" | "safari",
     version?: string, 
     platform: "WINDOWS" | "XP" | "VISTA" | "MAC" | "LINUX" | "UNIX" | "ANDROID",
     tags?: Array<string>,
     name?: string,
     pageLoadStrategy?: "normal" | "eager" | "none",
     acceptSslCerts?: boolean
 };

 declare type Webdriverio$Options = {
     desiredCapabilities: Webdriverio$DesiredCapabilities,
     host?: string,
     port?: number,
     logLevel?: "verbose" | "silent" | "command" | "data" | "result",
     logOutput?: string,  // figure out the type for a node Writeable stream
     path?: string,
     baseUrl?: string,
     connectionRetryTimeout?: number,
     connectionRetryCount?: number,
     coloredLogs?: boolean,
     bail?: boolean,
     screenshotPath?: ?string,
     screenshotOnReject?: boolean,
     waitforTimeout?: number,
     waitforInterval?: number,
     queryParams?: string
 }