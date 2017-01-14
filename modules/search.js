function find_in_files() {
    var param = $("#navbar-search-input").val();
    var base_dir = $("#base_dir").val();

    if(fs.existsSync(path.normalize(base_dir))) {
        $("#navtabs").show();
        $("#tab-content").show();
        
        $('#navtabs').html("");
        $('#tab-content').html("");

        $("#player").hide();
        $("#story").hide();

        $("#navtabs").html("<li class='active'><a href='#search-result' data-toggle='tab'>Search Result</a></li>");

        findInFiles.find(param, path.normalize(base_dir), '.json$')
            .then(function (results) {
                var html = '<div class="tab-pane active" id="search-result">';
                html += '<div class="row">';

                for(var result in results) {
                    var res = results[result];
                    var video = path.normalize(result.substr(0, result.lastIndexOf(".")) + ".mp4");
                    html += '<div class="col-sm-4">' +
                                '<video width="320" height="240" controls>' +
                                    '<source src="'+video+'" type="video/mp4">' +
                                    '<source src="'+video+'" type="video/avi">' +
                                '</video>' +
                                '<button class="btn btn-primary btn-flat" onclick="show_player('+"'"+video+"'"+')"><i class="fa fa-video-camera"></i>  '+video.split("/").pop()+'</button>' +
                                '<p><small><strong class="text-danger">'+ res.count +'</strong> times in <small class="text-primary">'+video.replace(base_dir+"/", "")+'</small></small></p>' +
                            '</div>';
                }

                html += '</div></div>';
                $("#tab-content").append(html);
            });
    }
}