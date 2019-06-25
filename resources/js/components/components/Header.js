import React, { Component } from "react";
import axios from "axios";
import logo from "../../../../public/images/logo-oneshow.png";

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: "",
            userId: this.props.userId,
            isLoading: true
        };
    }

    /*componentWillMount() {
        axios.get("api/usuario/" + this.state.userId).then(res => {
            console.log(res);
        });
    }*/

    render() {
        if (this.state.isLoading) {
            return "";
        } else {
            return (
                <header class="top-header">
                    <a href="#" class="top-header-logo">
                        <img class="logo-inside" src={logo} />
                    </a>

                    <nav id="navbar-principal" class="navbar navbar-default">
                        <div class="container-fluid">
                            <div class="navbar-header">
                                <button
                                    type="button"
                                    class="navbar-sidebar-toggle"
                                    data-toggle-sidebar
                                >
                                    <span class="fas fa-arrow-left fa-xs icon-arrow visible-sidebar-sm-open" />
                                    <span class="fas fa-arrow-right fa-xs icon-arrow visible-sidebar-sm-closed" />
                                    <span class="fas fa-arrow-left fa-xs icon-arrow visible-sidebar-md-open" />
                                    <span class="fas fa-arrow-right fa-xs icon-arrow visible-sidebar-md-closed" />
                                </button>
                            </div>

                            <ul class="navbar-nav ml-auto">
                                <li class="nav-item dropdown">
                                    <a
                                        class="nav-link dropdown-toggle"
                                        href="#"
                                        id="navbarDropdownMenuLink"
                                        role="button"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                    >
                                        <i class="fas fa-user" />
                                        &nbsp;
                                        {/*{ Str::limit(Auth::user()->nameMail(), 15) }*/}
                                    </a>
                                    <div
                                        class="dropdown-menu dropdown-menu-right dropdown-menu-sm-right"
                                        aria-labelledby="navbarDropdownMenuLink"
                                    >
                                        <a
                                            class="dropdown-item"
                                            href="{{ route('change-password') }}"
                                        >
                                            <i class="fas fa-key" />
                                            &nbsp;Cambiar Contraseña
                                        </a>
                                        <a
                                            class="dropdown-item"
                                            href="{{ route('logout') }}"
                                        >
                                            <i class="fas fa-sign-out-alt" />
                                            &nbsp;Salir
                                        </a>
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
