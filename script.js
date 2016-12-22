global.$ = $;

const {remote} = require('electron');
const {Menu, BrowserWindow, MenuItem, shell} = remote;

var fs = require('fs');

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

let dirs = ['...'];

$(document).ready(function() {
    initMenu();

    var base_dir = $('[name=base_dir]').val();
    load_directories(base_dir);
});

function load_directories(base_dir) {
    var html = "";
    fs.readdir(base_dir, function(err, files) {
        if (err) {
            html += '<li>'+
                        '<a href="#">'+
                            '<i class="fa fa-folder"></i>'+
                            '<span>Not Found</span>'+
                        '</a>'+
                    '</li>';
        }
        files.forEach( function (file) {
            html = '<li>'+
                        '<a href="#">'+
                            '<i class="fa fa-folder"></i>'+
                            '<span>'+file+'</span>'+
                        '</a>'+
                    '</li>';
        });
    });
    $('#sidebar-menu').append(html);
}

function is_directory(path) {
    fs.stat(path, function(err, stats) {
        if (err) {
            return console.error(err);
        }
        stats.isDirectory();
    });
}

function contains_directory(path) {
    fs.readdir(base_dir, function(err, files) {
        if (err) {
            return false;
        }
        file.forEach( function (file) {

        });
    });
}