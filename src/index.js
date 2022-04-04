const core = require('@actions/core')
const tc = require('@actions/tool-cache')


function getLatestVersion() {
    // TODO: get tags from github
    return "0.1.10"
}

function getLatestUrl(version) {
    // TODO: handle arch and OS
    return `https://github.com/Norsk-Tipping/metagraf/releases/download/v${version}/mg-${version}-linux-amd64.tar.gz`
}

async function setup() {
    try {
        const version = getLatestVersion()
        let toolPath = tc.find('metagraf', version)
        if (toolPath) {
            core.info(`Found metagraf in tool cache at ${toolPath}`)
        } else {
            core.info(`Attempting to resolve and download metagraf version ${version}`)
            const downloadPath = await tc.downloadTool(getLatestUrl(version))
            const extractedFolder = await tc.extractTar(downloadPath)
            toolPath = await tc.cacheDir(extractedFolder, 'metagraf', version)
        }
        core.addPath(toolPath)
        console.log(`metagraf installed to ${toolPath}`)

    } catch (error) {
        core.setFailed(error.message)
    }
}

module.exports = setup

if (require.main === module) {
    setup();
  }