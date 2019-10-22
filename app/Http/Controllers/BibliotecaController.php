<?php

namespace App\Http\Controllers;

//controlador encargado de la biblioteca

use App\Http\Requests\ValidateArchivo;
use App\Models\MongoDB\Biblioteca;
use App\Models\MongoDB\CategoriaBiblioteca;
use App\Models\MongoDB\Empresa;
use App\Models\MongoDB\Estado;
use App\Models\MongoDB\Evento;
use App\Models\MongoDB\Sucursal;
use Auth, DataTables, File, Storage;
use Carbon\Carbon;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;
use PHP\BitTorrent\Torrent;
use App\Jobs\MoveFileToTorrentClient;
use Illuminate\Support\Facades\Validator;
use wapmorgan\Mp3Info\Mp3Info;

class BibliotecaController extends Controller
{
    //metodo que crea la vista de inicio
    public function index(){
        //guardo el rol del usuario
        $rol = strtoupper(Auth::user()->nameRol());
        //verifico que tipo de datos voy a cargar acorde al rol
        if($rol == 'ADMINISTRADOR'){
            //cargo las empresas
            $select['empresas'] = Empresa::borrado(false)->activo(true)->orderBy(
                'Nombre', 'ASC')->get();
        }else if($rol == 'EMPRESA'){
            //cargo las empresas
            $select['empresas'] = Empresa::borrado(false)->activo(true)->where(
                '_id', Auth::user()->Empresa_id )->orderBy('Nombre', 'ASC')->get();
        }else if($rol == 'EVENTO'){
            //cargo las empresas
            $select['empresas'] = Empresa::borrado(false)->activo(true)->where(
                '_id', Auth::user()->Empresa_id )->orderBy('Nombre', 'ASC')->get();
        }
        //devuelve la vista asociada
        return view('Configuracion.Biblioteca.index', $select);
    }

    //metodo para llamar la vista de agregar
    public function viewAdd($id){
        $data['estados'] = Estado::borrado(false)->get();
        $data['categorias'] = CategoriaBiblioteca::borrado(false)->activo(true)->orderBy(
            'Nombre', 'ASC')->get();
        $data['evento'] = $id;
        //devuleve la vista
        return view('Configuracion.Biblioteca.add', $data);
    }

    //metodo para llamar la vista de ver
    public function viewShow($id){
        $data['existe'] = false;
        $registro = Evento::find($id);
        if($registro){
            $data['existe'] = true;
            $data['estados'] = Estado::borrado(false)->get();
            $data['empresa'] = Empresa::find($registro->Empresa_id);
            $data['evento'] = $registro;
        }
        //devuleve la vista
        return view('Configuracion.Biblioteca.show', $data);
    }

    //metodo para mandar la data de los eventos al datatables
    public function ajaxDatatables(Request $request){
        //almaceno los valores enviados por ajax
        $input = $request->all();
        //capturo el id de la empresa para buscar los eventos en base a ella
        $empresa   = $input['empresa'];
        //guardo el rol del usuario
        $rol = strtoupper(Auth::user()->nameRol());
        //acorde al rol muestro los eventos
        if($rol == 'ADMINISTRADOR'){
            $eve = Evento::borrado(false);
            //si contiene la empresa se la agrego al query de busqueda
            if($empresa){
                $eve->where(function ($q) use ($empresa){
                    $q->where('Empresa_id', new ObjectId($empresa) );
                });
            }
        }else if($rol == 'EMPRESA'){
            $eve = Evento::borrado(false)->where(
                'Empresa_id', new ObjectId(Auth::user()->Empresa_id) );
        }else if($rol == 'EVENTO'){
            $eve = Evento::borrado(false)->where('_id', Auth::user()->Evento_id );
        }
        $eventos = [];
        //extraigo el query con o sin los filtros
        $ev = $eve->get();
        //verifico que exista data sino lo devulevo vacio
        if($ev){
            foreach ($ev as $e) {
                $files = Biblioteca::borrado(false)->activo(true)->where(
                    'Evento_id', new ObjectId($e->_id))->get();
                //armo la data que se muestra en la tabla de inicio de la pagina de eventos
                $eventos[] = [
                    '_id'       => $e->_id,
                    'Empresa'   => Empresa::find($e->Empresa_id)->Nombre,
                    'Evento'    => strtoupper($e->Nombre),
                    'IDEvento'  => $e->IDEvento,
                    'Fecha'     => $e->Fecha. ' '.$e->Hora,
                    'App'       => $e->App,
                    'Archivos'  => count($files)
                ];
            }
        }
        return DataTables::collection( $eventos )->make(true);
    }

