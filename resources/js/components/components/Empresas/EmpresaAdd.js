import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import swal from "sweetalert2";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

export default class EmpresaAdd extends Component {

    constructor(props) {
        super(props);
        this.state = {
            url: props.url,
            identificacion: '',
            nombre: '',
            correo: '',
            telefono: '',
            pais: '',
            estatus: '',
            logo: '',
            paises: JSON.parse(props.paises),
            isLoading: false
        };

        this.actionSave = this.actionSave.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    actionSave(e){

        let self = this;

        self.setState({
            isLoading: true
        });

        let identificacion = this.state.identificacion;
        let nombre         = this.state.nombre;
        let correo         = this.state.correo;
        let telefono       = this.state.telefono;
        let pais           = this.state.pais;
        let estatus        = this.state.estatus;
        let logo           = this.state.logo;

        e.preventDefault();

        axios.post('/ajax-empresa-add', {identificacion, nombre, correo, telefono, pais, estatus, logo})
            .then(res => {

                let r = res.data;

                if(r.code === 200){

                    self.setState({
                        identificacion: '',
                        nombre: '',
                        correo: '',
                        telefono: '',
                        pais: '',
                        estatus: '',
                        logo: '',
                        isLoading: false
                    });

                    swal.fire({
                        title: '<i class="fa fa-check-circle"></i>',
                        text: r.msj,
                        showCancelButton: false,
                        confirmButtonColor: '#343a40',
                        confirmButtonText: 'Ok',
                        target: document.getElementById('sw')
                    }).then((result) => {
                        if (result.value) {

                        }
                    });


                }else if(r.code === 600){

                    self.setState({
                        isLoading: false
                    });

                    swal.fire({
                        title: '<i class="fas fa-exclamation-circle"></i>',
                        text: r.msj,
                        confirmButtonColor: '#343a40',
                        confirmButtonText: 'Ok',
                        target: document.getElementById('sw')

                    });

                }

            }).catch(function (error){

                if (error.response.status == 422){

                    self.setState({
                        isLoading: false
                    });

                    swal.fire({
                        title: '<i class="fas fa-exclamation-circle"></i>',
                        text: error.response.data,
                        confirmButtonColor: '#343a40',
                        confirmButtonText: 'Ok',
                        target: document.getElementById('sw')
                    });

                }

            });
    }

    _crop(){
        // image in dataUrl
        console.log(this.refs.cropper.getCroppedCanvas().toDataURL());
    }

    render() {

        let url = this.state.url;
        let urlEmpresa = url + '/empresa';

        let identificacion = this.state.identificacion;
        let nombre         = this.state.nombre;
        let correo         = this.state.correo;
        let telefono       = this.state.telefono;
        let pais           = this.state.pais;
        let estatus        = this.state.estatus;
        let logo           = this.state.logo;
        let paises         = this.state.paises;


        return (


            <div id="sw" className="col-lg-12">

                <div className="widget widget-default">

                    <div className="widget-body">

                        <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                            <li className="nav-item">
                                <a className="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab" aria-controls="pills-home" aria-selected="true">Datos</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-profile" role="tab" aria-controls="pills-profile" aria-selected="false">Logo</a>
                            </li>

                        </ul>

                        <hr className="line-gray"/>

                        <form method="POST" onSubmit={this.actionSave} className="form-change-password form">

                            <div className="tab-content" id="pills-tabContent">
                                <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">

                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label col-form-label-sm">Identificación</label>
                                        <div className="col-sm-4">
                                            <input type="text" className="form-control form-control-sm" id="identificacion" name="identificacion" value={identificacion} onChange={this.handleChange} placeholder="Ingrese el numero de identificacion fiscal"  />
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label col-form-label-sm">Nombre</label>
                                        <div className="col-sm-4">
                                            <input type="text" className="form-control form-control-sm" id="nombre" name="nombre" value={nombre} onChange={this.handleChange} placeholder="Ingrese el nombre de la empresa"  />
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label col-form-label-sm">Correo</label>
                                        <div className="col-sm-4">
                                            <input type="text" className="form-control form-control-sm" id="correo" name="correo" value={correo} onChange={this.handleChange} placeholder="Ingrese el correo de la empresa"  />
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label col-form-label-sm">Teléfono</label>
                                        <div className="col-sm-4">
                                            <input type="text" className="form-control form-control-sm" id="telefono" name="telefono" value={telefono} onChange={this.handleChange} placeholder="Ingrese el teléfono de la empresa"  />
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label col-form-label-sm">País</label>
                                        <div className="col-sm-4">
                                            <select className="form-control form-control-sm" id="pais" name="pais" value={pais} onChange={this.handleChange}>
                                                <option value="">Seleccione</option>
                                                {
                                                    paises.map((p, index) => {
                                                        return <option key={index} value={p._id} >{p.Nombre}</option>
                                                    })

                                                }
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label col-form-label-sm">Estado</label>
                                        <div className="col-sm-4">
                                            <select className="form-control form-control-sm" id="estatus" name="estatus" value={estatus} onChange={this.handleChange}>
                                                <option value="">Seleccione</option>
                                                <option value={true}>Activo</option>
                                                <option value={false}>Inactivo</option>
                                            </select>
                                        </div>
                                    </div>

                                </div>
                                <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">

                                    <div className="alert alert-faded-blue mb-4" role="alert">
                                        <i className="fas fa-info-circle"></i>&nbsp;
                                        La imagén a subir debe tener una resolución de <strong>200x200</strong>, en formato <strong>.jpg</strong> o <strong>.png</strong> y un peso aproximado entre <strong>10KB</strong> y <strong>5MB</strong>.
                                    </div>

                                    <input type="file" name="logo" value={logo} onChange={this.handleChange} />

                                    <Cropper
                                        ref='cropper'
                                        src=''
                                        style={{height: 400, width: '100%'}}
                                        // Cropper.js options
                                        aspectRatio={16 / 9}
                                        guides={false}
                                        crop={this._crop.bind(this)} />

                                </div>

                            </div>

                            <div className="form-group row">
                                <div className="col-sm-4">
                                    <button type="submit" className="btn btn-sm btn-dark mr-2">
                                        { this.state.isLoading ? <span><i className="fas fa-sync fa-spin"></i>&nbsp;&nbsp;</span> : '' }
                                        Guardar
                                    </button>

                                    <a href={urlEmpresa}><button type="button" className="btn btn-sm btn-dark">Volver</button></a>
                                </div>
                            </div>

                        </form>

                    </div>
                </div>

            </div>


        );
    }
}

if (document.getElementById('empresa-add')) {

    const element = document.getElementById('empresa-add');

    const props = Object.assign({}, element.dataset);

    ReactDOM.render(<EmpresaAdd {...props} />, element);
}
