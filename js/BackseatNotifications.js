jQuery(document).ready(function() {
    // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    //alert("Deze browser ondersteunt helaas geen meldingen! Je zult het zonder moeten doen.");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {

    if (!sessionStorage.getItem("welcomenotification")) {
        var options = {
            body: "Goed dat je er weer bent!",
            icon: "../images/sofieCircle.png"
        }

        var notification = new Notification("Welkom terug!", options);
        sessionStorage.setItem("welcomenotification", true);
    }
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
          var options = {
              body: "Via deze notificaties houd ik je graag op de hoogte van de laatste ontwikkelingen op ons avontuur.",
              icon: "../images/sofieCircle.png"
          }

          var notification = new Notification("Leuk dat je er bent!", options);
      }
    });
  }

});
