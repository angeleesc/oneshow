import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import swal from "sweetalert2";
//import moment from 'moment';
import moment from 'moment-timezone';
import EmptyMultimedia from "./EmptyMultimedia";
import Herramientas from "./Herramientas";
import Parametros from "./Parametros";
import Ejecucion from "./Ejecucion";
import Cola from "./Cola";
import Clock from 'react-live-clock';
import Fullscreen from "react-full-screen";
export default class Multimedia extends Component {

    constructor(props) {
        super(props);
        this.state = {
            url: props.url,
            footer: props.footer,
            eventos: JSON.parse(props.eventos),
            sectores: JSON.parse(props.sectores),
            bibliotecas: [],
            evento: '',
            multimedia: '',
            multimedias: [],
            envios:[],
            titleTool: '',
            sector: '',
            fechainicio: '',
            fechafin: '',
            archivo: '',
            istool: false,
            isFull: false,
            isLoading: false,
            flash:'',
            flash2:'',
            color:'#ffffff',
            hora:new Date(),
            hora2:new Date(),
            isOpenHora:false,
            isOpenHora2:false,
            zonaevento:'Etc/GMT+4'
        };

        this.goFull = this.goFull.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.actionTool = this.actionTool.bind(this);
        this.getMultimedia = this.getMultimedia.bind(this);
        this.enviarComando = this.enviarComando.bind(this);
        this.enviarComandoQuitar = this.enviarComandoQuitar.bind(this);
        this.ponerCola = this.ponerCola.bind(this);
        this.getEnvios = this.getEnvios.bind(this);
        this.quitarCola = this.quitarCola.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.handleThemeToggle = this.handleThemeToggle.bind(this);
        this.handleSelect2 = this.handleSelect2.bind(this);
        this.handleToggle2 = this.handleToggle2.bind(this);
        this.handleThemeToggle2 = this.handleThemeToggle2.bind(this);
        this.statusEnvios = this.statusEnvios.bind(this);
        this.iniciarMQTT();
    }

    statusEnvios(){
        for (var i = this.state.envios.length - 1; i >= 0; i--) {
            var tiempo =this.state.envios[i].Fin.split(":");
            var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes(); 
        var s = today.getSeconds();

            if(tiempo[0]<=h){
                if(tiempo[1]<=m){
                    if(tiempo[2]<=s){
                        var id = this.state.envios[i]._id;
                        document.getElementById(id).style.display="none";
                        axios.post('/ajax-remove-envios', {evento:'',title:'',estado:'',inicio:'',fin:'',parametro:'',id} )
            .then(res => {
                if(res){

                    let r = res.data;

                    if(r.code === 200){

                        this.setState({
                            envios: r.envios,
                        });
                        this.getEnvios();

                    }else if(r.code === 500){

                        console.log(r.msj);
                        this.setState({
                            multimedias: [],
                        });

                    }

                }

            }).catch(function (error) {});
                    }
                }
            }
        }   
    }

    iniciarMQTT(){
        var reconnectTimeout = 2000;
        var host="mqtt.oneshow.com.ar"; //change this
        var port=11344;
        
        function onConnect() {
      // Once a connection has been made, make a subscription and send a message.
    
        console.log("Connected ");
        //mqtt.subscribe("sensor1");
        var message = new Paho.MQTT.Message("Hello World");
        message.destinationName = "sensor1";
        window.mqttCliente.send(message);
      }
      function MQTTconnect() {
        console.log("connecting to "+ host +" "+ port);
        window.mqttCliente = new Paho.MQTT.Client(host,port,"clientjs");
        //document.write("connecting to "+ host);
        var options = {
            timeout: 3,
            onSuccess: onConnect,
            useSSL:true
         };
         
        window.mqttCliente.connect(options); //connect
        }
     
MQTTconnect();

    }

