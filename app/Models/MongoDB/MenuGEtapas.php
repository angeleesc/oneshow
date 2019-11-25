<?php

namespace App\Models\MongoDB;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class MenuGEtapas extends Eloquent
{
    protected $connection = 'mongodb';
    protected $table = 'MenuGEtapas';

    const CREATED_AT = 'Creado';
    const UPDATED_AT = 'Actualizado';

}
