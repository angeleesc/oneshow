import React, { Fragment, useState } from "react";
import QrScanner from "react-qr-scanner";
import Menu from "../../../../components/Menu";
import Header from "../../../../components/Header";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { useFullScreen } from 'react-hooks-full-screen'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as invitadosActions from "../../../../../redux/actions/invitados";

export const Qr = props => {
    const [showFullScreen, setShowFullScreen] = useState(false);
    useFullScreen('fullScreen', showFullScreen);
    const handleScan = data => {

        if (data) {
            const id = data.split('/')[0]
            const idevento = data.split('/')[1]
            props.checkInQr(id,idevento);
            console.log(data);
        }
    };
    const handleError = err => {
        console.error(err);
    };

    return (
        <Fragment>
            {props.invitados.error && sweetalert(`${props.invitados.error}.`, "error", "sweet")}
            {props.invitados.regresar && <Redirect to={'/acceso'} />}
            <Menu />
            <Header />
            <div className="content-wrapper">
                <header className="page-header">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm-12 col-md-12">
                                <h1
                                    className="page-header-heading"
                                    id="title-nav"
                                >
                                    <i className="fas fa-qrcode sidebar-nav-link-logo" />
                                    &nbsp; Escanear Qr
                                </h1>
                                <span style={{ cursor: 'pointer', float: 'right'}} >
                                    <FontAwesomeIcon
                                      onClick={() => setShowFullScreen(!showFullScreen)}
                                      icon="expand-arrows-alt"
                                      color="#fff" 
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                </header>
                <div id="sweet" className="container-fluid">
                    <div className="row">
                        <div className="col-6 offset-3" id="fullScreen">
                            <QrScanner
                                delay={1000}
                                onError={handleError}
                                onScan={handleScan}
                                style={{ width: "100%" }}
                                facingMode="front"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

const mapStateToProps = ({ invitados }) => {
    return {
        invitados
    };
};
export default connect(mapStateToProps, invitadosActions)(Qr);
