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
    this.onPostsUpdate = this.onPostsUpdate.bind(this);

    this.intervalId = '';
    this.observer = new MutationObserver(this.onPostsUpdate);
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

  componentWillUnmount () {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  /**
   * Una vez traidas las publicaciones, llama al moderador y revisa cada una de las publicaciones
   * que inicialmente llegaron al wall
   */
  onFrameLoad (e) {
    /**
     * Filtra para que solo aparezcan las publicaciones que tienen la clase
     * correspondiente a twitter, instagram o rss
     */
    this.iFrameRef.current.contentDocument.getElementsByClassName("filter-label")[0].setAttribute('data-filter', '.sb-twitter, .sb-instagram, .sb-rss');    
    const rawPosts = this.iFrameRef.current.contentDocument.getElementsByClassName("sb-item");
    
    this.observer.observe(this.iFrameRef.current.contentDocument.getElementById('timeline_wall1'), { 
      childList: true, 
    });

    let posts = [];
    
    for (let post of rawPosts) {
      posts.push({
        id: post.id,
        type: post.classList.item(1),
        image: post.getElementsByClassName('icbox').length > 0 ? post.getElementsByClassName('icbox')[0].href : null,
        text: post.getElementsByClassName("sb-text")[0] ? post.getElementsByClassName("sb-text")[0].innerText : "",
      });
    }

    this.setState({ posts }, () => {
      this.intervalId = setInterval(() => {
        let index = 0;
        let lastIndex = 5;

        for (index = lastIndex - 5; index < lastIndex; index++) {
          let post = this.state.posts[index];
          let promises = [];

          if (!post) {
            clearInterval(this.intervalId);

            return setTimeout(() => {
              this.setState({
                isLoading: false,
              }, () => this.iFrameRef.current.contentDocument.getElementsByClassName("filter-label")[0].click());
            }, 1500);
          }
          
          promises.push(new Promise((resolve, reject) => {
            if (post.image === null)
              return resolve({
                data: {
                  IsImageAdultClassified: false,
                  IsImageRacyClassified: false,
                }
              });

            return this.props.doesImageNeedModeration(post.image).then(res => resolve(res));
          }));

          promises.push(new Promise((resolve, reject) => {
            if (!post.text)
              return resolve({
                data: { Terms: [] },
              })

            return this.props.doesTextNeedModeration(post.text).then(res => resolve(res));
          }));

          Promise.all(promises).then(([imgModeration, txtModeration]) => {
            if (imgModeration.data.IsImageAdultClassified || imgModeration.data.IsImageRacyClassified || txtModeration.data.Terms) {
              // Le quita la clase de la red social de la cual
              // vino la publicación para que no aparezca más en pantalla
              this.iFrameRef.current.contentDocument.getElementById(post.id).classList.remove(post.type);
            }
          });

          lastIndex += 5;
        }

      }, 1000);
    });
  }

  onPostsUpdate (mutationList, observer) {
    const [record] = mutationList;
    let posts = [];

    record.addedNodes.forEach(node => posts.push({
      id: node.id,
      type: node.classList.item(1),
      image: node.getElementsByClassName('icbox').length > 0 ? node.getElementsByClassName('icbox')[0].href : null,
      text: node.getElementsByClassName("sb-text")[0] ? node.getElementsByClassName("sb-text")[0].innerText : "",
    }));

    posts = posts.filter((post, i) => {
      const exists = this.state.posts.find(p => p.id === post.id) ? true : false;

      if (exists) {
        return false;        
      } else {
        record.addedNodes[i].classList.remove(post.id);
        return true;
      }
    });

    this.iFrameRef.current.contentDocument.getElementsByClassName("filter-label")[0].click();

    const promises = posts.map(post => new Promise((resolve, reject) => {
      if (post.text) {
        this.props.doesTextNeedModeration(post.text).then(res => {
          if (!res.data.Terms) {
            this.iFrameRef.current.contentDocument.getElementById(post.id).classList.add(post.type);
          }

          resolve({});
        });
      } else {
        resolve({});
      }
    }));

    Promise.all(promises).then(() => {
      this.iFrameRef.current.contentDocument.getElementsByClassName("filter-label")[0].click();

      console.log('Done');

      this.setState(state => ({
        posts: [
          ...state.posts,
          ...posts
        ]
      }))
    })
    .catch(err => {
      this.iFrameRef.current.contentDocument.getElementsByClassName("filter-label")[0].click();
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
          style={{
            width: '100%',
            border: 'none',
            height: '700px !important',
          }}
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
  doesTextNeedModeration: (text) => dispatch(doesTextNeedModeration(text)),
  doesImageNeedModeration: (imageURL) => dispatch(doesImageNeedModeration(imageURL)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Wall);