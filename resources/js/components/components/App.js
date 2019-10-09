import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./../../redux";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import Alert from './../molecules/Alert';
import Loader from "./../atoms/Loader";
/**
 * A continuacion se importan todos los componentes que seran
 * utili ados como paginas y rutas del front end
 */
import Login from "../Pages/Login";
import Welcome from "../Pages/Welcome";
import Multimedia from "../Pages/Multimedia";
import Biblioteca from "../Pages/configuracion/Biblioteca/Biblioteca";
import ViewEventoBiblioteca from "../Pages/configuracion/Biblioteca/Show";
import AddEventoBiblioteca from "../Pages/configuracion/Biblioteca/Add";
import Empresas from "../Pages/configuracion/Empresas/Empresas";
import AddEmpresa from "../Pages/configuracion/Empresas/Add";
import ShowEmpresas from "../Pages/configuracion/Empresas/Show";
import EditEmpresas from "../Pages/configuracion/Empresas/Edit";
import Eventos from "../Pages/configuracion/Eventos/Eventos";
import EventosAdd from "../Pages/configuracion/Eventos/Add";
import EventoEdit from "../Pages/configuracion/Eventos/Edit";
import EventoShow from "../Pages/configuracion/Eventos/Show";
import Usuarios from "../Pages/configuracion/Usuarios/Usuarios";
import UsuariosAdd from "../Pages/configuracion/Usuarios/Add";
import UsuariosEdit from "../Pages/configuracion/Usuarios/Edit";
import UsuariosShow from "../Pages/configuracion/Usuarios/Show";
import Invitacion from "../Pages/configuracion/Invitados/invitacion/invitacion";
import InvitacionShow from "../Pages/configuracion/Invitados/invitacion/Show";
import InvitacionAdd from "../Pages/configuracion/Invitados/invitacion/Add";
import Invitados from "../Pages/configuracion/Invitados/invitados/Invitados";
import InvitadosAdd from "../Pages/configuracion/Invitados/invitados/Add";
import InvitadosShow from "../Pages/configuracion/Invitados/invitados/Show";
import InvitadosEdit from "../Pages/configuracion/Invitados/invitados/Edit";
import Grupos from "../Pages/configuracion/Grupos/Grupos";
import GruposAdd from "../Pages/configuracion/Grupos/Add";
import GruposEdit from "../Pages/configuracion/Grupos/Edit";
import Etapas from "../Pages/configuracion/Eventos/Etapas/Etapas";
import EtapasAdd from "../Pages/configuracion/Eventos/Etapas/Add";
import EtapasEdit from "../Pages/configuracion/Eventos/Etapas/Edit";
import MailConfirmation from "../Pages/configuracion/MailConfirmation/MailConfirmation";
import MailAsiento from "../Pages/configuracion/MailAsiento/MailAsiento";
import Planos from "../Pages/configuracion/Planos/Planos";
import PlanosAdd from "../Pages/configuracion/Planos/Add";
import PlanosEdit from "../Pages/configuracion/Planos/Edit";
import Asientos from "../Pages/configuracion/Invitados/asientos/Asientos";
import SeleccionPlanos from "../Pages/configuracion/Invitados/asientos/SeleccionPlanos";
import SeleccionAsientos from "../Pages/configuracion/Invitados/invitados/SeleccionAsientos";
import PlanoBase from "../Pages/configuracion/PlanoBase/PlanoBase";
import PlanoBaseAdd from "../Pages/configuracion/PlanoBase/Add";
import PlanoBaseEdit from "../Pages/configuracion/PlanoBase/Edit";
import PlanosBaseCopia from "../Pages/configuracion/Planos/PlanosBaseCopia";
import PlanoCopiaAdd from "../Pages/configuracion/Planos/PlanosBaseCopiaAdd";
import MenuGastronomico from "../Pages/configuracion/MenuGastronomico/MenuGastronomico";
import EdicionAsiento from "../Pages/configuracion/Invitados/invitados/EdicionAsiento";
import SocialWall from "../Pages/SocialWall";
import RecuperarPassword from './RecuperarPassword';
import ChangePassword from './ChangePassword';
import NewPassword from './../Pages/NewPassword';

library.add(fas);

