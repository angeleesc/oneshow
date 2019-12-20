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
            // $e->getMessage()
            return json_encode(['code' => 500]);
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
            return json_encode(['code' => "Evento no existe"]);
        }
        try {
            if ($data['TipoRegalo'] == "DINERO" and $data['OpcionDinero'] == "EFECTIVO") {

                if ($regaloEdit) {
                    if (empty($regaloEdit->PathImg)) {

                        $regaloEdit->TipoRegalo = $data['TipoRegalo'];
                        $regaloEdit->OpcionDinero = $data['OpcionDinero'];
                        $regaloEdit->Banco = '';
                        $regaloEdit->CUIL = '';
                        $regaloEdit->CBU = '';
                        $regaloEdit->Adquirido = false;
                        $regaloEdit->Borrado = false;
                        $regaloEdit->Activo = true;
                        $regaloEdit->save();
                    } else { // si el regalo viene de ser objeto a opcion de Dinero
                        if ($regaloEdit->PathImg != "") {
                            Storage::disk('public')->delete([
                                $regaloEdit->PathImg,
                                'torrents/' . $id . '.torrent',
                            ]);
                        }

                        $regaloEdit->TipoRegalo = $data['TipoRegalo'];
                        $regaloEdit->OpcionDinero = $data['OpcionDinero'];
                        $regaloEdit->Banco = '';
                        $regaloEdit->CUIL = '';
                        $regaloEdit->CBU = '';
                        $regaloEdit->PathImg = "";
                        $regaloEdit->NameImg = "";
                        $regaloEdit->Objeto = "";
                        $regaloEdit->SKU = "";
                        $regaloEdit->TiendaSugerida = "";
                        $regaloEdit->Link = "";
                        $regaloEdit->Adquirido = false;
                        $regaloEdit->Borrado = false;
                        $regaloEdit->Activo = true;
                        $regaloEdit->save();
                    }
                    return json_encode(['regalo' => $regaloEdit]);

                } else {

                    $newRegalo->Evento_id = new ObjectId($findEvento->_id);
                    $newRegalo->TipoRegalo = $data['TipoRegalo'];
                    $newRegalo->OpcionDinero = $data['OpcionDinero'];
                    $newRegalo->Adquirido = false;
                    $newRegalo->Borrado = false;
                    $newRegalo->Activo = true;
                    $newRegalo->save();
                }
                return json_encode(['regalo' => $newRegalo]);
            } elseif ($data['TipoRegalo'] == "DINERO" and $data['OpcionDinero'] == "TRANSFERENCIA") {

                $validarBanco = v::stringType()->notEmpty()->length(1, 35)->validate(($data['Banco']));
                $validarCUIL = v::numeric()->notEmpty()->length(1, 11)->validate($data['CUIL']);
                $validarCBU = v::numeric()->notEmpty()->length(1, 22)->validate($data['CBU']);

                if (!$validarBanco or !$validarCUIL or !$validarCBU) {
                    return json_encode(['code' => 500]);
                }

                if ($regaloEdit) {
                    if (!isset($regaloEdit->PathImg)) {
                        $regaloEdit->TipoRegalo = $data['TipoRegalo'];
                        $regaloEdit->OpcionDinero = $data['OpcionDinero'];
                        $regaloEdit->Banco = $data['Banco'];
                        $regaloEdit->CUIL = $data['CUIL'];
                        $regaloEdit->CBU = $data['CBU'];
                        $regaloEdit->Adquirido = false;
                        $regaloEdit->Borrado = false;
                        $regaloEdit->Activo = true;
                        $regaloEdit->save();
                    } else { // si el regalo viene de ser objeto a opcion de Dinero
                        if ($regaloEdit->PathImg != "") {
                            Storage::disk('public')->delete([
                                $regaloEdit->PathImg,
                                'torrents/' . $id . '.torrent',
                            ]);
                        }
                        $regaloEdit->TipoRegalo = $data['TipoRegalo'];
                        $regaloEdit->OpcionDinero = $data['OpcionDinero'];
                        $regaloEdit->Banco = $data['Banco'];
                        $regaloEdit->CUIL = $data['CUIL'];
                        $regaloEdit->CBU = $data['CBU'];
                        $regaloEdit->PathImg = "";
                        $regaloEdit->NameImg = "";
                        $regaloEdit->Objeto = "";
                        $regaloEdit->SKU = "";
                        $regaloEdit->TiendaSugerida = "";
                        $regaloEdit->Link = "";
                        $regaloEdit->Adquirido = false;
                        $regaloEdit->Borrado = false;
                        $regaloEdit->Activo = true;
                        $regaloEdit->save();
                    }
                    return json_encode(['regalo' => $regaloEdit]);
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
                    return json_encode(['regalo' => $newRegalo]);
                }
            }

        } catch (\Exception $e) {
            // $e->getMessage()
            return json_encode(['code' => 500]);
        }
    }
    public function addObjeto(Request $request, $id)
    {

        try {
            $input = $request->all();

            $newRegalo = new Regalo();

            $findEvento = Evento::find($id);
            if (!$findEvento) {
                return json_encode(['code' => "Evento no existe"]);
            }
            $idEvento = $findEvento->_id;
            $empresa = Evento::find($idEvento)->Empresa_id;
            $image = $input['PathImg'];
            $validarObjeto = v::stringType()->notEmpty()->validate($input['Objeto']);
            $validarTipoRegalo = v::stringType()->notEmpty()->validate($input['TipoRegalo']);
            if (!$validarObjeto) {
                return json_encode(['code' => 'Error en los campos']);
            }
            $pathSave = $empresa . '/Regalos/' . $idEvento;
            $fileDataImg = [
                'extension' => $image->getClientOriginalExtension(),
                'size' => humanFileSize($image->getSize()),
                'mime' => $image->getMimeType(),
            ];

            $randomName = rand(1, 1000000000);
            $nameImg = $randomName . '.' . $fileDataImg['extension'];
            // Storage::disk('public_oneshow')->put($pathSave . $nameImg, File::get($image));
            $path = $request->file('PathImg')->storeAs($pathSave, $nameImg, 'public');

            $newRegalo->Evento_id = new ObjectId($idEvento);
            $newRegalo->TipoRegalo = $input['TipoRegalo'];
            $newRegalo->PathImg = $path;
            $newRegalo->NameImg = $nameImg;
            $newRegalo->Objeto = $input['Objeto'];
            $newRegalo->SKU = isset($input['SKU']) ? $input['SKU'] : '';
            $newRegalo->TiendaSugerida = isset($input['TiendaSugerida']) ? $input['TiendaSugerida'] : '';
            $newRegalo->Link = isset($input['Link']) ? $input['Link'] : '';
            $newRegalo->Adquirido = false;
            $newRegalo->Borrado = false;
            $newRegalo->Activo = true;
            $newRegalo->save();

            $source = storage_path('app/public/' . $newRegalo->PathImg);
            $destination = base_path(env('ONESHOW_FTP_FAKE_FOLDER')) . '/' . $newRegalo->_id . '.' . $fileDataImg['extension'];
            // $success = copy($source, $destination);

            return json_encode(['regalo' => $newRegalo]);
        } catch (\Exception $e) {
            // $e->getMessage()
            return json_encode(['code' => 500]);
        }
    }

    public function editObjeto(Request $request, $idEvento, $idRegalo)
    {

        try {
            $input = $request->all();
            $findRegalo = Regalo::find($idRegalo);
            $empresa = Evento::find($idEvento)->Empresa_id;
            $image = $input['PathImg'];
            if (!isset($findRegalo->PathImg)) {
                $pathSave = $empresa . '/Regalos/' . $idEvento;
                $fileDataImg = [
                    'extension' => $image->getClientOriginalExtension(),
                    'size' => humanFileSize($image->getSize()),
                    'mime' => $image->getMimeType(),
                ];

                $randomName = rand(1, 1000000000);
                $nameImg = $randomName . '.' . $fileDataImg['extension'];
                // Storage::disk('public_oneshow')->put($pathSave . $nameImg, File::get($image));
                $path = $request->file('PathImg')->storeAs($pathSave, $nameImg, 'public');

                $findRegalo->PathImg = $path;
                $findRegalo->NameImg = $nameImg;
                $findRegalo->TipoRegalo = $input['TipoRegalo'];
                $findRegalo->Objeto = $input['Objeto'];
                $findRegalo->SKU = isset($input['SKU']) ? $input['SKU'] : '';
                $findRegalo->TiendaSugerida = isset($input['TiendaSugerida']) ? $input['TiendaSugerida'] : '';
                $findRegalo->Link = isset($input['Link']) ? $input['Link'] : '';
                $findRegalo->Adquirido = false;
                $findRegalo->Borrado = false;
                $findRegalo->Activo = true;
                $findRegalo->OpcionDinero = "";
                $findRegalo->Banco = "";
                $findRegalo->CUIL = "";
                $findRegalo->CBU = "";
                $findRegalo->save();
                $source = storage_path('app/public/' . $newRegalo->PathImg);
                $destination = base_path(env('ONESHOW_FTP_FAKE_FOLDER')) . '/' . $newRegalo->_id . '.' . $fileDataImg['extension'];
                // $success = copy($source, $destination);

                return json_encode(['regalo' => $findRegalo]);

            } else {
                if ($findRegalo->PathImg != $input['PathImg']) {
                    if ($findRegalo->PathImg != "") {

                        Storage::disk('public')->delete([
                            $findRegalo->PathImg,
                            'torrents/' . $idEvento . '.torrent',
                        ]);
                    }

                    $pathSave = $empresa . '/Regalos/' . $idEvento;
                    $fileDataImg = [
                        'extension' => $image->getClientOriginalExtension(),
                        'size' => humanFileSize($image->getSize()),
                        'mime' => $image->getMimeType(),
                    ];

                    $randomName = rand(1, 1000000000);
                    $nameImg = $randomName . '.' . $fileDataImg['extension'];
                    // Storage::disk('public_oneshow')->put($pathSave . $nameImg, File::get($image));
                    $path = $request->file('PathImg')->storeAs($pathSave, $nameImg, 'public');

                    $findRegalo->PathImg = $path;
                    $findRegalo->NameImg = $nameImg;

                    $source = storage_path('app/public/' . $findRegalo->PathImg);
                    $destination = base_path(env('ONESHOW_FTP_FAKE_FOLDER')) . '/' . $findRegalo->_id . '.' . $fileDataImg['extension'];
                    // $success = copy($source, $destination);

                }
                $findRegalo->TipoRegalo = $input['TipoRegalo'];
                $findRegalo->Objeto = $input['Objeto'];
                $findRegalo->SKU = isset($input['SKU']) ? $input['SKU'] : '';
                $findRegalo->TiendaSugerida = isset($input['TiendaSugerida']) ? $input['TiendaSugerida'] : '';
                $findRegalo->Link = isset($input['Link']) ? $input['Link'] : '';
                $findRegalo->OpcionDinero = "";
                $findRegalo->Banco = "";
                $findRegalo->CUIL = "";
                $findRegalo->CBU = "";
                $findRegalo->Adquirido = false;
                $findRegalo->Borrado = false;
                $findRegalo->Activo = true;
                $findRegalo->save();

                return json_encode(['regalo' => $findRegalo]);
            }

        } catch (\Exception $e) {
            return json_encode(['error' => 500]);
        }

    }

    public function deleteRegalo($id)
    {

        // $url = $_SERVER['DOCUMENT_ROOT'] . '/OneShow/Regalos';
        //valido que venga el id sino mando un error

        try {
            if ($id) {
                $registro = Regalo::find($id);
                if ($registro->delete()) {
                    Storage::disk('public')->delete([
                        $registro->PathImg,
                        'torrents/' . $id . '.torrent',
                    ]);
                }
                return json_encode(['code' => 200]);
            }
        } catch (\Exception $e) {
            return json_encode(['code' => 500]);
        }
    }
}
