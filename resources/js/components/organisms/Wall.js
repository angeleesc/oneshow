import React from 'react';
import { connect } from 'react-redux'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  doesTextNeedModeration,
  doesImageNeedModeration,
} from './../../redux/actions/social-wall';
import classnames from 'classnames';

class Wall extends React.Component  {
  constructor (props) {
    super(props);

    this.state = {
      hasHashtags: false,
      isLoading: false,
      posts: [],
    }

    this.onFrameLoad = this.onFrameLoad.bind(this);

    this.intervalId = '';
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

        this.iFrameRef.current.src = `${this.socialURL}?hashtagsTwitter=${twParams}&hashtagsInstagram=${igParams}&eventoId=${eventId}`;
      });
    }
  }

  onFrameLoad (e) {
    const rawPosts = this.iFrameRef.current.contentDocument.getElementsByClassName("sb-item");
    let posts = [];
    
    for (let post of rawPosts){
      posts.push({
        id: post.id,
        tipo: post.classList.item(1),
        imagen: post.getElementsByClassName('icbox').length > 0 ? post.getElementsByClassName('icbox')[0].href : null,
        texto: post.getElementsByClassName("sb-text")[0] ? post.getElementsByClassName("sb-text")[0].innerText : "",
      });
    }

    this.setState({ posts }, () => {
      this.intervalId = setInterval(() => {
        let index = 0;
        let lastIndex = 5;

        for (index = lastIndex - 5; index < lastIndex; index++) {
          let post = this.state.posts[index];
          let promises = [];

          console.log('post', post);

          if (!post)
            return clearInterval(this.intervalId);
          
          promises.push(new Promise((resolve, reject) => {
            if (!post.image)
              resolve({
                data: {
                  IsImageAdultClassified: false,
                  IsImageRacyClassified: false,
                }
              });

            return doesImageNeedModeration();
          }));

          promises.push(new Promise((resolve, reject) => {
            if (!post.text)
              resolve({
                data: { Terms: [] },
              })

            return doesTextNeedModeration();
          }));

          Promise.all(promises).then(result => {
            console.log('result', post.id, result);
          })

          lastIndex += 5;
        }

      }, 1000);
    });

    this.setState({
      isLoading: false,
    }, () => {});
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

const mapDispatchToProps = dispatch => ({
  doesTextNeedModeration: dispatch(doesTextNeedModeration()),
  doesImageNeedModeration: dispatch(doesImageNeedModeration()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Wall);