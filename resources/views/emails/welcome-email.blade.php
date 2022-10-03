<!DOCTYPE html>
<html>
<head>

  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Welcome to Financial Advisor Ally</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
  /**
   * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
   */

   @import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap");
/* @import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@200;300;400,500,600,700&display=swap"); */
  @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@200;400;600;800&display=swap");
  /**
   * Avoid browser level font resizing. 
   * 1. Windows Mobile
   * 2. iOS / OSX
   */
   html{
    font-family: "Bebas Neue", Arial, Helvetica, sans-serif;
   }
  body,
  table,
  td,
  a {
    -ms-text-size-adjust: 100%; /* 1 */
    -webkit-text-size-adjust: 100%; /* 2 */
  }

  /**
   * Remove extra space added to tables and cells in Outlook.
   */
  table,
  td {
    mso-table-rspace: 0pt;
    mso-table-lspace: 0pt;
  }

  /**
   * Better fluid images in Internet Explorer.
   */
  img {
    -ms-interpolation-mode: bicubic;
  }

  /**
   * Remove blue links for iOS devices.
   */
  a[x-apple-data-detectors] {
    font-family: inherit !important;
    font-size: inherit !important;
    font-weight: inherit !important;
    line-height: inherit !important;
    color: inherit !important;
    text-decoration: none !important;
  }

  /**
   * Fix centering issues in Android 4.4.
   */
  div[style*="margin: 16px 0;"] {
    margin: 0 !important;
  }

  body {
    width: 100% !important;
    height: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /**
   * Collapse table borders to avoid space between cells.
   */
  table {
    border-collapse: collapse !important;
  }

  a {
    color: #00b6ff;
  }

  img {
    height: auto;
    line-height: 100%;
    text-decoration: none;
    border: 0;
    outline: none;
  }
  </style>

</head>
<body style="background-color: white;">

  <!-- start preheader -->
  <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
    Your login info is...
  </div>
  <!-- end preheader -->

  <!-- start body -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%">

    <!-- start logo -->
    <tr>
      <td align="center" bgcolor="white">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="center" valign="top" style="padding: 36px 24px;">
              <a href="{{ url('') }}/" target="_blank" style="display: inline-block;">
                <img src="{{ url('') }}/images/ally_image.png" alt="Logo" border="0" style="display: block; width: 48px; max-width: 350px; min-width: 350px;">
              </a>
            </td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end logo -->

    <!-- start hero -->
    <tr>
      <td align="center" bgcolor="white">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="center" bgcolor="white" style="padding: 0; border-left: 1px solid black; border-right: 1px solid black; border-top: 1px solid black;">
              <!-- <h1 style=" color:#ea2b23;margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px; ">Welcome to Producer Confidential</h1> -->
            </td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end hero -->

    <!-- start copy block -->
    <tr>
      <td align="center" bgcolor="white">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="white" style=" border-left: 1px solid black; border-right: 1px solid black; color:black;padding: 24px; font-family: 'Nunito', sans-serif; font-size: 18px; line-height: 24px;">
                <p style="margin: 0;">
                    Here are your temporary login credentials...
                    <br/>
                    <br/>
                    <div style="text-align:center">
                        <span style="color: #BAD54A">Login Here: </span><a href="{{ $link }}">{{ url('') }}</a>
                        <br/>
                        <br/>
                        <span style="color: #BAD54A">UN: {{ $email }}</span>
                        <br/>
                        <span style="color: #BAD54A">PW: {{ $raw_password }}</span>
                    </div>
                    <br/>
                    You will be able to reset your password inside of your advisor portal.
                    <br/><br/>
                    If you have any questions, or need help accessing your portal, please email us at team@financialadvisorally.com
                    <br/>
                </p>
            </td>
          </tr>
          <!-- end copy -->
         
   
          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="white" style=" border-left: 1px solid black; border-right: 1px solid black; color:black;
            font-family: 'Nunito', sans-serif; font-size: 18px; line-height: 24px; border-bottom: 1px solid black">
              <!-- <p style="margin: 0;">Cheers,<br> The Team @ Producer Confidential</p> -->
            </td>
          </tr>
          <!-- end copy -->

        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end copy block -->

    <!-- start footer -->
    <tr>
      <td align="center" bgcolor="white" style="padding: 24px;">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->

        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="center" valign="top" style="padding: 36px 24px;">
              <a href="{{ url('') }}/" target="_blank" style="display: inline-block;">
                <img src="{{ url('') }}/images/FAA_email_SIG_new.png" alt="Logo" border="0" width=" " style="display: block; ">
              </a>
            </td>
          </tr>
        </table>

        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end footer -->

  </table>
  <!-- end body -->

</body>
</html>