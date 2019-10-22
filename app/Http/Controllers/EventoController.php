<?php

namespace App\Http\Controllers;

use App\Http\Requests\ValidateEvento;
use App\Mail\MailNotificacionAprobacion;
use App\Models\MongoDB\Categoria;
use App\Models\MongoDB\Empresa;
use App\Models\MongoDB\Evento;
use App\Models\MongoDB\MenuAppInvitado;
use App\Models\MongoDB\Pais;
use App\Models\MongoDB\Estado;
use App\Models\MongoDB\Envio;
use App\Models\MongoDB\Usuario;
use App\Models\MongoDB\Sector;
use App\Models\MongoDB\Rol;
use Carbon\Carbon;
use Illuminate\Http\Request;
use DB, DataTables, Image, Storage, File, Auth, Mail, QrCode;
use MongoDB\BSON\ObjectID;
use Illuminate\Support\Str;
use App\Http\Requests\Evento\ConsultarHashtags;
use App\Http\Requests\Evento\ActualizarHashtags;
use App\Http\Requests\Evento\RegistrarPublicacion;

//controlador encargado de la seccion de eventos
class EventoController extends Controller
{


    //metodo para llamar la vista principal de eventos
    public function index($id){

        //cargo los datos de la empresa
        $empresa = Empresa::find($id);

        //cargo la empresa
        $data['empresa'] = $empresa;
        //cargo lista de estados
        $data['estados'] = Estado::where('Borrado', false)->get();
        //cargo el pais
        $select['paises'] = Pais::borrado(false)->get();

        //devuleve la vista
        return view('Configuracion.Eventos.index', $data);
    }

    //metodo para llamar la vista de agregar
    public function viewAdd($id){

        $data['paises'] = Pais::borrado(false)->get();
        $data['menusapp'] = MenuAppInvitado::borrado(false)->activo(true)->orderBy('Nombre', 'asc')->get();
        $data['estados'] = Estado::borrado(false)->get();
        $data['empresa'] = Empresa::find($id);

        //devuleve la vista
        return view('Configuracion.Eventos.add', $data);
    }

    //metodo para llamar la vista de ver
    public function viewShow($id){

        $data['existe'] = false;

        $registro = Evento::find($id);

        if($registro){

            $data['existe'] = true;
            $data['paises'] = Pais::borrado(false)->get();
            $data['estados'] = Estado::borrado(false)->get();
            $data['empresa'] = Empresa::find($registro->Empresa_id);
            $data['evento'] = $registro;
            $data['menusapp'] = MenuAppInvitado::borrado(false)->activo(true)->orderBy('Nombre', 'asc')->get();
            $data['menuapp'] = $this->processGetMenuApp($registro->MenuApp);

        }

        //devuleve la vista
        return view('Configuracion.Eventos.show', $data);
    }

    //metodo para llamar la vista de editar
    public function viewEdit($id){

        $data['existe'] = false;

        $registro = Evento::find($id);

        if($registro){

            $data['existe'] = true;
            $data['paises'] = Pais::borrado(false)->get();
            $data['estados'] = Estado::borrado(false)->get();
            $data['empresa'] = Empresa::find($registro->Empresa_id);
            $data['evento'] = $registro;
            $data['menusapp'] = MenuAppInvitado::borrado(false)->activo(true)->orderBy('Nombre', 'asc')->get();
            $data['menuapp'] = $this->processGetMenuApp($registro->MenuApp);

        }

        //devuleve la vista
        return view('Configuracion.Eventos.edit', $data);
    }

    //metodo para mandar la data de los eventos al datatables
    public function ajaxDatatables(Request $request){

        //capturo el id de la empresa para buscar los eventos en base a ella
        $input = $request->all();
        $id_emp = $input['id_emp'];

        //guardo el rol del usuario
        $rol = strtoupper(Auth::user()->nameRol());

        //acorde al rol muestro los eventos
        if($rol == 'ADMINISTRADOR'){

            $eve = Evento::borrado(false)->where('Empresa_id', new ObjectID($id_emp) )->get();

        }else if($rol == 'EMPRESA'){

            $eve = Evento::borrado(false)->where('Empresa_id', new ObjectID($id_emp) )->get();

        }else if($rol == 'EVENTO'){

            $eve = Evento::borrado(false)->where('_id', Auth::user()->Evento_id )->get();

        }

        $eventos = [];

        //verifico que exista data sino lo devulevo vacio
        if($eve){

            foreach ($eve as $e) {

                //armo la data que se muestra en la tabla de inicio de la pagina de eventos
                $eventos[] = [
                    '_id'       => $e->_id,
                    'Nombre'    => $e->Nombre,
                    'IDEvento'  => $e->IDEvento,
                    'Fecha'     => $e->Fecha. ' '.$e->Hora,
                    'Pais'      => Pais::find($e->Pais_id)->Nombre,
                    'App'       => $e->App,
                    'Activo'    => $e->Activo
                ];
            }

        }

        return DataTables::collection( $eventos )->make(true);
    }

