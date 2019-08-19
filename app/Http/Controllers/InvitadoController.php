<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\MongoDB\Evento;
use App\Models\MongoDB\Grupo;
use App\Models\MongoDB\Invitado;
use App\Models\MongoDB\EventoInvitado;
use MongoDB\BSON\ObjectID;
use Illuminate\Support\Str;
use Carbon\Carbon;
use DB, DataTables, Image, Storage, File, Auth, Mail, QrCode;

//controlador encargado de los invitados

class InvitadoController extends Controller
{

  public function addInvitado(Request $request){

    $input = $request->all();
    $etapas = [];

    if($input['etapas']){
      //proceso las etapas
      $etapas = $this->processEtapas($input['etapas']);
    }

    $grupoId = "no aplica";

    if($input['grupo-id']){
      $grupoId = ($input['grupo-id']);
    }

    $existeInvitado = DB::table('Invitados')->where("Correo",$input['correo'])->get();

    if(count($existeInvitado) == 0){
      $data = [
        'nombre'              => strtoupper($input['nombre']),
        'apellido'            => strtoupper($input['apellido']),
        'correo'              => $input['correo'],
        'telefono'            => strtoupper($input['telefono']),
        'esMenorDeEdad'       => (boolean) false,
        'esInvitadoAdicional'=>(boolean) false,
        'borrado'             => false
      ];
      $invitado = new Invitado;
      $invitado->Nombre              = $data['nombre'];
      $invitado->Apellido            = $data['apellido'];
      $invitado->Correo              = $data['correo'];
      $invitado->Telefono            = $data['telefono'];
      $invitado->EsMenorDeEdad       = $data['esMenorDeEdad'];
      $invitado->esInvitadoAdicional       = $data['esInvitadoAdicional'];
      $invitado->borrado             = $data['borrado'];

      //verifico si fue exitoso el insert en la bd
      if($invitado->save()){
        $idEvento = $input['evento-id'];
        $idInvitado = $invitado->_id;
        $invitadosAdicionalesArreglo = [];
        $invitadosAdicionalesMayores = $input['invitados-adicionales-mayores'];
        $invitadosAdicionalesMenores = $input['invitados-adicionales-menores'];
        $etapas = [];

        if($input['etapas']){
          //proceso las etapas
          $etapas = $this->processEtapas($input['etapas']);
        }

        $dataEnventoInvitado = [
          'Evento_id'=>($idEvento),
          'Invitado_id'=>($idInvitado),
          'Grupo_id'=>  $grupoId,
          'CantidadInvitadosMayores'=>$invitadosAdicionalesMayores,
          'CantidadInvitadosMenores'=>$invitadosAdicionalesMenores,
          'Etapas'              => $etapas,
          'Confirmado'  => (boolean) false,
          'borrado' => (boolean) false
        ];

        $eventoInvitado = new EventoInvitado;
        $eventoInvitado->Evento_id = $dataEnventoInvitado['Evento_id'];
        $eventoInvitado->Invitado_id = $dataEnventoInvitado['Invitado_id'];
        $eventoInvitado->Grupo_id = $dataEnventoInvitado['Grupo_id'];
        $eventoInvitado->CantidadInvitadosMayores = $dataEnventoInvitado['CantidadInvitadosMayores'];
        $eventoInvitado->CantidadInvitadosMenores = $dataEnventoInvitado['CantidadInvitadosMenores'];
        $eventoInvitado->Etapas = $dataEnventoInvitado['Etapas'];
        $eventoInvitado->Confirmado = $dataEnventoInvitado['Confirmado'];
        $eventoInvitado->LinkDatos  = Str::random(40);
        $eventoInvitado->borrado = $dataEnventoInvitado['borrado'];
        $linkConfirmacion = $eventoInvitado->LinkDatos;
        
        if($eventoInvitado->save()){

          for($i = 0; $i<$invitadosAdicionalesMayores;$i++){
            $dataAdicional = [
              'idInvitadoSolicitante'=> ($idInvitado),
              'nombre'              => strtoupper("ADICIONAL"),
              'apellido'            => strtoupper($eventoInvitado->Apellido),
              'correo'              => strtoupper("vacio"),
              'telefono'            => strtoupper("vacio"),
              'esInvitadoAdicional'     => (boolean) true,
              'esMenorDeEdad'       => (boolean) false,
              'borrado'             => false
            ];
        
            $invitadoAdicional = new Invitado;
            $invitadoAdicional->Nombre              = $dataAdicional['nombre'];
            $invitadoAdicional->Apellido            = $dataAdicional['apellido'];
            $invitadoAdicional->Correo              = $dataAdicional['correo'];
            $invitadoAdicional->Telefono            = $dataAdicional['telefono'];
            $invitadoAdicional->EsInvitadoAdicional = $dataAdicional['esInvitadoAdicional'];
            $invitadoAdicional->EsMenorDeEdad       = $dataAdicional['esMenorDeEdad'];
            $invitadoAdicional->InvitadoSolicitante_id = $dataAdicional['idInvitadoSolicitante'];
            $invitadoAdicional->borrado             = $dataAdicional['borrado'];
    
            if($invitadoAdicional->save()){
              $eventoInvitado = new EventoInvitado;
              $eventoInvitado->Evento_id = $dataEnventoInvitado['Evento_id'];
              $eventoInvitado->Invitado_id = ($invitadoAdicional->_id);
              $eventoInvitado->Grupo_id = $dataEnventoInvitado['Grupo_id'];
              $eventoInvitado->CantidadInvitadosMayores = 0;
              $eventoInvitado->CantidadInvitadosMenores = 0;
              $eventoInvitado->Etapas = $dataEnventoInvitado['Etapas'];
              $eventoInvitado->Confirmado = (boolean)false;
              $eventoInvitado->borrado = $dataEnventoInvitado['borrado'];
              $eventoInvitado->save();
              array_push($invitadosAdicionalesArreglo, $invitadoAdicional);
            }

          }
    
          for($i = 0; $i<$invitadosAdicionalesMenores;$i++){

            $dataAdicional = [
              'idInvitadoSolicitante'=> ($idInvitado),
              'nombre'              => strtoupper("ADICIONAL"),
              'apellido'            => strtoupper($eventoInvitado->Apellido),
              'correo'              => strtoupper("vacio"),
              'telefono'            => strtoupper("vacio"),
              'esInvitadoAdicional'     => (boolean) true,
              'esMenorDeEdad'       => (boolean) true,
              'borrado'             => false
            ];

            $invitadoAdicional = new Invitado;
            $invitadoAdicional->Nombre              = $dataAdicional['nombre'];
            $invitadoAdicional->Apellido            = $dataAdicional['apellido'];
            $invitadoAdicional->Correo              = $dataAdicional['correo'];
            $invitadoAdicional->Telefono            = $dataAdicional['telefono'];
            $invitadoAdicional->EsInvitadoAdicional = $dataAdicional['esInvitadoAdicional'];
            $invitadoAdicional->EsMenorDeEdad       = $dataAdicional['esMenorDeEdad'];
            $invitadoAdicional->InvitadoSolicitante_id = $dataAdicional['idInvitadoSolicitante'];
            $invitadoAdicional->borrado             = $dataAdicional['borrado'];

            if($invitadoAdicional->save()){
              $eventoInvitado = new EventoInvitado;
              $eventoInvitado->Evento_id = $dataEnventoInvitado['Evento_id'];
              $eventoInvitado->Invitado_id = ($invitadoAdicional->_id);
              $eventoInvitado->Grupo_id = $dataEnventoInvitado['Grupo_id'];
              $eventoInvitado->CantidadInvitadosMayores = 0;
              $eventoInvitado->CantidadInvitadosMenores = 0;
              $eventoInvitado->Etapas = $dataEnventoInvitado['Etapas'];
              $eventoInvitado->Confirmado = (boolean)false;
              $eventoInvitado->borrado = $dataEnventoInvitado['borrado'];
              $eventoInvitado->save();
              array_push($invitadosAdicionalesArreglo, $invitadoAdicional);
            }

          }
        }
        return response()->json(['code' => 200,'invitado'=>$invitado,'invitados-adicionales'=>$invitadosAdicionalesArreglo,'link'=>$linkConfirmacion]);
    }
  }else{
    $invitado = $existeInvitado[0];
    $idInvitado = strval($invitado['_id']);
    $idEvento = $input['evento-id'];
    $existaInvitadoEvento = false;
    $eventoInvitado = EventoInvitado::where("Evento_id",($idEvento))->where("Invitado_id",$idInvitado)->get();
    if(count($eventoInvitado) == 0){
      $invitadosAdicionalesArreglo = [];
      $invitadosAdicionalesMayores = $input['invitados-adicionales-mayores'];
      $invitadosAdicionalesMenores = $input['invitados-adicionales-menores'];
      $etapas = [];
      if($input['etapas']){
        //proceso las etapas
        $etapas = $this->processEtapas($input['etapas']);
      }
      $dataEnventoInvitado = [
        'Evento_id'=>($idEvento),
        'Invitado_id'=>($idInvitado),
        'Grupo_id'=>  $grupoId,
        'CantidadInvitadosMayores'=>$invitadosAdicionalesMayores,
        'CantidadInvitadosMenores'=>$invitadosAdicionalesMenores,
        'Etapas'              => $etapas,
        'Confirmado'  => (boolean) false,
        'borrado' => (boolean) false
      ];
      $eventoInvitado = new EventoInvitado;
      $eventoInvitado->Evento_id = $dataEnventoInvitado['Evento_id'];
      $eventoInvitado->Invitado_id = $dataEnventoInvitado['Invitado_id'];
      $eventoInvitado->Grupo_id = $dataEnventoInvitado['Grupo_id'];
      $eventoInvitado->CantidadInvitadosMayores = $dataEnventoInvitado['CantidadInvitadosMayores'];
      $eventoInvitado->CantidadInvitadosMenores = $dataEnventoInvitado['CantidadInvitadosMenores'];
      $eventoInvitado->Etapas = $dataEnventoInvitado['Etapas'];
      $eventoInvitado->Confirmado = $dataEnventoInvitado['Confirmado'];
      $eventoInvitado->LinkDatos  = Str::random(40);
      $eventoInvitado->borrado = $dataEnventoInvitado['borrado'];
      $eventoInvitado->save();
  
      $linkConfirmacion = $eventoInvitado->LinkDatos;
  
      for($i = 0; $i<$invitadosAdicionalesMayores;$i++){
        $dataAdicional = [
          'idInvitadoSolicitante'=> ($idInvitado),
          'nombre'              => strtoupper("ADICIONAL"),
          'apellido'            => strtoupper($invitado['Apellido']),
          'correo'              => strtoupper("vacio"),
          'telefono'            => strtoupper("vacio"),
          'esInvitadoAdicional'     => (boolean) true,
          'esMenorDeEdad'       => (boolean) false,
          'borrado'             => false
        ];
    
        $invitadoAdicional = new Invitado;
        $invitadoAdicional->Nombre              = $dataAdicional['nombre'];
        $invitadoAdicional->Apellido            = $dataAdicional['apellido'];
        $invitadoAdicional->Correo              = $dataAdicional['correo'];
        $invitadoAdicional->Telefono            = $dataAdicional['telefono'];
        $invitadoAdicional->EsInvitadoAdicional = $dataAdicional['esInvitadoAdicional'];
        $invitadoAdicional->EsMenorDeEdad       = $dataAdicional['esMenorDeEdad'];
        $invitadoAdicional->InvitadoSolicitante_id = $dataAdicional['idInvitadoSolicitante'];
        $invitadoAdicional->borrado             = $dataAdicional['borrado'];
  
        if($invitadoAdicional->save()){
          $eventoInvitado = new EventoInvitado;
          $eventoInvitado->Evento_id = $dataEnventoInvitado['Evento_id'];
          $eventoInvitado->Invitado_id = ($invitadoAdicional->_id);
          $eventoInvitado->Grupo_id = $dataEnventoInvitado['Grupo_id'];
          $eventoInvitado->CantidadInvitadosMayores = 0;
          $eventoInvitado->CantidadInvitadosMenores = 0;
          $eventoInvitado->Etapas = $dataEnventoInvitado['Etapas'];
          $eventoInvitado->Confirmado = (boolean)false;
          $eventoInvitado->borrado = $dataEnventoInvitado['borrado'];
          $eventoInvitado->save();
          array_push($invitadosAdicionalesArreglo, $invitadoAdicional);
        }
  
      }
  
      for($i = 0; $i<$invitadosAdicionalesMenores;$i++){
  
        $dataAdicional = [
          'idInvitadoSolicitante'=> ($idInvitado),
          'nombre'              => strtoupper("ADICIONAL"),
          'apellido'            => strtoupper($invitado['Apellido']),
          'correo'              => strtoupper("vacio"),
          'telefono'            => strtoupper("vacio"),
          'esInvitadoAdicional'     => (boolean) true,
          'esMenorDeEdad'       => (boolean) true,
          'borrado'             => false
        ];
  
        $invitadoAdicional = new Invitado;
        $invitadoAdicional->Nombre              = $dataAdicional['nombre'];
        $invitadoAdicional->Apellido            = $dataAdicional['apellido'];
        $invitadoAdicional->Correo              = $dataAdicional['correo'];
        $invitadoAdicional->Telefono            = $dataAdicional['telefono'];
        $invitadoAdicional->EsInvitadoAdicional = $dataAdicional['esInvitadoAdicional'];
        $invitadoAdicional->EsMenorDeEdad       = $dataAdicional['esMenorDeEdad'];
        $invitadoAdicional->InvitadoSolicitante_id = $dataAdicional['idInvitadoSolicitante'];
        $invitadoAdicional->borrado             = $dataAdicional['borrado'];
  
        if($invitadoAdicional->save()){
          $eventoInvitado = new EventoInvitado;
          $eventoInvitado->Evento_id = $dataEnventoInvitado['Evento_id'];
          $eventoInvitado->Invitado_id = ($invitadoAdicional->_id);
          $eventoInvitado->Grupo_id = $dataEnventoInvitado['Grupo_id'];
          $eventoInvitado->CantidadInvitadosMayores = 0;
          $eventoInvitado->CantidadInvitadosMenores = 0;
          $eventoInvitado->Etapas = $dataEnventoInvitado['Etapas'];
          $eventoInvitado->Confirmado = (boolean)false;
          $eventoInvitado->borrado = $dataEnventoInvitado['borrado'];
          $eventoInvitado->save();
          array_push($invitadosAdicionalesArreglo, $invitadoAdicional);
        }
      }
      return response()->json(['code' => 200,'mensaje'=>"correo ya registrado",'invitado'=>$invitado,'invitados-adicionales'=>$invitadosAdicionalesArreglo,'link'=>$linkConfirmacion]);
    }else{
      return response()->json(['code'=>500,'mensaje'=>'Este invitado ya esta asociado al evento']);
    }
    
  
  }
}


