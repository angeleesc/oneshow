import React, { Component } from "react";
import Menu from "../components/Menu";
import Header from "../components/Header";
import Clock from "react-live-clock";
import Fullscreen from "react-full-screen";
import Live from './../organisms/Live';
import EmptyMultimedia from "../components/Multimedia/EmptyMultimedia";
import TabNavigation from './../organisms/TabNavigation';
import Ejecucion from "../components/Multimedia/Ejecucion";
import Cola from "../components/Multimedia/Cola";
import Herramientas from "../components/Multimedia/Herramientas";
import Parametros from "../components/Multimedia/Parametros";
import { connect } from 'react-redux';
import { 
  getEventos, 
  getCompanies, 
  getJobs, 
  createJob,
  setCompany,
  setEvent,
  getEventsFromCompany 
} from './../../redux/actions/multimedia';
import uuidv4 from 'uuid/v4';

class Multimedia extends Component {
    constructor() {
        super();
        this.state = {
          url: "",
          correo: "",
          password: "",
          eventos: [],
          envios:[],
          companyId: '',
          sectores: [],
          sector: '',
          archivo: '',
          fechainicio: '',
          fechafin: '',
          flash:'',
          flash2:'',
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
        this.handleChange = this.handleChange.bind(this);
        this.handleCompanyChange = this.handleCompanyChange.bind(this);
        this.handleEventChange = this.handleEventChange.bind(this);
        this.sendMqttCommand = this.sendMqttCommand.bind(this);
        this.removeMqttJob = this.removeMqttJob.bind(this);
        this.handleStartTime = this.handleStartTime.bind(this);
        this.handleEndTime = this.handleEndTime.bind(this);
        this.openStartTime = this.openStartTime.bind(this);
        this.openEndTime = this.openEndTime.bind(this);
        this.hideTimes = this.hideTimes.bind(this);

        this.mqttHost = 'mqtt.oneshow.com.ar';
        this.mqttPort = 11344;
        this.mqttClientId = uuidv4();
        this.mqttClient = new Paho.MQTT.Client(this.mqttHost, this.mqttPort, this.mqttClientId);
    }

    componentDidMount () {
      // Fetching event
      const { usuario, api_token } = this.state;

      this.setState({ isLoading: true });

      this.props.getCompanies()
        .then(() => this.setState({ isLoading: false }));

      // this.props.getEvents(usuario._id, api_token)
      //   .then(() => this.setState({ isLoading: false }));

      // Subscribing to broker
      this.mqttClient.connect({
        useSSL: true,
        onSuccess: () => console.log('Connected!!'),
        onFailure: e => console.log(e)
      })
    }

    componentWillUnmount () {
      this.mqttClient.disconnect();
    }

    /**
     * Funcion para enviar comandos o acciones a la cola del evento
     * @param {fecha de inicio del comando o accion} fechainicio 
     * @param {fecha final del comando evento o accion} fechafin 
     */
    sendMqttCommand (moment) {
      const { titleTool } = this.props.tool;
      const { companyId, eventId } = this.props;
      const { startTime, endTime, color, archivo, flash2 } = this.state;

      const topic = `/${companyId}/${eventId}`;
      let message = '';
      let payload = '';

      if (titleTool === 'colores' && !color)
        return console.log('Select a color');
      
      switch (titleTool) {
        case 'colores': 
          message = `COL,${moment},:id:,${color},${startTime.getTime()},${endTime.getTime()}`;
          payload = color;
          break;
        case 'flash':
          message = `FLH,${moment},:id:,${flash2},${startTime.getTime()},${endTime.getTime()}`;
          payload = flash2;
          break;
        case 'imagen':
          message = `IMG,${moment},:id:,${archivo},${startTime.getTime()},${endTime.getTime()}`;
          payload = archivo;
          break;
        case 'audio':
          message = `AUD,${moment},:id:,${archivo},${startTime.getTime()},${endTime.getTime()}`;
          payload = archivo;
          break;
        case 'video':
          message =  `VID,${moment},:id:,${archivo},${startTime.getTime()},${endTime.getTime()}`;
          payload = archivo;
          break;
        default:
          message = `MUL,${moment},:id:,${archivo},${startTime.getTime()},${endTime.getTime()}`;
          payload = archivo;
          break;
      }

      const job = {
        eventId,
        type: titleTool,
        status: 'ejecucion',
        startTime: startTime.getTime(),
        endTime: endTime.getTime(),
        payload
      }

      this.props.createJob(job, this.state.api_token)
        .then(jobId => {
          this.mqttClient.send(topic, message.replace(':id:', jobId));
        })
        .catch(e => {
          alert('Try again');
          
          console.log(e);
        })
    }

    /**
     * Metodo para quitar un comando de las acciones asociadas a ella
     * @param {id} ID del job a dejar de ejecutar 
     */
    removeMqttJob (id, type) {
      let jobType = '';

      switch (type) {
        case 'colores':
          jobType = 'COL';  
          break;
        case 'flash':
          jobType = 'FLH';
          break;
        case 'imagen':
          jobType = 'IMG';
          break;
        case 'audio':
          jobType = 'AUD';
          break;
        case 'video':
          jobType = 'VID';
          break;
      }
      const { companyId, eventId } = this.props;
      const topic = `/${companyId}/${eventId}`;
      const message = `REM,0,${id},${jobType}`;

      this.mqttClient.send(topic, message);
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

      this.props.setEvent(value);
      this.props.getEnvios(value);
    }

   /**
    * metodo para cambiar el state de las variables usadas en los inputs
    * @param {evento} e 
    */
    handleChange (e) {
      console.log('original handle change');
      if (e.target != undefined) {
        this.setState({
          [e.target.name]: e.target.value
        });

      } else if (e.hex != undefined) {  
        let colorDiv = document.getElementById("recuadro-color");
        colorDiv.style.backgroundColor=e.hex;
        
        this.setState({
            color: e.hex
        });
      }
    }

    openStartTime () {
      this.setState({ isOpenStartTime: true }, () => {
        document.querySelector(".wrapper").style.display="none";
      });
    }

    handleStartTime (time) {
      this.setState({startTime: new Date(time), isOpenStartTime: false}, () => {
        document.querySelector('.wrapper').style.display = 'block';
      });
    }
    
    handleEndTime (time) {
      this.setState({endTime: new Date(time), isOpenEndTime: false}, () => {
        document.querySelector('.wrapper').style.display = 'block';
      });
    };

    openEndTime () {
      this.setState({ isOpenEndTime: true }, () => {
        document.querySelector(".wrapper").style.display="none";
      });
    }

    hideTimes () {
      this.setState({ isOpenStartTime: false, isOpenEndTime: false }, () => {
        document.querySelector(".wrapper").style.display="block";
      });
    }

    /**
     * metodo para colocar hora de nuevo abierta
     */
    handleThemeToggle() {
        this.setState({ isOpenHora: true });            
        document.querySelector(".wrapper").style.display="none";
    }

    /**
     * metodo para colocar hora de nuevo abierta 2
     */
    handleThemeToggle2() {
        this.setState({ isOpenHora2: true });
        document.querySelector(".wrapper").style.display="none";
    } 

  render () {
    if (this.state.isLoading)
      return null;
  
    return (
      <Fullscreen
        enabled={this.state.isFull}
        onChange={isFull => this.setState({ isFull })}
      >
        <Menu usuario={this.state.user} />
        <Header usuario={this.state.user} history={this.props.history} />
        <div className="content-wrapper">
          <header className="page-header">
            <div className="container-fluid">
              <div className="row align-items-center">
                <div className="col-sm-3">
                  <h4 className="text-center my-0">
                    <i className="fas fa-compact-disc" /> Multimedia
                  </h4>
                </div>
                <div className="col-sm-9">
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
              </div>
              <div className="row mt-2 justify-content-center">
                <div className="col-sm-4 text-center">
                  <i className="fas fa-clock" /> {`  `}
                  <Clock
                    format="HH:mm:ss A"
                    ticking={true}
                    timezone={this.state.zonaevento}
                  />
                </div>
              </div>
            </div>
          </header>
          <div id="sweet" className="container-fluid">
            <TabNavigation items={['En Vivo', 'Escenas']}>
              <Live />
              <div />
            </TabNavigation>
            {/* {this.state.evento == '' ?(
                <EmptyMultimedia/>
            ):(
              <div>
                <Ejecucion
                  envios={this.props.envios}
                  evento={this.state.evento}
                  removeMqttJob={this.removeMqttJob}
                />
                <Cola
                  envios={this.props.envios} 
                  evento={this.state.evento} 
                  removeMqttJob={this.removeMqttJob}
                />
                <div className="container-fluid container-tools">
                  <div className="row">
                    <Herramientas 
                      eventId={this.state.evento}
                    />
                    <Parametros 
                      hideTimes={this.hideTimes}
                      handleStartTime={this.handleStartTime} 
                      handleEndTime={this.handleEndTime} 
                      isOpenStartTime={this.state.isOpenStartTime} 
                      isOpenEndTime={this.state.isOpenEndTime} 
                      startTime={this.state.startTime} 
                      endTime={this.state.endTime}
                      istool={this.props.tool.isTool} 
                      title={this.props.tool.titleTool} 
                      sectores={this.props.sectores} 
                      bibliotecas={this.props.tool.bibliotecas} 
                      sector={this.state.sector} 
                      fechainicio={this.state.fechainicio} 
                      fechafin={this.state.fechafin} 
                      archivo={this.state.archivo} 
                      change={this.handleChange} 
                      openStartTime={this.openStartTime}
                      openEndTime={this.openEndTime}
                      sendMqttCommand={this.sendMqttCommand} 
                    />
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </Fullscreen>
    );
    }
}

const mapStateToProps = state => ({
  companyId: state.multimedia.companyId,
  eventId: state.multimedia.eventId,
  companies: state.multimedia.companies,
  eventos: state.multimedia.eventos,
  sectores: state.multimedia.sectores,
  envios: state.multimedia.jobs,
  tool: state.multimedia.tool
});

const mapDispatchToProps = dispatch => ({
  setCompany: (companyId) => dispatch(setCompany(companyId)),
  setEvent: (eventId) => dispatch(setEvent(eventId)),
  getCompanies: () => dispatch(getCompanies()),
  getEnvios: (eventId) => dispatch(getJobs(eventId)),
  getEvents: (userId, apiToken) => dispatch(getEventos(userId, apiToken)),
  getEventsFromCompany: (companyId) => dispatch(getEventsFromCompany(companyId)),
  createJob: (eventId, job, apiToken) => dispatch(createJob(eventId, job, apiToken))
});

export default connect(mapStateToProps, mapDispatchToProps)(Multimedia);