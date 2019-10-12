import React, { Component } from "react";
import axios from "axios";
import Menu from "../../../../components/Menu";
import Header from "../../../../components/Header";
import { Link } from "react-router-dom";

export default class Add extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: JSON.parse(localStorage.getItem("usuario")),
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            empresas: JSON.parse(localStorage.getItem("empresas")),
            eventos:[],
            evento:"",
            nombre:"",
            apellido:"",
            correo:"",
            telefono:"",
            grupo:"",
            etapasSeleccionadas:[],
            etapas:[],
            invitadosAdicionalesMayores:0,
            invitadosAdicionalesMenores:0,
            opcion: "Invitados",
            footer: "Footer",
            eventos: JSON.parse(localStorage.getItem("eventos")),
            api_token: localStorage.getItem("api_token"),
            isLoading: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeMulti = this.handleChangeMulti.bind(this);
        this.handleEvento = this.handleEvento.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        
    }

    componentDidMount() {
        axios.get("api/eventos",{
            headers: {
                Authorization: this.state.api_token
            }
        }).then(res => {
            console.log(res)
            this.setState({
                eventos:res.data.eventos,
                evento:res.data.eventos[0]._id
            });
            axios.get("api/grupos",{
                headers: {
                    Authorization: this.state.api_token
                }
            }).then(res=>{
                console.log(res);
                this.setState({
                    grupos: res.data.grupos,
                });
                axios.get("api/etapas/evento/"+this.state.eventos[0]._id,{
                    headers: {
                        Authorization: this.state.api_token
                    }
                }).then(res=>{
                    console.log(res)
                    this.setState({
                        etapas: res.data.etapas,
                        isLoading: false
                    });
                })
                
                
            })
            
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

    handleEvento(event){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        console.log(value)
        const name = target.name;
        this.setState({
          [name]: value
        })
        axios.get("api/etapas/evento/"+value,{
            headers: {
                Authorization: this.state.api_token
            }
        }).then(res=>{
            console.log(res);
            this.setState({
                etapas:res.data.etapas
            })
        })
    }

    handleChangeMulti(e){
        this.setState({etapasSeleccionadas: [...e.target.selectedOptions].map(o => o.value)});
        console.log(this.state.etapasSeleccionadas);
    }

    handleSubmit(e){
        e.preventDefault();
        console.log(this.state.grupo);
        console.log(this.state.evento);
        let formData = new FormData()
        formData.append("nombre", this.state.nombre);
        formData.append("apellido", this.state.apellido);
        formData.append("correo", this.state.correo);
        formData.append("telefono", this.state.telefono);
        formData.append("grupo-id",this.state.grupo);
        formData.append("evento-id",this.state.evento);
        formData.append("etapas",this.state.etapasSeleccionadas);
        formData.append("invitados-adicionales-mayores",this.state.invitadosAdicionalesMayores);
        formData.append("invitados-adicionales-menores",this.state.invitadosAdicionalesMenores);
        $('#save-invitado').prepend('<i class="fa fa-spinner fa-spin"></i> ');
        axios.post("api/invitados",formData,{
            headers: {
                Authorization: this.state.api_token
            }
        }).then(res=>{
                if(res.data.code === 200) {
                    Swal.fire({
                        text: "Invitado agregado exitosamente",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonColor: "#343a40",
                        confirmButtonText: "OK",
                        target: document.getElementById('sweet')
                    }).then((result) => {
                        if (result.value) {
                            window.scrollTo(0, 0);
                            
                            this.props.history.push("/invitados");
                        }
                    }); 
                }else if(res.data.code === 500){
                    $('button#save-usuario').find('i.fa').remove();
                    sweetalert(res.data.mensaje, 'error', 'sweet');
                }
        }).catch(error => {
            $('button#save-usuario').find('i.fa').remove();
            
            sweetalert(error.response.data, 'error', 'sweet');
        })
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div>
                    <Menu usuario={this.state.user} />
                    <Header  usuario={this.state.user} history={this.props.history}    />
                    <div className="content-wrapper">
                        <header className="page-header">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12 col-md-12">
                                        <h1 className="page-header-heading">
                                            <i className="fas fa-user-friends page-header-heading-icon" />
                                            &nbsp; Invitados
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </header>
                        <div id="sweet" className="container-fluid">
                            <div className="row">
                                <div className="offset-6">
                                    <h3>
                                        <i className="fa fa-spinner fa-spin" />{" "}
                                        Cargando
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <Menu usuario={this.state.user} />
                    <Header  usuario={this.state.user} history={this.props.history}    />
                    <div className="content-wrapper">
                        <header className="page-header">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12 col-md-12">
                                        <h1 className="page-header-heading">
                                            <i className="fas fa-user-friends page-header-heading-icon" />
                                            &nbsp; 
                                            <Link to="/invitados">
                                            invitados{" "}
                                            </Link>
                                            / Agregar invitado
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div id="sweet" className="container-fluid">
                            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link active" id="pills-datos-tab" data-toggle="pill" href="#pills-datos" role="tab" aria-controls="pills-datos" aria-selected="true">Datos</a>
                                </li>

                            </ul>

                            <hr className="line-gray"/>

                            <form id="form-add-usuario" className="form-change-password form" encType="multipart/form-data" onSubmit={this.handleSubmit}>
                                <div className="tab-content" id="pills-tabContent">
                                    <div className="tab-pane fade show active" id="pills-datos" role="tabpanel" aria-labelledby="pills-datos-tab">

                                    <div className="form-group row">
                                            <label className="col-sm-4 col-form-label col-form-label-sm">Evento</label>
                                            <div className="col-sm-4">
                                                <select className="form-control form-control-sm" id="evento" name="evento" value={this.state.evento} onChange={this.handleEvento} required>
                                                {this.state.eventos.map(
                                                    (e, index) => {
                                                        return (
                                                            <option value={e._id} key={index}>{e.Nombre}</option>
                                                        )
                                                    }
                                                )}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-4 col-form-label col-form-label-sm">Nombre</label>
                                            <div className="col-sm-4">
                                                <input
                                                  type="text"
                                                  className="form-control form-control-sm"
                                                  id="nombre"
                                                  name="nombre"
                                                  placeholder="Ingrese el nombre"
                                                  value={this.state.nombre}
                                                  onChange={this.handleChange}
                                                  required
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-4 col-form-label col-form-label-sm">Apellido</label>
                                            <div className="col-sm-4">
                                                <input 
                                                  type="text" 
                                                  className="form-control form-control-sm" 
                                                  id="apellido" 
                                                  name="apellido" 
                                                  placeholder="Ingrese el apellido" 
                                                  value={this.state.apellido} 
                                                  onChange={this.handleChange} 
                                                  required
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-4 col-form-label col-form-label-sm">Correo</label>
                                            <div className="col-sm-4">
                                                <input 
                                                  type="text" 
                                                  className="form-control form-control-sm" 
                                                  id="correo" 
                                                  name="correo" 
                                                  placeholder="Ingrese el correo" 
                                                  value={this.state.correo} 
                                                  onChange={this.handleChange}
                                                  required
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-4 col-form-label col-form-label-sm">Teléfono</label>
                                            <div className="col-sm-4">
                                                <input 
                                                  type="text" 
                                                  className="form-control form-control-sm" 
                                                  id="telefono" 
                                                  name="telefono" 
                                                  placeholder="Ingrese el telefono" 
                                                  value={this.state.telefono} 
                                                  onChange={this.handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-4 col-form-label col-form-label-sm">Grupo de invitados</label>
                                            <div className="col-sm-4">
                                                <select className="form-control form-control-sm" id="grupo" name="grupo" value={this.state.grupo} onChange={this.handleChange} required>
                                                    <option value="">-Seleccione-</option>
                                                    {this.state.grupos.map((e, index) => {
                                                        return (
                                                            <option value={e._id} key={index}>{e.Nombre}</option>
                                                        )
                                                    
                                                    }
                                                    )
                                                }
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-4 col-form-label col-form-label-sm">Etapas del Evento</label>
                                            <div className="col-sm-4">
                                                <select className="form-control form-control-sm" id="etapasSeleccionadas" name="etapasSeleccionadas" value={this.state.etapasSeleccionadas} onChange={this.handleChangeMulti} multiple="multiple">
                                                {this.state.etapas.map(
                                                    (e, index) => {
                                                        return (
                                                            <option value={e._id} key={index}>{e.Nombre}</option>
                                                        )
                                                    }
                                                )}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                          <label htmlFor="example-number-input" className="col-4 col-form-label">invitados adicionales:</label>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="example-number-input" className="col-4 col-form-label">Mayores</label>
                                            <div className="col-4">
                                                <input 
                                                  className="form-control" 
                                                  type="number" 
                                                  name="invitadosAdicionalesMayores" 
                                                  value={this.state.invitadosAdicionalesMayores} 
                                                  id="invitadosAdicionalesMayores" 
                                                  onChange={this.handleChange} 
                                                  min="0"
                                                  required
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label htmlFor="example-number-input" className="col-4 col-form-label">Menores(12 años)</label>
                                            <div className="col-4">
                                              <input 
                                                className="form-control" 
                                                type="number" 
                                                name="invitadosAdicionalesMenores" 
                                                value={this.state.invitadosAdicionalesMenores} 
                                                id="invitadosAdicionalesMenores" 
                                                onChange={this.handleChange} 
                                                min="0"
                                                required
                                              />
                                            </div>
                                        </div>


                                    </div>

                                </div>

                                <div className="form-group row">
                                    <div className="col-sm-4">
                                        <button type="submit" id="save-invitado" className="btn btn-sm btn-dark mr-2">Guardar</button>
                                        <Link to="/invitados"><button type="button" className="btn btn-sm btn-dark">Volver</button></Link>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            );
        }
    }
}