    enviarComando(fechainicio,fechafin){
       
         var reconnectTimeout = 2000;
        var host="mqtt.oneshow.com.ar"; //change this
        var port=11344;
        var self=this;
        var envio=false;
        function onConnect() {
      // Once a connection has been made, make a subscription and send a message.
    
        console.log("Connected ");
        var titleTool=self.state.titleTool;
        // var message = new Paho.MQTT.Message("TTR,magnet:?xt=urn:btih:630fe8bec6fd0e785fe20a375daae1ba0bb96c59&dn=240192_splash.png&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com");
        //message.destinationName = "/empresa/evento/Multimedia";
       // window.mqttCliente.send(message);
       // var message = new Paho.MQTT.Message("MUL,5cb841bba1dc000bd11b6ec4/5cbadeb1388f7c4c5e5910d2/IMAGEN0022.jpg..1,"+fechainicio+","+fechafin);
        //message.destinationName = "sampletopic";
        //window.mqttCliente.send(message);
        if(self.state.hora){
          var h = self.state.hora.getHours();
          var m = self.state.hora.getMinutes();
          var s = self.state.hora.getSeconds();
          fechainicio=h+":"+m+":"+s;
        }
        if(self.state.hora2){
          var h2 = self.state.hora2.getHours();
          var m2 = self.state.hora2.getMinutes();
          var s2 = self.state.hora2.getSeconds();
          fechafin=h2+":"+m2+":"+s2;
        }
        var evento=self.state.evento.split("_")[0];
        var topic="/"+self.state.empresa+"/"+evento;

        if(fechainicio==""||fechainicio==undefined){
            fechainicio=moment().format("hh:mm:ss");
        }
        if(fechafin==""||fechafin==undefined){
            fechafin="99:99:99";
        }
        if(titleTool=='imagen'||titleTool=='video'||titleTool=='audio'){
                
                var message2 = new Paho.MQTT.Message("MUL,"+self.state.empresa+"/"+evento+"/"+self.state.archivo+"..1,"+fechainicio+","+fechafin);
                message2.destinationName = topic;
                window.mqttCliente.send(message2);
                envio=true;
        }
        if(titleTool=='flash'){
        
                var message2 = new Paho.MQTT.Message("FLH,"+self.state.flash2+","+fechainicio+","+fechafin);
                message2.destinationName = topic;
                window.mqttCliente.send(message2);
                envio=true;
        }
        if(titleTool=='colores'){
            if(self.state.color!=''){
                var message2 = new Paho.MQTT.Message("COL,"+self.state.color+"+10,"+fechainicio+","+fechafin);
                message2.destinationName = topic;
                window.mqttCliente.send(message2);
                envio=true;
            }else{
                swal.fire({
                            title: '<i class="fas fa-exclamation-circle"></i>',
                            text: 'Seleccione el color',
                            confirmButtonColor: '#343a40',
                            confirmButtonText: 'Ok',
                            target: document.getElementById('sweet')
                        });
            }
        }
        if(envio){
            self.ponerCola('ejecucion',fechainicio,fechafin);
        }
      }
      function MQTTconnect() {
        console.log("connecting to "+ host +" "+ port);
        window.mqttCliente = new Paho.MQTT.Client(host,port,"clientjs");
        //document.write("connecting to "+ host);
        var options = {
            timeout: 3,
            onSuccess: onConnect,
            useSSL:true
         };
         
        window.mqttCliente.connect(options); //connect
        }
     
MQTTconnect();
    }

    
    enviarComandoQuitar(title,parametro,fechainicio,fechafin){
       
         var reconnectTimeout = 2000;
        var host="mqtt.oneshow.com.ar"; //change this
        var port=11344;
        var self=this;
        function onConnect() {
      // Once a connection has been made, make a subscription and send a message.
    
        console.log("Connected ");
        var titleTool=title;
        // var message = new Paho.MQTT.Message("TTR,magnet:?xt=urn:btih:630fe8bec6fd0e785fe20a375daae1ba0bb96c59&dn=240192_splash.png&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com");
        //message.destinationName = "/empresa/evento/Multimedia";
       // window.mqttCliente.send(message);
       // var message = new Paho.MQTT.Message("MUL,5cb841bba1dc000bd11b6ec4/5cbadeb1388f7c4c5e5910d2/IMAGEN0022.jpg..1,"+fechainicio+","+fechafin);
        //message.destinationName = "sampletopic";
        //window.mqttCliente.send(message);
        var evento=self.state.evento.split("_")[0];
        var topic="/"+self.state.empresa+"/"+evento;
        if(fechainicio==""){
            fechainicio=moment().format("hh:mm:ss");
        }
        if(fechafin==""){
            fechafin="99:99:99";
        }
        if(titleTool=='imagen'||titleTool=='video'||titleTool=='audio'){

        var message2 = new Paho.MQTT.Message("MUL,"+self.state.empresa+"/"+evento+"/"+parametro+"..1,"+fechainicio+","+fechafin);
        message2.destinationName = topic;
        window.mqttCliente.send(message2);
        }
        if(titleTool=='flash'){
        parametro=0;
        var message2 = new Paho.MQTT.Message("FLH,"+parametro+","+fechainicio+","+fechafin);
        message2.destinationName = topic;
        window.mqttCliente.send(message2);
        }
        if(titleTool=='colores'){
        parametro='#000';
        var message2 = new Paho.MQTT.Message("COL,"+parametro+"+10,"+fechainicio+","+fechafin);
        message2.destinationName = topic;
        window.mqttCliente.send(message2);
        }
      }
      function MQTTconnect() {
        console.log("connecting to "+ host +" "+ port);
        window.mqttCliente = new Paho.MQTT.Client(host,port,"clientjs");
        //document.write("connecting to "+ host);
        var options = {
            timeout: 3,
            onSuccess: onConnect,
            useSSL:true
         };
         
        window.mqttCliente.connect(options); //connect
        }
     
MQTTconnect();
    }

