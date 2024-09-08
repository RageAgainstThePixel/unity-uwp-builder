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
        if (files.length === 0) { throw new Error(`No solution file found.`); }
        const buildPath = files[0];
        core.info(`Building ${buildPath}`);
        const configuration = core.getInput(`configuration`, { required: true });
        const buildArgs = [
            `/restore`,
            `/t:Build`,
            `/p:Configuration=${configuration}`
        ];
        const architecture = core.getInput(`architecture`);
        if (architecture) {
            core.info(`architecture: "${architecture}"`);
            buildArgs.push(`/p:Platform=${architecture}`);
        } else {
            buildArgs.push(`/p:Platform=x64|ARM64`);
        }
        const additionalArgs = core.getInput(`additional-args`);
        if (additionalArgs) {
            core.info(`additional-args: "${additionalArgs}"`);
            buildArgs.push(...additionalArgs.split(` `));
        }
        const packageType = core.getInput(`package-type`, { required: true });
        core.info(`package-type: "${packageType}"`);
        switch (packageType) {
            case `msixupload`:
                buildArgs.push(
                    `/p:UapAppxPackageBuildMode=StoreUpload`,
                    `/p:GenerateAppInstallerFile=false`,
                    `/p:AppxPackageSigningEnabled=false` // store signs the package
                );
                break;
            case `msix`:
                buildArgs.push(
                    `/p:UapAppxPackageBuildMode=SideloadOnly`
                );
                break;
            case `appx`:
                break;
            default:
                throw new Error(`Invalid package type: "${packageType}"`);
        }
        await exec.exec(`msbuild`, [buildPath, ...buildArgs]);
        const outputDirectory = path.join(path.dirname(buildPath), `AppPackages`, configuration);
        core.info(`output-directory: "${outputDirectory}"`);
        core.setOutput(`output-directory`, outputDirectory);
    } catch (error) {
        core.setFailed(error);
    }
}

main();
