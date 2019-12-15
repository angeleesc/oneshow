import React from 'react';
import { connect } from 'react-redux'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

class Wall extends React.Component  {
  constructor (props) {
    super(props);

    this.state = {
      hasHashtags: false,
      isLoading: false,
    }

    this.onFrameLoad = this.onFrameLoad.bind(this);

    this.iFrameRef = React.createRef();
    this.socialURL = window.location.protocol + "//" + window.location.host + "/Lib";
  }

  /**
   * Verifica que existan hashtags para el evento,
   * si no, muestra un mensaje señalando la situación
   */
  componentDidMount () {
    const { twitter, instagram } = this.props;

    if (twitter.length > 0 || instagram.length > 0) {
      this.setState({
        hasHashtags: true,
        isLoading: true,
      }, () => {
        const { twitter, instagram, eventId } = this.props;
        
        const twParams = twitter.map(hashtag => encodeURIComponent(hashtag)).join(',');
        const igParams = instagram.map(hashtag => encodeURIComponent(hashtag)).join(',');

        console.log(`${this.socialURL}?hashtagsTwitter=${twParams}&hashtagsInstagram=${igParams}&eventoId=${eventId}`);

        this.iFrameRef.current.src = `${this.socialURL}?hashtagsTwitter=${twParams}&hashtagsInstagram=${igParams}&eventoId=${eventId}`;
      });
    }
  }

  onFrameLoad (event) {
    this.setState({
      isLoading: false,
    });
  }

  render () {
    const { hasHashtags, isLoading } = this.state;

    const iFrameStyles = classnames({
      visible: hasHashtags && !isLoading,
      invisible: !hasHashtags || isLoading
    });

    return (
      <div>
        {!hasHashtags && !isLoading && 
          <React.Fragment>
            <div className="text-center mt-3">
              <FontAwesomeIcon icon="exclamation-circle" color="#fff" size="5x" />
            </div>
            <div className="text-center mt-3 roboto-condensed">
              No existen hashtags registrados en el evento
            </div>
          </React.Fragment>
        }
        {isLoading &&
          <div className="text-center">
            <FontAwesomeIcon color="#fff" icon="sync" spin />
          </div>
        }
        <iframe
          ref={this.iFrameRef}
          className={iFrameStyles}
          onLoad={this.onFrameLoad}
        >
        </iframe>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  twitter: state.social.hashtags.twitter,
  instagram: state.social.hashtags.instagram,
});

export default connect(mapStateToProps)(Wall);