<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/verErrores', function () {
    return view('ver_errores');
});

Route::view('/{path?}', 'index');
Route::view('/mail/{id}', 'index');
Route::view('/event/{id}', 'index');
Route::fallback('IndexController@index')->name('index');

/*
Route::middleware(['auth', 'prevent-back-history'])->group(function(){

    //ruta de cierre de session
    Route::get('/logout', 'LoginController@logout')->name('logout');

    //ruta de cambio de contraseña
    Route::get('/change-password', 'ChangePasswordController@index')->name('change-password');
    Route::post('/ajax-change-password', 'ChangePasswordController@ajaxChangePassword')->name('ajax-change-password');

    Route::middleware(['check-change-password'])->group(function(){

        Route::get('/welcome', 'IndexController@welcome')->name('welcome');

        //ruta de empresas
        Route::get('/empresa', 'EmpresaController@index')->name('configuracion.empresa');
        Route::post('/ajax-empresa', 'EmpresaController@ajaxDatatables');
        Route::get('/empresa-add', 'EmpresaController@viewAdd')->name('empresa-add');
        Route::post('/ajax-empresa-add', 'EmpresaController@ajaxAdd');
        Route::get('/empresa-show/{id}/', 'EmpresaController@viewShow');
        Route::get('/empresa-edit/{id}/', 'EmpresaController@viewEdit');
        Route::post('/ajax-empresa-update', 'EmpresaController@ajaxUpdate');
        Route::post('/ajax-empresa-delete', 'EmpresaController@ajaxDelete');

        //ruta de eventos
        Route::get('/evento/{id}/', 'EventoController@index')->name('configuracion.evento');
        Route::post('/ajax-evento', 'EventoController@ajaxDatatables');
        Route::get('/evento-add/{id}/', 'EventoController@viewAdd')->name('evento-add');
        Route::get('/evento-show/{id}/', 'EventoController@viewShow');
        Route::get('/evento-edit/{id}/', 'EventoController@viewEdit');
        Route::post('/ajax-evento-add', 'EventoController@ajaxAdd');
        Route::post('/ajax-evento-update', 'EventoController@ajaxUpdate');
        Route::post('/ajax-evento-delete', 'EventoController@ajaxDelete');
        Route::post('/ajax-evento-active', 'EventoController@ajaxChangeActive');

        //ruta de usuarios
        Route::get('/usuario', 'UsuarioController@index')->name('configuracion.usuario');
        Route::post('/ajax-usuario', 'UsuarioController@ajaxDatatables');
        Route::get('/usuario-add', 'UsuarioController@viewAdd')->name('usuario-add');
        Route::post('/ajax-usuario-add', 'UsuarioController@ajaxAdd');
        Route::get('/usuario-show/{id}/', 'UsuarioController@viewShow');
        Route::get('/usuario-edit/{id}/', 'UsuarioController@viewEdit');
        Route::post('/ajax-usuario-update', 'UsuarioController@ajaxUpdate');
        Route::post('/ajax-usuario-delete', 'UsuarioController@ajaxDelete');

        //ruta de clientes
        Route::get('/cliente', 'ClienteController@index')->name('configuracion.cliente');
        Route::post('/ajax-cliente', 'ClienteController@ajaxDatatables');
        Route::get('/cliente-show/{id}/', 'ClienteController@viewShow');
        Route::get('/cliente-edit/{id}/', 'ClienteController@viewEdit');
        Route::post('/ajax-cliente-update', 'ClienteController@ajaxUpdate');
        Route::post('/ajax-cliente-active', 'ClienteController@ajaxActive');

        //ruta master
        Route::get('/ajax/equipos/{pais}', 'MasterController@ajaxEquiposByPais');
        Route::get('/ajax/eventos/{empresa}', 'MasterController@ajaxEventosByEmpresa');

        //ruta monitor
        Route::get('/monitor', 'MonitorController@index')->name('configuracion.monitor');
        Route::get('/ajax-monitor', 'MonitorController@ajaxMonitor');
        Route::post('/ajax-monitor-action', 'MonitorController@ajaxMonitorAction');

        //rutas de biblioteca
        Route::get('/biblioteca', 'BibliotecaController@index')->name('configuracion.biblioteca');
        Route::post('/ajax-biblioteca', 'BibliotecaController@ajaxDatatables');
        Route::post('/ajax-biblioteca-files', 'BibliotecaController@ajaxDatatablesFiles');
        Route::get('/biblioteca-show/{id}/', 'BibliotecaController@viewShow')->name('biblioteca-show-files');
        Route::get('/biblioteca-add/{id}/', 'BibliotecaController@viewAdd')->name('biblioteca-add');
        Route::post('/ajax-biblioteca-add-files', 'BibliotecaController@ajaxAdd');
        Route::post('/ajax-biblioteca-delete-files', 'BibliotecaController@ajaxDelete');


        //rutas de multimedia
        Route::get('/multimedia', 'MultimediaController@index')->name('multimedia');
        Route::post('/ajax-action-tool', 'MultimediaController@ajaxActionTool');
        Route::post('/ajax-get-multimedia', 'MultimediaController@ajaxGetMultimedia');

        //rutas de invitacion
        Route::get('/invitacion', 'InvitacionController@index')->name('invitados.invitacion');
        Route::post('/ajax-invitacion', 'InvitacionController@ajaxDatatables');
        Route::get('/invitacion-show/{id}/', 'InvitacionController@viewShow')->name('invitacion-show');
        Route::post('/ajax-invitacion-files', 'InvitacionController@ajaxDatatablesFiles');
        Route::get('/invitacion-add/{id}/', 'InvitacionController@viewAdd')->name('invitacion-add');
        Route::post('/ajax-invitacion-add-files', 'InvitacionController@ajaxAdd');
        Route::post('/ajax-invitacion-delete-files', 'InvitacionController@ajaxDelete');


        //rutas de invitados
        Route::get('/invitados', 'InvitadoController@index')->name('invitados.invitado');

        //rutas de invitados
        Route::get('/asientos', 'AsientoController@index')->name('invitados.asiento');

        //rutas de invitados
        Route::get('/regalos', 'RegaloController@index')->name('invitados.regalo');

        // Routes for Agenda
        Route::get('/agenda', 'AgendaController@index')->name('configuracion.agenda');
        Route::get('/agenda-add', 'AgendaController@viewAdd')->name('agenda-add');
        Route::post('/ajax-agenda', 'AgendaController@ajaxDatatables');
        Route::post('/ajax-agenda-add', 'AgendaController@ajaxAdd');
        Route::get('/agenda-show/{id}', 'AgendaController@viewShow');
        Route::get('/agenda-edit/{id}', 'AgendaController@viewEdit');
        Route::post('/ajax-agenda-update', 'AgendaController@ajaxUpdate');
        Route::post('/ajax-agenda-delete', 'AgendaController@ajaxDelete');
        Route::post('/ajax-get-events/', 'AgendaController@get_events');
        Route::post('/ajax-dt-get-agendas/{id}/{fecha}', 'AgendaController@datatable_get_agendas');

        // Routes for Menu Gastronimico Etapas
        Route::get('/menu_etapas', 'MenugEtapasController@index')->name('configuracion.menug_etapas');
        Route::get('/menu-etapas-add', 'MenugEtapasController@viewAdd')->name('menuge-add');
        Route::post('/ajax-menu-etapas', 'MenugEtapasController@ajaxDatatables');
        Route::post('/ajax-menu-etapas-add', 'MenugEtapasController@ajaxAdd');
        Route::get('/menu-etapas-show/{id}', 'MenugEtapasController@viewShow');
        Route::get('/menu-etapas-edit/{id}', 'MenugEtapasController@viewEdit');
        Route::post('/ajax-menu-etapas-update', 'MenugEtapasController@ajaxUpdate');
        Route::post('/ajax-menu-etapas-delete', 'MenugEtapasController@ajaxDelete');

        // Routes for Menu Gastronimico Etapas
        Route::get('/menu_platos', 'MenugPlatosController@index')->name('configuracion.menug_platos');
        Route::get('/menu-platos-add', 'MenugPlatosController@viewAdd')->name('menugp-add');
        Route::post('/ajax-menu-platos', 'MenugPlatosController@ajaxDatatables');
        Route::post('/ajax-menu-platos-add', 'MenugPlatosController@ajaxAdd');
        Route::get('/menu-platos-show/{id}', 'MenugPlatosController@viewShow');
        Route::get('/menu-platos-edit/{id}', 'MenugPlatosController@viewEdit');
        Route::post('/ajax-menu-platos-update', 'MenugPlatosController@ajaxUpdate');
        Route::post('/ajax-menu-platos-delete', 'MenugPlatosController@ajaxDelete');

        // envios y cola
        Route::post('/ajax-get-envios', 'EventoController@ajaxEnvios')->name('envios');
        Route::post('/ajax-set-envios', 'EventoController@ajaxEnviosCola')->name('cola');
        Route::post('/ajax-remove-envios', 'EventoController@ajaxEnviosQuitar')->name('quitarcola');
    });


});*/