  public function getInvitado(Request $request){
    $input = $request->all();
    $idInvitado = $request['invitado_id'];
    $idEvento = $request['evento_id'];
    $registroInvitado = Invitado::find($idInvitado);
    $registroEventoInvitado = EventoInvitado::where("borrado",false)->where("Evento_id",$idEvento)->where("Invitado_id",$idInvitado)->get();
    if($registroInvitado && $registroEventoInvitado){
    $registroEventoInvitado = $registroEventoInvitado[0];
        $data = [
          "id"=>$registroEventoInvitado->_id,
          "evento_id"=>$request['evento_id'],
          "invitado_id"=>$request['invitado_id'],
          "nombre"=>$registroInvitado->Nombre,
          "apellido"=>$registroInvitado->Apellido,
          "correo"=>$registroInvitado->Correo,
          "telefono"=>$registroInvitado->Telefono,
          "etapas"=>$registroEventoInvitado->Etapas,
          "grupo_id"=>$registroEventoInvitado->Grupo_id,
          "cantidad_menores"=>$registroEventoInvitado->CantidadInvitadosMenores,
          "cantidad_mayores"=>$registroEventoInvitado->CantidadInvitadosMayores
        ];
        //valido que de verdad sea borrado en caso de que no arrojo un error
        return json_encode(['code' => 200,'invitado'=>$data]);
    }else{
        return json_encode(['code' => 500]);
    }
  }

