<?php

namespace App\Http\Controllers;

use App\Models\MongoDB\Etapa;
use App\Models\MongoDB\Evento;
use Exception;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;
use Respect\Validation\Validator as v;

//controlador encargado de los invitados

class EtapaController extends Controller
{
    public function addEtapa(Request $request, $idEvento)
    {
        $data = json_decode($request->getContent(), true);
        $findEvento = Evento::find($idEvento);
        $errorEvento = new Exception("El evento no existe");
        $errorEtapa = new Exception("La etapa no existe");
        $errorValidarCampos = new Exception("Campos inválidos");
        if (!$findEvento) {
            return json_encode(['error' => $errorEvento->getMessage()]);
        }

        try {

            $etapaValidator = v::key('nombre', v::stringType()->notEmpty()->length(1, 25))
                ->key('horario', v::stringType()->notEmpty())
                ->key('fecha', v::stringType()->notEmpty()
                );

            if (!$etapaValidator) { // si los campos son inválidos.

                return json_encode(['error' => $errorValidarCampos->getMessage()]);
            }
            $date = date_create($data['fecha']);
            $etapa = new Etapa();
            $etapa->Evento_id = new ObjectId($findEvento->_id);
            $etapa->Nombre = $data['nombre'];
            $etapa->Horario = $data['horario'];
            $etapa->Fecha = date_format($date, 'Y-m-d');
            $etapa->Borrado = false;
            $etapa->Activo = true;
            $etapa->save();
            return json_encode(['etapa' => $etapa]);

        } catch (\Exception $e) {
            // $e->getMessage()
            return json_encode(['error' => 500]);
        }

    }
    public function editEtapa(Request $request, $idEtapa)
    {

        $data = json_decode($request->getContent(), true);

        $findEtapa = Etapa::find($idEtapa);
        $errorEtapa = new Exception("La etapa no existe");
        $errorValidarCampos = new Exception("Campos inválidos");

        if (!$findEtapa) {
            return json_encode(['error' => $errorEtapa->getMessage()]);
        }
        try {

            $etapaValidator = v::key('nombre', v::stringType()->notEmpty()->length(1, 25))
                ->key('horario', v::stringType()->notEmpty())
                ->key('fecha', v::stringType()->notEmpty()
                );

            if (!$etapaValidator) { // si los campos son inválidos.

                return json_encode(['error' => $errorValidarCampos->getMessage()]);
            }

            $date = date_create($data['fecha']);
            $findEtapa->Nombre = $data['nombre'];
            $findEtapa->Horario = $data['horario'];
            $findEtapa->Fecha = date_format($date, 'Y-m-d');
            $findEtapa->Borrado = false;
            $findEtapa->Activo = true;
            $findEtapa->save();
            return json_encode(['etapa' => $findEtapa]);

        } catch (\Exception $e) {
            // $e->getMessage()
            return json_encode(['error' => 500]);
        }

    }

    public function getEtapasEvento($id)
    {
        $findEvento = Evento::find($id);
        $errorEvento = new Exception("El evento no existe");
        if (!$findEvento) {
            return json_encode(['error' => $errorEvento->getMessage()]);
        }
        $etapas = [];
        try {

            $etapa = Etapa::where([
                ['Evento_id', '=', new ObjectId($findEvento->_id)],
                ['Borrado', '=', false],
                ['Activo', '=', true]])->get();
            foreach ($etapa as $e) {
                $etapas[] = [

                    '_id' => $e->_id,
                    'Evento_id' => $e->Evento_id,
                    'Nombre' => $e->Nombre,
                    'Horario' => $e->Horario,
                    'Fecha' => $e->Fecha,
                ];
            }

            return response()->json(['etapas' => $etapas]);
        } catch (\Exception $e) {
            // $e->getMessage()
            return response()->json(['code' => 500]);
        }

    }

    public function getEtapa($id)
    {
        $registro = Etapa::find($id);
        if ($registro) {
            return json_encode(['code' => 200, 'etapa' => $registro]);
        } else {
            return response()->json(['code' => 500]);
        }

    }

    public function getetapas()
    {
        $Etapas = Etapa::borrado(false)->get();
        //devuelvo un json con la data
        return response()->json([
            'code' => 200,
            'etapas' => $etapas,
        ]);
    }

    public function setEtapa(Request $request)
    {
        //capturo el valor del id
        $input = $request->all();
        $id = $input['id'];
        $registro = Etapa::find($id);
        if ($registro) {
            $registro->Nombre = $input['nombre'];
            if ($registro->save()) {
                return response()->json(['code' => 200, 'etapa' => $registro]);
            } else {
                return response()->json(['code' => 500]);
            }
        } else {
            return response()->json(['code' => 600]);
        }
    }

    public function deleteEtapa($id)
    {
        // //capturo el valor del id
        // $input = $request->all();
        // $id = $input['id'];

        //valido que venga el id sino mando un error
        if ($id) {

            //ubico el id en la bd
            $registro = Etapa::find($id);
            $registro->Borrado = true;

            //valido que de verdad sea borrado en caso de que no arrojo un error
            if ($registro->save()) {

                return json_encode(['code' => 200]);
            } else {
                return json_encode(['code' => 500]);
            }

        } else {

            return json_encode(['code' => 600]);
        }

    }

}
