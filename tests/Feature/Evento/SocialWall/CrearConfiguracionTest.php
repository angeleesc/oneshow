<?php

namespace Tests\Feature\Evento\SocialWall;

use Tests\TestCase;
use App\Models\MongoDB\Evento;

class CrearConfiguracionTest extends TestCase
{

    /**
     * Evaluar registro de configuracion
     *
     * @test
     * @return void
     */
    public function registrarConfiguracionTest()
    {
        $eventoId = factory('App\Models\MongoDB\Evento')->create()->_id;
        
        $respuesta = $this->post('api/eventos/social-wall/configuracion', array_merge(
                ['eventoId' => $eventoId],
                $this->generarConfiguracion()
            )
        );

        Evento::destroy($eventoId);

        $respuesta->assertStatus(200);
    }

    /**
     * Generar datos de configuracion para la prueba
     * 
     * @return array
     */
    private function generarConfiguracion() {

        $faker = \Faker\Factory::create();

        return [
            'preferencias' => [
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
            ]
        ];
    }
}
