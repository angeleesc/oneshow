<?php

namespace App\Models\MongoDB;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class EventoSeats extends Eloquent
{
    protected $connection = 'mongodb';
    protected $table = 'EventosSeats';

    const CREATED_AT = 'Creado';
    const UPDATED_AT = 'Actualizado';

   

    //scope para buscar por borrado
    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

    //scope para buscar por activo
    public function scopeActivo($query, $flag) {
        return $query->where('Activo', $flag);
    }

    //scope para buscar por App
    public function scopeApp($query, $flag) {
        return $query->where('App', $flag);
    }

}
