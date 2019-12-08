@extends('Layouts.template-inside')

@section('heading')
    <h1 class="page-header-heading"><i class="fas fa-address-book page-header-heading-icon"></i>Editar Agenda</h1>
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
                    <form id="form-edit-etapa" class="form-change-password form" enctype="multipart/form-data">

                        <div class="tab-content" id="pills-tabContent">
                            <div class="tab-pane fade show active" id="pills-datos" role="tabpanel" aria-labelledby="pills-datos-tab">
                                <div class="form-group row">
                                    <label class="col-sm-2 col-form-label col-form-label-sm">Número Etapa</label>
                                    <div class="col-sm-4">
                                        <input class="hide" type="text" name="etapa_id" value="{{$etapa->_id}}" placeholder="">
                                        <input type="text" class="form-control form-control-sm" value="{{$etapa->Numero_etapa}}" id="numero_etapa" name="numero_etapa" placeholder="" />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-2 col-form-label col-form-label-sm">Título</label>
                                    <div class="col-sm-4">
                                        <input type="text" class="form-control form-control-sm" value="{{$etapa->Titulo}}" id="titulo" name="titulo" placeholder="" />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-2 col-form-label col-form-label-sm">Descripción</label>
                                    <div class="col-sm-4">
                                        <textarea  class="form-control form-control-sm" id="descripcion" name="descripcion" placeholder="">{{$etapa->Descripcion}}</textarea>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-2 col-form-label col-form-label-sm">Estado</label>
                                    <div class="col-sm-4">
                                        <select class="form-control form-control-sm" id="status" name="status">
                                            <option value="">Seleccione</option>
                                            @foreach($estados as $estado)
                                                <option value="{{ $estado->Valor == true ? 1 : 0 }}" @if($etapa->Activo == $estado->Valor) selected='selected' @endif>{{ $estado->Nombre }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div class="form-group row">
                            <div class="col-sm-4">
                                <button type="button" id="edit_etapa" class="btn btn-sm btn-dark mr-2">Guardar</button>
                                <a href="{{ route('configuracion.menug_etapas') }}"><button type="button" class="btn btn-sm btn-dark">Volver</button></a>
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
            var linkReturn = "{{ route('configuracion.menug_etapas') }}";
            $('button#edit_etapa').click(edit_etapa)

            function edit_etapa() {
                var form = $('form#form-edit-etapa');
                var titulo = $('input#titulo').val();
                var numero_etapa = $('input#numero_etapa').val();
                var descripcion = $('textarea#descripcion').val();
                if (titulo.trim() == '' || numero_etapa.trim() == '' || descripcion.trim() == '') {
                    sweetalert('Por favor introduzca todos los campos', 'warning', 'sweet');
                } else {
                    $.ajax({
                        url: '../ajax-menu-etapas-update',
                        type:'POST',
                        data: form.serialize(),
                        beforeSend: function(){
                            $('button#edit_etapa').prepend('<i class="fa fa-spinner fa-spin"></i> ');
                         },
                        success:function(result){
                            $('button#save_agenda').find('i.fa').remove();
                            if (result.code == 200) {
                                Swal.fire({
                                    text: "Etapa de menú editada exitosamente",
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
