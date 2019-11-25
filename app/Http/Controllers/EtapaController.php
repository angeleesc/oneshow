<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\MongoDB\Evento;
use App\Models\MongoDB\Etapa;
use MongoDB\BSON\ObjectID;
use Illuminate\Support\Str;
use Carbon\Carbon;
use DB, DataTables, Image, Storage, File, Auth, Mail, QrCode;

//controlador encargado de los invitados

class EtapaController extends Controller
{
  public function addEtapa(Request $request){
    $input = $request->all();
    $idEvento = $input['id-evento'];
    //capturo los datos y los acomodo en un arreglo
    $data = [
        'nombre'              => strtoupper($input['nombre-etapa']),
        'borrado'             => false
      ];
  
      $etapa = new Etapa;
      $etapa->Nombre              = $data['nombre'];
      $etapa->Borrado             = $data['borrado'];
  
      //verifico si fue exitoso el insert en la bd
      if($etapa->save()){
        $evento =  Evento::find($idEvento);
        if($evento){
            if($evento->etapas){
                $etapas = $evento->etapas;
                array_push($etapas, new ObjectID($etapa->_id));
                $evento->etapas = $etapas; 
            }else{
                $evento->etapas = [new ObjectID($etapa->_id)];
            }
            if($evento->save()){
                return response()->json(['code' => 200,'etapa'=>$etapa]);
            }else{
                return response()->json(['code' => 600]);
            }
        }
      }else{
          return response()->json(['code' => 500]);
      }
    
    
  }

  public function getEtapasEvento($id){
    $evento =  Evento::find($id);
    $etapas = [];
    if($evento){
        if($evento->etapas){
            $arregloEtapas = $evento->etapas;
            for($i = 0; $i < count($arregloEtapas); $i++){
                $etapa =  Etapa::find($arregloEtapas[$i]);
                array_push($etapas,$etapa);
            }
        }
        return response()->json(['code' => 200,'etapas'=>$etapas,'evento'=>$evento]);
    }
    return response()->json(['code' => 500]);
    
  }

  public function getEtapa($id){
    $registro =  Etapa::find($id);
    if($registro){
        return json_encode(['code' => 200,'etapa'=>$registro]);
    }else{
        return response()->json(['code' => 500]);
    }
        
  }

  public function getetapas(){
    $Etapas = Etapa::borrado(false)->get();
    //devuelvo un json con la data
    return response()->json([
        'code' => 200,
        'etapas' => $etapas
    ]);
  }

  public function setEtapa(Request $request){
    //capturo el valor del id
    $input = $request->all();
    $id = $input['id'];
    $registro =  Etapa::find($id);
    if($registro){
        $registro->Nombre = $input['nombre'];
        if($registro->save()){
            return response()->json(['code' => 200,'etapa'=>$registro]);
        }else{
            return response()->json(['code' => 500]);
        }
    }else{
        return response()->json(['code' => 600]);
    }
  }

  public function deleteEtapa(Request $request){
      //capturo el valor del id
      $input = $request->all();
      $id = $input['id'];

      //valido que venga el id sino mando un error
      if($id){

          //ubico el id en la bd
          $registro = Etapa::find($id);
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