    goFull() {
        this.setState({ isFull: !this.state.isFull });
    }

    actionTool(herramienta){
         var self = this;
        let {evento} = this.state;
        evento=evento.split("_")[0];
        axios.post('/ajax-action-tool', {evento, herramienta} )
            .then(res => {
                if(res){

                    let r = res.data;

                    if(r.code === 200){

                        if(r.tool == 'Video' || r.tool == 'Imagen' || r.tool == 'Audio'){

                            self.setState({
                                istool: true,
                                titleTool: herramienta,
                                bibliotecas: r.biblioteca
                            });

                        }else{

                            self.setState({
                                istool: true,
                                titleTool: herramienta
                            });
                        }


                    }else if(r.code === 500){

                        self.setState({
                            istool: false,
                            titleTool: ''
                        });

                    }else if(r.code === 700){

                        swal.fire({
                            title: '<i class="fas fa-exclamation-circle"></i>',
                            text: r.msj,
                            confirmButtonColor: '#343a40',
                            confirmButtonText: 'Ok',
                            target: document.getElementById('sweet')
                        });

                        self.setState({
                            istool: false,
                            titleTool: ''
                        });
                    }

                }

            }).catch(function (error) {

                console.log(error);

                self.setState({
                    istool: false,
                    titleTool: ''
                });

        });


    }

    getMultimedia(){

        let {evento} = this.state;
        evento=evento.split("_")[0];
        axios.post('/ajax-get-multimedia', {evento} )
            .then(res => {
                if(res){

                    let r = res.data;

                    if(r.code === 200){

                        this.setState({
                            multimedias: r.multimedia,
                        });

                    }else if(r.code === 500){

                        console.log(r.msj);
                        this.setState({
                            multimedias: [],
                        });

                    }

                }

            }).catch(function (error) {});

    }
    getEnvios(eventonew){

        let {evento} = this.state;
        evento=evento.split("_")[0];
        if(eventonew){
            evento=eventonew;
        }
        axios.post('/ajax-get-envios', {evento} )
            .then(res => {
                if(res){

                    let r = res.data;

                    if(r.code === 200){

                        this.setState({
                            envios: r.envios,
                        });

                    }else if(r.code === 500){

                        console.log(r.msj);
                        this.setState({
                            multimedias: [],
                        });

                    }

                }

            }).catch(function (error) {});

    }
    ponerCola(newestado,inicio,fin){
        let {evento} = this.state;
        evento=evento.split("_")[0];
        var title=this.state.titleTool;
        var parametro='';
        var self=this;
        if(self.state.hora){
          var h = self.state.hora.getHours();
          var m = self.state.hora.getMinutes();
          var s = self.state.hora.getSeconds();
          inicio=h+":"+m+":"+s;
        }
        if(self.state.hora2){
          var h2 = self.state.hora2.getHours();
          var m2 = self.state.hora2.getMinutes();
          var s2 = self.state.hora2.getSeconds();
          fin=h2+":"+m2+":"+s2;
        }
        var estado='cola';
        if(newestado!=undefined&&newestado!=null&&newestado!=""){
            estado=newestado;
        }
        if(inicio==""){
            inicio=moment().format("hh:mm:ss");
        }
        if(fin==""){
            fin="99:99:99";
        }
        if(title=='imagen'||title=='video'||title=='audio'){
        parametro=this.state.archivo;
        }
        if(title=='flash'){
        parametro=this.state.flash2;
        }
        if(title=='colores'){
        parametro=this.state.color;
        }
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; 
        var yyyy = today.getFullYear();
        var momento = new Date(yyyy+'-'+mm+'-'+dd+' '+fin+window.app.gtm);

        setTimeout(self.statusEnvios, momento.getTime()-(new Date()).getTime());
        axios.post('/ajax-set-envios', {evento,title,estado,inicio,fin,parametro} )
            .then(res => {
                if(res){

                    let r = res.data;

                    if(r.code === 200){

                        this.setState({
                            envios: r.envios,
                        });
                        this.getEnvios();

                    }else if(r.code === 500){

                        console.log(r.msj);
                        this.setState({
                            multimedias: [],
                        });

                    }

                }

            }).catch(function (error) {});
    }

