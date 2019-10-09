<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" style="font-family: Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
<head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title></title>

    <style type="text/css">
        img {
            max-width: 100%;
        }
        body {
            -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6;
        }
        body {
            background-color: #f6f6f6;
            color: #000000;
        }

        #boton{
            font-size:16px;
            color:#ffffff;
            font-weight: bold;
            text-decoration:none;
            background-color:#171a1d;
            border-top:11px solid #171a1d;
            border-bottom:11px solid #171a1d;
            border-left:20px solid #171a1d;
            border-right:20px solid #171a1d;
            border-radius:3px;
            display:inline-block;
        }

        @media only screen and (max-width: 640px) {
            h1 {
                font-weight: 600 !important; margin: 20px 0 5px !important;
            }
            h2 {
                font-weight: 600 !important; margin: 20px 0 5px !important;
            }
            h3 {
                font-weight: 600 !important; margin: 20px 0 5px !important;
            }
            h4 {
                font-weight: 600 !important; margin: 20px 0 5px !important;
            }
            h1 {
                font-size: 22px !important;
            }
            h2 {
                font-size: 18px !important;
            }
            h3 {
                font-size: 16px !important;
            }
            .container {
                width: 100% !important;
            }
            .content {
                padding: 10px !important;
            }
            .content-wrap {
                padding: 10px !important;
            }

        }
    </style>
</head>
<body itemscope itemtype="http://schema.org/EmailMessage" style="font-family: Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6; background: #f6f6f6; margin: 0;">
<table class="body-wrap" style="font-family: Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background: #f6f6f6; margin: 0;">
    <tr style="font-family: Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
        <td style="font-family: Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
        <td class="container" width="600" style="font-family: Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;" valign="top">
            <div class="content" style="font-family: Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;">
                <table class="main" width="100%" cellpadding="0" cellspacing="0" style="font-family: Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background: #fff; margin: 0; border: 1px solid #e9e9e9;">
                    <tr style="font-family:  Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                        <td class="alert alert-warning" style="box-sizing: border-box; font-size: 1.4em; vertical-align: top; color: #fff; font-weight: bold; text-align: center; border-radius: 3px 3px 0 0; background: #171a1d; margin: 0; padding: 10px;" align="center" valign="top">
                            Recuperación de Contraseña
                        </td>
                    </tr>
                    <tr style="font-family: Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                        <td class="content-wrap" style="font-family: Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px;" valign="top">
                            <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                <tr style="font-family: Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                    <td id="contenido" class="content-block" style="font-family: Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">

                                        <div style="color: #000000; font-size: 1.1em">

                                            Saludos,<br><br>

                                            Utiliza el siguiente botón para acceder a cambiar tu contraseña:

                                            <br><br>

                                            <div style="text-align: center">
                                                <a id="boton" shape="rect" href="{{ url('user/change/password', [$token]) }}" target="_blank">
                                                    Cambiar Contraseña
                                                </a>
                                            </div>

                                            <br>

                                        </div>

                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <div class="footer" style="font-family: Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; clear: both; color: #000; margin: 0; padding: 20px;">
                    <table width="100%" style="font-family: Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                        <tr style="font-family: Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                            <td class="aligncenter content-block" style="font-family: Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 12px; vertical-align: top; text-align: center; margin: 0; padding: 0 0 20px;" align="center" valign="top">
                                {{ Config::get('oneshow.footer-mail') }}
                            </td>
                        </tr>
                    </table>
                </div></div>
        </td>
        <td style="font-family: Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
    </tr>
</table>
</body>
</html>
