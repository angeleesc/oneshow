import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from "react";
import Fullscreen from "react-full-screen";
import Clock from "react-live-clock";
import Header from "../components/Header";
import Menu from "../components/Menu";
import EmptyMultimedia from "../components/Multimedia/EmptyMultimedia";
import { getTimestampDiff } from './../../redux/actions/app';

class Album extends Component {
    constructor() {
        super();
        this.state = {
          mosaic: '',
          color:'#ffffff',
          usuario: JSON.parse(localStorage.getItem("usuario")),
          permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
          api_token: localStorage.getItem("api_token"),
          opcion: "Multimedia",
          zonaevento: "Etc/GMT+4",
          isFull: false,
          startTime: new Date(),
          endTime: new Date(),
          isOpenStartTime: false,
          isOpenEndTime: false,
          isLoading: true
        };
        /**
         * Desclarando las funciones que daran uso al state del constructor de esta clase
         */
        this.handleCompanyChange = this.handleCompanyChange.bind(this);
        this.handleEventChange = this.handleEventChange.bind(this);

    }

    componentDidMount () {
      // Fetching event
      this.props.getCompanies()
        .then(() => this.setState({ isLoading: false }));

      this.props.getTimestampDiff()
        .then(() => console.log('Server time fetched'));
    }

    handleCompanyChange (e) {
      const { value } = e.target;

      if (!value) {
        this.props.setCompany('');
        this.props.setEvent('');
      
      } else {
        
        this.props.setCompany(value);
        this.props.getEventsFromCompany(value);
      }
    }

    handleEventChange (e) {
      const { value } = e.target;
      if (!value) {
        return this.props.setEvent('');
      }

      axios
      .post(
          "api/biblioteca/evento/files/mosaic",
          { 
            evento: value ? value : '',
            company: this.props.companyId
          },
          {
              headers: {
                Authorization: this.state.api_token
              }
          }
      )
      .then((res) => {
        
        this.setState({ 
          mosaic: res.data.response
        });
      });

      this.props.setEvent(value);
      // this.props.getEnvios(value);
    }

  render () {
    if (this.state.isLoading)
      return null;
  
    return (
      <React.Fragment>
        <Menu usuario={this.state.user} />
        <Header usuario={this.state.user} history={this.props.history} />
        <div className="content-wrapper">
          <header className="page-header">
            <div className="container-fluid">
              <div className="row align-items-center">
                <div className="col-sm-3">
                  <h4 className="text-center my-0">
                    <i className="fas fa-compact-disc" /> Album
                  </h4>
                </div>
                <div className="col-sm-5">
                  <form>
                    <div className="form-row">
                      <div className="col">
                        <select
                          name="company"
                          className="form-control form-control-sm"
                          onChange={this.handleCompanyChange}
                          value={this.state.company}
                        >
                          <option value="">Selecione una Empresa</option>
                          {this.props.companies.map(company => (
                            <option key={company.id} value={`${company.id}`}>
                              {company.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col">
                        <select 
                          name="event"
                          className="form-control form-control-sm" 
                          onChange={this.handleEventChange}
                          value={this.props.eventId}
                        >
                          <option value="">Seleccione un Evento</option>
                          {this.props.eventos.map(event => (
                            <option key={event.id} value={`${event.id}`}>
                              {event.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="col-md-1">
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                    subir
                  </button>
                  
                   </div>
                <div className="col-md-2 text-center">
                  <i className="fas fa-clock" /> {`  `}
                  <Clock
                    format="HH:mm:ss A"
                    ticking={true}
                    timezone={this.state.zonaevento}
                  />
                </div>

              
                                



                <div className="col-md-1 text-center">
                  <span style={{ cursor: 'pointer' }}>
                    <FontAwesomeIcon
                      onClick={() => this.props.toggleFullscreen()}
                      icon="expand-arrows-alt"
                      color="#fff" 
                    />
                  </span>
                </div>
              </div>
            </div>
          </header>
          <Fullscreen 
            enabled={this.props.fullscreen}
            onChange={isFull => this.props.setFullscreenState(isFull)}
          >
            <div id="sweet" className="">
              {
                this.props.eventId === '' 
                ? 
                  (
                    <EmptyMultimedia/>
                  )
                :
                  (
                    <div className="section-empty">
                        {
                          this.state.mosaic == '' 
                            ?
                              <h1 className="text-center text-white">
                                Mosaico no disponible
                              </h1>
                              : 
                              ''
                        }
                        {
                          this.state.mosaic == 'generando' 
                            ?
                              <h1 className="text-center text-white">
                                Generando Mosaico
                              </h1>
                            :
                              <img 
                                className="" 
                                src={this.state.mosaic}
                                style={{ width: "100%" }}
                              ></img>
                        }
                    </div>
                  )
              }
            </div>

            {/* albumapi modal */}

            

          </Fullscreen>
        </div>
      </React.Fragment>
    );
    }
}

const mapStateToProps = state => ({
  fullscreen: state.app.fullscreen,
  companyId: state.multimedia.companyId,
  eventId: state.multimedia.eventId,
  companies: state.multimedia.companies,
  eventos: state.multimedia.eventos,
  sectores: state.multimedia.sectores,
  envios: state.multimedia.jobs,
  tool: state.multimedia.tool
});

const mapDispatchToProps = dispatch => ({
  getTimestampDiff: () => dispatch(getTimestampDiff()),
  toggleFullscreen: () => dispatch(toggleFullscreen()),
  setFullscreenState: (state) => dispatch(setFullscreenState(state)),
  setCompany: (companyId) => dispatch(setCompany(companyId)),
  setEvent: (eventId) => dispatch(setEvent(eventId)),
  getCompanies: () => dispatch(getCompanies()),
  getEnvios: (eventId) => dispatch(getJobs(eventId)),
  getEvents: (userId, apiToken) => dispatch(getEventos(userId, apiToken)),
  getEventsFromCompany: (companyId) => dispatch(getEventsFromCompany(companyId)),
  createJob: (eventId, job, apiToken) => dispatch(createJob(eventId, job, apiToken))
});

export default connect(mapStateToProps, mapDispatchToProps)(Album);