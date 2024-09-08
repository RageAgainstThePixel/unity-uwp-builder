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
        const buildArgs = [`/t:Build`, `/p:Configuration=${configuration}`];
        const additionalArgs = core.getInput(`additional-args`);
        if (additionalArgs) { buildArgs.push(...additionalArgs.split(` `)); }
        await exec.exec(`msbuild`, [buildPath, ...buildArgs]);
        // calculate export path that contains the appx and other build artifacts
        const exportGlobber = await glob.create(path.join(path.dirname(buildPath), `**/AppPackages/**/*.appx`));
        const exportFiles = await exportGlobber.glob();
        if (exportFiles.length === 0) { throw new Error(`No appx file found.`); }
        const executable = exportFiles[0];
        core.setOutput(`executable`, executable);
        const exportPath = path.dirname(executable);
        core.setOutput(`export-path`, exportPath);
    } catch (error) {
        core.setFailed(error);
    }
}

main();
