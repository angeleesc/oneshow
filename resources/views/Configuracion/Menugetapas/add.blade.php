@extends('Layouts.template-inside')

@section('heading')
    <h1 class="page-header-heading"><i class="fas fa-folder-open page-header-heading-icon"></i>Agregar Menú Etapa</h1>
@endsection

@section('content')

    <div class="col-lg-12">

        <div class="widget widget-default">

            <div class="widget-body">

                <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active" id="pills-datos-tab" data-toggle="pill" href="#pills-datos" role="tab" aria-controls="pills-datos" aria-selected="true">Datos</a>
                    </li>
                </ul>

                <hr class="line-gray"/>

                <form id="form-add-etapa" class="form-change-password form" enctype="multipart/form-data">

                        <div class="tab-content" id="pills-tabContent">
                            <div class="tab-pane fade show active" id="pills-datos" role="tabpanel" aria-labelledby="pills-datos-tab">
                                <div class="form-group row">
                                    <label class="col-sm-2 col-form-label col-form-label-sm">Número Etapa</label>
                                    <div class="col-sm-4">
                                        <input type="text" class="form-control form-control-sm" value="" id="numero_etapa" name="numero_etapa" placeholder="" />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-2 col-form-label col-form-label-sm">Título</label>
                                    <div class="col-sm-4">
                                        <input type="text" class="form-control form-control-sm" value="" id="titulo" name="titulo" placeholder="" />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-2 col-form-label col-form-label-sm">Descripción</label>
                                    <div class="col-sm-4">
                                        <textarea  class="form-control form-control-sm" id="descripcion" name="descripcion" placeholder=""></textarea>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-2 col-form-label col-form-label-sm">Estado</label>
                                    <div class="col-sm-4">
                                        <select class="form-control form-control-sm" id="status" name="status">
                                            <option value="">Seleccione</option>
                                            @foreach($estados as $estado)
                                                <option value="{{ $estado->Valor == true ? 1 : 0 }}">{{ $estado->Nombre }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div class="form-group row">
                            <div class="col-sm-4">
                                <button type="button" id="save_etaoa" class="btn btn-sm btn-dark mr-2">Guardar</button>
                                <a href="{{ route('configuracion.menug_etapas') }}"><button type="button" class="btn btn-sm btn-dark">Volver</button></a>
                            </div>
                        </div>

                    </form>

            </div>

        </div>

    </div>

@endsection

@section('javascript')

    <script type="text/javascript">

        $(function(){

            var linkReturn = "{{ route('configuracion.menug_etapas') }}";
            $('button#save_etaoa').click(save_etapa)

            function save_etapa() {
                var form = $('form#form-add-etapa');
                var titulo = $('input#titulo').val();
                var numero_etapa = $('input#numero_etapa').val();
                var descripcion = $('textarea#descripcion').val();
                var status = $('select#status').val()
                if (titulo.trim() == '' || numero_etapa.trim() == '' || descripcion.trim() == '' || status.trim() == '') {
                    sweetalert('Por favor introduzca todos los campos', 'warning', 'sweet');
                } else {
                    $.ajax({
                        url: './ajax-menu-etapas-add',
                        type:'POST',
                        data: form.serialize(),
                        beforeSend: function(){
                            $('button#save_etaoa').prepend('<i class="fa fa-spinner fa-spin"></i> ');
                         },
                        success:function(result){
                            $('button#save_etaoa').find('i.fa').remove();
                            console.log(result);
                            if (result.code == 200) {
                                Swal.fire({
                                    text: "Etapa de menú agregada exitosamente",
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
                            }
                        }
                    })
                }
            }
        });
    </script>

@endsection