    //metodo para mandar la data de los archivos del evento
    public function ajaxDatatablesFiles(Request $request){
        //capturo el id de la empresa para buscar los eventos en base a ella
        $input = $request->all();
        $idevento = $input['evento'];
        $files = Biblioteca::borrado(false)->activo(true)->where(
            'Evento_id', new ObjectID($idevento) )->get();
        $archivos = [];
        //verifico que exista data sino lo devulevo vacio
        if($files){
            foreach ($files as $f) {
                //armo la data que se muestra en la tabla
                $archivos[] = [
                    '_id'       => $f->_id,
                    'Nombre'    => $f->NombreCompleto,
                    //'Tipo'      => $f->Tipo,
                    'Size'      => $f->Size,
                    'Categoria' => CategoriaBiblioteca::find($f->CategoriaBiblioteca_id)->Nombre,
                    'Activo'    => $f->Activo
                ];
            }
        }
        return DataTables::collection( $archivos )->make(true);
    }

    //metodo para agregar archivo
    public function ajaxAdd(ValidateArchivo $request){
        //verifico que la respuesta venga por ajax
        if($request->ajax()){
            $input = $request->all();
            $evento  = (string)$input['id-evento'];
            $empresa = (string)Evento::find($evento)->Empresa_id;
            $pathSave = $empresa.'/'.$evento.'/';
            $archivo = $input['archivo'];
            $fileData = [
                'extension' => $archivo->getClientOriginalExtension(),
                'size'      => humanFileSize($archivo->getSize()),
                'mime'      => $archivo->getMimeType()
            ];
            //dd($fileData);
            //creo el nombre del archivo
            $name = $input['name'].'.'.$fileData['extension'];
            Storage::disk('public_oneshow')->put($pathSave.$name, File::get($archivo));
            //capturo los datos y los acomodo en un arreglo
            $data = [
                'id-evento'        => new ObjectID($input['id-evento']),
                'nombre'           => $input['name'],
                'nombrec'          => $name,
                //'tipo'             => $type,
                'path'             => $pathSave.$name,
                'size'             => $fileData['size'],
                'categoria'        => new ObjectId($input['categoria']),
                'activo'           => true,
                'borrado'          => false
            ];
            //procedo a guardarlos en la bd
            $registro = new Biblioteca;
            $registro->Evento_id                 = $data['id-evento'];
            //$registro->Tipo                      = $data['tipo'];
            $registro->Nombre                    = $data['nombre'];
            $registro->NombreCompleto            = $data['nombrec'];
            $registro->Path                      = $data['path'];
            $registro->Extension                 = $fileData['extension'];
            $registro->Size                      = $data['size'];
            $registro->CategoriaBiblioteca_id    = $data['categoria'];
            $registro->Fecha                     = Carbon::now();
            $registro->Activo                    = $data['activo'];
            $registro->Borrado                   = $data['borrado'];
            //verifico si fue exitoso el insert en la bd
            if($registro->save()){

                return response()->json(['code' => 200]);

            }
            return response()->json(['code' => 500]);
        }
    }

