<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MongoDB\Evento;
use Illuminate\Support\Facades\Validator;

class SocialWallController extends Controller
{
  public function getEventHashTags (Request $request, $eventId) {
    Validator::make(['eventId' => $eventId], [
      'eventId' => 'required|exists:Eventos,_id'
    ])->validate();

    $event = Evento::find($eventId);
    $twitter = $event->hashtagsTwitter ? $event->hashtagsTwitter : [];
    $instagram = $event->hashtagsInstagram ? $event->hashtagsInstagram : [];

    return response()->json([
      'hashtagsTwitter' => $twitter,
      'hashtagsInstagram' => $instagram,
    ]);
  }

  public function updateEventHashtags (Request $request, $eventId) {
    $data = $request->all();
    $data['eventId'] = $eventId;

    Validator::make($data, [
      'eventId' => 'required|exists:Eventos,_id',
      'twitter' => 'array',
      'instagram' => 'array',
    ])->validate();

    $event = Evento::find($eventId);
    $event->hashtagsTwitter = $request->twitter;
    $event->hashtagsInstagram = $request->instagram;

    $event->save();

    return response('', 200);
  }
}
