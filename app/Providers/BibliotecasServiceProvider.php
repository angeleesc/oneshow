<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Libararies\Bibliotecas;

class BibliotecasServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(Biblioteca::class, function($app) {
            return new Bibliotecas();
        });
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
