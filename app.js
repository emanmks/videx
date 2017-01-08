$(document).ready(function() {
    //initMenu();

    var base_dir = $('[name=base_dir]').val();
    var directories = get_directories(base_dir);
    show_directories(base_dir, directories);

    $("#base_dir").keypress(function(e) {
        if(e.which == 13) {
            reload_base_dir();
            return false;
        }
    });

    $("#navbar-search-input").keypress(function(e) {
        if (e.which == 13) {
            find_in_files();
            return false;
        }
    });

    $("#navbar-search-input").focus();

});