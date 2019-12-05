<?php

namespace App\Http\Controllers;
use App\Models\MongoDB\MenuGPlatos;
use App\Models\MongoDB\MenuGEtapas;
use App\Models\MongoDB\Agenda;
use App\Models\MongoDB\Evento;
use App\Models\MongoDB\Estado;
use App\Models\MongoDB\MenuAppInvitado;
use App\Models\MongoDB\Empresa;

use Illuminate\Http\Request;

use Carbon\Carbon;
use MongoDB\BSON\ObjectID;
use DB, DataTables, Image, Storage, File, Auth, Session;

//controlador encargado de la seccion empresa
class MenugPlatosController extends Controller
{

    //metodo para llamar la vista principal de empresas
    public function index(){

        //devuleve la vista
        $rol = strtoupper(Auth::user()->nameRol());

        return view('Configuracion.Menugplatos.index');
    }

    //metodo para llamar la vista de agregar empresa
    /*public function viewAdd(){
        $data['estados'] = Estado::borrado(false)->get();
        $data['etapas'] = MenuGEtapas::where('Borrado', false)->get();
        //return view
        return view('Configuracion.Menugplatos.add', $data);
    }*/

    //metodo para llamar la vista de agregar empresa
    public function viewAdd(){
        $estados = Estado::borrado(false)->get();
        $etapas = MenuGEtapas::where('Borrado', false)->get();
        //return view
        #return view('Configuracion.Menugplatos.add', $data);
        return response()->json([
            'estados' => $estados,
            'etapas' => $etapas],
            200
        );
    }

    //metodo para llamar la vista de ver empresa
    /*
    public function viewShow($id){

        $data['existe'] = false;

        $registro = MenuGPlatos::find($id);

        if($registro){
            $data['existe'] = true;
            $data['estados'] = Estado::borrado(false)->get();
            $data['etapa'] = MenuGEtapas::where('_id', new ObjectID($registro->Etapa_id))->get()[0];
            $data['plato'] = $registro;
        }
        //devuelve la vista
        return view('Configuracion.Menugplatos.show', $data);
    }
    */

    //metodo para llamar la vista de ver empresa
    public function viewShow($id){

        $existe = false;
        $estados = [];
        $etapas = [];
        $plato = [];

        $registro = MenuGPlatos::find($id);

        if($registro){
            $existe = true;
            $estados = Estado::borrado(false)->get();
            $etapa = MenuGEtapas::where('_id', new ObjectID($registro->Etapa_id))->get()[0];
            $plato = $registro;        
        }

        // devuelve la lista
        return response()->json([
            'existe' => $existe,
            'estados' => $estados,
            'etapas' => $etapas,
            'plato' => $plato],
            200
        );
    }

    //metodo para llamar la vista de editar empresa
    /*public function viewEdit($id){
        $data['existe'] = false;
        $registro = MenuGPlatos::find($id);
        if($registro){
            $data['existe'] = true;
            $data['etapas'] = MenuGEtapas::where('Borrado', false)->get();
            $data['estados'] = Estado::borrado(false)->get();
            $data['plato'] = $registro;
        }
        //devuleve la vista
        return view('Configuracion.Menugplatos.edit', $data);
    }*/

    //metodo para llamar la vista de editar empresa
    public function viewEdit($id){
        $existe = false;
        $estados = [];
        $etapas = [];
        $plato = [];        
        $registro = MenuGPlatos::find($id);

        if($registro){
            $existe = true;
            $estados = Estado::borrado(false)->get();
            $etapa = MenuGEtapas::where('Borrado', false)->get();
            $plato = $registro;        
        }        

        // Devuelve la lista
        return response()->json([
            'existe' => $existe,
            'estados' => $estados,
            'etapas' => $etapas,
            'plato' => $plato],
            200
        );        
    }

    //metodo para mandar la data de las empresas al datatables
    /*public function ajaxDatatables(){
        //guardo el tipo de rol del usuario
        $rol = strtoupper(Auth::user()->nameRol());
        //acorde al tipo de rol cargo empresas
        if($rol == 'ADMINISTRADOR'){
            $menu_g_platos = MenuGPlatos::where('Borrado', false)->get();
        }
        $menu_platos = [];
        //verifico que exista data sino lo devulevo vacio
        if($menu_g_platos){
            foreach ($menu_g_platos as $m_plato) {
                $menu_platos[] = [
                    '_id'    => $m_plato->_id,
                    'Menu_etapa' => MenuGEtapas::where('_id', new ObjectID($m_plato->Etapa_id))->get()[0]->Titulo,
                    'Titulo' => strtoupper($m_plato->Titulo),
                    'Descripcion' => $m_plato->Descripcion,
                    'Numero_plato' => $m_plato->Numero_plato,
                    'Activo'  => $m_plato->Activo
                ];
            }
        }
        return DataTables::collection( $menu_platos )->make(true);
    }*/

