<?php

namespace App\Http\Controllers;

use App\Models\MongoDB\Empresa;
use App\Models\MongoDB\Estado;
use App\Models\MongoDB\Etapa;
use App\Models\MongoDB\Evento;
use App\Models\MongoDB\MenuGEtapas;
use Exception;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectID;
use Respect\Validation\Validator as v;

//controlador encargado de la seccion empresa
class MenugEtapasController extends Controller
{

    //metodo para llamar la vista principal de empresas
    /*public function index(){

    //devuleve la vista
    $rol = strtoupper(Auth::user()->nameRol());

    //verifico que tipo de datos voy a cargar acorde al rol
    if($rol == 'ADMINISTRADOR'){

    //cargo las empresas
    $select['empresas'] = Empresa::borrado(false)->activo(true)->orderBy('Nombre', 'ASC')->get();
    $select['show_select_evento'] = false;

    }else if($rol == 'EMPRESA'){

    //cargo las empresas
    $select['empresas'] = Empresa::borrado(false)->activo(true)->where('_id', Auth::user()->Empresa_id )->orderBy('Nombre', 'ASC')->get();
    $select['eventos'] = Evento::where('Empresa_id',Auth::user()->Empresa_id)->get();
    $select['show_select_evento'] = true;

    }else if($rol == 'EVENTO'){

    //cargo las empresas
    $select['empresas'] = Empresa::borrado(false)->activo(true)->where('_id', Auth::user()->Empresa_id )->orderBy('Nombre', 'ASC')->get();
    $select['show_select_evento'] = false;
    }
    return view('Configuracion.Menugetapas.index', $select);
    }*/

    //metodo para llamar la vista principal de empresas
    public function index(Request $request)
    {

        $empresas = $eventos = $show_select_evento = [];
        $rol = $request->input('rol');
        $empresa_id = $request->input('empresa_id');

        // Se verifica que tipo de datos se van a cargar acorde al rol
        if ($rol == 'ADMINISTRADOR') {
            // Se cargan las empresas
            $empresas = Empresa::borrado(false)->activo(true)->orderBy('Nombre', 'ASC')->get();
            $show_select_evento = false;
        } else if ($rol == 'EMPRESA') {
            // Se cargan las empresas
            $empresas = Empresa::borrado(false)->activo(true)->where('_id', $empresa_id)->orderBy('Nombre', 'ASC')->get();
            $eventos = Evento::where('Empresa_id', $empresa_id)->get();
            $show_select_evento = true;
        } else if ($rol == 'EVENTO') {
            // Se cargan las empresas
            $empresas = Empresa::borrado(false)->activo(true)->where('_id', $empresa_id)->orderBy('Nombre', 'ASC')->get();
            $show_select_evento = false;
        }
        return response()->json([
            'empresas' => $empresas,
            'eventos' => $eventos,
            'show_select_evento' => $show_select_evento],
            200
        );
    }

    //metodo para llamar la vista de agregar empresa
    /*public function viewAdd(){
    $data['estados'] = Estado::borrado(false)->get();
    //return view
    return view('Configuracion.Menugetapas.add', $data);
    }*/

    // Metodo para llamar la vista de agregar empresa
    public function getEstados()
    {
        $estados = Estado::borrado(false)->get();
        return response()->json([
            'estados' => $estados],
            200
        );
    }

    //metodo para llamar la vista de ver empresa
    /*public function viewShow($id){

    $data['existe'] = false;

    $registro = MenuGEtapas::find($id);

    if($registro){
    $data['existe'] = true;
    $data['estados'] = Estado::borrado(false)->get();
    $data['etapa'] = $registro;

    }
    // devuelve la vista
    return view('Configuracion.Menugetapas.show', $data);
    }*/

    // Metodo para llamar la vista de ver empresa
    public function viewShow($id)
    {

        $existe = false;
        $estados = $etapa = [];
        $registro = MenuGEtapas::find($id);

        if ($registro) {
            $existe = true;
            $estados = Estado::borrado(false)->get();
            $etapa = $registro;

        }

        // Devuelve la lista
        return response()->json([
            'existe' => $existe,
            'estados' => $estados,
            'etapas' => $etapa],
            200
        );
    }

    //metodo para llamar la vista de editar empresa
    /*public function viewEdit($id){

    $data['existe'] = false;

    $registro = MenuGEtapas::find($id);

    if($registro){

    $data['existe'] = true;
    $data['estados'] = Estado::borrado(false)->get();
    $data['etapa'] = $registro;
    }

    //devuleve la vista
    return view('Configuracion.Menugetapas.edit', $data);
    }*/

