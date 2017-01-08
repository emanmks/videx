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
            return;
        }
                        
        alert("The file has been succesfully submitted");
        show_player(video_full_path);
     });
}