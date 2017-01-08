function open_dir_dialog() {
    dialog.showOpenDialog({properties:['openDirectory']}, function (dir_name) {
        // fileNames is an array that contains all the selected
       if(dir_name) {
            $("#base_dir").val(dir_name[0]);
            reload_base_dir();
       }
    });
}

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
    if (directories) {
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
    }

    $("#breadcrumb").html("<i class='fa fa-folder'></i> "+base_dir);
}

function get_directories(base_dir) {
    if(fs.existsSync(base_dir)) {
        return fs.readdirSync(path.normalize(base_dir)).filter(function(file) {
            return fs.statSync(path.join(base_dir, file)).isDirectory();
        });
    } else {
        return null;
    }
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

            if (extension == 'mp4' || (extension == 'avi' && !has_mp4(full_path))) {
                html += '<div class="col-sm-4">' +
                            '<video width="320" height="240" tabindex="0" controls>' +
                                '<source src="'+full_path+'" type="video/mp4">' +
                                '<source src="'+full_path+'" type="video/avi">' +
                            '</video>' +
                            '<button class="btn btn-primary btn-flat" onclick="show_player('+"'"+full_path+"'"+')"><i class="fa fa-video-camera"></i>  '+full_path.split("/").pop()+'</button>' +
                        '</div>';
            }
        });
        html += '</div>';

        html += '</div>';
        $('#tab-content').append(html);
    }
    $("#breadcrumb").html("<i class='fa fa-folder'></i> "+full_subdir);
}

function has_mp4(video) {
    var mp4file = path.normalize(video.substr(0, video.lastIndexOf(".")) + ".mp4");
    return fs.existsSync(mp4file) ? true : false;
}

function show_player(video) {
    $("#navtabs").hide();
    $("#tab-content").hide();

    $("#player").show();
    $("#story").show();

    $("#player").html("");
    $("#story").html("");

    var extension = video.split('.').pop();

    if (extension == 'avi') {
        var mp4file = path.normalize(video.substr(0, video.lastIndexOf(".")) + ".mp4");
        ffmpeg(video).format('mp4').save(mp4file);

        var html = '<video width="100%" id="video_player" tabindex="0" controls>' +
                '<source src="'+mp4file+'" type="video/mp4">' +
                '</video>' +
                '<input type="hidden" id="video_full_path" value="'+mp4file+'">';
    } else {
        var html = '<video width="100%" id="video_player" tabindex="0" controls>' +
                '<source src="'+video+'" type="video/mp4">' +
                '</video>' +
                '<input type="hidden" id="video_full_path" value="'+video+'">';
    }

    $("#player").html(html);

    load_stories(video);

    $("#breadcrumb").html("<i class='fa fa-film'></i> "+video);

    $("#video_player").focus();
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
                        '<span class="text-danger pull-right"><a href="#" onclick="update_track('+"'"+story.timeline+"'"+')"><strong>'+story.timeline+'</strong></a></span>' +
                        story.story +
                    '</li>';
        });
    }
    html += '</ul>';

    $("#story").html(html);
}