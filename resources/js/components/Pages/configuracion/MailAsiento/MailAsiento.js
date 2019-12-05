import React, { Component } from "react";
import axios from "axios";

import logo from "../../../../../../public/images/logo-oneshow.png";
import { SeatsioSeatingChart } from "@seatsio/seatsio-react";

export default class MailAsiento extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventKey: this.props.match.params.id,
            evento: "",
            footer: "Footer",
            isLoading: true
        };
    }

    componentDidMount() {
        var eventoId = this.state.eventKey.split("-", 1);
        console.log(eventoId);
        eventoId = eventoId[0];
        axios
            .post("api/mail-asientos", {
                eventoId
            })
            .then(res => {
                console.log(res.data.data);
                this.setState({ evento: res.data.data, isLoading: false });
            });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div>
                    <div id="sweet" className="container-fluid">
                        <div className="row">
                            <div className="offset-6">
                                <img className="logo-inside" src={logo} />
                                <h3>
                                    <i className="fa fa-spinner fa-spin" />{" "}
                                    Cargando
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <div id="sweet" className="container-fluid">
                        <div className="row">
                            <div className="offset-6">
                                <img className="logo-inside" src={logo} />
                            </div>
                        </div>
                    </div>
                    {console.log(this.state)}
                    {console.log(this.state.evento.publicKey)}
                    {console.log(this.state.eventKey)}
                    <SeatsioSeatingChart
                        publicKey={this.state.evento.publicKey}
                        event={this.state.eventKey}
                    />
                </div>
            );
        }
    }
}
