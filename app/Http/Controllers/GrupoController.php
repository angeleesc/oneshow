<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\MongoDB\Evento;
use App\Models\MongoDB\Grupo;
use MongoDB\BSON\ObjectID;
use Illuminate\Support\Str;
use Carbon\Carbon;
use DB, DataTables, Image, Storage, File, Auth, Mail, QrCode;

//controlador encargado de los invitados

class GrupoController extends Controller
{
  public function addGrupo(Request $request){
    $input = $request->all();
    //capturo los datos y los acomodo en un arreglo
    $data = [
      'nombre'              => strtoupper($input['nombre']),
      'borrado'             => false
    ];

    $grupo = new Grupo;
    $grupo->Nombre              = $data['nombre'];
    $grupo->Borrado             = $data['borrado'];


    //verifico si fue exitoso el insert en la bd
    if($grupo->save()){
        return response()->json(['code' => 200,'grupo'=>$grupo]);
    }else{
        return response()->json(['code' => 500]);
    }
  }

  public function getGrupo($id){
    $registro =  Grupo::find($id);
    if($registro){
        return json_encode(['code' => 200,'grupo'=>$registro]);
    }else{
        return response()->json(['code' => 500]);
    }
        
  }

  public function getGrupos(){
    $grupos = Grupo::borrado(false)->get();
    //devuelvo un json con la data
    return response()->json([
        'code' => 200,
        'grupos' => $grupos
    ]);
  }

  public function setGrupo(Request $request){
    //capturo el valor del id
    $input = $request->all();
    $id = $input['id'];
    $registro =  Grupo::find($id);
    if($registro){
        $registro->Nombre = $input['nombre'];
        if($registro->save()){
            return response()->json(['code' => 200,'grupo'=>$registro]);
        }else{
            return response()->json(['code' => 500]);
        }
    }else{
        return response()->json(['code' => 600]);
    }
  }

  public function deleteGrupo(Request $request){
      //capturo el valor del id
      $input = $request->all();
      $id = $input['id'];

      //valido que venga el id sino mando un error
      if($id){

          //ubico el id en la bd
          $registro = Grupo::find($id);
          $registro->Borrado = true;

          //valido que de verdad sea borrado en caso de que no arrojo un error
          if($registro->save()){

              return json_encode(['code' => 200]);
          }else{
              return json_encode(['code' => 500]);
          }

      }else{

          return json_encode(['code' => 600]);
      }

  }

}
