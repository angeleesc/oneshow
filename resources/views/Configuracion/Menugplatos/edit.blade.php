@extends('Layouts.template-inside')

@section('heading')
    <h1 class="page-header-heading"><i class="fas fa-coffee page-header-heading-icon"></i>Editar Plato</h1>
@endsection

@section('content')

    <div class="col-lg-12">

        <div class="widget widget-default">

            <div class="widget-body">

                @if($existe)

                    <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="pills-datos-tab" data-toggle="pill" href="#pills-datos" role="tab" aria-controls="pills-datos" aria-selected="true">Datos</a>
                        </li>
                        <!--li class="nav-item">
                            <a class="nav-link" id="pills-logo-tab" data-toggle="pill" href="#pills-logo" role="tab" aria-controls="pills-logo" aria-selected="false">Logo</a>
                        </li-->

                    </ul>

                    <hr class="line-gray"/>
                    <form id="form-edit-plato" class="form-change-password form" enctype="multipart/form-data">

                        <div class="tab-content" id="pills-tabContent">
                            <div class="tab-pane fade show active" id="pills-datos" role="tabpanel" aria-labelledby="pills-datos-tab">
                                <div class="form-group row">
                                    <label class="col-sm-2 col-form-label col-form-label-sm">Menú Etapa</label>
                                    <div class="col-sm-4">
                                        <select class="form-control form-control-sm" id="etapa" name="etapa">
                                            <option value="">Seleccione</option>
                                            @foreach($etapas as $etapa)
                                                <option value="{{ $etapa->_id}}" @if($plato->Etapa_id == $etapa->_id) selected='selected' @endif>{{ $etapa->Titulo }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-2 col-form-label col-form-label-sm">Número Plato</label>
                                    <div class="col-sm-4">
                                        <input class="hide" type="text" name="plato_id" value="{{$plato->_id}}" placeholder="">
                                        <input type="text" class="form-control form-control-sm" value="{{$plato->Numero_plato}}" id="numero_plato" name="numero_plato" placeholder="" />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-2 col-form-label col-form-label-sm">Título</label>
                                    <div class="col-sm-4">
                                        <input type="text" class="form-control form-control-sm" value="{{$plato->Titulo}}" id="titulo" name="titulo" placeholder="" />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-2 col-form-label col-form-label-sm">Descripción</label>
                                    <div class="col-sm-4">
                                        <textarea  class="form-control form-control-sm" id="descripcion" name="descripcion" placeholder="">{{$plato->Descripcion}}</textarea>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-2 col-form-label col-form-label-sm">Estado</label>
                                    <div class="col-sm-4">
                                        <select class="form-control form-control-sm" id="status" name="status">
                                            <option value="">Seleccione</option>
                                            @foreach($estados as $estado)
                                                <option value="{{ $estado->Valor == true ? 1 : 0 }}" @if($plato->Activo == $estado->Valor) selected='selected' @endif>{{ $estado->Nombre }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div class="form-group row">
                            <div class="col-sm-4">
                                <button type="button" id="edit_plato" class="btn btn-sm btn-dark mr-2">Guardar</button>
                                <a href="{{ route('configuracion.menug_platos') }}"><button type="button" class="btn btn-sm btn-dark">Volver</button></a>
                            </div>
                        </div>

                    </form>           
                    

                @else

                    <div class="alert alert-danger mb-4" role="alert">
                        <i class="fas fa-info-circle"></i>&nbsp;No existe la agenda.
                    </div>

                @endif

            </div>

        </div>

    </div>

@endsection

@section('javascript')

    <script type="text/javascript">

        $(function(){
            var linkReturn = "{{ route('configuracion.menug_platos') }}";
            $('button#edit_plato').click(edit_plato)

            function edit_plato() {
                var form = $('form#form-edit-plato');
                var titulo = $('input#titulo').val();
                var etapa = $('select#etapa').val();
                var numero_plato = $('input#numero_plato').val();
                var descripcion = $('textarea#descripcion').val();
                if (titulo.trim() == '' || numero_plato.trim() == '' || descripcion.trim() == '' || etapa.trim() == '') {
                    sweetalert('Por favor introduzca todos los campos', 'warning', 'sweet');
                } else {
                    $.ajax({
                        url: '../ajax-menu-platos-update',
                        type:'POST',
                        data: form.serialize(),
                        beforeSend: function(){
                            $('button#edit_plato').prepend('<i class="fa fa-spinner fa-spin"></i> ');
                         },
                        success:function(result){
                            $('button#save_agenda').find('i.fa').remove();
                            if (result.code == 200) {
                                Swal.fire({
                                    text: "plato de menú editado exitosamente",
                                    type: "success",
                                    showCancelButton: false,
                                    confirmButtonColor: "#343a40",
                                    confirmButtonText: "OK",
                                    target: document.getElementById('sweet')
                                }).then((result) => {
                                    if (result.value) {
                                        window.location.href = linkReturn;
                                    }
                                });
                            } else {
                                sweetalert(result.message, 'error', 'sweet');
                            }
                        }
                    })
                }
            }
        });

        


    </script>

@endsection
