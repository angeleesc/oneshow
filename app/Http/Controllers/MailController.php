<?php

namespace App\Http\Controllers;

use App\Mail\ConfirmacionDatos;
use App\Mail\CorreoDeInvitacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Models\MongoDB\Evento;
use App\Models\MongoDB\Invitado;
use App\Models\MongoDB\EventoInvitado;

class MailController extends Controller
{
    public function sendMailInvitados(Request $request){
        $input = $request->all();
        //$link = "http://localhost:8000/mail/".$input['link'];
        $link = "https://consola.oneshow.com.ar/mail/".$input['link'];
        $eventoInvitado = EventoInvitado::where('LinkDatos',$input['link'])->get();
        if($eventoInvitado){
            $eventoInvitado = $eventoInvitado[0];
            $data = [
                'nombre' => Invitado::find($eventoInvitado->Invitado_id)->Nombre,
                'nombre_evento' => Evento::find($eventoInvitado->Evento_id)->Nombre,
                'cantidad_mayores' => $eventoInvitado->CantidadInvitadosMayores,
                'cantidad_menores' => $eventoInvitado->CantidadInvitadosMenores,
                'link' => $link
            ];
            $eventoInvitado->Enviado = true;
            $eventoInvitado->save();
            Mail::to(Invitado::find($eventoInvitado->Invitado_id)->Correo)->send(new CorreoDeInvitacion($data));
            return json_encode(['code' => 200,'mensaje'=>"Invitacion enviada"]);
        }else{
            return json_encode(['code' => 500,'mensaje'=>"Error al enviar Correo"]);
        }
        
    }

    public function datosListos(Request $request){
        $input = $request->all();
        $id = EventoInvitado::find($input['id_evento_invitado'])->Evento_id;
        $input['nombre_evento'] = Evento::find($id)->Nombre;
        Mail::to($input['correo'])->send(new ConfirmacionDatos($input));
        return json_encode(['code' => 200,'mensaje'=>"Invitacion enviada"]);
    }
}
