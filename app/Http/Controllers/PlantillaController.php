<?php

namespace App\Http\Controllers;


class PlantillaController extends Controller
{

  
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
