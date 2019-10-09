import React, { Component } from "react";
import axios from "axios";
import logo from "../../../../public/images/logo-oneshow.png";
import { Link } from "react-router-dom";

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: "",
            usuario: this.props.usuario,
            api_token: localStorage.getItem("api_token"),
            isLoading: false
        };
        this.handleLogut = this.handleLogut.bind(this);
    }

    handleLogut(e) {
        e.preventDefault();
        let formData = new FormData();
        formData.append("api_token", this.state.api_token);
        $("#logout").prepend('<i class="fa fa-spinner fa-spin"></i> ');
        axios.post("api/logout", formData).then(res => {
            if (res.data.code == "200") {
                console.log(this.props);
                localStorage.clear();
                this.props.history.push("/");
            }
        });
    }

    handleClick() {
        var body = document.getElementsByTagName("body")[0];
        if (body.className == "sidebar-closed-md") {
            body.className = "";
        } else {
            body.className = "sidebar-closed-md";
        }
    }

    render() {
        if (this.state.isLoading) {
            return "";
        } else {
            if (!this.state.usuario) {
                this.state.usuario = JSON.parse(
                    localStorage.getItem("usuario")
                );
            }
            return (
                <header className="top-header">
                    <Link to="/welcome" className="top-header-logo">
                        <img className="logo-inside" src={logo} />
                    </Link>
                    <nav
                        id="navbar-principal"
                        className="navbar navbar-default"
                    >
                        <div className="container-fluid">
                            <div className="navbar-header">
                                <button
                                    type="button"
                                    className="navbar-sidebar-toggle"
                                    onClick={this.handleClick}
                                    data-toggle-sidebar
                                >
                                    <span className="fas fa-arrow-left fa-xs icon-arrow visible-sidebar-sm-open" />
                                    <span className="fas fa-arrow-right fa-xs icon-arrow visible-sidebar-sm-closed" />
                                    <span className="fas fa-arrow-left fa-xs icon-arrow visible-sidebar-md-open" />
                                    <span className="fas fa-arrow-right fa-xs icon-arrow visible-sidebar-md-closed" />
                                </button>
                            </div>

                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item dropdown">
                                    <a
                                        className="nav-link dropdown-toggle"
                                        href="#"
                                        id="navbarDropdownMenuLink"
                                        role="button"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                    >
                                        <i className="fas fa-user" />
                                        &nbsp;
                                        {this.state.usuario.Correo}
                                        {/*{ Str::limit(Auth::user()->nameMail(), 15) }*/}
                                    </a>
                                    <div
                                        className="dropdown-menu dropdown-menu-right dropdown-menu-sm-right"
                                        aria-labelledby="navbarDropdownMenuLink"
                                    >
                                        <Link
                                            className="dropdown-item"
                                            to="/cambiar-password"
                                        >
                                            <i className="fas fa-key" />
                                            &nbsp;Cambiar Contraseña
                                        </Link>
                                        <Link
                                            to="/"
                                            className="dropdown-item logout"
                                            style={{
                                                color: "#ccc"
                                            }}
                                            onClick={this.handleLogut}
                                        >
                                            <i className="fas fa-sign-out-alt" />
                                            &nbsp;Salir
                                        </Link>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </header>
            );
        }
    }
}
