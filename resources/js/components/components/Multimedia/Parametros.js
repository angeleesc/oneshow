import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Datepicker from 'react-mobile-datepicker';
import InputColor from 'react-input-color';

import "./css/Parametros.css";

const dateConfig = {
    'hour': {
        format: 'hh',
        caption: 'Hora',
        step: 1,
    },
    'minute': {
        format: 'mm',
        caption: 'Minuto',
        step: 1,
    },
    'second': {
        format: 'ss',
        caption: 'Segundo',
        step: 1,
    },
};

const Parametros = (props) => {
    const [color, setColor] = React.useState({});
    const { istool, title, bibliotecas, sectores, sector, fechainicio, fechafin, archivo } = props;
    let flash2=props.flash2;    
    var maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 1);

    if (istool === false) {
      return (
        <div className="col-9 section-parametros">
          <div className="d-flex align-items-center justify-content-center h-100">
            <div className="text-center">
              <i className="fas fa-ban fa-2x"></i>
              <div>Seleccione una herramienta para configurar</div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="col-9 section-parametros">
        <div className="text-left mb-4 mt-4">
          <h2 className="font-weight-bold text-capitalize">{title}</h2>
        </div>
        {title === 'video' &&
          <div>
            <form>
                <div className="form-row mb-4">
                    <div className="col">
                      <label>Archivo</label>
                      <select className="form-control form-control-sm" name="archivo" value={archivo} onChange={props.change}>
                          <option value="">Seleccione</option>
                          {
                            bibliotecas.map( (p, index) => {
                                return <option key={index} value={p.NombreCompleto}  >{p.NombreCompleto}</option>
                            })
                          }
                      </select>
                    </div>
                    <div className="col">
                    <label>Sector</label>
                        <select className="form-control form-control-sm" name="sector" value={sector} onChange={props.change }>
                            <option value="">Seleccione</option>
                            {
                              sectores.map( (p, index) => {
                                  return <option key={index} value={p._id} >{p.Nombre}</option>
                              })
                            }
                        </select>
                    </div>
                </div>
              </form>
          </div>
        }
        {title === 'audio' &&
          <div>
            <form>
              <div className="form-row mb-4">
                <div className="col">
                  <label>Archivo</label>
                  <select className="form-control form-control-sm" name="archivo" value={archivo} onChange={props.change}>
                    <option value="">Seleccione</option>
                    {
                      bibliotecas.map( (p, index) => {
                        return <option key={index} value={p.NombreCompleto} >{p.NombreCompleto}</option>
                      })
                    }
                  </select>
                </div>
                <div className="col">
                  <label>Sector</label>
                  <select className="form-control form-control-sm">
                    <option value="">Seleccione</option>
                    {
                      sectores.map( (p, index) => {
                          return <option key={index} value={p._id} >{p.Nombre}</option>
                      })
                    }
                  </select>
                </div>                        
              </div>
            </form>
          </div>
        }
        {title === 'imagen' &&
            <div>
              <form>
                <div className="form-row mb-4">
                    <div className="col">
                        <label>Archivo</label>
                        <select className="form-control form-control-sm"  name="archivo"  value={archivo} onChange={props.change} >
                            <option value="">Seleccione</option>
                            {
                                bibliotecas.map( (p, index) => {
                                    return <option key={index} value={p.NombreCompleto}>{p.NombreCompleto}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="col">
                        <label>Sector</label>
                        <select className="form-control form-control-sm">
                            <option value="">Seleccione</option>
                            {
                                sectores.map( (p, index) => {
                                    return <option key={index} value={p._id} >{p.Nombre}</option>
                                })
                            }
                        </select>
                    </div>
                </div>
            </form>
          </div>
        }
        {title === 'flash' &&
          <div>
            <form>
              <div className="form-row">
                <div className="col">
                  <label>Estado</label>
                    <select className="form-control form-control-sm" name="flash2" value={flash2} onChange={props.change}>
                      <option key="flas1" value="">Seleccione</option>
                      <option key="flas2" value="0">Apagar</option>
                      <option key="flas3" value="1">Encender</option>
                    </select>
                  </div>
                  <div className="col">
                    <label>Sector</label>
                    <select className="form-control form-control-sm" name="sector" value={sector} onChange={props.change }>
                      <option value="">Seleccione</option>
                      {
                        sectores.map( (p, index) => {
                          return <option key={index} value={p._id} >{p.Nombre}</option>
                        })
                      }
                    </select>   
                </div>
              </div>
            </form>
          </div>
        }
        {title === 'colores' &&
          <div>
            <form>
              <div className="form-row">
                <div className="col-md-3 mb-4">
                  <label>Sector</label>
                  <select className="form-control form-control-sm" name="sector" value={sector} onChange={props.change }>
                    <option value="">Seleccione</option>
                    {
                        sectores.map( (p, index) => {
                            return <option key={index} value={p._id} >{p.Nombre}</option>
                        })
                    }
                  </select>
                </div>
                <div className="offset-md-1 col-md-3 mb-4 form-group">
                    <div className="row">
                      <label className="label-color">Parametro color </label>
                    </div>
                    <div className="row">
                    <InputColor
                        initialHexColor="#5e72e4"
                        name="color" value={color} onChange={props.change}
                        placement="right"
                    />
                    <div
                    id="recuadro-color"
                    style={{
                    height: 35,
                    width:100,
                    left: 20,
                    backgroundColor: color == {} ? color : '#5e72e4'
                    }}
                />
                    </div>  
                </div>
              </div>
            </form>
          </div>
        }
        <div className="form-row mb-4">
          <div className="col">
            <label className="label-inicio">Hora Inicio </label>
            <a
              className="select-btn sm boton-hora" 
              onClick={props.openStartTime}
            >
              {props.startTime==''?'Ingrese (Opcional)':props.startTime.getHours()+':'+props.startTime.getMinutes() +':'+props.startTime.getSeconds()}
            </a>
            <Datepicker
              showCaption={true}
              showHeader={true}
              headerFormat={'hh:mm:ss'}
              value={new Date()}
              theme="default"
              isOpen={props.isOpenStartTime}
              onSelect={props.handleStartTime}
              onCancel={props.hideTimes}
              confirmText="Seleccionar"
              cancelText="Cancelar"
              max={maxDate}
              dateConfig={dateConfig}
            />
          </div>
          <div className="col">
            <label className="label-fin">Hora Fin</label>
              <a
                className="select-btn sm boton-hora" 
                onClick={props.openEndTime}>
                {props.endTime==''?'Ingrese (Opcional)':props.endTime.getHours()+':'+props.endTime.getMinutes() +':'+props.endTime.getSeconds()}
              </a>
              <Datepicker
                showCaption={true}
                showHeader={true}
                headerFormat={'hh:mm:ss'}
                value={new Date()}
                theme="default"
                isOpen={props.isOpenEndTime}
                onSelect={props.handleEndTime}
                onCancel={props.hideTimes}
                confirmText="Seleccionar"
                cancelText="Cancelar"
                max={maxDate}
                dateConfig={dateConfig}
              />
          </div>
        </div>
        <div className="offset-3 mb-4">
            <button className="btn btn-sm btn-dark mr-2" onClick={(e)=> props.sendMqttCommand(1)}>Inmediata</button>
            <button className="btn btn-sm btn-dark mr-2" onClick={(e) => props.sendMqttCommand(2)}>Proxima</button>
            <button className="btn btn-sm btn-dark mr-2" onClick={(e) => props.sendMqttCommand(3)}>En cola</button>
            <button className="btn btn-sm btn-dark mr-2">Cancelar</button>
        </div>
      </div>
    );
};

export default Parametros;
