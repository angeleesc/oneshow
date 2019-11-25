<?php

namespace App\Http\Middleware;

use \Illuminate\Http\Request as Request;
use Closure;
use App\Models\MongoDB\Usuario;

class ApiMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $apiToken= $request->header('Authorization'); 
        if($apiToken){
            $usuario = Usuario::borrado(false)->activo(true)->where('api_token', $apiToken)->get();
           
            if(sizeof($usuario) > 0){
                return $next($request);
            }else{
                return response(['no esta autorizado'], 403);
            }
        }
        return response(['Debe enviar sus credenciales'], 503);
    }
}
