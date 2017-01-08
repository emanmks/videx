global.$ = $;

const {remote, app, globalShortcut} = require('electron');
const {Menu, BrowserWindow, MenuItem, shell} = remote;

var fs = require('fs');
var path = require('path');
var rem = require('electron').remote;
var dialog = rem.dialog;
var ffmpeg = require('fluent-ffmpeg');
var findInFiles = require('find-in-files');

// append default actions to menu for OSX
var initMenu = function () {
    try {
        var nativeMenuBar = new Menu();
        if (process.platform == "darwin") {
            nativeMenuBar.createMacBuiltin && nativeMenuBar.createMacBuiltin("FileExplorer");
        }
    } catch (error) {
        console.error(error);
        setTimeout(function () { throw error }, 1);
    }
};