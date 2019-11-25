<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\MongoDB\Plantilla;
//controlador encargado de la seccion de los usuarios
class PlantillaController extends Controller
{

    //metodo para llamar la vista principal de usuarios
    public function plantillasTraerTodas(){

        //devuleve la vista
	$plantillas = Plantilla::all();
        return response()->json(['plantillas' => $plantillas ]);
    }



    


}
