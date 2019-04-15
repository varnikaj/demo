/**
 * This file is the common configuration used for configuring webpack and the eslint-webpack-import-resolver
 * It is common so that we automatically pick up changes to both
 */

const glob = require('glob');
const path = require('path');
const AppFilesLoaderPlugin = require('./appFilesLoaderPlugin');

exports.roots = ['js', 'node_modules', 'node_modules/@saxo'];

// add .html to allow importing dot templates
const extensions = ['.js', '.jsx', '.html'];
exports.extensions = extensions;

exports.commonAliases = {
    // Polyfilled libraries
    jqueryAll: 'libs/jqueryAll',
    spineAll: 'libs/spineAll',

    // Libraries installed manually
    signalR: 'libs/jquery.signalR-2.0.3',
    insertionQ: 'libs/insertionq',
    packer: 'libs/packer',

    'redux-tale': 'redux-tale/es',

    // Project modules
    'spine/commonControllers': 'src/spine/controllers/commongo',
    'spine/commonViewControllers': 'src/spine/viewControllers/commongo',
    'spine/commonTemplates': 'src/spine/templates/commongo',

    // optimizations
    'moment-timezone': 'moment-timezone/builds/moment-timezone-with-data-2012-2022',
    redux$: 'redux/dist/redux.min.js',

    // access the source of open ui
    openui: '@saxo/openui/src',

    // library required for chart
    'one-color': 'onecolor',
};

exports.apps = [
    {
        scriptId: 'p',
        appSpecificFolderName: 'phonego',
        appSpecificFolderNameReact: 'phone',
        isPhone: true,
    },
    {
        scriptId: 't',
        appSpecificFolderName: 'tabletgo',
        appSpecificFolderNameReact: 'tablet',
        isTablet: true,
    },
    {
        scriptId: 'd',
        appSpecificFolderName: 'desktopgo',
        appSpecificFolderNameReact: 'desktop',
    },
    {
        scriptId: 'proslave',
        entryFilename: 'slaveBundle.js',
        appSpecificFolderName: 'pro',
        appSpecificFolderNameReact: 'pro',
    },
    {
        scriptId: 'promaster',
        entryFilename: 'masterDataSetupBundle.js',
        appSpecificFolderName: 'pro',
        appSpecificFolderNameReact: 'pro',
    },
    {
        scriptId: 'disclaimer',
        appSpecificFolderName: 'disclaimer',
        appSpecificFolderNameReact: 'disclaimer',
    },
    {
        scriptId: 'investor',
        entryFilename: 'dataSetupBundle.js',
        appSpecificFolderName: 'investor',
        appSpecificFolderNameReact: 'investor',
    },
    {
        scriptId: 'editor',
        entryFilename: 'dataSetupBundle.js',
        appSpecificFolderName: 'editor',
        appSpecificFolderNameReact: 'editor',
    },
];

/**
 * Check if a module exists on the file system.
 *
 * @param  {String}  modulePath
 * @param  {Boolean} fullPathGiven
 * @return {Boolean}
 */
function physicalModuleExists(modulePath, fullPathGiven) {
    // Build the file path and replace potential extensions with a
    // glob.
    let filePath;
    if (fullPathGiven) {
        filePath = modulePath;
    } else {
        filePath = path.resolve(__dirname, '../../', modulePath);
    }
    const fileGlob = `${filePath}{${extensions.join(',')}}`;

    return Boolean(glob.sync(fileGlob).length);
}

exports.getAppSpecificAliases = function(options) {
    const appSpecificFolderName = options.appSpecificFolderName;
    const appSpecificFolderNameReact =
        options.appSpecificFolderNameReact || appSpecificFolderName;

    return {
        aliases: {
            'spine/controllers': `src/spine/controllers/${appSpecificFolderName}`,
            'spine/viewControllers': `src/spine/viewControllers/${appSpecificFolderName}`,
            'spine/templates': `src/spine/templates/${appSpecificFolderName}`,
        },
        customPlugins: [
            // Aliases [app] in the path to the right app
            new AppFilesLoaderPlugin({
                appSpecificFolderNameReact,
                physicalModuleExists,
            }),
        ],
    };
};
