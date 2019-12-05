<?php

namespace App\Models\MongoDB;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Plantilla extends Eloquent
{
    protected $connection = 'mongodb';
    protected $table = 'Plantillas';

    //scope para buscar por id
    /*public function scopeBorrado($query, $flag) {
        return $query->where('Borrado', $flag);
    }*/

}