    //metodo para agregar evento
    public function ajaxAdd(ValidateEvento $request){

        //verifico que la respuesta venga por ajax
        if($request->ajax()){

            $input = $request->all();

            //guardo la imagen en una variable
            $image = $input['logo'];
            //ubico la ruta de la imagen
            $path = $image->getRealPath();
            //obtengo la extension
            $type = $image->getClientOriginalExtension();
            //creo un nombre temporal
            $name = time().'.'.$type;
            //ruta imagen temporal
            $pathImgTemporal = public_path('images/'.$name);
            //proceso la imagen a 200x200
            $img = Image::make($path)->crop( (int)round($input['w']),  (int)round($input['h']),  (int)round($input['x']),  (int)round($input['y']) )->fit(200,200)->save($pathImgTemporal);
            //obtengo la data de la imagen
            $data = file_get_contents($pathImgTemporal);
            //convierto a base64
            $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
            //elimino imagen temporal
            File::delete($pathImgTemporal);

            $ubi = $input['ubicacion'];
            $ubicacion = 'MANUAL';

            if($ubi == 'g'){
                $ubicacion = 'GPS';
            }

            $menusapp = [];

            if($input['menuapp']){

                //proceso los menus
                $menusapp = $this->processMenuApp($input['menuapp']);
            }


            //capturo los datos y los acomodo en un arreglo
            $data = [
                'id-emp'           => new ObjectID($input['id-emp']),
                'nombre'           => $input['nombre'],
                'fecha'            => $input['fecha'],
                'hora'             => $input['hora'],
                'estatus'          => $input['estatus'],
                'app'              => $input['app'],
                'licencias'        => $input['licencias'],
                'pais'             => new ObjectID($input['pais']),
                'latitud'          => $input['latitud'],
                'longitud'         => $input['longitud'],
                'ubicacion'        => $ubicacion,
                'logo'             => $base64,
                'idevento'         => $this->generateRandomIDEvento(),
                'borrado'          => false
            ];


            //procedo a guardarlos en la bd
            $registro = new Evento;
            $registro->Empresa_id                = $data['id-emp'];
            $registro->Nombre                    = $data['nombre'];
            $registro->Fecha                     = $data['fecha'];
            $registro->Hora                      = $data['hora'];
            $registro->Activo                    = (boolean) $data['estatus'];
            $registro->App                       = (boolean) $data['app'];
            $registro->Licencias                 = $data['licencias'];
            $registro->Pais_id                   = $data['pais'];
            $registro->Latitud                   = $data['latitud'];
            $registro->Longitud                  = $data['longitud'];
            $registro->Ubicacion                 = $data['ubicacion'];
            $registro->Logo                      = $data['logo'];
            $registro->IDEvento                  = $data['idevento'];
            $registro->MenuApp                   = $menusapp;
            $registro->Borrado                   = $data['borrado'];


            //verifico si fue exitoso el insert en la bd
            if($registro->save()){
                return response()->json(['code' => 200]);
            }
            return response()->json(['code' => 500]);
        }

    }