    quitarCola(newestado,tipo,inicio,fin,id){
        let {evento} = this.state;
        evento=evento.split("_")[0];
        var title=tipo;
        var parametro='';

        var estado='cola';
        if(newestado!=undefined&&newestado!=null&&newestado!=""){
            estado=newestado;
        }
        if(inicio==undefined&&inicio==null&&inicio==""){
            inicio=moment().format("hh:mm:ss");
        }
        if(fin==undefined&&fin==null&&fin==""){
            fin="99:99:99";
        }
        if(title=='imagen'||title=='video'||title=='audio'){
        parametro=this.state.archivo;
        }
        if(title=='flash'){
        parametro=this.state.flash2;
        }
        if(title=='colores'){
        parametro=this.state.color;
        }
        this.enviarComandoQuitar(title,parametro,inicio,fin);
        document.getElementById(id).style.display="none";
        axios.post('/ajax-remove-envios', {evento,title,estado,inicio,fin,parametro,id} )
            .then(res => {
                if(res){

                    let r = res.data;

                    if(r.code === 200){

                        this.setState({
                            envios: r.envios,
                        });
                        this.getEnvios();

                    }else if(r.code === 500){

                        console.log(r.msj);
                        this.setState({
                            multimedias: [],
                        });

                    }

                }

            }).catch(function (error) {});
    }

    handleChange(e) {

        console.log(e);
        if(e.target!=undefined){
            if(e.target.name == 'evento'){
                var eventos = this.state.eventos;
                var gtm = this.state.zonaevento;
                for (var i = eventos.length - 1; i >= 0; i--) {
                    if(eventos[i]._id==e.target.value.split("_")[0]){
                        console.log(eventos[i].Pais);
                        gtm=eventos[i].Pais.GTM;
                        var t = parseInt(gtm.substring(2,3));
                        var signo =gtm.substring(0,1);
                        if(signo=='+'){
                            signo='-';
                        }else{
                            signo='+';
                        }
                        gtm='Etc/GMT'+signo+t;
                    }
                }
                this.setState({
                    multimedia: '',
                    multimedias: [],
                    bibliotecas: [],
                    evento: e.target.value.split("_")[0],
                    empresa:e.target.value.split("_")[1],
                    istool: false,
                    titleTool: '',
                    zonaevento:gtm
                });
                this.getEnvios(e.target.value.split("_")[0]);

            }

            this.setState({
                [e.target.name]: e.target.value
            });
        }else if(e.hex!=undefined){
            this.setState({
                color: e.hex
            });
        }
    }

    handleSelect(hora){
        var hora2 = new Date(hora);
        hora2.setHours( hora.getHours() + 1 )
            this.setState({ hora,hora2, isOpenHora: false });
            document.querySelector(".wrapper").style.display="block";
        }
      handleToggle(isOpenHora) {
            this.setState({ isOpenHora });
            if(isOpenHora){
                document.querySelector(".wrapper").style.display="none";
            }else{
                document.querySelector(".wrapper").style.display="block";    
            }
        }