    // Metodo para llamar la vista de editar empresa
    public function viewEdit($id)
    {
        $existe = false;
        $estados = $etapa = [];
        $registro = MenuGEtapas::find($id);

        if ($registro) {
            $existe = true;
            $estados = Estado::borrado(false)->get();
            $etapa = $registro;
        }

        // Retorna una lista
        return response()->json([
            'existe' => $existe,
            'estados' => $estados,
            'etapas' => $etapa],
            200
        );
    }



    // Metodo para mandar la data de los menu a las etapas
    public function getInfo(Request $request, $idEtapa)
    {

        $findEtapa = Etapa::find($idEtapa);
        $errorEtapa = new Exception("La etapa no existe");
        if (!$findEtapa) {
            return json_encode(['error' => $errorEtapa->getMessage()]);
        }
        $menus = [];
        try {

            $menu = MenuGEtapas::where([
                ['Etapa_id', '=', new ObjectId($findEtapa->_id)],
                ['Borrado', '=', false],
                ['Activo', '=', true]])->get();
            foreach ($menu as $e) {
                $menus[] = [
                    '_id' => $e->_id,
                    'Etapa_id' => $e->Etapa_id,
                    'Titulo' => $e->Titulo,
                    'Descripcion' => isset($e->Descripcion) ? $e->Descripcion : '',
                ];
            }

            return response()->json(['menu' => $menus]);
        } catch (\Exception $e) {
            // $e->getMessage()
            return response()->json(['error' => 500]);
        }

    }


    public function agregar(Request $request, $idEtapa)
    {
        $data = json_decode($request->getContent(), true);
        $findEtapa = Etapa::find($idEtapa);
        $errorEtapa = new Exception("La etapa no existe");
        $errorValidarCampos = new Exception("Campos inválidos");
        if (!$findEtapa) {
            return json_encode(['error' => $errorEtapa->getMessage()]);
        }

        try {

            $menuValidator = v::key('titulo', v::stringType()->notEmpty()->length(1, 25));
            $vMenu = $menuValidator->validate($data);
            if (!$vMenu) { // si los campos son inválidos.

                return json_encode(['error' => $errorValidarCampos->getMessage()]);
            }

            $data = $request->all();
            $registro = new MenuGEtapas();
            // $registro->Numero_plato = $data['numero_plato'];
            $registro->Etapa_id = new ObjectId($findEtapa->_id);
            $registro->Titulo = $data['titulo'];
            if (isset($data['descripcion'])) {
                $registro->Descripcion = $data['descripcion'];
            }
            $registro->Activo = true;
            $registro->Borrado = false;
            $registro->Etapa_id = new ObjectId($findEtapa->_id);
            $registro->save();
            return response()->json(['menu' => $registro]);

        } catch (\Exception $e) { // Si ocurre algun error interno
            return response()->json(['error' => $e->getMessage()]);
        }
    }
    public function edit(Request $request, $idMenu)
    {
        $data = json_decode($request->getContent(), true);
        $findMenu = MenuGEtapas::find($idMenu);
        $errorMenu = new Exception("El menu no existe");
        $errorValidarCampos = new Exception("Campos inválidos");

        if (!$findMenu) {
            return json_encode(['error' => $errorMenu->getMessage()]);
        }
        try {

            $menuValidator = v::key('titulo', v::stringType()->notEmpty()->length(1, 25));

            $vMenu = $menuValidator->validate($data);
            if (!$vMenu) { // si los campos son inválidos.

                return json_encode(['error' => $errorValidarCampos->getMessage()]);
            }
            $data = $request->all();

            $findMenu->Titulo = $data['titulo'];
            if (isset($data['descripcion'])) {
                $findMenu->Descripcion = $data['descripcion'];
            }
            $findMenu->save();
            return response()->json(['menu' => $findMenu]);

        } catch (\Exception $e) { // Si ocurre algun error interno
            // $e->getMessage()
            return response()->json(['error' => 500]);
        }
    }

    // Metodo para borrar empresas
    public function eliminar($id)
    {
        // Se valida que venga el id sino se manda un error
        if ($id) {
            try {
                // Se ubica el id en la bd
                $registro = MenuGEtapas::find($id);
                // Se valida que sea borrado, en caso contrario, se arroja un error
                if ($registro->delete()) {
                    return json_encode(['message' => 'El registro fue eliminado exitosamente'], 204);
                }
            } catch (\Exception $e) { // Si ocurre algun error interno
                return response()->json(['error' => $e->getMessage()], 500);
            }
        }
        return json_encode(['message' => 'Debe ingresar el parámetro id'], 400);
    }
}
