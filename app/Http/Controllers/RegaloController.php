<?php

namespace App\Http\Controllers;

use App\Models\MongoDB\Evento;
use App\Models\MongoDB\Regalo;
use App\Traits\PermisosTraits;
use File;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;
use Respect\Validation\Validator as v;
use Storage;

//controlador encargado de los regalos

class RegaloController extends Controller
{
    public function getInfo(Request $request)
    {
        //capturo el id de la empresa para buscar los eventos en base a ella
        $input = $request->all();
        //almaceno los valores enviados por ajax
        $empresa = $input['empresa'];
        //guardo el rol del usuario
        $rol = $input['rol'];
        $id = $input['id'];

        try {
            $ev = PermisosTraits::permisoEvento($rol, $id, $empresa);
            //verifico que exista data sino lo devulevo vacio
            $allregalos = Regalo::all();
            foreach ($ev as $e) {

                if (count($allregalos) > 0) {
                    $regalos = Regalo::where([
                        ['Evento_id', '=', new ObjectId($e->_id)],
                        ['Borrado', '=', false],
                        ['Activo', '=', true]])->get();
                }

                //armo la data que se muestra en la tabla de inicio de la pagina de eventos
                $eventos[] = [

                    'Regalos' => isset($regalos) ? count($regalos) : 0,
                ];

            }

            return json_encode(['code' => 200, 'data' => $eventos]);
        } catch (\Exception $e) {
            return json_encode(['code' => $e->getMessage()]);
        }

    }

    public function getRegalosEventoId($id)
    {

        $idevento = $id;
        $regalos = [];

        try {
            $regalosIdEvento = Regalo::where([
                ['Evento_id', '=', new ObjectId($idevento)],
                ['Borrado', '=', false],
                ['Activo', '=', true]])->get();

            return json_encode(['code' => 200, 'regalos' => $regalosIdEvento]);
            if (count($regalosIdEvento) > 0) {
                foreach ($regalosIdEvento as $r) {
                    $regalos[] = [
                        '_id' => $r->_id,
                        'Evento_id' => $r->Evento_id,
                        'TipoRegalo' => isset($r->TipoRegalo) ? $r->TipoRegalo : '',
                        'OpcionDinero' => isset($r->OpcionDinero) ? $r->OpcionDinero : '',
                        'Banco' => isset($r->Banco) ? $r->Banco : '',
                        'CUIL' => isset($r->CUIL) ? $r->CUIL : '',
                        'CBU' => isset($r->CBU) ? $r->CBU : '',
                        'PathImg' => isset($r->PathImg) ? $r->PathImg : '',
                        'Objeto' => isset($r->Objeto) ? $r->Objeto : '',
                        'SKU' => isset($r->SKU) ? $r->SKU : '',
                        'TiendaSugerida' => isset($r->Tienda) ? $r->Tienda : '',
                        'Link' => isset($r->Link) ? $r->Link : '',
                        'Adquirido' => isset($r->Adquirido) ? $r->Adquirido : '',
                    ];
                }

                return json_encode(['code' => 200, 'regalos' => $regalos]);
            } else {
                return json_encode(['code' => 204, 'regalos' => []]);
            }

        } catch (\Exception $e) {
            // return json_encode(['code' => $e->getMessage()]);
            return json_encode(['code' => 500]);
        }

    }

