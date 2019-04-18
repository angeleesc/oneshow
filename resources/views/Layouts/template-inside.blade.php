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

    </head>
    <body>

        <div class="wrapper">

            <div class="page-wrapper">

                @include('Layouts.side-menu')

                @include('Layouts.header')

                <div class="content-wrapper">

                    <header class="page-header">

                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-sm-12 col-md-12">
                                    @yield('heading')
                                </div>
                            </div>
                        </div>

                    </header>

                    <div id="sweet" class="container-fluid">

                        @yield('content')

                        @include('Layouts.footer')

                    </div>

                </div>

            </div>

        </div>

        <script src="{{ asset('js/app.js') }}"></script>
        <script src="{{ asset('js/vendor.js') }}"></script>

        @yield('javascript')

    </body>
</html>
