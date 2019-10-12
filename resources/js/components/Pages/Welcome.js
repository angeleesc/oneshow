import React, { Component } from "react";
import Menu from "../components/Menu";
import Header from "../components/Header";

export default class Welcome extends Component {
    constructor(props) {
      super(props);
      
      this.state = {
          url: "",
          correo: "",
          password: "",
          opcion: "Dashboard",
          footer: "Footer",
          user: JSON.parse(localStorage.getItem('usuario')),
          api_token: JSON.parse(localStorage.getItem('usuario')),
          isLoading: false
      };
    }

    componentWillMount() {
        /**esto estaba en el template de welcome */
        localStorage.setItem("auto_load_agenda", "0");
    }

    render() {
        return (
            <div>
                <Menu usuario={this.state.user} />
                <Header
                    usuario={this.state.user}
                    history={this.props.history}
                />
                <div className="content-wrapper">
                    <header className="page-header">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-sm-12 col-md-12">
                                    <h1 className="page-header-heading">
                                        <i className="fas fa-tachometer-alt page-header-heading-icon" />
                                        {this.state.opcion}
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div id="sweet" className="container-fluid">
                        <div className="col-lg-12">
                            <div className="widget widget-default">
                                <div className="widget-body">
                                    <div
                                        className="alert alert-success"
                                        role="alert"
                                    >
                                        <i className="fas fa-info-circle" />
                                        &nbsp;
                                        <strong>Bienvenido</strong> a ONE Show
                                        Console.
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/**esto de abajo es de php, es el texto que cambia con el menu */}
                        <footer className="content-wrapper-footer">
                            <span>{this.state.footer}</span>
                        </footer>
                    </div>
                </div>
            </div>
        );
    }
}