    public function addAndEdit(Request $request, $id, $idRegalo)
    {

        $data = json_decode($request->getContent(), true);
        $newRegalo = new Regalo();
        $findEvento = Evento::find($id);
        $regaloEdit = Regalo::find($idRegalo);
        if (!$findEvento) {
            return json_encode(['code' => new Exception(500)]);
        }
        try {
            if ($data['TipoRegalo'] == "DINERO" and $data['OpcionDinero'] == "EFECTIVO") {

                if ($regaloEdit) {
                    $regaloEdit->TipoRegalo = $data['TipoRegalo'];
                    $regaloEdit->OpcionDinero = $data['OpcionDinero'];
                    $regaloEdit->Banco = '';
                    $regaloEdit->CUIL = '';
                    $regaloEdit->CBU = '';
                    $regaloEdit->Adquirido = false;
                    $regaloEdit->Borrado = false;
                    $regaloEdit->Activo = true;
                    $regaloEdit->save();
                } else {
                    $newRegalo->Evento_id = new ObjectId($findEvento->_id);
                    $newRegalo->TipoRegalo = $data['TipoRegalo'];
                    $newRegalo->OpcionDinero = $data['OpcionDinero'];
                    $newRegalo->Adquirido = false;
                    $newRegalo->Borrado = false;
                    $newRegalo->Activo = true;
                    $newRegalo->save();
                }
                return json_encode(['code' => 200]);
            } elseif ($data['TipoRegalo'] == "DINERO" and $data['OpcionDinero'] == "TRANSFERENCIA") {

                $validarBanco = v::stringType()->notEmpty()->length(1, 35)->validate(($data['Banco']));
                $validarCUIL = v::numeric()->notEmpty()->length(1, 11)->validate($data['CUIL']);
                $validarCBU = v::numeric()->notEmpty()->length(1, 22)->validate($data['CBU']);

                if (!$validarBanco or !$validarCUIL or !$validarCBU) {
                    return json_encode(['code' => new Exception(500)]);
                }

                if ($regaloEdit) {
                    $regaloEdit->TipoRegalo = $data['TipoRegalo'];
                    $regaloEdit->OpcionDinero = $data['OpcionDinero'];
                    $regaloEdit->Banco = $data['Banco'];
                    $regaloEdit->CUIL = $data['CUIL'];
                    $regaloEdit->CBU = $data['CBU'];
                    $regaloEdit->Adquirido = false;
                    $regaloEdit->Borrado = false;
                    $regaloEdit->Activo = true;
                    $regaloEdit->save();
                } else {
                    $newRegalo->Evento_id = new ObjectId($findEvento->_id);
                    $newRegalo->TipoRegalo = $data['TipoRegalo'];
                    $newRegalo->OpcionDinero = $data['OpcionDinero'];
                    $newRegalo->Banco = $data['Banco'];
                    $newRegalo->CUIL = $data['CUIL'];
                    $newRegalo->CBU = $data['CBU'];
                    $newRegalo->Adquirido = false;
                    $newRegalo->Borrado = false;
                    $newRegalo->Activo = true;
                    $newRegalo->save();
                }

                return json_encode(['code' => 200]);
            }

        } catch (\Exception $e) {
            // $e->getMessage()
            return json_encode(['code' => 500]);
        }
    }
    public function addObjeto(Request $request, $id)
    {

        $input = $request->all();

        $newRegalo = new Regalo();

        $findEvento = Evento::find($id);
        $idEvento = $findEvento->_id;
        $empresa = Evento::find($idEvento)->Empresa_id;
        $image = $input['PathImg'];
        $validarObjeto = v::stringType()->notEmpty()->validate($input['Objeto']);
        $validarTipoRegalo = v::stringType()->notEmpty()->validate($input['TipoRegalo']);

        if (!$validarObjeto) {
            return json_encode(['code' => 'Error en los campos']);
        }
        try {
            $pathSave = 'Regalos/' . $idEvento . '/';
            $fileDataImg = [
                'extension' => $image->getClientOriginalExtension(),
                'size' => humanFileSize($image->getSize()),
                'mime' => $image->getMimeType(),
            ];

            $randomName = rand(1, 1000000000);
            $nameImg = $randomName . '.' . $fileDataImg['extension'];
            Storage::disk('public_oneshow')->put($pathSave . $nameImg, File::get($image));

            $newRegalo->Evento_id = new ObjectId($idEvento);
            $newRegalo->TipoRegalo = $input['TipoRegalo'];
            $newRegalo->PathImg = url('/') . '/OneShow/' . $pathSave . $nameImg;
            $newRegalo->NameImg = $nameImg;
            $newRegalo->Objeto = $input['Objeto'];
            $newRegalo->SKU = isset($input['SKU']) ? $input['SKU'] : '';
            $newRegalo->TiendaSugerida = isset($input['TiendaSugerida']) ? $input['TiendaSugerida'] : '';
            $newRegalo->Link = isset($input['Link']) ? $input['Link'] : '';
            $newRegalo->Adquirido = false;
            $newRegalo->Borrado = false;
            $newRegalo->Activo = true;
            $newRegalo->save();
            return json_encode(['code' => 200]);
        } catch (\Exception $e) {
            // $e->getMessage()
            return json_encode(['code' => 500]);
        }
    }

    public function deleteRegalo($id)
    {

        $url = $_SERVER['DOCUMENT_ROOT'] . '/OneShow/Regalos';
        //valido que venga el id sino mando un error

        try {
            if ($id) {
                $registro = Regalo::find($id);
                if ($registro->delete()) {
                    $pathImg = $url . '/' . $registro->Evento_id . '/' . $registro->NameImg;
                    \unlink($pathImg);
                }
                return json_encode(['code' => 200]);
            }
        } catch (\Exception $e) {
            return json_encode(['code' => 500]);
        }
    }
}
