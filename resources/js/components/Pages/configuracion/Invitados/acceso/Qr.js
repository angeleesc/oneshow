import React, { Fragment, useState } from "react";
import QrReader from "react-qr-reader";
import Menu from "../../../../components/Menu";
import Header from "../../../../components/Header";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import * as invitadosActions from "../../../../../redux/actions/invitados";

export const Qr = props => {
    const [c, setC] = useState(0);
    const handleScan = data => {

        if (data && c == 0) {
            setC(1);
            const id = data.split('/')[0]
            const idevento = data.split('/')[1]
            props.checkInQr(id,idevento);
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
                            </div>
                        </div>
                    </div>
                </header>
                <div id="sweet" className="container-fluid">
                    <div className="row">
                        <div className="col-6 offset-3">
                            <QrReader
                                delay={300}
                                onError={handleError}
                                onScan={handleScan}
                                style={{ width: "100%" }}
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
