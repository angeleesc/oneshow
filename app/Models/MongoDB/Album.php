<?php

namespace App\Models\MongoDB;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Album extends Eloquent
{
    protected $connection = 'mongodb';
    protected $table = 'Album';

    protected $dates = ['Titulo', 'Usuario', 'IdUsuario','Imagen'];
    
}