    //metodo para actualizar
    public function ajaxUpdate(ValidateEvento $request){

        //verifico que la respuesta venga por ajax
        if($request->ajax()){

            //obtengo todos los datos del formulario
            $input = $request->all();

            //instancio los datos a editar
            $registro = Evento::find($input['id-evento']);

            //guardo la imagen en una variable
            $image = $input['logo'];

            //valido que la imagen este o no vacio, si esta vacia vuelvo a guardar la imagen actual sino la actualizo
            if($image == 'undefined'){
                $base64 = $registro->Logo;
            }else{

                //ubico la ruta de la imagen
                $path = $image->getRealPath();
                //obtengo la extension
                $type = $image->getClientOriginalExtension();
                //creo un nombre temporal
                $name = time().'.'.$type;
                //ruta imagen temporal
                $pathImgTemporal = public_path('images/'.$name);
                //proceso la imagen a 200x200
                $img = Image::make($path)->crop( (int)round($input['w']),  (int)round($input['h']),  (int)round($input['x']),  (int)round($input['y']) )->fit(200,200)->save($pathImgTemporal);
                //obtengo la data de la imagen
                $data = file_get_contents($pathImgTemporal);
                //convierto a base64
                $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
                //elimino imagen temporal
                File::delete($pathImgTemporal);

            }

            $ubi = $input['ubicacion'];
            $ubicacion = 'MANUAL';

            if($ubi == 'g'){
                $ubicacion = 'GPS';
            }

            $menusapp = [];

            if($input['menuapp']){

                //proceso los menus
                $menusapp = $this->processMenuApp($input['menuapp']);
            }

            $data = [
                'id'               => $input['id-evento'],
                'nombre'           => $input['nombre'],
                'fecha'            => $input['fecha'],
                'hora'             => $input['hora'],
                'estatus'          => $input['estatus'],
                'licencias'        => $input['licencias'],
                'pais'             => new ObjectID($input['pais']),
                'latitud'          => $input['latitud'],
                'longitud'         => $input['longitud'],
                'ubicacion'        => $ubicacion,
                'logo'             => $base64
            ];

            //procedo a guardarlos en la bd
            $registro = Evento::find($data['id']);
            $registro->Nombre                    = $data['nombre'];
            $registro->Fecha                     = $data['fecha'];
            $registro->Hora                      = $data['hora'];
            $registro->Activo                    = (boolean) $data['estatus'];
            $registro->Licencias                 = $data['licencias'];
            $registro->Pais_id                   = $data['pais'];
            $registro->Latitud                   = $data['latitud'];
            $registro->Longitud                  = $data['longitud'];
            $registro->Ubicacion                 = $data['ubicacion'];
            $registro->MenuApp                   = $menusapp;
            $registro->Logo                      = $data['logo'];

            //verifico si fue exitoso el insert en la bd
            if($registro->update()){
                return response()->json(['code' => 200]);
            }
            return response()->json(['code' => 500]);
        }

    }

    //metodo para borrar
    public function ajaxDelete(Request $request){

        //verifico que la respuesta venga por ajax
        if($request->ajax()){

            //capturo el valor del id
            $input = $request->all();
            $id = $input['id'];

            //valido que venga el id sino mando un error
            if($id){

                //ubico el id en la bd
                $registro = Evento::find($id);
                $registro->Borrado = true;

                //valido que de verdad sea borrado en caso de que no arrojo un error
                if($registro->save()){
                    return json_encode(['code' => 200]);
                }
                return json_encode(['code' => 500]);

            }
            return json_encode(['code' => 600]);
        }

    }

    //metodo para cambiar la visualizacion o estado
    public function ajaxEnvios(Request $request){

        //verifico que la respuesta venga por ajax
        if($request->ajax()){

            //capturo el valor del id
            $input = $request->all();
            $id = $input['evento'];

            //valido que venga el id sino mando un error
            if($id){

                //ubico el id en la bd
                $registro = Evento::find(new ObjectId($id));
                $envios = Envio::where('Evento',$id)->get();

                if($registro){
                    return json_encode(['code' => 200,'envios'=>$envios]);
                }
                return json_encode(['code' => 500]);
            }
            return json_encode(['code' => 600]);
        }

    }

    //metodo para cambiar la visualizacion o estado
    public function ajaxEnviosCola(Request $request){

        //verifico que la respuesta venga por ajax
        if($request->ajax()){

            //capturo el valor del id
            $input = $request->all();
            $evento = $input['evento'];
            $title = $input['title'];
            $estado = $input['estado'];
            $inicio = $input['inicio'];
            $fin = $input['fin'];
            $parametro = $input['parametro'];

            //valido que venga el id sino mando un error
            if($evento){

                //ubico el id en la bd
                $evento = Evento::find($evento);

                $envio = new Envio;
                $envio->Evento = $input['evento'];
                $envio->Tipo = $title;
                $envio->Estado = $estado;
                $envio->Inicio = $inicio;
                $envio->Fin = $fin;
                $envio->Parametro = $parametro;


                if($envio->save()){                   
                    $envios = Envio::get();
                    return json_encode(['code' => 200,'envios'=>$envios]);
                }
                return json_encode(['code' => 500]);

            }
            return json_encode(['code' => 600]);
        }

    }

