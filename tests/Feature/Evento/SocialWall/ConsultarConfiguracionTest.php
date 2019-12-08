<?php

namespace Tests\Feature\Evento\SocialWall;

use Tests\TestCase;
use App\Models\MongoDB\Evento;

class ConsultarConfiguracionTest extends TestCase
{

    /**
     * Evaluar consulta de configuracion
     *
     * @test
     * @return void
     */
    public function solicitarConfiguracionTest()
    {
        $eventoId = factory('App\Models\MongoDB\Evento')->create()->_id;

        $this->registrarConfiguracion($eventoId);

        $respuesta = $this->get('api/eventos/social-wall/configuracion/' . $eventoId);

        Evento::destroy($eventoId);

        $respuesta->assertStatus(200);
    }

    /**
     * Registrar datos de configuracion para la prueba
     * 
     * @param int $eventoId
     * @return void
     */
    private function registrarConfiguracion($eventoId) {

        $faker = \Faker\Factory::create();

        $configuracionGenerada = [
            'tema' => $faker->randomElement([
                'sb-modern-light',
                'sb-metro-dark',
                'sb-modern2-light',
                'sb-default-light',
                'sb-flat-light',
                'sb-modern-dark'
            ]),
            'presentacion' => $faker->randomElement([
                'wall',
                'feed',
                'timeline'
            ]),
            'moderarContenido' => $faker->randomElement([true, false])
        ];

        $evento = Evento::find($eventoId);
        $evento->SocialWall = $configuracionGenerada;
        $evento->save();
    }
}
