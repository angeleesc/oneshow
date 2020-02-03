<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class Albumcontroller extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()

    {



        return response()->json([
            'lugar'=>'index',
            'peticion'=>'get',
            'decripcion'=>'aqui se muestra todas las imagenes'
        ]);
    }


    public function indexSeguro(Request $request)
    {

        $datos= $request -> all();
     
        



        
        return response()->json([
            'lugar'=>'indexSeguro',
            'peticion'=>'get',
            'decripcion'=>'aqui se muestra todas las imagenes',
            'dato'=>$request
        
        ]);
    }

    public function indexSeguro2(Request $request)
    {

        $datos= $request -> all();
     
        



        
        return response()->json([
            'lugar'=>'indexSeguro',
            'peticion'=>'get',
            'decripcion'=>'aqui se muestra todas las imagenes',
            'dato'=>$request
        
        ]);
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
        return response()->json([
            'code' => 200,
            'empresas' => 'la maria',
            'datoses' => $request['nombre']
        ]);
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
