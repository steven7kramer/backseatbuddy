<!--
Title:      Backseat Buddy Prototype
Author:     Cas Wognum
Descr:      A very minimalistic prototype for
            Backseat Buddy, an app that uses
            GPS to offer location based content
URL:        N.A.
Version:    0.1
-->

<?php include("includes/session.php") ?>

<!DOCTYPE html>
<html lang="nl">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="utf-8">
        <title>Backseat Buddy - Prototype</title>

        <!-- CSS -->
        <link rel="stylesheet" href="../css/bsb_style.css">
        <link rel="stylesheet" href="../css/admin.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">


        <!-- Libraries -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <script src="/lib/autosize-master/dist/autosize.js"></script>
        <!--<link href="https://use.fontawesome.com/releases/v5.0.6/css/all.css" rel="stylesheet">-->

        <!-- Javascript -->
        <script src="../js/BackseatNAV.js"></script>
        <?php readfile("includes/tagmanagerHeader.php") ?>

    </head>

    <body>

        <!-- NAVIGATION -->
        <?php include("includes/menu.php") ?>
        <?php readfile("includes/tagmanagerBody.php") ?>

        <div id="main" class = "width-100 height-100">
            <form action="../php/BackseatDB.php" title="" method="post" class="backseat-form" id="backseatFeedbackForm" enctype="multipart/form-data">
                <h1> Geef ons je feedback! </h1>
                <h4> Help ons Backseat Buddy te verbeteren! </h4>

                Welk cijfer zou je ons nu geven? <br />
                <i> 5 is het hoogst, 1 is het laagst! </i>
                <div class="custom-select">
                    <select id="cijfer" name="cijfer" required />
                        <option value="5"> 5 </option>
                        <option value="4"> 4 </option>
                        <option value="3"> 3 </option>
                        <option value="2"> 2 </option>
                        <option value="1"> 1 </option>
                    </select><br>
                </div>

                Wat vind je leuk? <br />
                <textarea id="goed" name="goed" cols="40" rows="5" required></textarea><br />

                Wat kan er beter? <br />
                <textarea id="kanbeter" name="kanbeter" cols="40" rows="5" required></textarea>

                <input type="hidden" id="functionname" name="functionname" value="giveFeedback">
                <input type="submit" value="Verstuur!">

                <div id="formFeedback"></div>

            </form>

            <script>//for changing the dropdown menu to a custom one
              var x, i, j, selElmnt, a, b, c;
              /*look for any elements with the class "custom-select":*/
              x = document.getElementsByClassName("custom-select");
              for (i = 0; i < x.length; i++) {
                selElmnt = x[i].getElementsByTagName("select")[0];
                /*for each element, create a new DIV that will act as the selected item:*/
                a = document.createElement("DIV");
                a.setAttribute("class", "select-selected");
                a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
                x[i].appendChild(a);
                /*for each element, create a new DIV that will contain the option list:*/
                b = document.createElement("DIV");
                b.setAttribute("class", "select-items select-hide");
                for (j = 0; j < selElmnt.length; j++) {
                  /*for each option in the original select element,
                  create a new DIV that will act as an option item:*/
                  c = document.createElement("DIV");
                  c.innerHTML = selElmnt.options[j].innerHTML;
                  c.addEventListener("click", function(e) {
                      /*when an item is clicked, update the original select box,
                      and the selected item:*/
                      var y, i, k, s, h;
                      s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                      h = this.parentNode.previousSibling;
                      for (i = 0; i < s.length; i++) {
                        if (s.options[i].innerHTML == this.innerHTML) {
                          s.selectedIndex = i;
                          h.innerHTML = this.innerHTML;
                          y = this.parentNode.getElementsByClassName("same-as-selected");
                          for (k = 0; k < y.length; k++) {
                            y[k].removeAttribute("class");
                          }
                          this.setAttribute("class", "same-as-selected");
                          break;
                        }
                      }
                      h.click();
                  });
                  b.appendChild(c);
                }
                x[i].appendChild(b);
                a.addEventListener("click", function(e) {
                    /*when the select box is clicked, close any other select boxes,
                    and open/close the current select box:*/
                    e.stopPropagation();
                    closeAllSelect(this);
                    this.nextSibling.classList.toggle("select-hide");
                    this.classList.toggle("select-arrow-active");
                  });
              }
              function closeAllSelect(elmnt) {
                /*a function that will close all select boxes in the document,
                except the current select box:*/
                var x, y, i, arrNo = [];
                x = document.getElementsByClassName("select-items");
                y = document.getElementsByClassName("select-selected");
                for (i = 0; i < y.length; i++) {
                  if (elmnt == y[i]) {
                    arrNo.push(i)
                  } else {
                    y[i].classList.remove("select-arrow-active");
                  }
                }
                for (i = 0; i < x.length; i++) {
                  if (arrNo.indexOf(i)) {
                    x[i].classList.add("select-hide");
                  }
                }
              }
              /*if the user clicks anywhere outside the select box,
              then close all select boxes:*/
              document.addEventListener("click", closeAllSelect);
            </script>

            <script type='text/javascript'>
            // auto resize textarea based on content
            autosize(document.querySelectorAll('textarea'));


                /* attach a submit handler to the form */
                $("#backseatFeedbackForm").submit(function(event) {

                  /* stop form from submitting normally */
                  event.preventDefault();

                  /* get the action attribute from the <form action=""> element */
                  var $form = $( this ),
                      url = $form.attr( 'action' );

                  /* Send the data using post with element id name and name2*/
                  var posting = $.post( url, {
                      cijfer: $('#cijfer').val(),
                      goed: $('#goed').val(),
                      kanbeter: $('#kanbeter').val(),
                      functionname: $('#functionname').val()
                  });

                  /* Alerts the results */
                  posting.done(function( data ) {
                    var resetForm = document.getElementById("backseatFeedbackForm");
                    $('#formFeedback').css("background-color", "#2ecc71");
                    $('#formFeedback').text('Te gek! We hebben je feedback ontvangen en gaan er mee aan de slag. Keep on rocking!');
                    $('#formFeedback').fadeIn();
                    resetForm.reset();
                  });
                });
            </script>
        </div>
  </body>
</html>
