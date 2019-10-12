import React, { Component } from "react";
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link, withRouter } from "react-router-dom";
import { getUserScope } from './../../redux/actions/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Menu extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      url: "",
      guests: {
        open: false,
      },
      config: {
        open: false,
      },
      usuario: this.props.usuario,
      permisosUsuario: {},
      api_token: localStorage.getItem("api_token"),
      isLoading: true
    };

    this.isActive = this.isActive.bind(this);
  }

  componentDidMount () {
    const guestsPaths = ['/invitacion', '/invitados', '/asientos'];
    const configPaths = ['/biblioteca', '/empresas', '/invitados', '/grupos', '/menu-gastronómico', '/usuarios']
    
    this.props.getUserScope().then(({ Nombre, Permisos}) => this.setState({
      isLoading: false,
      permisosUsuario: {
        nombre: Nombre,
        permisos: Permisos,
      }
    }, () => localStorage.setItem('permisosUsuario', JSON.stringify({ 
      nombre: Nombre,
      permisos: Permisos,
    }))))
    .catch(err => {
      console.log('err', err);
    });

    for (let path of guestsPaths) {
      if (path === this.props.match.path) {
        return this.setState({
          guests: { open: true }
        });
      }
    }

    for (let path of configPaths) {
      if (path === this.props.match.path) {
        return this.setState({
          config: { open: true }
        });
      }
    }
  }

  isActive (path) {
    return path === this.props.match.path ? ' active' : '';
  }

  render() {
    if (this.state.isLoading)
      return null;

    const permisos = this.props.scope;

    if (!permisos.multimedia) {
        permisos.multimedia = [];
    }
    if (!permisos.biblioteca) {
        permisos.biblioteca = [];
    }
    if (!permisos.angenda) {
        permisos.agenda = [];
    }
    if (!permisos.empresa) {
        permisos.empresa = [];
    }
    if (!permisos.cliente) {
        permisos.cliente = [];
    }
    if (!permisos.monitor) {
        permisos.monitor = [];
    }
    if (!permisos.usuario) {
        permisos.usuario = [];
    }
    if (!permisos.etapas) {
        permisos.etapas = [];
    }
    if (!permisos.angenda) {
        permisos.agenda = [];
    }
    if (!permisos.platos) {
        permisos.platos = [];
    }

    const { guests, config } = this.state;
    
    return (
      <aside className="left-sidebar">
        <ul className="sidebar-nav mt-3">
          <li className={'sidebar-nav-link' + this.isActive('/welcome')}>
            <Link to="/welcome">
              <i className="fas fa-tachometer-alt sidebar-nav-link-logo" /> {" "}
              Dashboard
            </Link>
          </li>
          {permisos.multimedia.includes("show") && (
            <li className={'sidebar-nav-link' + this.isActive('/multimedia')}>
              <Link to="/multimedia">
                <i className="fas fa-compact-disc sidebar-nav-link-logo" /> {" "}
                Luces & Sonido
              </Link>
            </li>
          )}
          <li className={'sidebar-nav-link sidebar-nav-link-group' + (guests.open ? ' active' : '')}>
            <a 
              href="/invitacion" 
              onClick={e => {
                e.preventDefault();
                this.setState(state => ({ guests: { open: !state.guests.open }}))
              }}
            >
              <span className="sidebar-nav-link-logo">
                <FontAwesomeIcon icon="user-friends"/> {` `}
              </span>
              Invitados
              {guests.open ? (
                <span className="fa fa-chevron-down subnav-toggle-icon subnav-toggle-icon-opened" />
              ) : (
                <span className="fa fa-chevron-right subnav-toggle-icon subnav-toggle-icon-closed" />
              )}
            </a>
            <div className="row">
              <div className={'collapse multi-collapse offset-1' + (guests.open ? ' show' : '')}>
                <ul className="sidebar-nav">
                  <li className="sidebar-nav-link">
                    <Link to="/invitacion">
                      <i className="fas fa-envelope-open-text sidebar-nav-link-logo" />{" "}
                      Invitación
                    </Link>
                  </li>
                  <li className="sidebar-nav-link">
                    <Link to="/invitados">
                      <i className="fas fa-user-friends sidebar-nav-link-logo" />{" "}
                      Invitados
                    </Link>
                  </li>
                  <li className="sidebar-nav-link">
                      <Link to="/invitados/asientos">
                          <i className="fas fa-chair sidebar-nav-link-logo" />{" "}
                          Asientos
                      </Link>
                  </li>
                  {/* <li className="sidebar-nav-link">
                      <a href="{{ route('invitados.regalo') }}">
                          <i className="fas fa-gift sidebar-nav-link-logo" />{" "}
                          Regalos
                      </a>
                  </li> */}
                </ul>
              </div>
            </div>
          </li>
          <li className={'sidebar-nav-link' + this.isActive('/social-wall')}>
            <Link
              to={{
                  pathname: "/social-wall",
                  state: {
                    usuario: JSON.parse(localStorage.getItem("usuario")),
                    api_token: localStorage.getItem("api_token")
                  }
              }}
            >
              <span className="sidebar-nav-link-logo">
                <FontAwesomeIcon icon="photo-video" /> {" "}
              </span>
              Social Wall
            </Link>
          </li>
          <li className={'sidebar-nav-link sidebar-nav-link-group' + (config.open ? ' active' : '')}>
            <a 
              href="/configuracion"
              onClick={e => {
                e.preventDefault();
                this.setState(state => ({ config: { open: !state.config.open }}))
              }}
            >
              <span className="sidebar-nav-link-logo">
                <FontAwesomeIcon icon="tools"/> {` `}
              </span>
              Configuracion
              {config.open ? (
                <span className="fa fa-chevron-down subnav-toggle-icon subnav-toggle-icon-opened" />
              ) : (
                <span className="fa fa-chevron-right subnav-toggle-icon subnav-toggle-icon-closed" />
              )}
            </a>
            <div className="row">
              <div className={'collapse multi-collapse offset-1' + (config.open ? ' show' : '')}>
                <ul className="sidebar-nav">
                  {permisos.biblioteca.includes("show") &&
                    <li className="sidebar-nav-link">
                      <Link to="/biblioteca">
                        <i className="fas fa-book sidebar-nav-link-logo" />{" "}
                        Biblioteca
                      </Link>
                    </li>
                  }
                  {permisos.empresa.includes("show") && 
                    <li className="sidebar-nav-link">
                      <Link to="/empresas">
                        <i className="fas fa-industry sidebar-nav-link-logo" />{" "}
                        Empresas
                      </Link>
                    </li>
                  }
                  {permisos.cliente.includes("show") &&
                    <li className="sidebar-nav-link">
                        <Link to="/invitados">
                            <i className="fas fa-user-tie sidebar-nav-link-logo" />{" "}
                            Invitados
                        </Link>
                    </li>
                  }
                  {this.state.permisosUsuario.nombre === "ADMINISTRADOR" &&
                    <li className="sidebar-nav-link">
                      <Link to="/grupos">
                        <i className="fas fa-users sidebar-nav-link-logo" />{" "}
                        Grupos
                      </Link>
                    </li>
                  }
                  {/* {permisos.monitor.includes("show") &&
                      <li className="sidebar-nav-link">
                           <Link to="/monitor">
                              <i className="fas fa-desktop sidebar-nav-link-logo" />{" "}
                              Monitor
                          </Link>
                      </li>
                  }
                  {permisos.usuario.includes("show") &&
                    <li className="sidebar-nav-link">
                      <Link to="/menu-gastronomico">
                        <i className="fas fa-coffee sidebar-nav-link-logo" />
                        Menu Gastronómico
                      </Link>
                    </li>
                  } */}
                  {permisos.usuario.includes("show") &&
                    <li className="sidebar-nav-link">
                      <Link to="/usuarios">
                        <i className="fas fa-user-cog sidebar-nav-link-logo" />{" "}
                        Usuarios
                      </Link>
                    </li>
                  }
                  {/* {permisos.agenda.includes("show") &&
                    <li className="sidebar-nav-link">
                      <a href="{{ route('configuracion.agenda') }}">
                        <i className="fas fa-address-book sidebar-nav-link-logo" />{" "}
                        Agendas
                      </a>
                    </li>
                  }
                  {permisos.etapas.includes("show") &&
                    <li className="sidebar-nav-link">
                      <a href="{{ route('configuracion.menug_etapas') }}">
                        <i className="fas fa-folder-open sidebar-nav-link-logo" />{" "}
                        Menú Etapas
                      </a>
                    </li>
                  }
                  {permisos.platos.includes("show") &&
                    <li className="sidebar-nav-link">
                      <a href="{{ route('configuracion.menug_platos') }}">
                        <i className="fas fa-coffee sidebar-nav-link-logo" />{" "}
                        Menú Platos
                      </a>
                    </li>
                  } */}
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </aside>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  scope: state.auth.scope, 
});

const mapDispatchToProps = dispatch => ({
  getUserScope: () => dispatch(getUserScope())
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Menu);