@extends('Layouts.template-inside')

@section('heading')
    <h1 class="page-header-heading"><i class="fas fa-address-book page-header-heading-icon"></i>Agenda</h1>
@endsection

@section('content')


    <div class="col-lg-12">
        
        <div class="widget widget-default">

            <div class="widget-body">
                <div class="row">
                    <div class="form-inline mb-6 col-md-5">
                        <label class="my-1 mr-2 form-control-sm"><strong>Empresa</strong></label>
                        <select class="form-control form-control-sm my-1 mr-sm-4 col-6" id="pro-find-empresa" name="pro-find-empresa" {{ strtoupper(Auth::user()->nameRol()) == 'ADMINISTRADOR'  ? '' : 'disabled' }} >
                            @if(strtoupper(Auth::user()->nameRol()) == 'ADMINISTRADOR')
                                <option value="">Todas</option>
                            @endif

                            @foreach($empresas as $emp)
                                <option value="{{ $emp->_id }}">{{ $emp->Nombre }}</option>
                            @endforeach

                        </select>
                        @if(strtoupper(Auth::user()->nameRol()) == 'ADMINISTRADOR')
                            <button id="p-limpiar" class="btn btn-dark btn-sm mr-1" data-toggle="tooltip" data-placement="top" title="Limpiar Busqueda"><i class="fa fa-trash" aria-hidden="true"></i></button>
                        @endif
                        

                    </div>
                    <div class="form-inline mb-6 col-md-5">
                        <label class="my-1 mr-2 form-control-sm"><strong>Evento</strong></label>
                        <select {{ $show_select_evento ? '' : 'disabled' }} class="form-control form-control-sm my-1 mr-sm-4 col-6" id="pro-find-evento" name="pro-find-evento">                            
                            @if(isset($eventos) && count($eventos))
                                @if(strtoupper(Auth::user()->nameRol()) == 'ADMINISTRADOR' || strtoupper(Auth::user()->nameRol()) == 'EMPRESA')
                                    <option value="">Seleccione</option>
                                @endif
                                 @foreach($eventos as $evento)
                                    <option value="{{ $evento->_id }}">{{ $evento->Nombre }}</option>
                                @endforeach
                            @endif
                        </select>
                        @if(strtoupper(Auth::user()->nameRol()) == 'ADMINISTRADOR' || strtoupper(Auth::user()->nameRol()) == 'EMPRESA')
                            <button id="evento-limpiar" class="btn btn-dark btn-sm mr-1" data-toggle="tooltip" data-placement="top" title="Limpiar Busqueda"><i class="fa fa-trash" aria-hidden="true"></i></button>
                        @endif
                        

                    </div>
                </div>
                <hr>
                <div id="show_table" class="{{ strtoupper(Auth::user()->nameRol()) != 'EVENTO' ? 'hide' : '' }}">
                        <table class="table table-hover table-condensed table-dark-theme table-responsive-sm" id="dt_agendas">
                        <thead>
                        <tr>
                            <th>FECHA</th>
                            <th>HORA</th>
                            <th>TÍTULO</th>
                            <th>DESCRIPCIÓN</th>
                            <th class="text-center">ACCIONES</th>
                        </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </div>

    </div>


@endsection

