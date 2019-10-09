<?php

namespace App\Http\Controllers;

use Hash, Auth, Mail;
use MongoDB\BSON\ObjectId;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\MongoDB\Usuario;
use App\Mail\MailRecoveryPassword;
use Illuminate\Support\Facades\Validator;
use App\Models\MongoDB\ResetClaveUsuarios;
use App\Http\Requests\ValidateResetPassword;
use App\Http\Requests\ValidateRecoveryPassword;


//controlador encargado del recuperar contraseña
class RecoveryPasswordController extends Controller
{
  /**
   * metodo para llamar la vista de recuperar contraseña
   */
  public function index(){
    //devuleve la vista
    return view('recovery-password');
  }

  /**
   * Método que genera el token para recuperar la contraseña
   */
  public function requestPasswordRecover (Request $request) {
    Validator::make($request->all(), [
      'email' => 'required|email'
    ])->validate();

    // verifico que ese correo exista en la coleccion de usuarios
    $user = Usuario::borrado(false)
      ->where('Correo', strtoupper($request->email))
      ->first();

    // si existe, ingreso, de lo contrario mando un mensaje diciendo que no existe el usuario
    if($user){
      // verifico que ese usuario este activo, sino, no realizo el proceso de recuperacion y le envio un mensaje al usuario
      if($user->Activo) {

        //elimino todos los token asociados al usuario
        ResetClaveUsuarios::where('Correo', $user->Correo)->delete();

        //genero el nuevo token
        $reset = new ResetClaveUsuarios;
        $reset->Usuario_id = new ObjectId($user->_id);
        $reset->Correo = strtoupper($request->email);
        $reset->Token = Str::random(60);
        $reset->save();

        $token = $reset->Token;
        // $reset = ResetClaveUsuarios::where('Correo', $correo)->where('Usuario_id', new ObjectId($user->_id))->first();

        // le envio un correo al usuario con las intrucciones para recuperar la contraseña
        Mail::to(strtolower($user->Correo))->send(new MailRecoveryPassword($token));

        return response()->json([
          'message' => 'Le ha sido enviado un correo con un enlace para restablecer su contraseña' 
        ]);
      }
      
      return response()->json([
        'message' => 'El usuario especificado se encuentra inactivo'
      ], 403);
    }
    
    return response()->json([
      'message' => 'El correo especificado no existe'
    ], 404);
  }

  public function checkTokenValidity (Request $request, $token) {
    $storedToken = ResetClaveUsuarios::where('Token', $token)->first();

    if ($storedToken) 
      return response()->json([
        'message' => 'Token validado correctamente'
      ], 200);
    
    return response()->json([
      'message' => 'El correo de recuperación de contraseña ya caducó'
    ], 404);
  }

  public function changePassword (Request $request, $token) {
    $data = $request->all();
    $data['token'] = $token;

    Validator::make($data, [
      'password' => 'required|string|min:6|confirmed',
      'token' => 'required|string|exists:ResetClavesUsuarios,Token'
    ])->validate();

    $storedToken = ResetClaveUsuarios::where('Token', $token)->first();
    $user = Usuario::where('Correo', strtoupper($storedToken->Correo))->first();

    $user->Password = Hash::make($request->password);
    $user->save();
    $storedToken->delete();

    return response('', 200);
  }

    //metodo para validar que el token del usuario es valido y no ha expirado
    public function formResetPassword($tok){

        $tokenValido = false;

        //caputro y verifico el token en la bd
        $token = ResetClaveUsuarios::where('Token', $tok)->first();
        //si el token existe y es valido, mando al usuario a cambiar su contraseña por la de su preferencia, en caso de que no le indico que el token es invalido o ha expirado
        if ($token){
            $tokenValido = true;
            return view('reset-password', ['token' => $token->Token, 'tokenValido' => $tokenValido]);
        }
        return view('reset-password', ['token' => $token->Token, 'tokenValido' => $tokenValido]);
    }

    //metodo para cambiar la contraseña una vez el token haya sido valido
    public function ajaxResetPassword(ValidateResetPassword $request){

        //capturo los datos
        $input    = $request->all();
        $correo   = strtoupper($input['correo']);
        $password = $input['password'];
        $token    = $input['token'];

        //ubico al usuario con el token
        $tokenData = ResetClaveUsuarios::where('Token', $token)->first();
        $user = Usuario::find((string)$tokenData->Usuario_id);

        //si el usuario fue encontrado, procedo a cambiar el password, sino le indico al usuario de que no fue asi
        if($user){

            //actualizo la contraseña
            $user->Password = Hash::make($password);

            if($user->save()){

                //elimino todas las entradas de token del usuario
                ResetClaveUsuarios::where('Correo', $user->Correo)->delete();

                return response()->json([
                    'code' => 200, 
                    'msj' => 'Contraseña cambiada exitosamente' 
                ]);

            }
            return response()->json([
                'code' => 600, 
                'msj' => 'Ocurrio un problema al cambiar la contraseña. Consulte al administrador' 
            ]);

        }
        return response()->json(['code' => 600, 'msj' => 'Usuario no existe' ]);
    }
}