    //metodo para cambiar la visualizacion o estado
    public function ajaxEnviosQuitar(Request $request){

        //verifico que la respuesta venga por ajax
        if($request->ajax()){

            //capturo el valor del id
            $input = $request->all();
           // $evento = $input['evento'];
          //  $title = $input['title'];
            //$estado = $input['estado'];
            //$inicio = $input['inicio'];
            //$fin = $input['fin'];
           // $parametro = $input['parametro'];
            $id = $input['id'];

            //valido que venga el id sino mando un error
            if($id){

                //ubico el id en la bd
                //$evento = Evento::find($evento);

               /* $envio = new Envio;
                $envio->Evento = $input['evento'];
                $envio->Tipo = $title;
                $envio->Estado = $estado;
                $envio->Inicio = $inicio;
                $envio->Fin = $fin;
                $envio->Parametro = $parametro;*/
                $envio = Envio::find($id);
                

                if($envio&&$envio->delete()){
                    $envios = Envio::get();
                    return json_encode(['code' => 200,'envios'=>$envios]);
                }
                return json_encode(['code' => 500]);
            }
            return json_encode(['code' => 600]);
        }

    }

    //metodo para cambiar la visualizacion o estado
    public function ajaxChangeActive(Request $request){

        //verifico que la respuesta venga por ajax
        if($request->ajax()){

            //capturo el valor del id
            $input = $request->all();
            $id = $input['id'];

            //valido que venga el id sino mando un error
            if($id){

                //ubico el id en la bd
                $registro = Evento::find($id);

                if($registro->App == false){
                    $registro->App = true;
                }else{
                    $registro->App = false;
                }

                //valido que de verdad sea borrado en caso de que no arrojo un error
                if($registro->save()){
                    return json_encode(['code' => 200]);
                }
                return json_encode(['code' => 500]);

            }
            return json_encode(['code' => 600]);
        }

    }


    public function generateRandomIDEvento(){

        $id = Str::random(6);

        $validator = \Validator::make(['id'=>$id],['id'=>'unique:Eventos,IDEvento']);

        if($validator->fails()){
            return $this->generateRandomIDEvento();
        }

        return strtoupper($id);
    }

