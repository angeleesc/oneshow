import axios from 'axios';
import swal from "sweetalert2";
import { Link } from "react-router-dom";
import { React, Component } from 'react';
import Fullscreen from "react-full-screen";
import Menu from "../Menu";
import Header from "../Header";


export default class SocialWall extends Component {

    constructor(props) {
        super(props);
        this.state = {
            footer: "Footer",
            opcion: "Empresas",
            estaCargando: false,
            enPantallaCompleta: false,
            api_token: localStorage.getItem("api_token"),
            usuario: JSON.parse(localStorage.getItem("usuario"))
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        return (
            <div>
                <Menu usuario={this.state.user} />
                <Header usuario={this.state.user} history={this.props.history} />
                <Fullscreen
                    enabled={this.state.enPantallaCompleta}
                    onChange={enPantallaCompleta => this.setState({enPantallaCompleta})}
                >
                    <div className="content-wrapper">
                        {/* <header className="page-header">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12 col-md-12">
                                        <h1 className="page-header-heading">
                                            <Link to="/empresas">
                                                Empresa
                                            </Link>{" "}
                                            {" "}
                                            <Link
                                                to={`/empresa/eventos/${
                                                    this.state.idEmpresa
                                                }`}
                                            >
                                                / Eventos
                                            </Link>{" "}
                                                / Redes Sociales
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </header> */}

                        <div id="sweet" className="container-fluid">
                            <iframe src="http://www.oneshow.com/Lib/"></iframe>
                        </div>

                        {/**esto de abajo es de php, es el texto que cambia con el menu */}
                        <footer className="content-wrapper-footer">
                            <span>{this.state.footer}</span>
                        </footer>
                    </div>
                </Fullscreen>
            </div>
        );
    }
}