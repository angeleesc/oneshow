<?php

namespace App\Http\Controllers;
use App\Models\MongoDB\Agenda;
use App\Models\MongoDB\Evento;
use App\Models\MongoDB\MenuAppInvitado;
use App\Models\MongoDB\Empresa;

use Illuminate\Http\Request;

use Carbon\Carbon;
use MongoDB\BSON\ObjectID;
use DB, DataTables, Image, Storage, File, Auth, Session;

//controlador encargado de la seccion empresa
class AgendaController extends Controller
{
    //metodo para llamar la vista principal de empresas
    public function index(){
        //devuleve la vista
        $rol = strtoupper(Auth::user()->nameRol());
        //verifico que tipo de datos voy a cargar acorde al rol
        if($rol == 'ADMINISTRADOR'){
            //cargo las empresas
            $select['empresas'] = Empresa::borrado(false)->activo(true)->orderBy(
                'Nombre', 'ASC')->get();
            $select['eventos'] = Evento::where('Empresa_id',Auth::user()->Empresa_id)->get();
            $select['show_select_evento'] = false;
            $select['active_fecha'] = false; 
        }else if($rol == 'EMPRESA'){
            //cargo las empresas
            $select['empresas'] = Empresa::borrado(false)->activo(true)->where(
                '_id', Auth::user()->Empresa_id )->orderBy('Nombre', 'ASC')->get();
            $select['eventos'] = Evento::borrado(false)->activo(true)->get();
            $select['show_select_evento'] = true;
            $select['active_fecha'] = true; 
        }else if($rol == 'EVENTO'){
            //cargo las empresas
            $select['empresas'] = Empresa::borrado(false)->activo(true)->where('_id', Auth::user()->Empresa_id )->orderBy('Nombre', 'ASC')->get();
            $select['eventos'] = Evento::where('_id',Auth::user()->Evento_id)->get();
            $select['show_select_evento'] = false;
            $select['active_fecha'] = false; 
        }
        return view('Configuracion.Agendas.index', $select);
    }

    //metodo para llamar la vista de agregar empresa
    public function viewAdd(){
        $evento = Evento::where('_id', Session::get('last_event'))->get()[0];
        $select = ['evento' => $evento];
        //return view
        return view('Configuracion.Agendas.add', $select);
        //return response()->json(['code' => Session::get('last_event') ]);
    }

    //metodo para llamar la vista de ver empresa
    public function viewShow($id){
        $data['existe'] = false;
        $registro = Agenda::find($id);
        if($registro){
            $data['existe'] = true;
            $data['evento'] = Evento::where('_id', $registro->Evento_id)->get()[0];
            $data['agenda'] = $registro;
        }
        //devuelve la vista
        return view('Configuracion.Agendas.show', $data);
    }

    //metodo para llamar la vista de editar empresa
    public function viewEdit($id){
        $data['existe'] = false;
        $registro = Agenda::find($id);
        if($registro){
            $data['existe'] = true;
            $data['agenda'] = $registro;
            $data['evento'] = Evento::where('_id', $registro->Evento_id)->get()[0];
        }
        //devuleve la vista
        return view('Configuracion.Agendas.edit', $data);
    }

    //metodo para mandar la data de las empresas al datatables
    public function ajaxDatatables(){
        //guardo el tipo de rol del usuario
        $rol = strtoupper(Auth::user()->nameRol());
        //acorde al tipo de rol cargo empresas
        if($rol == 'ADMINISTRADOR'){
            $agenda = Agenda::all();
        }else if($rol == 'EMPRESA'){
            $agenda = Agenda::all();//$emp = Agenda::borrado(false)->where('_id',  Auth::user()->Empresa_id  )->get();
        }else if($rol == 'EVENTO'){
            $agenda = Agenda::all();//$emp = Agenda::borrado(false)->where('_id', Auth::user()->Empresa_id  )->get();
        }
        $agendas = [];
        //verifico que exista data sino lo devulevo vacio
        if($agenda){
            foreach ($agenda as $ag) {
                //armo la data que se muestra en la tabla de inicio de la pagina de agendas
                $agendas[] = [
                    '_id'    => $ag->_id,
                    'Titulo' => strtoupper($ag->Titulo),
                    'Descripcion' => $ag->Descripcion,
                    'Evento' => Evento::where('_id',$ag->Evento_id)->get()[0]->Nombre,
                    'Hora'  => $ag->Hora
                ];
            }
        }
        return DataTables::collection( $agendas )->make(true);
    }

