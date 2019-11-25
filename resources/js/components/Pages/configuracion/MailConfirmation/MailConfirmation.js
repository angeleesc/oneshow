

import React, { Component } from "react";
import axios from "axios";

import logo from "../../../../../../public/images/logo-oneshow.png";

export default class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idConfirmacion: this.props.match.params.id,
            nombre:"",
            apellido:"",
            correo:"",
            telefono:"",
            evento:"",
            id:"",
            evento_id:"",
            idInvitado:"",
            adicionales:[],
            footer: "Footer",
            isLoading: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeAdicional = this.handleChangeAdicional.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this); 
        this.generarCamposAdicionales = this.generarCamposAdicionales.bind(this);
        this.calcularMayores = this.calcularMayores.bind(this);
        this.calcularMenores = this.calcularMenores.bind(this);
    }

    componentDidMount() {
        axios.post("api/mail-confirmacion",{
           idConfirmacion: this.state.idConfirmacion
        }).then(res => {
            console.log(res);
            let r = res.data;
            this.setState({
                id:r.invitado.id,
                idInvitado:r.invitado.invitado_id,
                nombre: r.invitado.nombre,
                apellido: r.invitado.apellido,
                correo:r.invitado.correo,
                telefono:r.invitado.telefono,
                grupo:r.invitado.grupo,
                evento:r.invitado.evento,
                evento_id:r.invitado.evento_id,
                adicionales: r.adicionales,
                cantidadAdicionales:0,
                cargadoAdicionales:false
            });
            this.setState({isLoading:false})
        });
    }


    handleChange(event){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        console.log(value)
        const name = target.name;
        this.setState({
          [name]: value
        })
    }

    handleChangeAdicional(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.state[name] =  value
        this.setState({...this.state})
    }

    handleSubmit(e){
        e.preventDefault();
        let formData = new FormData()
        formData.append("id",this.state.idInvitado);
        formData.append("id_evento_invitado",this.state.id);
        formData.append("id_evento",this.state.evento_id);
        formData.append("nombre", this.state.nombre);
        formData.append("apellido", this.state.apellido);
        formData.append("correo", this.state.correo);
        formData.append("telefono", this.state.telefono);
        if(this.state.cantidadAdicionales>0){
            formData.append("cantidad_adicionales",this.state.cantidadAdicionales);
            
            for(var i=0;i<this.state.cantidadAdicionales;i++){
                
                formData.append("id_invitado_adicional_"+i,this.state["id_invitado_adicional_"+i]);
                formData.append("nombre_adicional_"+i, this.state["nombre_adicional_"+i]);
                formData.append("apellido_adicional_"+i, this.state["apellido_adicional_"+i]);
                formData.append("correo_adicional_"+i, this.state["correo_adicional_"+i]);
                formData.append("telefono_adicional_"+i, this.state["telefono_adicional_"+i]);
            }
        }
        $('#save-invitado').prepend('<i class="fa fa-spinner fa-spin"></i> ');
        axios.post("api/mail-confirmacion/datos",formData).then(res=>{
            console.log(res)
                if(res.data.code === 200) {
                    axios.post("api/mail-confirmacion/datos-listos",formData).then(res=>{
                        if (res.data.code === 200){
                            $('#save-invitado').find('i.fa').remove();
                            Swal.fire({
                                text: "Datos confirmados exitosamente",
                                type: "success",
                                showCancelButton: false,
                                confirmButtonColor: "#343a40",
                                confirmButtonText: "OK",
                                target: document.getElementById('sweet')
                            }).then((result) => {
                                if (result.value) {
                                    window.scrollTo(0, 0);
                                    location.href="http://www.oneshow.com.ar";
                                    
                                }
                            });
                        }
                        else if(res.data.code === 500){
                            sweetalert('Error al confirmar datos.', 'error', 'sweet');
                        }
                    })
                    

                }else if(res.data.code === 500){
                    sweetalert('Error al confirmar datos.', 'error', 'sweet');
                }
        }).catch(error => {
            $('button#save-usuario').find('i.fa').remove();
            sweetalert(error.response.data, 'error', 'sweet');
        })
    }

    generarCamposAdicionales(){
        var retorno = [];
        this.state.cantidadAdicionales = this.state.adicionales.length;
        this.state.adicionales.map((e,index)=>{
            if(!this.state.hasOwnProperty("nombre_adicional_"+index)){
                this.state["id_invitado_adicional_"+index]=e._id;
                this.state["nombre_adicional_"+index] = e.Nombre;
                this.state["apellido_adicional_"+index] = e.Apellido;
                this.state["correo_adicional_"+index] = e.Correo;
                this.state["telefono_adicional_"+index] = e.Telefono;
            }
            retorno.push(
                <div key={e._id}>
                    <h3>Invitado Adicional {index+1}</h3>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label col-form-label-sm">Nombre</label>
                        <div className="col-sm-4">
                            <input type="text" className="form-control form-control-sm" id="nombre" name={`nombre_adicional_${index}`} placeholder="Ingrese el nombre" value={this.state["nombre_adicional_"+index]} onChange={this.handleChangeAdicional} />
                        </div>
                    </div>

                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label col-form-label-sm">Apellido</label>
                        <div className="col-sm-4">
                            <input type="text" className="form-control form-control-sm" id="apellido" name={`apellido_adicional_${index}`} placeholder="Ingrese el apellido" value={this.state["apellido_adicional_"+index]}  onChange={this.handleChangeAdicional} />
                        </div>
                    </div>

                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label col-form-label-sm">Correo</label>
                        <div className="col-sm-4">
                            <input type="text" className="form-control form-control-sm" id="correo" name={`correo_adicional_${index}`} placeholder="Ingrese el correo" value={this.state["correo_adicional_"+index]}  onChange={this.handleChangeAdicional} />
                        </div>
                    </div>

                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label col-form-label-sm">Teléfono</label>
                        <div className="col-sm-4">
                            <input type="text" className="form-control form-control-sm" id="telefono" name={`telefono_adicional_${index}`} placeholder="Ingrese el télefono" value={this.state["telefono_adicional_"+index]}  onChange={this.handleChangeAdicional}/>
                        </div>
                    </div>
                    <hr align="left" noshade="noshade" size="2" width="50%" />
                </div>
                
            );
            
        })
        return retorno;
    }

    calcularMayores(){
        var cantidad = 0;
        if(this.state.adicionales.length){
            for (var i=0; i<this.state.adicionales.length;i++){
                if(!this.state.adicionales[i].EsMenorDeEdad){
                    cantidad++;
                }
            }
        }
        return cantidad;
    }

    calcularMenores(){
        var cantidad = 0;
        if(this.state.adicionales.length){
            for (var i=0; i<this.state.adicionales.length;i++){
                if(this.state.adicionales[i].EsMenorDeEdad){
                    cantidad++;
                }
            }
        }
        return cantidad;
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div>
                        <div id="sweet" className="container-fluid">
                            <div className="row">
                                <div className="offset-6">
                                <img className="logo-inside" src={logo} />
                                    <h3>
                                        <i className="fa fa-spinner fa-spin" />{" "}
                                        Cargando
                                    </h3>
                                </div>
                            </div>
                        </div>
                </div>
            );
        } else {
            return (
                <div>
                    
                        <div id="sweet" className="container-fluid">
                        <div className="row mb-4">
                            <div className="col-3">
                            <img className="ml-4" src={logo} style={{ width: "60%"}}/>
                            </div>
                            <div className="col-3">
                                {this.state.evento}
                            </div>
                        </div>
                            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link active" id="pills-datos-tab" data-toggle="pill" href="#pills-datos" role="tab" aria-controls="pills-datos" aria-selected="true">Datos</a>
                                </li>

                            </ul>


                            <hr className="line-gray"/>

                            <form id="form-add-usuario" className="form-change-password form" encType="multipart/form-data" onSubmit={this.handleSubmit}>
                                <div className="tab-content" id="pills-tabContent">
                                    <div className="tab-pane fade show active" id="pills-datos" role="tabpanel" aria-labelledby="pills-datos-tab">
                                        <div className="alert alert-info" role="alert">
                                            Recuerda que tienes {this.calcularMayores()} invitados adicionales mayores de edad y {this.calcularMenores()} menores de dad
                                        </div>
                                        <h3>Tus Datos personales</h3>
                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Nombre</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="nombre" name="nombre" placeholder="Ingrese el nombre" value={this.state.nombre} onChange={this.handleChange} />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Apellido</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="apellido" name="apellido" placeholder="Ingrese el apellido" value={this.state.apellido} onChange={this.handleChange} />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Correo</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="correo" name="correo" placeholder="Ingrese el correo" value={this.state.correo} onChange={this.handleChange} disabled/>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Teléfono</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="telefono" name="telefono" placeholder="Ingrese el telefono" value={this.state.telefono} onChange={this.handleChange}/>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <hr align="left" noshade="noshade" size="2" width="50%" />
                                {(this.state.adicionales.length )?(
                                    this.generarCamposAdicionales()
                                ):(
                                    ""
                                )}

                                <div className="form-group row">
                                    <div className="col-sm-4">
                                        <button type="submit" id="save-invitado" className="btn btn-sm btn-dark mr-2">Confirmar</button>
                                        
                                    </div>
                                </div>
                            </form>
                        </div>
                    
                </div>
            );
        }
    }
}
