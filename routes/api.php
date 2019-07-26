<?php

use Illuminate\Http\Request;


Route::post('/login', 'LoginController@login');
/**
 * Rutas API orientadas al controlador de USUARIOS UsuarioController
 */
Route::group(['middleware'=>'api_token','prefix' => 'usuarios'], function() {
    Route::post('/add','UsuarioController@addUsuario');
    Route::post('/delete','UsuarioController@deleteUsuario');
    Route::post('/edit','UsuarioController@editUsuario');
    Route::get('/infoEdit/{id}','UsuarioController@getInfoEdit');
    
    Route::get('/','UsuarioController@getUsuarios');
    Route::get('/selects','UsuarioController@getSelectUsuario');
    Route::get('/{id}', 'UsuarioController@getUsuario');
    Route::get('/permisos/{id}', 'UsuarioController@getPermisosUsuario');
   
});

/**
 * Rutas API orientadas al controlador de EVENTOS EventoController
 */
Route::group(['middleware'=>'api_token','prefix' => 'eventos'], function() {
    Route::get('/usuario/{id}', 'EventoController@getEventosUsuario');
    Route::post('/envios', 'EventoController@getEnvios');
    Route::post('/remove-envios', 'EventoController@quitarEnvios');
    Route::post('/cola/add','EventoController@addCola');
});

/**
 * Rutas API orientadas al controlador de MULTIMEDIA MultimediaController
 */

Route::group(['middleware'=>'api_token','prefix' => 'multimedia'], function() {
    //rutas de multimedia
    Route::post('/action-tool', 'MultimediaController@actionTool');
    //Route::post('/ajax-get-multimedia', 'MultimediaController@ajaxGetMultimedia');
});

/**
 * Rutas API orientadas al controlador de EMPRESAS EmpresaController
 */
Route::group(['middleware'=>'api_token','prefix' => 'empresas'], function() {
    //rutas de empresas
    Route::get('/', 'EmpresaController@getEmpresas');
    Route::post('/add','EmpresaController@addEmpresa');
    Route::post('/tabla',"EmpresaController@getEmpresasTabla");
    Route::get('/paises',"EmpresaController@getPaises");
    Route::post('/delete','EmpresaController@deleteEmpresa');
    Route::post('/update','EmpresaController@updateEmpresa');
    Route::get('/eventos/{empresa}', 'EmpresaController@getEventosPorEmpresa');
    Route::get('/{id}','EmpresaController@getEmpresa');
    
});


/**
 * Rutas API orientadas al controlador de BIBLIOTECA BibliotecaController
 */
Route::group(['middleware'=>'api_token','prefix' => 'biblioteca'], function() {
    //rutas de empresas
    Route::post('/', 'BibliotecaController@getBibliotecasRol');
    Route::post('/evento/files', 'BibliotecaController@getFilesEvento');
    Route::post('/evento/files/delete', 'BibliotecaController@deleteFile');
    Route::get('/evento/files/data-add', 'BibliotecaController@getDataAdd');
    Route::post('/evento/add-file','BibliotecaController@addFile');
});

/**
 * Rutas API orientadas al controlador de AGENDENDA AgendaController
 */
Route::group(['middleware'=>'api_token','prefix' => 'agendas'], function() {
    // Endpoints de agendas
    Route::post('/add', 'AgendaController@ajaxAdd');
    Route::post('/datatables', 'AgendaController@ajaxDatatables');
    Route::get('/{id}', 'AgendaController@viewShow');
    Route::post('/update', 'AgendaController@ajaxUpdate');
    Route::post('/delete', 'AgendaController@ajaxDelete');
    Route::post('/events', 'AgendaController@getEvents');
    Route::post('/datatable-get-agendas/{id}/{fecha}', 'AgendaController@datatable_get_agendas');
});

/**
 * Rutas API orientadas al controlador de EVENTOS eventoController
 */

Route::group(['middleware'=>'api_token','prefix' => 'eventos'], function() {
    //rutas de eventos
    Route::get('/menus','EventoController@getMenuAppInvitado');
    Route::get('/one/{id}','EventoController@getEventoById');
    Route::post('/add','EventoController@addEvento');
    Route::post('/delete','EventoController@deleteEvento');
    Route::post('/edit','EventoController@editEvento');
    Route::get('/{id}', 'EventoController@getEvento');
    Route::post('/empresa', 'EventoController@getEventosEmpresa');
    
});

Route::group(['middleware'=>'api_token','prefix' => 'invitaciones'], function() {
    Route::post('/get-info', 'InvitacionController@getInfo');
    Route::post('/files', 'InvitacionController@getFiles');
    Route::post('/file/delete', 'InvitacionController@deleteFile');
    Route::post('/file/add', 'InvitacionController@addFile');
});
/**
 * Rutas API orientadas al controlador de Menus(menugrastronomico) 
 * (queda por restructurar)
 */
Route::group(['middleware'=>'api_token','prefix' => 'menu'], function() {
    // Endpoints para el Menu Gastronimico Etapas
    Route::group(['prefix' => 'gastronomico'], function() {
        Route::get('/index', 'MenugEtapasController@index');
        Route::get('/estados', 'MenugEtapasController@getEstados');
        Route::get('/view-show/{id}', 'MenugEtapasController@viewShow');
        Route::get('/view-edit/{id}', 'MenugEtapasController@viewEdit');
        Route::get('/datatables', 'MenugEtapasController@datatables');
        Route::post('/agregar', 'MenugEtapasController@agregar');
        Route::post('/actualizar', 'MenugEtapasController@actualizar');
        Route::post('/eliminar/{id}', 'MenugEtapasController@eliminar');
        Route::post('/etapas', 'MenugEtapasController@ajaxDatatables');
        Route::post('/etapas-add', 'MenugEtapasController@ajaxAdd');
        Route::post('/menu-etapas-update', 'MenugEtapasController@ajaxUpdate');
        Route::post('/menu-etapas-delete', 'MenugEtapasController@ajaxDelete');        
    });
    // Endpoints para el Menu Gastronimico Platos
    Route::group(['prefix' => 'platos'], function() {
        Route::get('/', 'MenugPlatosController@getDatatables');
        Route::get('/view-add', 'MenugPlatosController@viewAdd');
        Route::get('/view-show/{id}', 'MenugPlatosController@viewShow');
        Route::get('/view-edit/{id}', 'MenugPlatosController@viewEdit');
        Route::post('/agregar', 'MenugPlatosController@agregar');
        Route::post('/actualizar', 'MenugPlatosController@actualizar');
        Route::post('/eliminar/{id}', 'MenugPlatosController@eliminar');        
    });
});