import React, { Component } from "react";
import axios from "axios";
import Menu from "../../../../components/Menu";
import Header from "../../../../components/Header";
import { Link } from "react-router-dom";

export default class Show extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: JSON.parse(localStorage.getItem("usuario")),
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            empresas: JSON.parse(localStorage.getItem("empresas")),
            idInvitado: this.props.location.state.invitado_id,
            idEvento: this.props.location.state.evento_id,
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
        
    }

    componentDidMount() {
        axios.get("api/eventos",{
            headers: {
                Authorization: this.state.api_token
            }
        }).then(res => {
            console.log(res)
            this.setState({
                eventos:res.data.eventos
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
                    axios.post("api/invitados/one",{
                        invitado_id:this.state.idInvitado,
                        evento_id:this.state.idEvento
                    },{
                        headers: {
                            Authorization: this.state.api_token
                        }
                    }).then(res=>{
                        let r = res.data.invitado;
                        console.log(r.etapas)
                        var etapas = [];
                        for(var i=0;i<r.etapas.length;i++){
                            console.log("estoy aqui en "+i)
                            console.log(r.etapas[i])
                            console.log(r.etapas[i].$oid)
                            etapas.push(r.etapas[i].$oid)
                        }
                        axios.get("api/etapas/evento/"+r.evento_id,{
                            headers: {
                                Authorization: this.state.api_token
                            }
                        }).then(res=>{
                            console.log(res);
                            this.setState({
                                etapas:res.data.etapas
                            })
                        })
                        this.setState({
                            nombre : r.nombre,
                            apellido: r.apellido,
                            grupo:r.grupo_id,
                            evento: r.evento_id,
                            correo: r.correo,
                            etapasSeleccionadas: etapas,
                            telefono: r.telefono,
                            idEventoInvitado: r.id,
                            isLoading: false
                        });
                    })
            })
            
        });
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
                                            <i className="fas fa-calendar-week page-header-heading-icon" />
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
                                            <i className="fas fa-calendar-week page-header-heading-icon" />
                                            &nbsp; 
                                            <Link to="/invitados">
                                            invitados{" "}
                                            </Link>
                                            / Mostrar invitado
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
                                                <select className="form-control form-control-sm" id="evento" name="evento" defaultValue={this.state.evento} disabled>
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
                                                <input type="text" className="form-control form-control-sm" id="nombre" name="nombre" placeholder="Ingrese el nombre" value={this.state.nombre} disabled />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-4 col-form-label col-form-label-sm">Apellido</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="apellido" name="apellido" placeholder="Ingrese el apellido" value={this.state.apellido} disabled />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-4 col-form-label col-form-label-sm">Correo</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="correo" name="correo" placeholder="Ingrese el correo" value={this.state.correo} disabled/>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-4 col-form-label col-form-label-sm">Teléfono</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="telefono" name="telefono" placeholder="Ingrese el telefono" value={this.state.telefono} disabled/>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-4 col-form-label col-form-label-sm">Grupo de invitados</label>
                                            <div className="col-sm-4">
                                                <select className="form-control form-control-sm" id="grupo" name="grupo" defaultValue={this.state.grupo} disabled>
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
                                            <label className="col-sm-4 col-form-label col-form-label-sm">Accesos de evento</label>
                                            <div className="col-sm-4">
                                                <select className="form-control form-control-sm" id="etapasSeleccionadas" name="etapasSeleccionadas" defaultValue={this.state.etapasSeleccionadas} disabled multiple="multiple" >
                                                {this.state.etapas.map((e, index) => {
                                                        
                                                        
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
                                            <label className="col-sm-4 col-form-label col-form-label-sm">Invitados Adicionales</label>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-4 col-form-label col-form-label-sm">Mayores</label>
                                            <div className="col-sm-1">
                                                {this.state.cantidadMayores}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-4 col-form-label col-form-label-sm">Menores(12 años)</label>
                                            <div className="col-sm-1">
                                                {this.state.cantidadMenores}
                                            </div>
                                        </div>


                                    </div>

                                </div>

                                <div className="form-group row">
                                    <div className="col-sm-4">
                                        

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
