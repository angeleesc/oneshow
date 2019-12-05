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
                    <form id="form-edit-agenda" class="form-change-password form" enctype="multipart/form-data">

                        <div class="tab-content" id="pills-tabContent">
                            <div class="tab-pane fade show active" id="pills-datos" role="tabpanel" aria-labelledby="pills-datos-tab">
                                
                                <div class="form-group row">
                                    <label class="col-sm-2 col-form-label col-form-label-sm">Evento</label>
                                    <div class="col-sm-4">
                                         <input type="text" class="hide" value="{{$agenda->_id}}" id="agenda_id" name="agenda_id"/>
                                        <input type="text" class="form-control form-control-sm" value="{{$evento->Nombre}}" id="evento" name="evento" placeholder="" disabled />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-2 col-form-label col-form-label-sm">Título</label>
                                    <div class="col-sm-4">
                                        <input type="text" class="form-control form-control-sm" value="{{$agenda->Titulo}}" id="titulo" name="titulo" placeholder="Ingrese el titulo " />
                                    </div>
                                </div>                                
                                <div class="form-group row">
                                    <label class="col-sm-2 col-form-label col-form-label-sm">Hora</label>
                                    <div class="col-sm-4">
                                        <input type="text" class="form-control form-control-sm" value="{{$agenda->Hora}}" id="hora" name="hora" placeholder="Ingrese la hora" />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-2 col-form-label col-form-label-sm">Título</label>
                                    <div class="col-sm-4">
                                        <textarea id="descripcion" name="descripcion" class="form-control form-control-sm">{{$agenda->Descripcion}}</textarea>
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div class="form-group row">
                            <div class="col-sm-4">
                                <button type="button" id="edit_agenda" class="btn btn-sm btn-dark mr-2">Guardar</button>
                                <a href="{{ route('configuracion.agenda') }}"><button type="button" class="btn btn-sm btn-dark">Volver</button></a>
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
        localStorage.setItem("auto_load_agenda", "1");
        localStorage.setItem("evento_id", "{{$evento->_id}}");
        $(function(){
            var linkReturn = "{{ route('configuracion.agenda') }}";
            $('button#edit_agenda').click(edit_agenda)

            function edit_agenda() {
                var form = $('form#form-edit-agenda');
                let formData = new FormData();
                var titulo = $('input#titulo').val();
                var hora = $('input#hora').val();
                var descripcion = $('textarea#descripcion').val();
                if (titulo.trim() == '' || hora.trim() == '' || descripcion.trim() == '') {
                    sweetalert('Por favor introduzca todos los campos', 'warning', 'sweet');
                } else {
                    formData.append("hora", hora);
                    formData.append("titulo", titulo);
                    formData.append("descripcion", descripcion);
                    formData.append("agenda_id",  $('input#agenda_id').val());
                    $.ajax({
                        type:'POST',
                        url: '../ajax-agenda-update',
                        data: formData,
                        contentType: false,
                        cache: false,
                        processData:false,
                        beforeSend: function(){
                            $('button#edit_agenda').prepend('<i class="fa fa-spinner fa-spin"></i> ');
                         },
                        success:function(result){
                            $('button#save_agenda').find('i.fa').remove();
                            if (result.code == 200) {
                                Swal.fire({
                                    text: "Agenda editada exitosamente",
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