    handleThemeToggle() {
            this.setState({ isOpenHora: true });            
            document.querySelector(".wrapper").style.display="none";
        }

    handleSelect2(hora2){
        var hora =new Date(hora2);
        hora.setHours( hora.getHours() - 1 );
            this.setState({ hora, hora2, isOpenHora2: false });
            document.querySelector(".wrapper").style.display="block";
        }
      handleToggle2(isOpenHora2) {
            this.setState({ isOpenHora2 });
            if(isOpenHora2){
                document.querySelector(".wrapper").style.display="none";
            }else{
                document.querySelector(".wrapper").style.display="block";    
            }
        }
    handleThemeToggle2() {
            this.setState({ isOpenHora2: true });
            document.querySelector(".wrapper").style.display="none";
        }  

    render() {

        let {eventos, evento, istool, multimedia, multimedias, titleTool, sectores, bibliotecas, footer, sector, fechainicio, fechafin, archivo} = this.state;
         
        return (

            <Fullscreen
                enabled={this.state.isFull}
                onChange={isFull => this.setState({isFull})}
            >

            <div className="content-wrapper">

                <header className="page-header">

                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm-12 col-md-12">

                                <div className="d-flex">

                                    <div className="my-2">
                                        <h1 className="page-header-heading"><i className="fas fa-compact-disc page-header-heading-icon"></i>Multimedia
                                            <i className="fas fa-clock mr-2 ml-4"></i> <Clock format={'HH:mm:ss A'} ticking={true} timezone={this.state.zonaevento} />
                                        </h1>


                                    </div>

                                    <form className="form-inline ml-5">
                                        <i className="fas fa-calendar-week fa-lg mr-3"></i>
                                        <select className="form-control form-control-sm form-select-event" name="evento" value={evento} onChange={this.handleChange}>
                                            <option value="">Seleccione evento</option>
                                            {
                                                eventos.map( (p, index) => {
                                                    return <option key={index} value={p._id+'_'+p.Empresa_id} >{p.Nombre}</option>
                                                })
                                            }
                                        </select>
                                    </form>



                                    <div className="ml-auto">

                                        <button type="button" className="btn btn-sm btn-dark ml-4" onClick={this.goFull}><i className="fas fa-arrows-alt"></i>&nbsp;Fullscreen</button>

                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>

                </header>

                <div id="sweet" className="container-fluid">

                    <div className="col-lg-12">

                        <div className="widget widget-default">

                            <div className="widget-body">

                                {evento == '' ?

                                    <EmptyMultimedia/>

                                    :

                                    <div>

                                        <Ejecucion envios={this.state.envios} evento={this.state.evento} sincola={this.quitarCola.bind(this)} />

                                        <Cola envios={this.state.envios} evento={this.state.evento} sincola={this.quitarCola.bind(this)}/>

                                        <div className="container-fluid container-tools">

                                            <div className="row">

                                                <Herramientas action={this.actionTool.bind(this)} />

                                                <Parametros handleToggle={this.handleToggle} handleSelect={this.handleSelect} isOpenHora={this.state.isOpenHora} hora={this.state.hora} handleToggle2={this.handleToggle2} handleSelect2={this.handleSelect2} isOpenHora2={this.state.isOpenHora2} hora2={this.state.hora2} istool={this.state.istool} title={this.state.titleTool} sectores={this.state.sectores} bibliotecas={this.state.bibliotecas} sector={this.state.sector} fechainicio={this.state.fechainicio} fechafin={this.state.fechafin} archivo={this.state.archivo} change={this.handleChange}  handleThemeToggle={this.handleThemeToggle} handleThemeToggle2={this.handleThemeToggle2} enviar={this.enviarComando.bind(this)} cola={this.ponerCola.bind(this)} />

                                            </div>

                                        </div>

                                    </div>

                                }

                            </div>
                        </div>

                    </div>


                    <footer className="content-wrapper-footer">
                        <span>{footer}</span>
                    </footer>

                </div>

            </div>

            </Fullscreen>

        );
    }
}
/*
if (document.getElementById('multimedia')) {

    const element = document.getElementById('multimedia');

    const props = Object.assign({}, element.dataset);

    ReactDOM.render(<Multimedia {...props} />, element);
}*/
