<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class AlbumModel extends Eloquent
{
    protected $connection = 'mongodb';
    protected $table = 'Album';
    protected $fillable = ['Titulo', 'autor', 'imagen'];



}
