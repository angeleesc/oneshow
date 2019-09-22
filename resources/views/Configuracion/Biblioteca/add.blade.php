@extends('Layouts.template-inside')

@section('heading')
    <h1 class="page-header-heading"><i class="fas fa-book page-header-heading-icon"></i>&nbsp;<a href="{{ route('configuracion.biblioteca') }}">Biblioteca</a>  / <a href="{{ route('biblioteca-show-files', ['evento' => $evento] ) }}">Archivos</a> / Agregar Archivos</h1>
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

                <form id="form-add" class="form-change-password form" enctype="multipart/form-data">

                    <div class="tab-content" id="pills-tabContent">
                        <div class="tab-pane fade show active" id="pills-datos" role="tabpanel" aria-labelledby="pills-datos-tab">

                            <input type="hidden" id="id-evento" value="{{ $evento }}">

                            <!--<div class="form-group row">
                                <label class="col-sm-2 col-form-label col-form-label-sm">Tipo de Archivo</label>
                                <div class="col-sm-5">
                                    <select class="form-control form-control-sm" id="tipo" name="tipo" >
                                        <option value="">Seleccione</option>
                                        <option value="i" >Imagén</option>
                                        <option value="a" >Audio</option>
                                        <option value="v" >Video</option>
                                    </select>
                                </div>
                            </div>-->

                            <div class="form-group row">
                                <label class="col-sm-2 col-form-label col-form-label-sm">Archivo</label>
                                <div class="col-sm-5">
                                    <input type="file" class="form-control-file" id="archivo" name="archivo" >
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-sm-2 col-form-label col-form-label-sm">Nombre del Archivo</label>
                                <div class="col-sm-5">
                                    <input type="text" class="form-control" id="name" name="name" placeholder="Nombre del archivo (Max. 10 caracteres sin espacio)">
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-sm-2 col-form-label col-form-label-sm">Categoria</label>
                                <div class="col-sm-4">
                                    <select class="form-control form-control-sm" id="categoria" name="categoria">
                                        <option value="">Seleccione</option>
                                        @foreach($categorias as $c)
                                            <option value="{{ $c->_id }}">{{ $c->Nombre }}</option>
                                        @endforeach
                                    </select>
                                </div>
                            </div>

                        </div>


                    </div>

                    <div class="form-group row">
                        <div class="col-sm-4">
                            <button type="button" id="save-file" class="btn btn-sm btn-dark mr-2">Guardar</button>

                            <a href="{{ route('biblioteca-show-files', ['evento' => $evento] ) }}"><button type="button" class="btn btn-sm btn-dark">Volver</button></a>
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

            var linkReturn = "{{ route('biblioteca-show-files', ['evento' => $evento] ) }}";

            $('#name').inputmask({"mask": "&&&&&&&&&&", greedy: false, "placeholder": ""});


            $('#div-add-emp-img').hide();

            $('#logo').on('change', function(){

                var $image = $('#preview-add-emp');

                var oFReader = new FileReader();

                oFReader.readAsDataURL(this.files[0]);

                oFReader.onload = function (oFREvent) {

                    // Destroy the old cropper instance
                    $image.cropper('destroy');

                    // Replace url
                    $image.attr('src', this.result);

                    // Start cropper
                    $image.cropper({
                        viewMode: 1,
                        minContainerWidth: 200,
                        minContainerHeight: 200,
                        autoCropArea: 1,
                        crop: function(event) {

                            $('#add-x').val(event.detail.x);
                            $('#add-y').val(event.detail.y);
                            $('#add-w').val(event.detail.width);
                            $('#add-h').val(event.detail.height);
                        }
                    });


                };

                $('#div-add-emp-img').show();
            });

            $("#save-file").on("click",function(){

                let formData = new FormData();

                formData.append("id-evento", $('#id-evento').val());
                //formData.append("tipo", $('#form-add select[name=tipo]').val());
                formData.append("name", $('#form-add input[name=name]').val());
                formData.append("categoria", $('#form-add select[name=categoria]').val());
                formData.append("archivo", $('#form-add input[name=archivo]')[0].files[0] === undefined ? '' : $('#form-add input[name=archivo]')[0].files[0] );

                /*formData.append("x", $('#add-x').val());
                formData.append("y", $('#add-y').val());
                formData.append("w", $('#add-w').val());
                formData.append("h", $('#add-h').val());*/

                $.ajax({
                    type: 'POST',
                    url: '../ajax-biblioteca-add-files',
                    data: formData,
                    //dataType: 'json',
                    contentType: false,
                    cache: false,
                    processData:false,
                    beforeSend: function(){
                        $('button#save-file').prepend('<i class="fa fa-spinner fa-spin"></i> ');
                    },
                    success: function(json){

                        $('button#save-file').find('i.fa').remove();

                        if(json.code === 200) {

                            Swal.fire({
                                text: "Archivo agregado exitosamente",
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

                        }else if(json.code === 500){
                            sweetalert('Error al agregar archivo. Consulte al Administrador.', 'error', 'sweet');
                        }
                    },
                    error: function(json){

                        $('button#save-file').find('i.fa').remove();

                        if(json.status === 422){
                            let errors = json.responseJSON;
                            sweetalert(errors, 'error', 'sweet');
                        }
                    }
                });


            });


        });


    </script>

@endsection
