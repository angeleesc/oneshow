<?php

namespace App\Http\Controllers;

//controlador encargado de la seccion de los usuarios
class PlantillaController extends Controller
{

    //metodo para llamar la vista principal de usuarios
    public function plantillasTraerTodas()
    {

        //devuleve la vista
        // $plantillas = Plantilla::all();
        //   ;
        $url = $_SERVER['DOCUMENT_ROOT'] . '/plantillas';
        $files = scandir($url);

        $file_list = [];
        foreach ($files as  $value) {

            if ($value == '..' or $value == '.') {
                // $file_list[] = ['files' => $value];
            } else {
                $file_list[] = ['_id' => $value, 'nombre' => $value];
            }
        }
        return response()->json(['plantillas' => $file_list]);

    }
}