@section('javascript')

    <script type="text/javascript">

        // Set variables helpers //
        var rol = "{{ strtoupper(Auth::user()->nameRol())  }}";
        var id_empresa = 0;
        var id_evento = "{{ strtoupper(Auth::user()->nameRol()) != 'EVENTO' ? 0 : $eventos[0]->_id }}";
        var div_show_table = $('div#show_table');
        // Events Reactions //
        $("#p-limpiar").click(clear_empresa);
        $('#evento-limpiar').click(clear_evento);
        $('select#pro-find-empresa').change(search_empresas);
        $('select#pro-find-evento').change(search_agendas);
        // ===================================
        let linkAdd        =  "{{ route('agenda-add')  }}";
        var addAction      = "{{ Auth::user()->hasPermission('agenda', 'add')  }}";
        var showAction     = "{{ Auth::user()->hasPermission('agenda', 'show')  }}";
        var editAction     = "{{ Auth::user()->hasPermission('agenda', 'edit')  }}";
        var deleteAction   = "{{ Auth::user()->hasPermission('agenda', 'delete')  }}";
        var eventoAction   = "{{ Auth::user()->hasPermission('agenda', 'evento')  }}";
        var datatable_agenda = $('#dt_agendas');
        datatable_agenda.DataTable({
                dom: 'Bfrtip',
                buttons: [
                    {
                        text: 'Agregar Agenda',
                        className: "btn-sm btn-dark button-add",
                        action: function ( e, dt, node, config ) {

                            if(addAction){

                                window.location.href = linkAdd;

                            }else{
                                sweetalert('Accion prohibida', 'error', 'sweet');
                            }


                        }
                    }
                ],
                "language": {
                    "url": "{{ asset('js/Spanish.json') }}",
                },
                "bLengthChange": false,
                "bFilter": true,
                "bInfo": false,
                "autoWidth": false,
                "processing": false,
                "serverSide": true,
                "ordering": false,
                "paging": true,
                "deferRender": true,
                "ajax": {
                    "url": "./ajax-dt-get-agendas/" + id_evento,
                    "type": "POST"
                },
                "columns":[
                    {"width": "10%", data: 'Fecha', "searchable": true, "bSortable": false},
                    {"width": "7%", data: 'Hora', "searchable": true, "bSortable": false},
                    {"width": "12%", data: 'Titulo', "searchable": true, "bSortable": false},
                    //{"width": "10%", data: 'Evento', "searchable": true, "bSortable": false},
                    {"width": "7%", data: 'Descripcion', "searchable": true, "bSortable": false},
                    {
                        "width": "9%",
                        data: 'opciones',
                        "searchable": false,
                        "bSortable": false,
                        "render": function(data, type, row, meta){

                            let linkShow   = './agenda-show/' + row._id;
                            let linkEdit   = './agenda-edit/' + row._id;
                            let linkEvento = './evento/' + row._id;

                            var ver      = showAction ? '<a href=" ' +linkShow+ ' "><i style="color: #ffffff; cursor: pointer" data-toggle="tooltip" data-placement="top" title="Ver" class="fas fa-eye"></i></a>&nbsp;&nbsp;&nbsp;' : '';
                            var editar   = editAction ? '<a href=" ' +linkEdit+ ' "><i style="color: #ffffff; cursor: pointer" data-toggle="tooltip" data-placement="top" title="Editar" class="fas fa-edit" ></i></a>&nbsp;&nbsp;&nbsp;' : '';
                            var borrar   = deleteAction ? '<a onclick="modalDelete(\''+row._id+'\')"><i style="color: #ffffff; cursor: pointer" data-toggle="tooltip" data-placement="top" title="Borrar" class="fas fa-trash-alt"></i></a>&nbsp;&nbsp;&nbsp;' : '';

                            var acciones = '<div class="text-center">' + ver + editar + borrar + '</div>';

                            return acciones;
                        }
                    }
                ]
            });
               

        // Custom function of View

        function clear_empresa() {
            $('#pro-find-empresa').prop('selectedIndex',0);
            $('select#pro-find-evento').attr('disabled', true);
            $('select#pro-find-evento').html('');
            datatable_agenda.DataTable().clear().draw();
            id_evento = 0;
            id_empresa = 0;
            datatable_agenda.DataTable().ajax.url( "./ajax-dt-get-agendas/" + id_evento ).load();
            div_show_table.addClass('hide');
        }

        function search_empresas() {
            id_empresa = $('#pro-find-empresa').val();
            if (id_empresa == 0 || id_empresa == '') {
                sweetalert("Por favor seleccione una empresa válida", "warning", "sweet");
            } else {
                var select_event = $('select#pro-find-evento');
                select_event.html('');
                $.ajax({
                    url: './ajax-get-events',
                    type:'POST',
                    data: {'id_empresa': id_empresa},
                    dataType: 'json',
                    success:function(result){
                        if (result.code == 200) {
                            var events = result.data;
                            var n_events = events.length;                            
                            select_event.append('<option value="0">Seleccione</option>');
                            for (var i = 0; i < n_events; i++) {
                                select_event.append('<option value="'+events[i]._id+'">'+events[i].Nombre+'</option>');
                            }
                            select_event.removeAttr('disabled');
                        } else {
                            sweetalert(result.message, "warning", "sweet");                            
                        }
                    }
                })
            }
        }

        function search_agendas() {
            id_evento = $('#pro-find-evento').val();
            if (id_evento == '' || id_evento == 0) {
                sweetalert("Por favor seleccione un evento válido", "warning", "sweet");
            } else {
                datatable_agenda.DataTable().ajax.url( "./ajax-dt-get-agendas/" + id_evento ).load();
                div_show_table.removeClass('hide');
            }
        }

        function clear_evento() {
            $('select#pro-find-evento').prop('selectedIndex',0);
            datatable_agenda.DataTable().clear().draw();
            id_evento = 0;
            datatable_agenda.DataTable().ajax.url( "./ajax-dt-get-agendas/" + id_evento ).load();
            div_show_table.addClass('hide');
        }

        function modalDelete(id){

            Swal.fire({
                text: "¿Está seguro que desea borrar la actividad de la agenda?.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#343a40",
                confirmButtonText: "Si",
                cancelButtonText: "No",
                target: document.getElementById('sweet')
            }).then((result) => {

                if (result.value) {

                    $.ajax({
                        type: 'POST',
                        url: './ajax-agenda-delete',
                        data: {'id': id},
                        dataType: 'json',
                        beforeSend: function() {
                        },
                        success: function(rs) {

                            if(rs.code === 200) {
                                sweetalert("Item eliminado correctamente", "success", "sweet");
                                $('#dt_agendas').DataTable().ajax.reload();
                            }else if(rs.code === 600){
                                sweetalert("Error en el Proceso de Eliminacion. Consulte al Administrador", "error", "sweet");
                            }else if(rs.code == 500){
                                sweetalert("Error al Eliminar. Consulte al Administrador", "error", "sweet");
                            }
                        }
                    });
                }
            });

        }
    </script>

@endsection