    //metodo que procesa los menus app
    public function processMenuApp($data){

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

    //metodo que arma los menus app
    public function processGetMenuApp($data){

        $result = [];

        //renombro la llave
        foreach ($data as $value ){

            $result[] = (string)$value;
        }

        //devuelvo el resultado en formato json
        return $result;
    }


    public function getEventosUsuario ($id) {
        $usuario = Usuario::find($id);
        $id_rol = $usuario->Rol_id;
        $rol = Rol::find($id_rol);
        $nombreRol = $rol->Nombre;

        if ($nombreRol == 'ADMINISTRADOR') {

            //cargo los eventos
            $data['eventos'] = Evento::borrado(false)->activo(true)->app(true)->orderBy('Nombre', 'ASC')->get();

        } else if ($nombreRol == 'EMPRESA') {

            //cargo los eventos
            $data['eventos'] = Evento::borrado(false)->activo(true)->app(true)->where('Empresa_id', new ObjectId((string)$usuario->Empresa_id) )->orderBy('Nombre', 'ASC')->get();

        } else if ($nombreRol == 'EVENTO') {

            //cargo los eventos
            $data['eventos'] = Evento::borrado(false)->activo(true)->app(true)->where('_id', new ObjectId((string)$usuario->Evento_id) )->orderBy('Nombre', 'ASC')->get();

        }

        for ($i=0; $i < count($data['eventos']); $i++) {
          $pais = Pais::find(new ObjectId($data['eventos'][$i]->Pais_id));
          $data['eventos'][$i]->Pais=$pais;
        }
        
        $data['sectores'] = Sector::borrado(false)->activo(true)->orderBy('Nombre', 'ASC')->get();

        return json_encode(['code' => 200, "data"=>$data]);
    }


    //metodo para cambiar la visualizacion o estado
    public function getEnvios(Request $request){

        //verifico que la respuesta venga por ajax
        if($request->ajax()){

            //capturo el valor del id
            $input = $request->all();
            $id = $input['evento'];

            //valido que venga el id sino mando un error
            if($id){

                //ubico el id en la bd
                $registro = Evento::find(new ObjectId($id));
                $envios = Envio::where('Evento',$id)->get();

                if($registro){
                    return json_encode(['code' => 200,'envios'=>$envios]);
                }
                return json_encode(['code' => 500]);

            }
            return json_encode(['code' => 600]);
        }

    }

    //metodo para cambiar la visualizacion o estado
    public function quitarEnvios(Request $request){

        //verifico que la respuesta venga por ajax
        if($request->ajax()){

            //capturo el valor del id
            $input = $request->all();
           // $evento = $input['evento'];
          //  $title = $input['title'];
            //$estado = $input['estado'];
            //$inicio = $input['inicio'];
            //$fin = $input['fin'];
           // $parametro = $input['parametro'];
            $id = $input['id'];

            //valido que venga el id sino mando un error
            if($id){

                //ubico el id en la bd
                //$evento = Evento::find($evento);

               /* $envio = new Envio;
                $envio->Evento = $input['evento'];
                $envio->Tipo = $title;
                $envio->Estado = $estado;
                $envio->Inicio = $inicio;
                $envio->Fin = $fin;
                $envio->Parametro = $parametro;*/
                $envio = Envio::find($id);
                

                if($envio&&$envio->delete()){
                    $envios = Envio::get();
                    return json_encode(['code' => 200,'envios'=>$envios]);
                }
                return json_encode(['code' => 500]);

            }
            return json_encode(['code' => 600]);
        }
    }

    /**
     * metodo para obtener evento 
     * por id
     * */
    public function getEvento($id){
        $registro = Evento::find($id);

        return json_encode(['code' => 200,'evento'=>$registro]);
    }

    /**
     * metodo para obtener todos los eventos por el id de la empresa
     */
    public function getEventosEmpresa(Request $request){
           //capturo el id de la empresa para buscar los eventos en base a ella
           $input = $request->all();
           $id_emp = $input['idEmpresa'];
           $empresa = Empresa::find($id_emp);
           //guardo el rol del usuario
           $rol = $input['rol'];
   
           //acorde al rol muestro los eventos
           if($rol == 'ADMINISTRADOR'){
   
               $eve = Evento::borrado(false)->where('Empresa_id', new ObjectID($id_emp) )->get();
   
           }else if($rol == 'EMPRESA'){
   
               $eve = Evento::borrado(false)->where('Empresa_id', new ObjectID($id_emp) )->get();
   
           }else if($rol == 'EVENTO'){
   
               $eve = Evento::borrado(false)->where('_id', Auth::user()->Evento_id )->get();
   
           }
   
           $eventos = [];
   
           //verifico que exista data sino lo devulevo vacio
           if($eve){
   
               foreach ($eve as $e) {

                   //armo la data que se muestra en la tabla de inicio de la pagina de eventos
                   $eventos[] = [
                       '_id'       => $e->_id,
                       'Nombre'    => $e->Nombre,
                       'IDEvento'  => $e->IDEvento,
                       'Fecha'     => $e->Fecha. ' '.$e->Hora,
                       'Pais'      => Pais::find($e->Pais_id)->Nombre,
                       'App'       => $e->App,
                       'Activo'    => $e->Activo
                   ];
                   
               }
               return json_encode(['code' => 200,'eventos'=>$eventos,'empresa'=>$empresa]);
           }else{
                
           return json_encode(['code' => 500]);
           }
   
           
    }

    /**funcion de actuali acion */
    public function actu(){
        $eve = Evento::borrado(false)->get();
        foreach ($eve as $e) {
            if(!$e->SeatsSubAccount_id){
                $seatsio = new \Seatsio\SeatsioClient("f4b8068e-031f-4035-a6c2-c56eca47ced9");
                $dato =  $seatsio->subaccounts->create($e->Nombre);
                $e->secretKey                 = $dato->secretKey;
                $e->publicKey                 = $dato->publicKey;
                $e->designerKey               = $dato->designerKey;
                $e->SeatsSubAccount_id        = $dato->id;
                if(!$e->save()){
                    return json_encode(['code' => 200,'mensaje'=>"no se guardo"]);
                }
            }
            
        }
        return json_encode(['code' => 200,'mensaje'=>"guardado con exito"]);

    }

    /**
     * metodo para obtener todas las opciones de menu que tendra el evento
     */
    public function getMenuAppInvitado(){
        $data = MenuAppInvitado::borrado(false)->activo(true)->orderBy('Nombre', 'asc')->get();

        if($data){
            return json_encode(['code' => 200,'data'=>$data]);
        }else{
             
        return json_encode(['code' => 500]);
        }
    }

    /**
     * metodo para agregar evento el validateRequest
     * es el request que valida que toda la informacion agregada en el formulario este completa y confiable
     */
    public function addEvento(ValidateEvento $request){
            $input = $request->all();
            //guardo la imagen en una variable
            $image = $input['logo'];
            //ubico la ruta de la imagen
            $path = $image->getRealPath();
            //obtengo la extension
            $type = $image->getClientOriginalExtension();
            //creo un nombre temporal
            $name = time().'.'.$type;
            //ruta imagen temporal
            $pathImgTemporal = public_path('images/'.$name);
            //proceso la imagen a 200x200
            $img = Image::make($path)->crop( (int)round($input['w']),  (int)round($input['h']),  (int)round($input['x']),  (int)round($input['y']) )->fit(200,200)->save($pathImgTemporal);
            //obtengo la data de la imagen
            $data = file_get_contents($pathImgTemporal);
            //convierto a base64
            $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
            //elimino imagen temporal
            File::delete($pathImgTemporal);

            $ubi = $input['ubicacion'];
            $ubicacion = 'MANUAL';

            if($ubi == 'g'){
                $ubicacion = 'GPS';
            }

            $menusapp = [];

            if($input['menuapp']){

                //proceso los menus
                $menusapp = $this->processMenuApp($input['menuapp']);
            }


            //capturo los datos y los acomodo en un arreglo
            $data = [
                'id-emp'           => new ObjectID($input['id-emp']),
                'nombre'           => $input['nombre'],
                'fecha'            => $input['fecha'],
                'hora'             => $input['hora'],
                'estatus'          => $input['estatus'],
                'app'              => $input['app'],
                'licencias'        => $input['licencias'],
                'pais'             => new ObjectID($input['pais']),
                'latitud'          => $input['latitud'],
                'longitud'         => $input['longitud'],
                'ubicacion'        => $ubicacion,
                'logo'             => $base64,
                'idevento'         => $this->generateRandomIDEvento(),
                'borrado'          => false
            ];
            $seatsio = new \Seatsio\SeatsioClient("f4b8068e-031f-4035-a6c2-c56eca47ced9");
            $dato = $seatsio->subaccounts->create($input["nombre"]);
            //procedo a guardarlos en la bd
            $registro = new Evento;
            $registro->Empresa_id                = $data['id-emp'];
            $registro->Nombre                    = $data['nombre'];
            $registro->Fecha                     = $data['fecha'];
            $registro->Hora                      = $data['hora'];
            $registro->Activo                    = (boolean) $data['estatus'];
            $registro->App                       = (boolean) $data['app'];
            $registro->Licencias                 = $data['licencias'];
            $registro->Pais_id                   = $data['pais'];
            $registro->Latitud                   = $data['latitud'];
            $registro->Longitud                  = $data['longitud'];
            $registro->Ubicacion                 = $data['ubicacion'];
            $registro->Logo                      = $data['logo'];
            $registro->IDEvento                  = $data['idevento'];
            $registro->MenuApp                   = $menusapp;
            $registro->secretKey                 = $dato->secretKey;
            $registro->publicKey                 = $dato->publicKey;
            $registro->designerKey               = $dato->designerKey;
            $registro->SeatsSubAccount_id        = $dato->id;
            $registro->Borrado                   = $data['borrado'];


            //verifico si fue exitoso el insert en la bd
            if($registro->save()){

                return response()->json(['code' => 200,'data'=>$registro]);

            }else{
                return response()->json(['code' => 500]);
            }
        }

    /**
     * metodo para eliminar el evento por id
     */
    public function deleteEvento(Request $request){

    

            //capturo el valor del id
            $input = $request->all();
            $id = $input['id'];

            //valido que venga el id sino mando un error
            if($id){

                //ubico el id en la bd
                $registro = Evento::find($id);
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

    /**
     * metodo para obtener la informacion del evento por id
     */
    public function getEventoById($id){
        $registro = Evento::find($id);
        $registro->Pais = Pais::find($registro->Pais_id)->Nombre;
        if($registro){

            $data['existe'] = true;
            $data['paises'] = Pais::borrado(false)->get();
            $data['estados'] = Estado::borrado(false)->get();
            $data['empresa'] = Empresa::find($registro->Empresa_id);
            $data['evento'] = $registro;
            $data['menusapp'] = MenuAppInvitado::borrado(false)->activo(true)->orderBy('Nombre', 'asc')->get();
            $data['menuapp'] = $this->processGetMenuApp($registro->MenuApp);

            return json_encode(['code' => 200,'evento'=>$data]);
         

        }else{
            return json_encode(['code' => 500]);
        }

    }

    public function getEventoByIdRol($id){
        $registro = Evento::find($id);

        if($registro){

            $data['existe'] = true;
            $data['paises'] = Pais::borrado(false)->get();
            $data['estados'] = Estado::borrado(false)->get();
            $data['empresa'] = Empresa::find($registro->Empresa_id);
            $data['evento'] = $registro;
            $data['menusapp'] = MenuAppInvitado::borrado(false)->activo(true)->orderBy('Nombre', 'asc')->get();
            $data['menuapp'] = $this->processGetMenuApp($registro->MenuApp);

            return json_encode(['code' => 200,'evento'=>$data]);
         

        }else{
            return json_encode(['code' => 500]);
        }

    }

    /**
     * meotodo para modificar informacion de un evento
     * validate Evento el request valida que toda la informacion 
     * sea correcta y viable
     */
    public function editEvento(ValidateEvento $request){

            //obtengo todos los datos del formulario
            $input = $request->all();

            //instancio los datos a editar
            $registro = Evento::find($input['id-evento']);

            //guardo la imagen en una variable
            $image = $input['logo'];

            //valido que la imagen este o no vacio, si esta vacia vuelvo a guardar la imagen actual sino la actualizo
            if($image == 'undefined'){
                $base64 = $registro->Logo;
            }else{

                //ubico la ruta de la imagen
                $path = $image->getRealPath();
                //obtengo la extension
                $type = $image->getClientOriginalExtension();
                //creo un nombre temporal
                $name = time().'.'.$type;
                //ruta imagen temporal
                $pathImgTemporal = public_path('images/'.$name);
                //proceso la imagen a 200x200
                $img = Image::make($path)->crop( (int)round($input['w']),  (int)round($input['h']),  (int)round($input['x']),  (int)round($input['y']) )->fit(200,200)->save($pathImgTemporal);
                //obtengo la data de la imagen
                $data = file_get_contents($pathImgTemporal);
                //convierto a base64
                $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
                //elimino imagen temporal
                File::delete($pathImgTemporal);

            }

            $ubi = $input['ubicacion'];
            $ubicacion = 'MANUAL';

            if($ubi == 'g'){
                $ubicacion = 'GPS';
            }

            $menusapp = [];

            if($input['menuapp']){

                //proceso los menus
                $menusapp = $this->processMenuApp($input['menuapp']);
            }

            $data = [
                'id'               => $input['id-evento'],
                'nombre'           => $input['nombre'],
                'fecha'            => $input['fecha'],
                'hora'             => $input['hora'],
                'estatus'          => $input['estatus'],
                'licencias'        => $input['licencias'],
                'pais'             => new ObjectID($input['pais']),
                'latitud'          => $input['latitud'],
                'longitud'         => $input['longitud'],
                'ubicacion'        => $ubicacion,
                'logo'             => $base64
            ];

            //procedo a guardarlos en la bd
            $registro = Evento::find($data['id']);
            $registro->Nombre                    = $data['nombre'];
            $registro->Fecha                     = $data['fecha'];
            $registro->Hora                      = $data['hora'];
            $registro->Activo                    = (boolean) $data['estatus'];
            $registro->Licencias                 = $data['licencias'];
            $registro->Pais_id                   = $data['pais'];
            $registro->Latitud                   = $data['latitud'];
            $registro->Longitud                  = $data['longitud'];
            $registro->Ubicacion                 = $data['ubicacion'];
            $registro->MenuApp                   = $menusapp;
            $registro->Logo                      = $data['logo'];

            //verifico si fue exitoso el insert en la bd
            if($registro->update()){

                return response()->json(['code' => 200]);

            }else{
                return response()->json(['code' => 500]);
            }
        
    }

    /**
     * Metodo para agregar a la cola de multimedia de eventos
     */
    public function addCola (Request $request) {


            //capturo el valor del id
            $input = $request->all();
            $evento = $input['evento'];
            $title = $input['title'];
            $estado = $input['estado'];
            $inicio = $input['inicio'];
            $fin = $input['fin'];
            $parametro = $input['parametro'];

            //valido que venga el id sino mando un error
            if ($evento) {

                //ubico el id en la bd
                $evento = Evento::find($evento);

                $envio = new Envio;
                $envio->Evento = $input['evento'];
                $envio->Tipo = $title;
                $envio->Estado = $estado;
                $envio->Inicio = $inicio;
                $envio->Fin = $fin;
                $envio->Parametro = $parametro;


                if($envio->save())    
                    return json_encode(['code' => 200, 'envio' => [
                      '_id' => $envio->_id,
                      'Evento' => $envio->Evento,
                      'Tipo' => $envio->Tipo,
                      'Estado' => $envio->Estado,
                      'Inicio' => $envio->Inicio,
                      'Fin' => $envio->Fin,
                      'Parametro' => $envio->Parametro,
                    ]]);
                
                return json_encode(['code' => 500]);

            } else {
                return json_encode(['code' => 600]);
            }
    }

    /**
     * Consultar Hashtags del Evento
     * 
     * @param ConsultarHashtags $request
     * @return Response
     */
    public function consultarHashtagsDelEvento(ConsultarHashtags $request) 
    {
        $evento = Evento::find($request->eventoId);

        if ($evento->HashtagsTwitter || $evento->HashtagsInstagram) {
            return response()->json([
                'hashtagsTwitter' => ($evento->HashtagsTwitter) ? json_encode($evento->HashtagsTwitter) : null,
                'hashtagsInstagram' => ($evento->HashtagsInstagram) ? json_encode($evento->HashtagsInstagram) : null,
                'existen' => true
            ], 200);
        }

        return response()->json([
            'mensaje' => 'No existen Hashtags registrados para el evento',
            'existen' => false
        ], 200);
    }

    /**
     * Actualizar Hashtags y redes sociales disponibles
     * 
     * @param ActualizarHashtags $request
     * @return Response
     */
    public function actualizarHashtagsDelEvento(ActualizarHashtags $request) 
    {
        $evento = Evento::find($request->eventoId);
        $evento->HashtagsTwitter = ($request->HashtagsTwitter) ? json_decode($request->HashtagsTwitter) : [];
        $evento->HashtagsInstagram = ($request->HashtagsInstagram) ? json_decode($request->HashtagsInstagram) : [];
        $evento->save();

        return response()->json(['guardado' => true], 200);
    }

    /**
     * Obtener publicaciones del evento en formato XML/RSS
     * 
     * @param Request $request
     * @param string $eventoId
     * @return Response
     */
    public function obtenerPublicacionesRSS(Request $request, $eventoId) {

        $plantillaRSS = '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel></channel></rss>';
        $contenidoXML = new \SimpleXMLElement($plantillaRSS);

        $evento = Evento::find($eventoId);

        foreach ($evento->PublicacionesRSS as $publicacion) {

            $item = $contenidoXML->channel->addChild('item');
            $item->addChild('description', $publicacion['descripcion']);
            $item->addChild('pubDate', $publicacion['fechaPublicacion']);

            if ($publicacion['rutaDeImagen']) {
                $imagen = $item->addChild('enclosure');
                $imagen->addAttribute('url', $publicacion['rutaDeImagen']);
                $imagen->addAttribute('type', 'image/png');
            }
        }

        $rutaDelXML = base_path('storage/app/public/Eventos/'. $eventoId . '/Publicaciones/' . 'RSS.xml');
        file_put_contents($rutaDelXML, $contenidoXML->asXML());

        return response()->file($rutaDelXML);
    }

    /**
     * Registrar publicacion RSS
     * 
     * @param Request $request
     * @return Response
     */
    public function registrarPublicacionRSS(Request $request) {

        $rutaDeImagen = ($request->imagen) ? $this->guardarImagen($request->eventoId, $request->imagen) : null;

        $publicacion = [
            'descripcion' => $request->descripcion,
            'rutaDeImagen' => $rutaDeImagen,
            'fechaPublicacion' => date(DATE_RFC2822)
        ];

        $evento = Evento::find($request->eventoId);

        if ($evento->PublicacionesRSS) {
            $nuevasPublicaciones = $evento->PublicacionesRSS;
            array_push($nuevasPublicaciones, $publicacion);
        } else {
            $nuevasPublicaciones = array($publicacion);
        }

        $evento->PublicacionesRSS = $nuevasPublicaciones;
        $evento->save();

        return response()->json(['guardado' => true], 200);
    }

    /**
     * Almacenar imagen de la publicacion
     * 
     * @param string $eventoId
     * @param string $imagenCodificada
     * @return string
     */
    private function guardarImagen($eventoId, $imagenCodificada) {
        
        $imagenDecodificada = base64_decode($imagenCodificada);
        $nombre = time() . '.png';
        $rutaDeLaImagen = base_path('storage/app/public/Eventos/'. $eventoId . '/Publicaciones/' . $nombre);

        if(!File::exists(base_path('storage/app/public/Eventos/'. $eventoId .'/Publicaciones'))) {
            File::makeDirectory(base_path('storage/app/public/Eventos/'. $eventoId .'/Publicaciones'), $mode = 0777, true, true);
        }

        file_put_contents($rutaDeLaImagen, $imagenDecodificada);

        return '/storage/Eventos/'. $eventoId . '/Publicaciones/' . $nombre;
    }

    public function getEventos(){
        $data = Evento::borrado(false)->get();
        if($data){
            return json_encode(['code' => 200,'eventos'=>$data]);
        }else{
            return json_encode(['code' => 500]);
        }
    }
}