function App () {
  const { alert } = store.getState();

    return (
        <Provider store={store}>
          <React.Fragment>
            <BrowserRouter>
                <Switch>
                    {/**A continuacion se presentan todas las rutas registradas del front end
              asi como sus respectivos componentes renderi ados en cada una */}
                    <Route exact path="/" component={Login} />
                    <Route exact path="/welcome" component={Welcome} />
                    <Route exact path="/multimedia" component={Multimedia} />
                    <Route exact path="/social-wall" component={SocialWall} />
                    <Route exact path="/biblioteca" component={Biblioteca} />
                    <Route exact path="/cambiar-password" component={ChangePassword} />
                    <Route exact path="/recover-password" component={RecuperarPassword} />
                    <Route exact path="/user/change/password/:token" component={NewPassword} />
                    <Route
                        exact
                        path="/biblioteca/evento/:id"
                        component={ViewEventoBiblioteca}
                    />
                    <Route
                        exact
                        path="/biblioteca/evento/add-file/:id"
                        component={AddEventoBiblioteca}
                    />
                    <Route exact path="/empresas" component={Empresas} />
                    <Route exact path="/empresas/add" component={AddEmpresa} />
                    <Route
                        exact
                        path="/empresas/show/:id"
                        component={ShowEmpresas}
                    />
                    <Route
                        exact
                        path="/empresas/edit/:id"
                        component={EditEmpresas}
                    />
                    <Route
                        exact
                        path="/empresas/planos-base/:id"
                        component={PlanoBase}
                    />
                    <Route
                        exact
                        path="/empresa/planos-base/add"
                        component={PlanoBaseAdd}
                    />

                    <Route
                        exact
                        path="/empresa/planos-base/edit/:id"
                        component={PlanoBaseEdit}
                    />
                    <Route
                        exact
                        path="/empresa/eventos/:id"
                        component={Eventos}
                    />
                    <Route
                        exact
                        path="/eventos/add/:id"
                        component={EventosAdd}
                    />
                    <Route
                        exact
                        path="/eventos/edit/:id"
                        component={EventoEdit}
                    />
                    <Route
                        exact
                        path="/eventos/show/:id"
                        component={EventoShow}
                    />
                    <Route
                        exact
                        path="/eventos/etapas/:id"
                        component={Etapas}
                    />
                    <Route
                        exact
                        path="/eventos/etapas/add/:id"
                        component={EtapasAdd}
                    />
                    <Route
                        exact
                        path="/eventos/etapas/edit/:id"
                        component={EtapasEdit}
                    />
                    <Route
                        exact
                        path="/evento/planos/planos-base-copia/:id"
                        component={PlanosBaseCopia}
                    />
                    <Route
                        exact
                        path="/evento/plano/copia/"
                        component={PlanoCopiaAdd}
                    />
                    <Route
                        exact
                        path="/eventos/planos/:id"
                        component={Planos}
                    />
                    <Route
                        exact
                        path="/eventos/planos/add/:id"
                        component={PlanosAdd}
                    />
                    <Route
                        exact
                        path="/eventos/planos/edit/:id"
                        component={PlanosEdit}
                    />
                    <Route exact path="/usuarios" component={Usuarios} />
                    <Route exact path="/usuarios/add" component={UsuariosAdd} />
                    <Route
                        exact
                        path="/usuarios/edit/:id"
                        component={UsuariosEdit}
                    />
                    <Route
                        exact
                        path="/usuarios/show/:id"
                        component={UsuariosShow}
                    />
                    <Route exact path="/invitacion" component={Invitacion} />
                    <Route
                        exact
                        path="/invitacion/show/:id"
                        component={InvitacionShow}
                    />
                    <Route
                        exact
                        path="/invitacion/add"
                        component={InvitacionAdd}
                    />
                    <Route exact path="/invitados" component={Invitados} />
                    <Route
                        exact
                        path="/invitados/add"
                        component={InvitadosAdd}
                    />
                    <Route
                        exact
                        path="/invitados/edit/"
                        component={InvitadosEdit}
                    />
                    <Route
                        exact
                        path="/invitados/show/"
                        component={InvitadosShow}
                    />

                    <Route
                        exact
                        path="/invitados/asientos/"
                        component={Asientos}
                    />
                    <Route
                        exact
                        path="/asientos/planos/"
                        component={SeleccionPlanos}
                    />
                    <Route
                        exact
                        path="/planos/seleccion-asiento/"
                        component={SeleccionAsientos}
                    />
                    <Route
                        exact
                        path="/planos/edicion-asiento/"
                        component={EdicionAsiento}
                    />
                    <Route exact path="/grupos" component={Grupos} />
                    <Route exact path="/grupos/add" component={GruposAdd} />
                    <Route
                        exact
                        path="/grupos/edit/:id"
                        component={GruposEdit}
                    />
                    <Route
                        exact
                        path="/mail/:id"
                        component={MailConfirmation}
                    />
                    <Route exact path="/event/:id" component={MailAsiento} />
                    <Route
                        exact
                        path="/menu-gastronomico/"
                        component={MenuGastronomico}
                    />
                </Switch>
            </BrowserRouter>
            <Alert/>
            <Loader/>
          </React.Fragment>
        </Provider>
    );
}

export default App;
