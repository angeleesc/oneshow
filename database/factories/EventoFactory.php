<?php

use Faker\Generator as Faker;
use Illuminate\Support\Str;
use App\Models\MongoDB\Evento;

$factory->define(Evento::class, function (Faker $faker) {
    return [
        'Nombre' => $faker->name,
        'Prueba' => true
    ];
});

?>