    //metodo para agregar las empresas
    public function ajaxAdd(Request $request){
        //verifico que la respuesta venga por ajax
        if($request->ajax()){
            $data = $request->all();
            $registro =  new Agenda;
            $registro->Hora = $data['hora'];
            $registro->Titulo = $data['titulo'];
            $registro->Descripcion = $data['descripcion'];
            $registro->Evento_id = new ObjectID($data['evento_id']); //Session::get('last_event');
            $saved = $registro->save();
            if ($saved) {
                return response()->json(['code' => 200, 'last_id' => $registro->id]);
            }
            return response()->json(['code' => 500]);
        }
    }

    //metodo para actualizar las empresas
    public function ajaxUpdate(Request $request){
        //verifico que la respuesta venga por ajax
        if($request->ajax()){
            //obtengo todos los datos del formulario
            $data = $request->all();
            $agenda = Agenda::find($data['agenda_id']);
            $agenda->Titulo = $data['titulo'];
            $agenda->Hora = $data['hora'];
            $agenda->Descripcion = $data['descripcion'];
            
            if($agenda->save()){
                return response()->json(['code' => 200, 'data' => $data]);
            }
            return response()->json(['code' => 500]);
        }
    }

    //metodo para borrar empresas
    public function ajaxDelete(Request $request){
        //verifico que la respuesta venga por ajax
        if($request->ajax()){
            //capturo el valor del id
            $input = $request->all();
            $id = $input['id'];
            //valido que venga el id sino mando un error
            if($id){
                //ubico el id en la bd
                $registro = Agenda::find($id);
                //DB::table('Sucursales')->where('Empresa_id', new ObjectId($id))->update(['Borrado' => true]);
                //valido que de verdad sea borrado en caso de que no arrojo un error
                if($registro->delete()){
                    return json_encode(['code' => 200]);
                }
                return json_encode(['code' => 500]);
            }
            return json_encode(['code' => 600]);
        }
    }

    // Custom functions 
    public function getEvents (Request $request) {
        $data = $request->all();
        $id_empresa = $data['id_empresa'];
        $events = Evento::where('Empresa_id', new ObjectID($id_empresa))->get();
        if ($events) {
            // We get Id of agenda App
            $agenda =  MenuAppInvitado::where('Nombre', 'Agenda')->get();
            $agenda_id = $agenda ? $agenda[0]->_id : null;
            $data_events = [];
            foreach ($events as $event) {
                if (count($event['MenuApp'])) {      
                    if (in_array($agenda_id, $event['MenuApp'])) {
                        $data_events[] = $event;
                    }                    
                }
            }
            if ($data_events) {
                return response()->json(['code' => 200, 'data' => $data_events]);
            }
            return response()->json([
                'code' => 404, 
                'message' => 'Empresa no posee eventos con Agenda'
            ]);       
        }
        return response()->json(['code' => 404, 'message' => 'Empresa no posee eventos']);
    }

    public function datatable_get_agendas( $id_evento, $fecha ) {
        // Setting id_evento on session
        $rol = strtoupper(Auth::user()->nameRol());
        Session::put('last_event', $id_evento);
        $last_event = Session::get('last_event');
        $empresa = Empresa::where('_id', Auth::user()->Empresa_id )->get();
        if ($fecha == 'all' && $id_evento != 0) {
            $agendas = Agenda::where('Evento_id', new ObjectID($id_evento))->get();
        } elseif ($fecha != 'all' && $id_evento != 0) {
            $agendas = Agenda::where('Evento_id', new ObjectID($id_evento))->get();
        } else {
            $fecha_filter = str_replace('-', '/', $fecha);
            $agendas = Agenda::where('Fecha',$fecha_filter)->get();
        }
        $data_agendas = [];
        //verifico que exista data sino lo devulevo vacio
        if($agendas){
            foreach ($agendas as $agenda) {
                //armo la data que se muestra en la tabla de inicio de la pagina de agendas
                $evento = Evento::where('_id',$agenda->Evento_id)->get()[0];
                $data_agendas[] = [
                    '_id'    => $agenda->_id,
                    'Titulo' => strtoupper($agenda->Titulo),
                    'Descripcion' => $agenda->Descripcion,
                    'Evento' => $evento->Nombre,
                    'Hora'  => $agenda->Hora,
                    'Fecha' => $agenda->Fecha
                ];
            }
        }
        return DataTables::collection( $data_agendas )->make(true);
    }
}
