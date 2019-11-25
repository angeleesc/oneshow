<?php

namespace App\Models\MongoDB;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
use Jenssegers\Mongodb\Eloquent\SoftDeletes;

class Scene extends Eloquent
{
  use SoftDeletes;

  /**
   * Collection name for this model
   */
  protected $collection = 'Scene';
  
  /**
   * Connection name
   */
  protected $connection = 'mongodb';

  /**
   * Collection primary key name
   */
  protected $primaryKey = '_id';
  
  /**
   * Timestamp field customization
   */
  const CREATED_AT = 'createdAt';  
  const UPDATED_AT = 'updatedAt';

  
  protected $dates = ['deletedAt'];

  public function event () {
    return $this->belongsTo('App\Models\MongoDB\Evento', 'eventId', '_id');
  }
}
