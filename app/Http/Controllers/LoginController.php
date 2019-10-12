<?php

namespace App\Http\Controllers;

use App\Models\MongoDB\Usuario;
use Illuminate\Http\Request;
use App\Http\Requests\ValidateLogin;
use Illuminate\Support\Facades\Auth;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Support\Str;
use Hash;
use MongoDB\BSON\ObjectId;

//controlador encargado del login

class LoginController extends Controller
{

    public function __construct(Guard $auth)
    {
        $this->auth = $auth;
    }

    //metodo que crea la vista
    public function index () {
        //devuelve la vista asociada
        return view('login');
    }

    //metodo para procesar el login por ajax
    public function login(ValidateLogin $request)
    {
        $input = $request->all();

        $credenciales = [
            'correo'   => strtoupper($input['correo']),
            'password' => $input['password']
        ];

        $user = Usuario::where('Correo', $credenciales['correo'])->first();

        if ($user) {
            if($user->Activo == true){

                if(Hash::check($credenciales['password'], $user->Password)){

                    $exito = Auth::guard('web')->login($user);
                    $user->api_token = Str::random(60);
                    $apitoken = $user->api_token;
                    if ($user->update()){
                        return response()->json([
                            'code' => 200, 
                            'msj' => 'exito' , 
                            'api_token' => $apitoken,
                            'usuario' => $user
                        ]);
                    } else {
                        return response()->json([
                            'code' => 404, 
                            'msj' => 'error no esperado' 
                        ]);
                    }                  
                }

                return response()->json([
                    'code' => 600, 
                    'msj' => 'Correo y/o Contraseña incorrectos' ]
                );
            }
            return response()->json([
                'code' => 600, 
                'msj' => 'Usuario inactivo' 
            ]);

        }
        return response()->json([
            'code' => 600, 
            'msj' => 'Usuario no registrado' 
        ]);
    }


    //metodo para cerrar la session
    public function logout (Request $request) {
        $token = $request->header('Authorization');
        $usuario = Usuario::where('api_token', $token)->first();

        
        if ($usuario) {  
          $usuario->api_token = "";
          $usuario->save();
          
          return response()->json(['code' => 200], 200);
        }

        return response()->json([
            'code' => 404
        ]);
    }

}
