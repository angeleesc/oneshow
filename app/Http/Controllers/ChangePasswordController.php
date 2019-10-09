<?php

namespace App\Http\Controllers;
use App\Models\MongoDB\Usuario;
use App\Http\Requests\ValidateChangePassword;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Hash, Auth;


//controlador encargado del cambio de clave del usuario interno
class ChangePasswordController extends Controller
{
    //metodo para llamar la vista de cambio de clave
    public function index(){
        $changePassword = Auth::user()->isChangePassword();
        //devuleve la vista
        return view('change-password', ['changepassword' => $changePassword]);
    }

    //metodo para procesar el cambio de contraseña
    public function changePassword (Request $request) {
      Validator::make($request->all(), [
        'previous_password' => 'required|string|min:6',
        'password' => 'required|string|min:6|confirmed'
      ])->validate();
      
      
      $user = Usuario::where('api_token', $request->header('Authorization'))->first();

      if (Hash::check($request->previous_password, $user->Password)) {
        
        $user->Password = Hash::make($request->password);
        $user->save();

        return response()->json([
          'message' => 'Contraseña actualizada correctamente',
        ], 200);
      }

      return response()->json([
        'message' => 'La contraseña actual no coincide'
      ], 400);
    }
}
