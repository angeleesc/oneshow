<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MongoDB\AlbumModel as Album;

class AlbumController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
     return response()->json(['seccion' => 'index', 'descripcion' => 'aqui se muestra tosa las imagenes']);
    }

    public function pruebaMongoDB(Request $request){


            
            $album = new Album(); // instanciamos la base de datos

            $album->titulo = 'ejemplo2';
            $album->idusuario ='id de usuario2';
            $album->imagen = 'direcion de la imagen2';
            $album->email= 'ejemplo2@angel.com';

        // guradamos el registro             

            if ($album->save()) {
                return response()->json(['code' => 200]);
            }
            return response()->json(['code' => 500]);
        
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
       // return response()->json(['seccion' => 'store', 'descripcion' => 'aqui se guarda todas las imagenes','datos'=>$request['firstName'] ]);


       /*
       
          if ($request->hasFile('imagen')){

           $file = $request->file('imagen');
           $name = time().$file->getClientOriginalName();
           $file->move(public_path().'/album/',$name);
       }

       
       */

      return response()->json(['email ' => $request['email'],
                                'id de usuario' => $request['id']]);


    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
