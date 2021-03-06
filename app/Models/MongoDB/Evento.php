<?php

namespace App\Models\MongoDB;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Evento extends Eloquent
{
    protected $connection = 'mongodb';
    protected $table = 'Eventos';

    const CREATED_AT = 'Creado';
    const UPDATED_AT = 'Actualizado';

    protected $fillable = [
        'Nombre', 
        'Cuit_rut', 
        'Direccion', 
        'Telefono', 
        'Pais_id', 
        'Provincia_id', 
        'Departamento_id', 
        'Localidad_id', 
        'Correo', 
        'CodigoComercioProductivo', 
        'CodigoComercioIntegracion', 
        'PublicKey', 
        'PrivateKey', 
        'Activo', 
        'Logo', 
        'NumeroVotos', 
        'TotalScore', 
        'Rating', 
        'RazonSocial', 
        'ContactoResponsable', 
        'ContactoFinanza'
    ];

    public function scenes () {
      return $this->hasMany('App\Models\MongoDB\Scene', 'eventId', '_id');
    }

    //scope para buscar por borrado
    public function scopeBorrado($query, $flag) {
        return $query->where('Borrado', $flag);
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
