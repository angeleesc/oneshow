import React from 'react'


export default function alertMessage(props) {
    return (
        <div className={`alert alert-${props.type}`} role="alert">
             <i className="fas fa-info-circle" /> {props.message}
            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    )
}