    //metodo para borrar
    public function deleteFile(Request $request){
            //capturo el valor del id
            $input = $request->all();
            $id = $input['id'];
            //valido que venga el id sino mando un error
            if($id){
                //ubico el id en la bd
                $registro = Biblioteca::find($id);
                //valido que de verdad sea borrado en caso de que no arrojo un error
                if($registro->delete()){
                    Storage::disk('public')->delete([
                      $registro->Path,
                      'torrents/' . $id . '.torrent'
                    ]);

                    return json_encode(['code' => 200]);
                }
                return json_encode(['code' => 500]);
            }
            return json_encode(['code' => 600]);
    }
    

    //metodo para mandar la data de los eventos al datatables
    public function getBibliotecasRol(Request $request){
        //almaceno los valores recibidos de la peticion
        $input = $request->all();
        //Guardo el rol del usuario logeado
        $rol = $input['rol'];
        //guardo su id independiente de su rol
        $id = $input['id'];
        //obtengo el id de empresa si llegan a enviar
        /*if($input['id_empresa']){
            $empresa = $input['id_empresa'];
        }else{
            $empresa = " ";
        }*/

        if($rol == 'ADMINISTRADOR'){
            $eve = Evento::borrado(false);
            //si contiene la empresa se la agrego al query de busqueda
           /* if($empresa != " "){

                $eve->where(function ($q) use ($empresa){
                    $q->where('Empresa_id', new ObjectId($empresa) );
                });
            }*/
        }else if($rol == 'EMPRESA'){
            $eve = Evento::borrado(false)->where('Empresa_id', new ObjectId($id) );
        }else if($rol == 'EVENTO'){
            $eve = Evento::borrado(false)->where('_id', $id );
        }
        $eventos = [];
        //extraigo el query con o sin los filtros
        $ev = $eve->get();
        //return $ev;
        //verifico que exista data sino lo devulevo vacio
        if($ev){
            foreach ($ev as $e) {
                $files = Biblioteca::borrado(false)->activo(true)->where(
                    'Evento_id', new ObjectId($e->_id))->get();
                //armo la data que se muestra en la tabla de inicio de la pagina de eventos
                $eventos[] = [
                    '_id'       => $e->_id,
                    'Empresa'   => Empresa::find($e->Empresa_id)->Nombre,
                    'Empresa_id' => strtolower($e->Empresa_id),
                    'Evento'    => strtoupper($e->Nombre),
                    'IDEvento'  => $e->IDEvento,
                    'Fecha'     => $e->Fecha. ' '.$e->Hora,
                    'App'       => $e->App,
                    'Archivos'  => count($files)
                ];
            }
        }
        return $eventos;
    }

    /**
     * metodo para obtener todos los archivos asociados a un evento
     * $request variable que recibe el id del evento
     */
    public function getFilesEvento(Request $request){
        //capturo el id de la empresa para buscar los eventos en base a ella
        $idevento = $request->evento;

        $files = Biblioteca::borrado(false)->activo(true)->where('Evento_id', new ObjectID($idevento))->get();

        $archivos = [];

        //verifico que exista data sino lo devulevo vacio
        if($files){

            foreach ($files as $f) {

                //armo la data que se muestra en la tabla
                $archivos[] = [
                    '_id'       => $f->_id,
                    'Nombre'    => $f->NombreCompleto,
                    //'Tipo'      => $f->Tipo,
                    'Size'      => $f->Size,
                    'Categoria' => CategoriaBiblioteca::find($f->CategoriaBiblioteca_id)->Nombre,
                    'Activo'    => $f->Activo,
                    'MagnetURI' => $f->MagnetURI
                ];
            }
        }

        if($archivos){
            return json_encode(['code' => 200,'archivos'=>$archivos]);
        }else{
            return json_encode(['code' => 600]);
        }

    }


/**
 * Metodo para obtener toda la informacion del formulario para agregar un archivo multimedia
 */
    public function getDataAdd(){

        $data['estados'] = Estado::borrado(false)->get();
        $data['categorias'] = CategoriaBiblioteca::borrado(false)->activo(true)->orderBy('Nombre', 'ASC')->get();

        if($data){
            return json_encode(['code' => 200,'data'=>$data]);
        }else{
            return json_encode(['code' => 600]);
        }
    }

