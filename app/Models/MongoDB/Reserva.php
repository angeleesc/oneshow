<?php

namespace App\Models\MongoDB;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
use Carbon\Carbon;

class Reserva extends Eloquent
{
    protected $connection = 'mongodb';
    protected $table = 'Reservas';

    const CREATED_AT = 'Creado';
    const UPDATED_AT = 'Actualizado';

    //scope para buscar por borrado
    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }
    

    //scope para buscar por activo
    public function scopeActivo($query, $flag) {
        return $query->where('activo', $flag);
    }

}
