<?php

namespace App\Models\MongoDB;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class MenuGPlatos extends Eloquent
{
    protected $connection = 'mongodb';
    protected $table = 'MenuGPlatos';

    const CREATED_AT = 'Creado';
    const UPDATED_AT = 'Actualizado';

}
