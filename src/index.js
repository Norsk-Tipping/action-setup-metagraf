const core = require('@actions/core')
const tc = require('@actions/tool-cache')

const axios = require('axios')
const semver = require('semver')


async function getLatestVersion() {
    let latest = '0.1.11' // default to a known version

    // TODO: get tags from github
    core.debug(`Downloading version metadata`)
    try {
        const response = await axios.get('https://api.github.com/repos/norsk-tipping/metagraf/releases', {
            headers: { Accept: 'application/vnd.github.v3+json'}
        })
        versions = response.data.map(versionData => versionData.tag_name)

        // loop through all versions and find the latest one
        versions.forEach(version => {
            // ignore pre-release
            if (semver.prerelease(version) === null) {
                const cleanedVersion = semver.clean(version)
                latest = semver.gt(cleanedVersion, latest) ? cleanedVersion : latest
            }
        })
    } catch (error) {
        core.setFailed(error.message)
    }
    core.info(`Latest metagraf version is ${latest}`)
    return latest
}

function getDownloadUrl(version) {
    // TODO: handle arch and OS
    return `https://github.com/Norsk-Tipping/metagraf/releases/download/v${version}/mg-${version}-linux-amd64.tar.gz`
}

async function setup() {
    try {
        const inputVersion = core.getInput('version')

        const version = inputVersion ? inputVersion : await getLatestVersion()

        let toolPath = tc.find('metagraf', version)
        if (toolPath) {
            core.info(`Found metagraf in tool cache at ${toolPath}`)
        } else {
            core.info(`Attempting to resolve and download metagraf version ${version}`)
            const downloadPath = await tc.downloadTool(getDownloadUrl(version))
            const extractedFolder = await tc.extractTar(downloadPath)
            toolPath = await tc.cacheDir(extractedFolder, 'metagraf', version)
        }
        core.addPath(toolPath)

    } catch (error) {
        core.setFailed(error.message)
    }
}

module.exports = setup

if (require.main === module) {
    setup();
}