  public function getInvitados(){
      $data = EventoInvitado::where("borrado",false)->get();
      $registroInvitados = [];
      if($data){
          for($i=0; $i<count($data);$i++){
            $idInvitado = $data[$i]->Invitado_id;
            $dataInvitado = Invitado::find($idInvitado);
            if($data[$i]->Grupo_id == "no aplica"){
              $grupo = "no aplica";
            }else{
              $grupo = Grupo::find($data[$i]->Grupo_id)->Nombre;
            }
              $datos = [
                '_id' => $data[$i]->_id,
                'Nombre' => $dataInvitado->Nombre,
                'Apellido' => $dataInvitado->Apellido,
                'esInvitadoAdicional' => $dataInvitado->esInvitadoAdicional,
                'Grupo' => $grupo,
                'Etapas' => count($data[$i]->Etapas),
                'Evento' => Evento::find($data[$i]->Evento_id)->Nombre,//esto se debe cambiar en el futuro
                'Evento_id'=>$data[$i]->Evento_id,
                'Invitado_id'=>$data[$i]->Invitado_id,
                'Correo'  => $dataInvitado->Correo,
                'Link'    => $data[$i]->LinkDatos,
                'Confirmado' => $data[$i]->Confirmado,
              ];
              array_push($registroInvitados,$datos);
          }

          return json_encode(['code' => 200,'invitados'=>$registroInvitados]);
      }else{
          return json_encode(['code' => 500]);
      }
  }