    // Método para mandar la data de las empresas al datatables
    public function getDatatables(Request $request){
        // Obtiene el rol del usuario
        $rol = $request->input('rol');
        if($rol){
            // Acorde al tipo de rol cargo empresas
            if($rol == 'ADMINISTRADOR'){
                $menu_g_platos = MenuGPlatos::where('Borrado', false)->get();
                $menu_platos = [];
                // Se verifica que exista data sino lo devulevo vacio
                if($menu_g_platos){
                    foreach ($menu_g_platos as $m_plato) {
                        $menu_platos[] = [
                            '_id'    => $m_plato->_id,
                            'Menu_etapa' => MenuGEtapas::where(
                                '_id', new ObjectID($m_plato->Etapa_id))->get()[0]->Titulo,
                            'Titulo' => strtoupper($m_plato->Titulo),
                            'Descripcion' => $m_plato->Descripcion,
                            'Numero_plato' => $m_plato->Numero_plato,
                            'Activo'  => $m_plato->Activo
                        ];
                    }
                }
                return DataTables::collection( $menu_platos )->make(true);
            }
            return response()->json(['message' => 'Rol inválido' ],400);
        }
        return response()->json(['message' => 'Debe ingresar el rol' ], 400);
    }

    //metodo para agregar las empresas
    /*public function ajaxAdd(Request $request){
        //verifico que la respuesta venga por ajax
        if($request->ajax()){
            $data = $request->all();
            $registro =  new MenuGPlatos;
            $registro->Numero_plato = $data['numero_plato'];
            $registro->Titulo = $data['titulo'];
            $registro->Descripcion = $data['descripcion'];
            $registro->Activo = $data['status'];
            $registro->Borrado = false;
            $registro->Etapa_id = new ObjectID($data['etapa']);
            $saved = $registro->save();
            if ($saved) {
                return response()->json(['code' => 200, 'last_id' => $registro->id]);
            }
            return response()->json(['code' => 500]);
        }
    }*/

    // Permite agregar las empresas
    public function agregar(Request $request){

        try {
            $data = $request->all();
            $registro =  new MenuGPlatos;
            $registro->Numero_plato = $data['numero_plato'];
            $registro->Titulo = $data['titulo'];
            $registro->Descripcion = $data['descripcion'];
            $registro->Activo = $data['status'];
            $registro->Borrado = false;
            $registro->Etapa_id = new ObjectID($data['etapa']);
            $saved = $registro->save();
            if ($saved) {
                return response()->json([
                    'message' => 'El registro fue creado exitosamente', 
                    'last_id' => $registro->id], 
                    201);
            }            
        } catch (\Exception $e) { // Si ocurre algun error interno
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    //metodo para actualizar las empresas
    /*public function ajaxUpdate(Request $request){
        //verifico que la respuesta venga por ajax
        if($request->ajax()){
            //obtengo todos los datos del formulario
            $data = $request->all();
            $etapa = MenuGPlatos::find($data['plato_id']);
            $etapa->Titulo = $data['titulo'];
            $etapa->Numero_plato = $data['numero_plato'];
            $etapa->Descripcion = $data['descripcion'];
            $etapa->Etapa_id = new ObjectID($data['etapa']);
            $etapa->Activo = $data['status'];
            if($etapa->save()){
                return response()->json(['code' => 200, 'data' => $data]);
            }
            return response()->json(['code' => 500]);
        }
    }*/

    // Permite actualizar las empresas
    public function actualizar(Request $request){
        try{
            // Se obtienen todos los datos del formulario
            $data = $request->all();
            $etapa = MenuGPlatos::find($data['plato_id']);
            $etapa->Titulo = $data['titulo'];
            $etapa->Numero_plato = $data['numero_plato'];
            $etapa->Descripcion = $data['descripcion'];
            $etapa->Etapa_id = new ObjectID($data['etapa']);
            $etapa->Activo = $data['status'];
            if($etapa->save()){
                return response()->json([
                    'message' => 'Registro actualizado exitosamente', 
                    'data' => $data], 200);
            }
        } catch (\Exception $e) { // Si ocurre algun error interno
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Permite actualizar las empresas
    /*public function ajaxUpdate(Request $request){
        //verifico que la respuesta venga por ajax
        //obtengo todos los datos del formulario
        $data = $request->all();
        $etapa = MenuGPlatos::find($data['plato_id']);
        $etapa->Titulo = $data['titulo'];
        $etapa->Numero_plato = $data['numero_plato'];
        $etapa->Descripcion = $data['descripcion'];
        $etapa->Etapa_id = new ObjectID($data['etapa']);
        $etapa->Activo = $data['status'];
        if($etapa->save()){
            return response()->json(['code' => 200, 'data' => $data]);
        }
        return response()->json(['code' => 500]);
    }*/

    //metodo para borrar empresas
    /*public function ajaxDelete(Request $request){
        //verifico que la respuesta venga por ajax
        if($request->ajax()){
            //capturo el valor del id
            $input = $request->all();
            $id = $input['id'];
            //valido que venga el id sino mando un error
            if($id){
                //ubico el id en la bd
                $registro = MenuGPlatos::find($id);
                //DB::table('Sucursales')->where('Empresa_id', new ObjectId($id))->update(['Borrado' => true]);
                //valido que de verdad sea borrado en caso de que no arrojo un error
                if($registro->delete()){
                    return json_encode(['code' => 200]);
                }
                return json_encode(['code' => 500]);
            }
            return json_encode(['code' => 600]);
        }
    }*/
    // Permite borrar empresas
    public function eliminar($id){
        //valido que venga el id sino mando un error
        if($id){
            try{
                //ubico el id en la bd
                $registro = MenuGPlatos::find($id);
                // Se valida que sea borrado en caso de que no arrojo un error
                if($registro->delete()){
                    return json_encode(['message' => 'El registro fue eliminado exitosamente'],204);
                }
            } catch (\Exception $e) { // Si ocurre algun error interno
                return response()->json(['error' => $e->getMessage()], 500);
            }
        }
        return json_encode(['message' => 'Debe ingresar el parámetro id'],400);
    }    
}