   /**
    * Metodo para agregar un nuevo archivo
    * ValidateArchivo es un request que valida si toda la informacion recibida cumple con todos los parametros
    * $request recibe toda la informacion del archivo agregada en front end
    */
    public function addFile(ValidateArchivo $request){
        $input = $request->all();

        $evento  = (string) $input['id-evento'];
        $empresa = (string) Evento::find($evento)->Empresa_id;
        $pathSave = $empresa.'/'.$evento.'/';

        $archivo = $input['archivo'];

        $fileData = [
            'extension' => $archivo->getClientOriginalExtension(),
            'size'      => humanFileSize($archivo->getSize()),
            'mime'      => $archivo->getMimeType()
        ];

        //dd($fileData);
        //creo el nombre del archivo
        $name = $input['name'].'.'.$fileData['extension'];

        $path = $request->file('archivo')->storeAs($pathSave, $name, 'public');
        $categoria = CategoriaBiblioteca::where('_id', new ObjectId($input['categoria']))->first();
        $duration = null;

        if ($categoria->Nombre === 'Imagen') {
          Validator::make(['archivo' => $request->archivo], [
            'archivo' => 'file|image',
          ])->validate();

        } else if ($categoria->Nombre === 'Audio') {
          
          Validator::make(['archivo' => $request->archivo], [
            'archivo' => 'file|mimetypes:audio/mpeg,audio/mp4,audio/vnd.wav',
          ])->validate();
          
          $audio = new Mp3Info($request->archivo->path());
          $duration = floor($audio->duration * 1000);

        } else if ($categoria->Nombre === 'Video') {
          
          Validator::make(['archivo' => $request->archivo], [
            'archivo' => 'file|mimetypes:video/x-msvideo,video/mpeg,video/3gpp|mimes:mp4',
          ])->validate();

          $getID3 = new \getID3();
          $video = $getID3->analyze($request->archivo->path());

          $duration = floor($video['playtime_seconds'] * 1000);
        }

        // Storage::disk('public_oneshow')->put($pathSave.$name, File::get($archivo));
        //capturo los datos y los acomodo en un arreglo
        $data = [
            'id-evento'        => new ObjectID($input['id-evento']),
            'nombre'           => $input['name'],
            'nombrec'          => $name,
            'path'             => $path,
            'size'             => $fileData['size'],
            'categoria'        => new ObjectId($input['categoria']),
            'activo'           => true,
            'borrado'          => false
        ];


        //procedo a guardarlos en la bd
        $registro = new Biblioteca;
        $registro->Evento_id                 = $data['id-evento'];
        $registro->Nombre                    = $data['nombre'];
        $registro->NombreCompleto            = $data['nombrec'];
        $registro->Path                      = $data['path'];
        $registro->Extension                 = $fileData['extension'];
        $registro->Size                      = $data['size'];
        $registro->CategoriaBiblioteca_id    = $data['categoria'];
        $registro->Fecha                     = Carbon::now();
        $registro->Activo                    = $data['activo'];
        $registro->Duracion                  = $duration;
        $registro->Borrado                   = $data['borrado'];

        //verifico si fue exitoso el insert en la bd
        if($registro->save()) {
            
            if (env('APP_ENV') === 'local') {
              MoveFileToTorrentClient::dispatch($registro);
            } else {
              $name = $registro->id .'.'. $fileData['extension'];
              $request->file('archivo')->storeAs('ROOT/files', $name, 'ftp');
            }


            return response()->json(['code' => 200]);

        } else {
            return response()->json(['code' => 500]);
        }
        

    }

    public function downloadTorrent (Request $request) {
      // return 'asldknaskldnaslkd';
      $pathToFile = public_path('storage/torrents') . '/' . $request->filename . '.torrent';

      if (is_file($pathToFile))
        return response()->file($pathToFile, [
          'Access-Control-Allow-Origin' => '*'
        ]);

      return response('Not Found', 404);
    }
}
