$(document).ready(function() {

    $(".container").hide();
    $("#submit-spawn").hide()

    window.addEventListener('message', function(event) {
        var data = event.data;
        if (data.type === "ui") {
            if (data.status == true) {
                $(".container").fadeIn(250);
            } else {
                $(".container").fadeOut(250);
            }
        }

        if (data.action == "setupAppartements") {
            setupApps(data.locations)
        }
    })
})

var currentLocation = null

$(document).on('click', '.location', function(evt){
    evt.preventDefault(); //dont do default anchor stuff
    var location = $(this).data('location'); //get the text
    var type = $(this).data('type'); //get the text
    var label = $(this).data('label'); //get the text
    if (type !== "lab") {
        $("#spawn-label").html("Confirm")
        $("#submit-spawn").attr("data-location", location);
        $("#submit-spawn").attr("data-type", type);
        $("#submit-spawn").fadeIn(100)
        $.post('https://qb-spawn/setCam', JSON.stringify({
            posname: location,
            type: type,
        }));
        if (currentLocation !== null) {
            $(currentLocation).removeClass('selected');
        }
        $(this).addClass('selected');
        currentLocation = this
    }
});

$(document).on('click', '#submit-spawn', function(evt){
    evt.preventDefault(); //dont do default anchor stuff
    var location = $(this).data('location');
    var spawnType = $(this).data('type');
    $(".container").addClass("hideContainer").fadeOut("9000");
    setTimeout(function(){
        $(".hideContainer").removeClass("hideContainer");
    }, 900);
    if (spawnType == "appartment") {
        $.post('https://qb-spawn/chooseAppa', JSON.stringify({
            appType: location,
        }));
    }
});

function setupApps(apps) {
    var parent = $('.spawn-locations')
    $(parent).html("");

    $(parent).append('<div class="loclabel" id="location" data-location="null" data-type="lab" data-label="Seleciona um Apartamento"><p><span id="null">Seleciona um Apartamento</span></p></div>')

    $.each(apps, function(index, app){
        $(parent).append('<div class="location" id="location" data-location="'+app.name+'" data-type="appartment" data-label="'+app.label+'"><p><span id="'+app.name+'">'+app.label+'</span></p></div>')
    });

    $(parent).append('<div class="submit-spawn" id="submit-spawn"><p><span id="spawn-label"></span></p></div>');
    $('.submit-spawn').hide();
}