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