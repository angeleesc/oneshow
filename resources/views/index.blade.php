<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="api-base-url" content="{{ url('/') }}" />
        <link rel="icon" type="image/png" href="{{ asset('images/favicon.ico') }}">

        <title>{{ config('oneshow.title') }}</title>

        <!-- Fonts -->
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,bolditalic">
        <link href="https://fonts.googleapis.com/css?family=Roboto+Condensed:regular,bold,italic,bolditalic" rel="stylesheet">

        <link rel="stylesheet" href="{{ asset('css/vendor.css') }}">
        <link rel="stylesheet" href="{{ asset('css/main.css') }}">
        <style>
            body {
            overflow: scroll!important;
            overflow-x: hidden!important;    
            }
        </style>
    </head>
    <body>

        <div class="wrapper">

            <div class="page-wrapper">

                <div id="app" data-url="{{ url('/') }}"></div>
                

            </div>

        </div>

        <script src="{{ asset('js/app.js') }}"></script>
        <script src="{{ asset('js/vendor.js') }}"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.1/mqttws31.min.js" type="text/javascript"></script>
    </body>
</html>