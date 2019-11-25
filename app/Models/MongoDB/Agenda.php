<?php

namespace App\Models\MongoDB;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Agenda extends Eloquent
{
    protected $connection = 'mongodb';
    protected $table = 'Agendas';

    const CREATED_AT = 'Creado';
    const UPDATED_AT = 'Actualizado';

    protected $fillable = ['Titulo', 'Descripcion', 'Hora'];

    //scope para buscar por borrado
    public function scopeBorrado($query, $flag) {
        return $query->where('Borrado', $flag);
    }

    //scope para buscar por activo
    public function scopeActivo($query, $flag) {
        return $query->where('Activo', $flag);
    }

    //scope para buscar por Reporte Ventas Diario
    public function scopeReporteVentasDiarias($query, $flag) {
        return $query->where('ReporteVentasDiarias', $flag);
    }

}