  public function setInvitado(Request $request){
    $input = $request->all();
    $etapas = [];
    $id = $input['eventoInvitado_id'];
    if($id){
      if($input['etapas']){
        //proceso las etapas
        $etapas = $this->processEtapas($input['etapas']);
      }
      $eventoInvitado = EventoInvitado::find($id);
      if($eventoInvitado){
        $invitado = Invitado::find($input['invitado_id']);

        $grupoId = "no aplica";
        if($input['grupo_id'] != "no aplica"){
          $grupoId = ($input['grupo_id']);
        }
          $data = [
            'nombre'              => strtoupper($input['nombre']),
            'apellido'            => strtoupper($input['apellido']),
            'correo'              => $input['correo'],
            'telefono'            => $input['telefono'],
            'Grupo_id'            => $grupoId,
            'Evento_id'           => ($input['evento_id']),
            'Etapas'              => $etapas,
          ];
          $invitado->Nombre              = $data['nombre'];
          $invitado->Apellido            = $data['apellido'];
          $invitado->Correo              = $data['correo'];
          $invitado->Telefono            = $data['telefono'];
          
          $eventoInvitado->Grupo_id      = $data['Grupo_id'];
          $eventoInvitado->Etapas        = $data['Etapas'];
          if($eventoInvitado->Evento_id != $data['Evento_id']){
            $eventoInvitadoVerificacion = EventoInvitado::where("borrado",false)->where("Invitado_id",$input['invitado_id'])->where("Evento_id",$data['Evento_id'])->get();
            if(count($eventoInvitadoVerificacion)>0){
              return json_encode(['code' => 500,'mensaje'=>'no puede usar este evento, ya que dicho invitado ya se encuentra invitado']);
            }
          }
          $eventoInvitado->Evento_id     = $data['Evento_id'];
          if($invitado->save() && $eventoInvitado->save()){
            return json_encode(['code' => 200,'invitados'=>$invitado,'eventoInvitado'=>$eventoInvitado]);
          }
          return json_encode(['code' => 400]);
      }
      return json_encode(['code' => 500]);
    }
    return json_encode(['code' => 600]);
  }

