global.$ = $;

const {remote} = require('electron');
const {Menu, BrowserWindow, MenuItem, shell} = remote;

var fs = require('fs');
var path = require('path');

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

$(document).ready(function() {
    initMenu();

    var base_dir = $('[name=base_dir]').val();
    load_directories(path.dirname(base_dir));
});

function load_directories(base_dir) {
    fs.readdir(base_dir, function(err, files) {
        if (err) {
            var html = '<li class="active">'+
                        '<a href="#">'+
                            '<i class="fa fa-ban"></i>'+
                            '<span>Not Found</span>'+
                        '</a>'+
                    '</li>';
            $('#sidebar-menu').append(html);
            console.log(err);
        } else {
            console.log(files);
            files.forEach( function (file) {
                var html = '<li>'+
                            '<a href="#">'+
                                '<i class="fa fa-folder"></i>'+
                                '<span>'+file+'</span>'+
                            '</a>'+
                        '</li>';
                $('#sidebar-menu').append(html);
            });
        }
    });
}

function is_directory(path) {
    fs.stat(path, function(err, stats) {
        if (err) {
            return false;
        } else {
            return stats.isDirectory();
        }
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

function is_daily_dir(path) {
    console.log(path);
}