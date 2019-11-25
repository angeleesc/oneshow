@extends('Layouts.template-inside')

@section('heading')
    <h1 class="page-header-heading"><i class="fas fa-fa-address-book page-header-heading-icon"></i>Agregar Agenda</h1>
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

                <form id="form-add-agenda" class="form-change-password form" enctype="multipart/form-data">

                    <div class="tab-content" id="pills-tabContent">
                        <div class="tab-pane fade show active" id="pills-datos" role="tabpanel" aria-labelledby="pills-datos-tab">
                            <div class="form-group row">
                                <label class="col-sm-2 col-form-label col-form-label-sm">Evento</label>
                                <div class="col-sm-4">
                                    <input class="hide" type="text" id="evento_id" name="evento_id" value="{{$evento->_id}}">
                                    <input disabled type="text" class="form-control form-control-sm" value="{{$evento->Nombre}}" id="evento" name="evento" placeholder=""/>
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-sm-2 col-form-label col-form-label-sm">Hora</label>
                                <div class="col-sm-4">
                                    <input type="text" class="form-control form-control-sm" id="hora" name="hora" placeholder="Ingrese la hora. Ej: 10:00 PM"  />
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-sm-2 col-form-label col-form-label-sm">Título</label>
                                <div class="col-sm-4">
                                    <input type="text" class="form-control form-control-sm" id="titulo" name="titulo" placeholder="Ingrese el título de actividad"  />
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-sm-2 col-form-label col-form-label-sm">Descripción</label>      
                                <div class="col-sm-4">
                                   <textarea class="form-control form-control-sm" id="descripcion" name="descripcion"  placeholder="Ingrese corta descripción"></textarea>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div class="form-group row">
                        <div class="col-sm-4">
                            <button type="button" id="save_agenda" class="btn btn-sm btn-dark mr-2">Guardar</button>
                            <a href="{{ route('configuracion.agenda') }}"><button type="button" class="btn btn-sm btn-dark">Volver</button></a>
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
            localStorage.setItem("auto_load_agenda", "1");
            var linkReturn = "{{ route('configuracion.agenda') }}";
            $('button#save_agenda').click(add_agenda)

            function add_agenda() {

                var form = $('form#form-add-agenda');
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
                    formData.append("evento_id",  $('input#evento_id').val());
                    $.ajax({
                        type:'POST',
                        url: './ajax-agenda-add',
                        data: formData,
                        contentType: false,
                        cache: false,
                        processData:false,
                        beforeSend: function(){
                            $('button#save_agenda').prepend('<i class="fa fa-spinner fa-spin"></i> ');
                         },
                        success:function(result){
                            $('button#save_agenda').find('i.fa').remove();
                            console.log(result);
                            if (result.code == 200) {
                                Swal.fire({
                                    text: "Agenda agregada exitosamente",
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
            // $("#save-empresa").on("click",function(){

            //     let formData = new FormData();

            //     formData.append("identificacion", $('#form-add-empresa input[name=identificacion]').val());
            //     formData.append("nombre", $('#form-add-empresa input[name=nombre]').val());
            //     formData.append("correo", $('#form-add-empresa input[name=correo]').val());
            //     formData.append("telefono", $('#form-add-empresa input[name=telefono]').val());
            //     formData.append("pais", $('#form-add-empresa select[name=pais]').val());
            //     formData.append("estatus", $('#form-add-empresa select[name=estatus]').val());
            //     formData.append("logo", $('#form-add-empresa input[name=emp-logo]')[0].files[0] === undefined ? '' : $('#form-add-empresa input[name=emp-logo]')[0].files[0] );
            //     formData.append("x", $('#emp-add-x').val());
            //     formData.append("y", $('#emp-add-y').val());
            //     formData.append("w", $('#emp-add-w').val());
            //     formData.append("h", $('#emp-add-h').val());

            //     $.ajax({
            //         type: 'POST',
            //         url: './ajax-empresa-add',
            //         data: formData,
            //         contentType: false,
            //         cache: false,
            //         processData:false,
            //         beforeSend: function(){
            //             $('button#save-empresa').prepend('<i class="fa fa-spinner fa-spin"></i> ');
            //         },
            //         success: function(json){
            //             $('button#save-empresa').find('i.fa').remove();
            //             if(json.code === 200) {
            //                 Swal.fire({
            //                     text: "Empresa agregada exitosamente",
            //                     type: "success",
            //                     showCancelButton: false,
            //                     confirmButtonColor: "#343a40",
            //                     confirmButtonText: "OK",
            //                     target: document.getElementById('sweet')
            //                 }).then((result) => {
            //                     if (result.value) {
            //                         window.location.href = linkReturn;
            //                     }
            //                 });
            //             }else if(json.code === 500){
            //                 sweetalert('Error al agregar empresa. Consulte al Administrador.', 'error', 'sweet');
            //             }
            //         },
            //         error: function(json){

            //             $('button#save-empresa').find('i.fa').remove();

            //             if(json.status === 422){
            //                 let errors = json.responseJSON;
            //                 sweetalert(errors, 'error', 'sweet');
            //             }
            //         }
            //     });
            // });
        });
    </script>

@endsection
