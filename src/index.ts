import core = require('@actions/core');
import exec = require('@actions/exec');
import glob = require('@actions/glob');
import path = require('path');

const main = async () => {
    try {
        if (process.platform !== `win32`) { throw new Error(`This action can only run on Windows runner.`); }
        const projectPath = core.getInput(`project-path`, { required: true });
        const globber = await glob.create(path.join(projectPath, `**/*.sln`));
        const files = await globber.glob();
        if (files.length === 0) { throw new Error(`No solution or project file found.`); }
        const buildPath = files[0];
        core.info(`Building ${buildPath}`);
        const configuration = core.getInput(`configuration`, { required: true });
        const additionalArgs = core.getInput(`additional-args`);
        const buildArgs = [`/t:Build`, `/p:Configuration=${configuration}`, ...additionalArgs.split(` `)];
        await exec.exec(`msbuild`, [buildPath, ...buildArgs]);
    } catch (error) {
        core.setFailed(error);
    }
}

main();
