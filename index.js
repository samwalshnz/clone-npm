var git = require('simple-git');
var packageJson = require('package-json');
var packageName = process.argv[2];

const getOptions = function() {
    return process.argv.slice(3);
}

const getRepoUrl = function(packageJson) {
    return packageJson.repository.url.replace('git+https', 'https');
}

const getPathname = function(options) {
    const index = options.findIndex(function(option) {
        return option[0] !== '-';
    })

    if (index) {
        return options.splice(index, 1)[0];
    }

    return;
}

const clone = function(repoUrl) {
    const options = getOptions();
    const pathname = getPathname(options);

    const cloning = git().clone(repoUrl, pathname, options.unshift('--progress'));

    stdout(cloning);
}

const stdout = function(cloning) {
    const socket = cloning._childProcess.stdio[2];
    socket.on('data', function(data) { 
        process.stdout.write(data)
    });
}

packageJson(packageName, {fullMetadata: true})
        .then(getRepoUrl)
        .then(clone)