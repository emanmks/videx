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
    var directories = get_directories(base_dir);
    show_directories(base_dir, directories);

    $(".video").hover(function () {
        $(this).children("video")[0].play();
    }, function () {
        var el = $(this).children("video")[0];
        el.pause();
        el.currentTime = 0;
    });

    $("#base_dir").keypress(function(e) {
        if(e.which == 13) {
            reload_base_dir();
            return false;
        }
    });

});

function reload_base_dir() {
    $('#sidebar-menu').html("");
    $('#sidebar-menu').append('<li class="header" id="sidebar-header">NAVIGATION</li>');
    
    $('#navtabs').html("");
    $('#tab-content').html("");
    
    var base_dir = $('[name=base_dir]').val();
    var directories = get_directories(base_dir);
    show_directories(base_dir, directories);
}

function show_directories(base_dir, directories) {
    directories.forEach( function (directory) {
        var subdirectories = get_directories(base_dir+'/'+directory);
        var submenu = '<ul class="treeview-menu">';
        subdirectories.forEach( function (dir) {
            var full_subdir = base_dir+'/'+directory+'/'+dir;
            submenu += '<li><a href="#" onclick="rload('+"'"+full_subdir+"'"+')"><i class="fa fa-folder"></i> '+dir+'</a></li>';
        });
        submenu += '</ul>';
        var html = '<li class="treeview">'+
                    '<a href="#">'+
                        '<i class="fa fa-folder"></i>'+
                        '<span>'+directory+'</span>'+
                    '</a>'+
                    submenu +
                '</li>';
        $('#sidebar-menu').append(html);
    });
}

function get_directories(base_dir) {
    return fs.readdirSync(path.normalize(base_dir)).filter(function(file) {
        return fs.statSync(path.join(base_dir, file)).isDirectory();
    });
}

function get_files(base_dir) {
    return fs.readdirSync(path.normalize(base_dir)).filter(function(file) {
        return fs.statSync(path.join(base_dir, file)).isFile();
    });
}

function rload(full_subdir) {
    var directories = get_directories(full_subdir);
    
    $('#navtabs').html("");
    $('#tab-content').html("");

    for (var i = 0; i < directories.length; i++) {
        var html = "";
        if (i == 0) {
            html += '<li class="active">';
        } else {
            html += '<li>';
        }
        html += '<a href="#'+directories[i]+'" data-toggle="tab">'+directories[i]+'</a>' +
                '</li>';
        $('#navtabs').append(html);

        var html = '<div class="tab-pane active" id="'+directories[i]+'">';
        var files = get_files(full_subdir+'/'+directories[i]);

        html += '<div class="row">';
        files.forEach( function (file) {
            html += '<div class="col-sm-4 video">' +
                        '<video width="320" height="240" controls>' +
                            '<source src="'+full_subdir+'/'+directories[i]+'/'+file+'" type="video/mp4">' +
                            '<source src="'+full_subdir+'/'+directories[i]+'/'+file+'" type="video/avi">' +
                            'Your browser does not support the video tag.'+
                        '</video>' +
                    '</div>';
        });
        html += '</div>';

        html += '</div>';
        $('#tab-content').append(html);
    }
}