jQuery(document).ready(function() {
    getCollectiblesFromDatabase();
});

function getCollectiblesFromDatabase() {
    console.log("Accessing Database...");

    jQuery.ajax({
        type: "POST",
        url: "../php/BackseatDB.php",
        datatype: 'json',
        data: {functionname: 'getCollectibles'},

        success: function(obj, textstatus) {
            if (!('error' in obj)) {
                addCollectibles(obj.collectibles);
            } else {
                handleDBError(obj.error)
            }
        }
    });
}


function addCollectibles(data) {
    console.log('Finished with the database: SUCCESS');
    console.log(data);

    var counter = 0;
    var NUMBER_OF_CELLS_COLLECTIBLES = 6;

    for (var i = 0; i < data.length; i++) {

        var color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);

        var card = "";
        card += '<li class="chew-cell">';
        card += '<div class="chew-card">';
        card += '<div class="card">';
        card += '<div style="width:100%; height:100%; background-color: #1d71b8;' + color + ';">';
        card += '<img src="../images/collectibles/' + data[i].cImage + '" alt="image" style="width:60%; height:60%; display: block; margin: 0 auto;">';
        card += '</div>';
        card += '<div class="container">';
        card += '<p><b>' + data[i].cTitle + '</b></p>';
        card += '<p>' + data[i].cDescr + '</p>';
        card += '</div></div></div></li>';

        jQuery("#collectibles-row").append(card);
        counter++;
    }

    while (counter % NUMBER_OF_CELLS_COLLECTIBLES != 0) {
        var ghost = "<li class='chew-cell chew-cell--ghost'></li>";
        jQuery("#collectibles-row").append(ghost);
        counter++;
    }
}

// function to handle an error trying to obtain the route details
function handleDBError(e) {
    console.error('Finished with the database: ERROR');
    console.error(e);
}
