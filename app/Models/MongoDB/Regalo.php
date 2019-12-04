<?php

namespace App\Models\MongoDB;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Regalo extends Eloquent
{
    protected $connection = 'mongodb';
    protected $table = 'Regalos';

    const CREATED_AT = 'Creado';
    const UPDATED_AT = 'Actualizado';


}
