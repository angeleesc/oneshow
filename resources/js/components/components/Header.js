import React, { Component } from "react";
import logo from "../../../../public/images/logo-oneshow.png";
import { Link } from "react-router-dom";
import { logout, userLoggedOut } from './../../redux/actions/auth';
import { toggleSidebar } from './../../redux/actions/app';
import { connect } from 'react-redux';

class Header extends Component {
    constructor(props) {
      super(props);
      this.state = {
        url: "",
        usuario: this.props.usuario,
        api_token: localStorage.getItem("api_token"),
        isLoading: false
      };
      
      this.handleLogut = this.handleLogut.bind(this);
      this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount () {
      if(this.props.isSidebarOpen) {
        const [ body ] = document.getElementsByTagName('body');
        body.className = '';
      }
    }

    handleLogut(e) {
      e.preventDefault();

      this.props.logout().then(() => {
        this.props.history.push("/");
        this.props.userLoggedOut();
        localStorage.clear();
      });
    }

    handleClick() {
      const [ body ] = document.getElementsByTagName("body");

      if (this.props.isSidebarOpen) {
        body.className = "sidebar-closed-md";
      } else {
        body.className = "";
      }

      this.props.toggleSidebar();
    }

  render () {
    if (this.props.user === null)
      return null;

    return (
      <header className="top-header">
        <Link to="/welcome" className="top-header-logo">
            <img className="logo-inside" src={logo} />
        </Link>
        <nav id="navbar-principal" className="navbar navbar-default">
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
                      <i className="fas fa-user" />{` `}{this.props.user.email}
                  </a>
                  <div
                    className="dropdown-menu dropdown-menu-right dropdown-menu-sm-right"
                    aria-labelledby="navbarDropdownMenuLink"
                  >
                    <Link to="/cambiar-password" className="dropdown-item">
                      <i className="fas fa-key" />{` `}Cambiar Contraseña
                    </Link>
                    <Link to="/" className="dropdown-item logout" onClick={this.handleLogut}>
                      <i className="fas fa-sign-out-alt" />{` `}Salir
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

const mapStateToProps = state => ({
  user: state.auth.user,
  isSidebarOpen: state.app.isSidebarOpen
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  userLoggedOut: () => dispatch(userLoggedOut()),
  toggleSidebar: () => dispatch(toggleSidebar()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
