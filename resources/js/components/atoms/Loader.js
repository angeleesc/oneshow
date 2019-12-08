import React from 'react';
import { connect } from 'react-redux';
import "../Pages/css/Loader.css";

class Loader extends React.Component {
    render () {
        return (
            <>
                { this.props.mostrar &&
                    <div id="loader">
                        <ul>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </div>
                }
            </>
        );
    }
}

const mapStateToProps = state => ({
    mostrar: state.loader.mostrar
});
  
export default connect(mapStateToProps)(Loader);