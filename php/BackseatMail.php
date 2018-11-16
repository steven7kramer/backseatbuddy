<?php

header('Content-Type: application/json');

// Get all cookies
session_start();

// Store the array to be encoded as JSON
$result = array();
$link;

// Checks if the AJAX request contains a function name
if (!isset($_POST['functionname'])) {
    $result['error'] = 'No function name given!';
}

// If a function name is given...
if (!isset($result['error'])) {

    // Based on function name do some action
    switch ($_POST['functionname']) {
        case 'register':
            // Register a new user
            if (sendRegistrationEmail()) {
                $result['mail'] = 'success';
            } else {
                $result['mail'] = 'failure';
            }
            break;
        case 'recover':
            // Send a password recovery email
            sendRecoveryEmail();
            break;
        default:
            // Function not found
            $result['error'] = 'Specified function not found';
            break;
    }
}

// Output the result
echo json_encode($result);


// ------------------------------------------------------------------ //
//                         MAIN FUNCTIONS                             //
// ------------------------------------------------------------------ //

/*
 *  Send an e-mail to the e-mail adress if a user registers a new account.
 *  The e-mail contains a randomly generated value that should be entered
 *  on a new page
 *
 */

function sendRegistrationEmail() {

    // Connect to the database
    if (!connect()) {
        $GLOBALS['result']['error'] = "error";
        return;
    }

    // Bepaal waar de mail naar verzonden wordt
    $to = $_POST['uEmail'];;

    // Create onderwerp van de mail
    $subject = 'Welkom bij de club!';

    // Set up headers
    $headers = "From: Cas | Backseat Buddy <cas@caswognum.nl>  \r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

    // Create message
    $message = "<html><body>\r\n";
    $message .= "<img src='https://caswognum.nl/images/logo-min.jpg' style='width:200px' alt='Logo' /></br></br>\r\n";
    $message .= "<h3 style='color: #e83273'>Welkom bij Backseat Buddy!</h3> \r\n";
    $message .= "<p style='color: #333'>Wat leuk dat je je aangemeld hebt voor het Backseat Buddy prototype!\r\n";
    $message .= "We zijn hard aan het werk om de leukste app voor op de achterbank te ontwikkelen en voegen regelmatig nieuwe functies toe!";
    $message .= "Heb je suggesties of opmerkingen? We horen ze graag! <a href='mailto:steven@backseat-buddy.com'>Steven</a> (steven@backseat-buddy.com) staat je graag te woord!</p></br>\r\n";
    $message .= "<table rules='all' style='border-color: #666;' cellpadding='10'>";
    $message .= "<tr><td><strong>Email:</strong> </td><td>" . strip_tags($_POST['uEmail']) . "</td></tr>";
    $message .= "<tr><td><strong>Code:</strong> </td><td>" . strip_tags($_POST['uPassword']) . "</td></tr>";
    $message .= "</table> \r\n";
    $message .= "</br></br> \r\n";
    $message .= "</body></html> \r\n";

    // Send email
    $mailSuccess = mail($to, $subject, $message, $headers);
    $GLOBALS['result']['mail1'] = $mailSuccess;

    if ($mailSuccess) {
        // Create onderwerp van de mail
        $subject = 'Nieuwe Backseat Buddy gebruiker';

        $to = "caswognum@hotmail.com, skramerproducties@gmail.com \r\n";

        // Set up headers
        $headers = "From: Cas | Backseat Buddy <cas@caswognum.nl> \r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

        // Create message
        $message = "<html><body>\r\n";
        $message .= "<img src='https://caswognum.nl/images/logo-min.jpg' style='width:200px' alt='Logo' /></br></br>\r\n";
        $message .= "<h3 style='color: #e83273'>Feestje! Er is een nieuwe user.</h3>\r\n";
        $message .= "<p style='color: #333'>Relevante statistieken zouden we hier (en in de tabel) kunnen plaatsen</p></br>\r\n";
        $message .= "<table rules='all' style='border-color: #666;' cellpadding='10'>";
        $message .= "<tr><td><strong>Email:</strong> </td><td>" . strip_tags($_POST['uEmail']) . "</td></tr>";
        $message .= "</table>\r\n";
        $message .= "</body></html>\r\n";

        // Send email
        $mailSuccess = mail($to, $subject, $message, $headers);
        $GLOBALS['result']['mail2'] = $mailSuccess;
    }

    return $mailSuccess;

}

?>
