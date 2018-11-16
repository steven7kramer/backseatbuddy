// function to open the menu
function openNav() {
    var width = $( document ).width();
    var height = $( document ).height();

    $("#toggleBtnMenu").toggleClass('active');

    if ($("#toggleBtnMenu").hasClass('active')) {
        $("#toggleMenuIcon").css('color', 'white');
    } else {
        $("#toggleMenuIcon").css("color", "black")
    }

    if (width >= height) {
        $('#sidenav').css({'width': '400px'});
        $('#navlogo').css('width', '280px');
    } else {
        $('#sidenav').css('width', '100%');
        $('#navlogo').css('width', width * 0.6 + "px");
    }
}

// function to close the menu
function closeNav() {
    $('#sidenav').css({'width': '0', 'box-shadow': 'none'});

    $("#toggleBtnMenu").toggleClass('active');

    if ($("#toggleBtnMenu").hasClass('active')) {
        $("#toggleMenuIcon").css('color', 'white');
    } else {
        $("#toggleMenuIcon").css("color", "black")
    }
}
