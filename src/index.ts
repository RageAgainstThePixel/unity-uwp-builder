import core = require('@actions/core');

const main = async () => {
    try {
        core.info('Hello World!');
    } catch (error) {
        core.setFailed(error);
    }
}

main();
