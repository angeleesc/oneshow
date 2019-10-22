<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\MongoDB\Evento;
use App\Models\MongoDB\Empresa;
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
      $invitado->EsInvitadoAdicional       = $data['esInvitadoAdicional'];
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
        $eventoInvitado->Enviado = (boolean) false;
        $eventoInvitado->LinkDatos  = Str::random(40);
        $eventoInvitado->borrado = $dataEnventoInvitado['borrado'];
        $linkConfirmacion = $eventoInvitado->LinkDatos;
        
        if($eventoInvitado->save()){

          for($i = 0; $i<$invitadosAdicionalesMayores;$i++){
            $dataAdicional = [
              'idInvitadoSolicitante'=> ($idInvitado),
              'nombre'              => strtoupper("ADICIONAL"),
              'apellido'            => strtoupper($input['apellido']),
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
              $eventoInvitado->Enviado = (boolean) false;
              $eventoInvitado->borrado = $dataEnventoInvitado['borrado'];
              $eventoInvitado->save();
              array_push($invitadosAdicionalesArreglo, $invitadoAdicional);
            }

          }
    
          for($i = 0; $i<$invitadosAdicionalesMenores;$i++){

            $dataAdicional = [
              'idInvitadoSolicitante'=> ($idInvitado),
              'nombre'              => strtoupper("ADICIONAL"),
              'apellido'            => strtoupper($input['apellido']),
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
              $eventoInvitado->Enviado = (boolean) false;
              $eventoInvitado->borrado = $dataEnventoInvitado['borrado'];
              $eventoInvitado->save();
              array_push($invitadosAdicionalesArreglo, $invitadoAdicional);
            }

          }
        }
        return response()->json(['code' => 200,'invitado'=>$invitado,'invitados-adicionales'=>$invitadosAdicionalesArreglo,'link'=>$linkConfirmacion]);
    }
  } else {
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
      $eventoInvitado->Enviado = (boolean) false;
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
          $eventoInvitado->Enviado = (boolean) false;
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
          $eventoInvitado->Enviado = (boolean) false;
          $eventoInvitado->borrado = $dataEnventoInvitado['borrado'];
          $eventoInvitado->save();
          array_push($invitadosAdicionalesArreglo, $invitadoAdicional);
        }
      }
      return response()->json(['code' => 200,'mensaje'=>"correo ya registrado",'invitado'=>$invitado,'invitados-adicionales'=>$invitadosAdicionalesArreglo,'link'=>$linkConfirmacion]);
    } else {
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

  public function getInvitados(Request $request){
      $data = EventoInvitado::where("borrado",false)->get();
      $input = $request->all();
      $registroInvitados = [];
      $eventosParaEmpresa = [];
      $id = $input['id'];
      $rol= $input['rol'];
      $empresas = Empresa::where("Borrado",false)->get();
      $grupos = Grupo::where("Borrado",false)->get();

      $eventos = Evento::where("Borrado",false)->get();
      if($data){
        if($rol == 'ADMINISTRADOR'){
          
          for($i=0; $i<count($data);$i++){
            $idInvitado = $data[$i]->Invitado_id;
            $dataInvitado = Invitado::find($idInvitado);
            if($data[$i]->Grupo_id == "no aplica"){
              $grupo = "no aplica";
              $grupoId = "no aplica";
            }else{
              $grupo = Grupo::find($data[$i]->Grupo_id)->Nombre;
              $grupoId = Grupo::find($data[$i]->Grupo_id)->_id;
            }
              $datos = [
                '_id' => $data[$i]->_id,
                'Nombre' => $dataInvitado->Nombre,
                'Apellido' => $dataInvitado->Apellido,
                'esInvitadoAdicional' => $dataInvitado->EsInvitadoAdicional,
                'Grupo' => $grupo,
                'Grupo_id'=> $grupoId,
                'Etapas' => count($data[$i]->Etapas),
                'Evento' => Evento::find($data[$i]->Evento_id)->Nombre,//esto se debe cambiar en el futuro
                'Evento_id'=>$data[$i]->Evento_id,
                'Empresa_id'=>Evento::find($data[$i]->Evento_id)->Empresa_id,
                'Invitado_id'=>$data[$i]->Invitado_id,
                'Correo'  => $dataInvitado->Correo,
                'Link'    => $data[$i]->LinkDatos,
                'Confirmado' => $data[$i]->Confirmado,
                'Enviado' => $data[$i]->Enviado
              ];
              array_push($registroInvitados,$datos);
          }
          return json_encode(['code' => 200,'invitados'=>$registroInvitados,'empresas'=>$empresas,'eventos'=>$eventos,'grupos'=>$grupos]);
        }else if($rol == 'EMPRESA'){
            $empresa = Empresa::find($id);
            for($i=0; $i<count($data);$i++){
              $idInvitado = $data[$i]->Invitado_id;
              $dataInvitado = Invitado::find($idInvitado);
              if($data[$i]->Grupo_id == "no aplica"){
                $grupo = "no aplica";
                $grupoId = "no aplica";
              }else{
                $grupo = Grupo::find($data[$i]->Grupo_id)->Nombre;
                $grupoId = Grupo::find($data[$i]->Grupo_id)->_id;
              }
                $datos = [
                  '_id' => $data[$i]->_id,
                  'Nombre' => $dataInvitado->Nombre,
                  'Apellido' => $dataInvitado->Apellido,
                  'esInvitadoAdicional' => $dataInvitado->EsInvitadoAdicional,
                  'Grupo' => $grupo,
                  'Grupo_id'=> $grupoId,
                  'Etapas' => count($data[$i]->Etapas),
                  'Evento' => Evento::find($data[$i]->Evento_id)->Nombre,//esto se debe cambiar en el futuro
                  'Evento_id'=>$data[$i]->Evento_id,
                  'Empresa_id'=>$id,
                  'Invitado_id'=>$data[$i]->Invitado_id,
                  'Correo'  => $dataInvitado->Correo,
                  'Link'    => $data[$i]->LinkDatos,
                  'Confirmado' => $data[$i]->Confirmado,
                  'Enviado' => $data[$i]->Enviado
                ];
                $evento = Evento::find($data[$i]->Evento_id);
                $empresa_id = $evento->Empresa_id;
                if($empresa_id == $id){
                  
                  array_push($eventosParaEmpresa,$evento);
                  array_push($registroInvitados,$datos);
                }  
            }
            return json_encode(['code' => 200,'invitados'=>$registroInvitados,'empresas'=>$empresas,'eventos'=>$eventos,'grupos'=>$grupos]);
        }else if($rol == 'EVENTO'){
          $evento = Evento::find($id);
          $empresa = Empresa::find($evento->Empresa_id);
          for($i=0; $i<count($data);$i++){
            $idInvitado = $data[$i]->Invitado_id;
            $dataInvitado = Invitado::find($idInvitado);
            if($data[$i]->Grupo_id == "no aplica"){
              $grupo = "no aplica";
              $grupoId = "no aplica";
            }else{
              $grupo = Grupo::find($data[$i]->Grupo_id)->Nombre;
              $grupoId = Grupo::find($data[$i]->Grupo_id)->_id;
            }
              $datos = [
                '_id' => $data[$i]->_id,
                'Nombre' => $dataInvitado->Nombre,
                'Apellido' => $dataInvitado->Apellido,
                'esInvitadoAdicional' => $dataInvitado->EsInvitadoAdicional,
                'Grupo' => $grupo,
                'Grupo_id' => $grupoId,
                'Etapas' => count($data[$i]->Etapas),
                'Evento' => Evento::find($data[$i]->Evento_id)->Nombre,//esto se debe cambiar en el futuro
                'Evento_id'=>$data[$i]->Evento_id,
                'Empresa_id'=>$evento->Empresa_id,
                'Invitado_id'=>$data[$i]->Invitado_id,
                'Correo'  => $dataInvitado->Correo,
                'Link'    => $data[$i]->LinkDatos,
                'Confirmado' => $data[$i]->Confirmado,
                'Enviado' => $data[$i]->Enviado
              ];

              if($data[$i]->Evento_id == $id){
                array_push($registroInvitados,$datos);
              }  
          }
          return json_encode(['code' => 200,'invitados'=>$registroInvitados,'empresas'=>$empresas,'eventos'=>$eventos,'grupos'=>$grupos]);
        }
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
            $adicionalesMayores = $input['adicionales_mayores'];
            $adicionalesMenores = $input['adicionales_menores'];
            $invitadosAdicionalesArreglo = [];
            for($i = 0; $i<$adicionalesMayores;$i++){
              $dataAdicional = [
                'idInvitadoSolicitante'=> ($invitado->_id),
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
                $eventoInvitado->Evento_id = $data['Evento_id'];
                $eventoInvitado->Invitado_id = ($invitadoAdicional->_id);
                $eventoInvitado->Grupo_id = $data['Grupo_id'];
                $eventoInvitado->CantidadInvitadosMayores = 0;
                $eventoInvitado->CantidadInvitadosMenores = 0;
                $eventoInvitado->Etapas = $data['Etapas'];
                $eventoInvitado->Confirmado = (boolean)false;
                $eventoInvitado->borrado = (boolean)false;
                $eventoInvitado->save();
                array_push($invitadosAdicionalesArreglo, $invitadoAdicional);
              }
            }

            for($i = 0; $i<$adicionalesMenores;$i++){
              $dataAdicional = [
                'idInvitadoSolicitante'=> ($invitado->_id),
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
                $eventoInvitado->Evento_id = $data['Evento_id'];
                $eventoInvitado->Invitado_id = ($invitadoAdicional->_id);
                $eventoInvitado->Grupo_id = $data['Grupo_id'];
                $eventoInvitado->CantidadInvitadosMayores = 0;
                $eventoInvitado->CantidadInvitadosMenores = 0;
                $eventoInvitado->Etapas = $data['Etapas'];
                $eventoInvitado->Confirmado = (boolean)false;
                $eventoInvitado->borrado = (boolean)false;
                $eventoInvitado->save();
                array_push($invitadosAdicionalesArreglo, $invitadoAdicional);
              }
            }
            return json_encode(['code' => 200,'invitados'=>$invitado,'eventoInvitado'=>$eventoInvitado,'invitadosAdicionales'=>$invitadosAdicionalesArreglo]);
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
                $registro = EventoInvitado::find($id);
                $registro->borrado = true;
                $invitado = Invitado::find($registro->Invitado_id);
                $invitado->borrado = true;
                //valido que de verdad sea borrado en caso de que no arrojo un error
                if($registro->save() && $invitado->save()){
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
        $eventoInvitado = EventoInvitado::where("borrado",false)->where('LinkDatos', $idConfirmacion)->get();
        if(count($eventoInvitado)){
          $eventoInvitado = $eventoInvitado[0];
          $registroInvitado = Invitado::find($eventoInvitado['Invitado_id']);
          if($registroInvitado){
              if($eventoInvitado['Grupo_id'] == "no aplica"){
                $grupo = "no aplica";
              }else{
                $grupo = Grupo::find($eventoInvitado['Grupo_id'])->Nombre;
              }
              $data = [
                "id"=>$eventoInvitado["_id"],
                "invitado_id"=>$eventoInvitado['Invitado_id'],
                "nombre"=>$registroInvitado->Nombre,
                "apellido"=>$registroInvitado->Apellido,
                "correo"=>$registroInvitado->Correo,
                "telefono"=>$registroInvitado->Telefono,
                "grupo"=>$grupo,
                "evento"=>Evento::find($eventoInvitado['Evento_id'])->Nombre,
                "evento_id"=>$eventoInvitado['Evento_id']
              ];
              $dataAdicional = [];
              $invitadosAdicionales = Invitado::where("borrado",false)->where('InvitadoSolicitante_id', $eventoInvitado['Invitado_id'])->get();
              if(count($invitadosAdicionales)>0){
                foreach($invitadosAdicionales as $invitadoAdicional){
                  $eventoInvitadoAdicional = EventoInvitado::where("borrado",false)->where("Invitado_id",$invitadoAdicional->_id)->get();
                  
                  $eventoInvitadoAdicional = $eventoInvitadoAdicional[0];
                  if($eventoInvitadoAdicional->Evento_id == $eventoInvitado['Evento_id']){
                    array_push($dataAdicional,$invitadoAdicional);
                  }
                }
              }
              //valido que de verdad sea borrado en caso de que no arrojo un error
              return json_encode(['code' => 200,'invitado'=>$data,'adicionales'=>$dataAdicional]);
          }
        }
        return json_encode(['code' => 200,'data'=>$invitado]);
      }
    }

    public function confirmacionDatos(Request $request){
      $input = $request->all();
      $cantidadAdicionales = $input['cantidad_adicionales'];
      $invitadosAdicionales = [];
      $id = $input['id'];
      if($id){
        $registro = Invitado::find($id);
        $idEventoInvitado = $input['id_evento_invitado'];
        $idEvento = $input['id_evento'];
        if($registro){
            $data = [
              'nombre'              => strtoupper($input['nombre']),
              'apellido'            => strtoupper($input['apellido']),
              'correo'              => strtoupper($input['correo']),
              'telefono'            => strtoupper($input['telefono'])
            ];

            $registro->Nombre              = $data['nombre'];
            $registro->Apellido            = $data['apellido'];
            $registro->Correo              = $data['correo'];
            $registro->Telefono            = $data['telefono'];
            $registroEventoInvitado = EventoInvitado::find($idEventoInvitado);
            $registroEventoInvitado->Confirmado = true;
            

            if($registro->save() && $registroEventoInvitado->save()){
              if($cantidadAdicionales>0){
                for($i=0;$i<$cantidadAdicionales;$i++){
                  $registroAdicional = Invitado::find($input["id_invitado_adicional_".$i]);

                  $data = [
                    'nombre'              => strtoupper($input['nombre_adicional_'.$i]),
                    'apellido'            => strtoupper($input['apellido_adicional_'.$i]),
                    'correo'              => strtoupper($input['correo_adicional_'.$i]),
                    'telefono'            => strtoupper($input['telefono_adicional_'.$i])
                  ];
      
                  $registroAdicional->Nombre              = $data['nombre'];
                  $registroAdicional->Apellido            = $data['apellido'];
                  $registroAdicional->Correo              = $data['correo'];
                  $registroAdicional->Telefono            = $data['telefono'];
                  $registroAdicional->EsInvitadoAdicional            = true;
                  $registroEventoInvitadoAdicional = EventoInvitado::where("borrado",false)->where("Invitado_id",$input["id_invitado_adicional_".$i])->where("Evento_id",$idEvento)->get();
                  if(count($registroEventoInvitadoAdicional)>0){
                    $registroEventoInvitadoAdicional = $registroEventoInvitadoAdicional[0];
                    $registroEventoInvitadoAdicional = EventoInvitado::find($registroEventoInvitadoAdicional['id']);
                    $registroEventoInvitadoAdicional->Confirmado = true;
      
                    if($registroAdicional->save() && $registroEventoInvitadoAdicional->save()){
                      array_push($invitadosAdicionales,$registroAdicional);
                      continue;
                    }
                  }
    
                  if($registroAdicional->save()){
                    array_push($invitadosAdicionales,$registroAdicional);
                    continue;
                  }
                  
                  break;
                }
              }
              return json_encode(['code' => 200,'invitado'=>$registro,'adicionales'=>$invitadosAdicionales]);
            }
            return json_encode(['code' => 400]);
        }
        return json_encode(['code' => 500]);
      }
      return json_encode(['code' => 600]);
    }

   

}