  public function deleteInvitado(request $request){
  
            $input = $request->all();
            $id = $input['id'];

            //valido que venga el id sino mando un error
            if($id){
                //ubico el id en la bd
                $registro = Invitado::find($id);

                $registro->borrado = true;
                

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

  public function eliminarTodos(){
    $data = Invitado::borrado(false)->get();
    if($data){
        for($i=0;$i<count($data);$i++){
          if($data[$i]->Grupo_id != "no aplica"){
            $invitadoId= $data[$i]->_id;
            $invitado = Invitado::find($invitadoId);
            $invitado->Borrado = true;
            $invitado->borrado = true;
            if($invitado->save()){
              continue;
            }
          }
        }
        return json_encode(['code' => 200,'data'=>"borrados todos"]);
    }
  }

  
    public function processEtapas($data){

        //separo los id
        $separacion = explode(",", $data);

        $result = [];

        //renombro la llave
        foreach ($separacion as $value ){

            $result[] = new ObjectId($value);
        }

        //devuelvo el resultado en formato json
        return $result;
    }

    public function mailConfirmacion(Request $request){
      $input = $request->all();
      $idConfirmacion = $input['idConfirmacion'];
      if($idConfirmacion){
        $invitado = Invitado::borrado(false)->where('linkConfirmacion', $idConfirmacion)->get();
        return json_encode(['code' => 200,'data'=>$invitado]);
      }
    }

    public function confirmacionDatos(Request $request){
      $input = $request->all();
      $id = $input['id'];
      if($id){
        $registro = Invitado::find($id);
        if($registro){
            $data = [
              'nombre'              => strtoupper($input['nombre']),
              'apellido'            => strtoupper($input['apellido']),
              'correo'              => strtoupper($input['correo']),
              'telefono'            => strtoupper($input['telefono']),
              'confirmacion'       => (boolean) true
            ];

            $registro->Nombre              = $data['nombre'];
            $registro->Apellido            = $data['apellido'];
            $registro->Correo              = $data['correo'];
            $registro->linkConfirmacion    = "usado";
            $registro->Telefono            = $data['telefono'];
            $registro->Confirmacion        = $data['confirmacion'];

            if($registro->save()){
              return json_encode(['code' => 200,'invitado'=>$registro]);
            }
            return json_encode(['code' => 400]);
        }
        return json_encode(['code' => 500]);
      }
      return json_encode(['code' => 600]);
    }

   

}
