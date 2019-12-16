<?php

namespace App\Traits;

use App\Models\MongoDB\Evento;
use MongoDB\BSON\ObjectId;

trait PermisosTraits
{
    public static function permisoEvento(string $rol, string $id, $empresa)
    {
        //acorde al rol muestro los eventos
        if ($rol == 'ADMINISTRADOR') {
            $eve = Evento::borrado(false);
            //si contiene la empresa se la agrego al query de busqueda
            if ($empresa) {
                $eve->where(function ($q) use ($empresa) {
                    $q->where('Empresa_id', new ObjectId($empresa));
                });
            }
        } else if ($rol == 'EMPRESA') {
            $eve = Evento::borrado(false)->where('Empresa_id', new ObjectId($id));

        } else if ($rol == 'EVENTO') {
            $eve = Evento::borrado(false)->where('_id', $id);
        }
        $eventos = [];
        //extraigo el query con o sin los filtros
        $ev = $eve->get();

        return $ev;
    }
}
