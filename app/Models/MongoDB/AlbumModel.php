<?php

namespace App\Models\MongoDB;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class AlbumModel extends Eloquent
{
    protected $connection = 'mongodb';
    protected $table = 'Album';
    protected $fillable = ['titulo', 'idusuario', 'imagen', 'email'];
}
