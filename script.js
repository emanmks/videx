global.$ = $;

const {remote} = require('electron');
const {Menu, BrowserWindow, MenuItem, shell} = remote;

var fs = require('fs');
var path = require('path');
var rem = require('electron').remote;
var dialog = rem.dialog;

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

    $('#navtabs').show();
    $('#tab-content').show();
    
    var base_dir = $('[name=base_dir]').val();
    var directories = get_directories(base_dir);
    show_directories(base_dir, directories);

    $("#breadcrumb").html("<i class='fa fa-folder'></i> "+base_dir);
}

function show_directories(base_dir, directories) {
    directories.forEach( function (directory) {
        var subdirectories = get_directories(base_dir+'/'+directory);

        var submenu = '<ul class="treeview-menu">';
        subdirectories.forEach( function (dir) {
            var full_subdir = base_dir+'/'+directory+'/'+dir;
            var  sub_dirs = get_directories(full_subdir);

            var sub_submenu = '<ul class="treeview-menu">';
            sub_dirs.forEach( function (sub_dir) {
                var full_path_sub = full_subdir+'/'+sub_dir;
                sub_submenu += '<li><a href="#" onclick="rload('+"'"+full_path_sub+"'"+')"><i class="fa fa-folder"></i> '+sub_dir+'</a></li>';
            });
            sub_submenu += '</ul>';

            submenu += '<li><a href="#" ><i class="fa fa-folder"></i> '+dir+'</a>'+sub_submenu+'</li>';
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

    $("#breadcrumb").html("<i class='fa fa-folder'></i> "+base_dir);
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

    $("#navtabs").show();
    $("#tab-content").show();
    
    $('#navtabs').html("");
    $('#tab-content').html("");

    $("#player").hide();
    $("#story").hide();

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
            var full_path = full_subdir+'/'+directories[i]+'/'+file;
            var extension = full_path.split('.').pop();

            if(extension == 'mp4' || extension == 'avi') {
                html += '<div class="col-sm-4">' +
                            '<video width="320" height="240" controls>' +
                                '<source src="'+full_subdir+'/'+directories[i]+'/'+file+'" type="video/mp4">' +
                                '<source src="'+full_subdir+'/'+directories[i]+'/'+file+'" type="video/avi">' +
                                'Your browser does not support the video tag.'+
                            '</video>' +
                            '<button class="btn btn-info btn-xs" onclick="show_player('+"'"+full_path+"'"+')"><i class="fa fa-video"></i> Details</button>'+
                        '</div>';
            }
        });
        html += '</div>';

        html += '</div>';
        $('#tab-content').append(html);

        $("#breadcrumb").html("<i class='fa fa-folder'></i> "+full_subdir);
    }
}

function show_player(video) {
    $("#navtabs").hide();
    $("#tab-content").hide();

    $("#player").show();
    $("#story").show();

    $("#player").html("");
    $("#story").html("");

    var html = '<video width="100%" id="video_player" controls>' +
                    '<source src="'+video+'" type="video/mp4">' +
                    '<source src="'+video+'" type="video/avi">' +
                    'Your browser does not support the video tag.'+
                '</video>';
    html += '<input type="hidden" id="video_full_path" value="'+video+'">';
    $("#player").html(html);

    load_stories(video);

    $("#breadcrumb").html("<i class='fa fa-film'></i> "+video);
}

function load_stories(video) {
    var storyfile = path.normalize(video.substr(0, video.lastIndexOf(".")) + ".json");
    path.normalize(storyfile);

    var html = '<button class="btn btn-xs btn-info" onclick="open_dialog()"><i class="fa fa-file"></i> Load Storyline (CSV)</button>';

    if(fs.existsSync(storyfile)) {
        var stories = fs.readFileSync(storyfile);
        stories.toString();
        stories = JSON.parse(stories);

        
        html += '<ul class="list-group">';
        stories.forEach(function (story) {
            html += '<li class="list-group-item">' +
                        '<span class="badge bg-blue"><a href="#" onclick="update_track('+"'"+story.timeline+"'"+')">'+story.timeline+'</a></span>' +
                        story.story +
                    '</li>';
        });
    }
    html += '</ul>';

    $("#story").html(html);
}

function open_dialog() {
    dialog.showOpenDialog(function (file_names) {
        // fileNames is an array that contains all the selected
       if(file_names){
            var extension = file_names[0].split('.').pop();
            if (extension != 'csv') {
                alert("Invalid csv file");
            }
            proceed_csv(file_names[0]);
       }
    });
}

function open_dir_dialog() {
    dialog.showOpenDialog({properties:['openDirectory']}, function (dir_names) {
        // fileNames is an array that contains all the selected
       if(dir_names) {
            $("#base_dir").val(dir_names[0]);
            reload_base_dir();
       }
    });
}

function proceed_csv(filepath) {
    fs.readFile(path.normalize(filepath), 'utf-8', function (err, data) {
        if(err){
            alert("An error ocurred reading the file :" + err.message);
            return;
        }
        var stories = [];
        data.split("\n").forEach( function (story) {
            story = story.split(",");
            var line = {
                "timeline":story[0],
                "story":story[1]
            };
            stories.push(line);
        });
        stories.shift();
        stories.pop();
        write_storyline(stories);
    });
}

function write_storyline (stories) {
    var json_stories = JSON.stringify(stories);
    var video_full_path = $("#video_full_path").val();
    var storyfile = path.normalize(video_full_path.substr(0, video_full_path.lastIndexOf(".")) + ".json");
    
    fs.writeFile(storyfile, json_stories, function (err) {
        if(err) {
            alert("An error ocurred updating the file"+ err.message);
            console.log(err);
            return;
        }
                        
        alert("The file has been succesfully submitted");
        show_player(video_full_path);
     });
}

function update_track(timeline) {
    document.getElementById("video_player").currentTime = extract_seconds(timeline);
}

function extract_seconds(timeline) {
    var components = timeline.split(":");
    var result = 0;

    if (components.length == 3) {
        var hour = parseInt(components[0]) * 3600;
        var minute = parseInt(components[1]) * 60;
        result = hour + minute + parseInt(components[2]);
    } else if (components.length == 2) {
        var minute = parseInt(components[0]) * 60;
        result = minute + parseInt(components[1]);
    } else {
        result = parseInt(components[0]);
    }

    return result;
}