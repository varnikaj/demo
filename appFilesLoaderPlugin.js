const path = require('path');

const relativeModuleRegex = /^\.{1,2}\//;
const srcAppRegex = /\[app\]/i;

function AppFilesLoaderPlugin(options) {
    this.appSpecificFolderNameReact = options.appSpecificFolderNameReact;
    this.physicalModuleExists = options.physicalModuleExists;
}

/**
 * Checks if module exists, adjusting path if relative
 *
 * @param  {String} requestPath
 * @param  {Object} result

 */
AppFilesLoaderPlugin.prototype.checkPath = function(requestPath, result) {
    let isFullPath = false;
    if (relativeModuleRegex.test(requestPath)) {
        requestPath = path.join(result.context, requestPath);
        isFullPath = true;
    }

    return this.physicalModuleExists(requestPath, isFullPath);
};

/**
 * Checks if module has relative path or resides in src/modules and calls to check
 * if app specific file exists on the file system.
 *
 * @param  {String} result
 * @param  {Function} callback
 * @return {Boolean}
 */
AppFilesLoaderPlugin.prototype.beforeResolveFileHandler = function(result) {
    if (!result) {
        return;
    }

    if (srcAppRegex.test(result.request)) {
        // Used to resolve paths of type 'src/app/[app]/' or './footer.[app]'

        let appSpecificRequest = result.request.replace(
            srcAppRegex,
            this.appSpecificFolderNameReact,
        );
        if (!this.checkPath(appSpecificRequest, result)) {
            appSpecificRequest = result.request.replace(srcAppRegex, 'default');
        }
        result.request = appSpecificRequest;
    }

    return result;
};

AppFilesLoaderPlugin.prototype.apply = function(resolver) {
    resolver.hooks.normalModuleFactory.tap(
        'AppFilesLoaderPlugin',
        function(nmf) {
            nmf.hooks.beforeResolve.tap(
                'AppFilesLoaderPlugin',
                this.beforeResolveFileHandler.bind(this),
            );
        }.bind(this),
    );
};

module.exports = AppFilesLoaderPlugin;
