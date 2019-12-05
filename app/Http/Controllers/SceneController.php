<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MongoDB\Scene;
use App\Models\MongoDB\Evento;
use Illuminate\Support\Facades\Validator;

class SceneController extends Controller
{
  public function create (Request $request, $eventId) {
    $event = Evento::findOrFail($eventId);

    Validator::make($request->all(), [
      'name' => 'required|string',
      'icon' => 'required|string',
      'iconColor' => 'required|string',
      'color' => 'required',
      'flash' => 'required',
      'audio' => 'required',
      'video' => 'required',
      'image' => 'required',
    ])->validate();

    $scene = new Scene();
    $scene->name = $request->name;
    $scene->icon = $request->icon;
    $scene->iconColor = $request->iconColor;
    $scene->color = $request->color;
    $scene->flash = $request->flash;
    $scene->audio = $request->audio;
    $scene->video = $request->video;
    $scene->image = $request->image;
    $scene->eventId = $eventId;

    if ($scene->save()) {
      return response()->json($scene);
    } else {
      return response(null, 500);
    }
  }

  public function get (Request $request, $eventId) {
    $event = Evento::findOrFail($eventId);

    $scenes = Scene::where('eventId', $eventId)->get();

    return response()->json($scenes);
  }

  public function delete (Request $request, $eventId, $sceneId) {
    
    $scene = Scene::findOrFail($sceneId);
    $scene->delete();

    if ($scene->trashed()) {
      return response()->json($scene);
    } else {
      return response(null, 500);
    }
  }
}
