import React from 'react';
import { connect } from 'react-redux'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  doesPostNeedModeration,
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
    this.promisesAll = this.promisesAll.bind(this);

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

  async promisesAll (promises) {
    let results = [];
    
    for(const promise of promises) {
      result.push(await promise());
      console.log('Promise done');
    }

    return results;
  };

  /**
   * Una vez traidas las publicaciones, llama al moderador y revisa cada una de las publicaciones
   * que inicialmente llegaron al wall
   */
  async onFrameLoad (e) {
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

    for (let post of posts) {
      console.log('text:', post.text);
      
      const result = await this.props.doesPostNeedModeration(post.text, post.image);
      await (new Promise(resolve => setTimeout(() => resolve({}), 1000)));
      
      if (result.moderation) {  
        this.iFrameRef.current.contentDocument.getElementById(post.id).classList.remove(post.type);
      }
      
      console.log('result:', result);
    }

    this.setState(state => ({
      isLoading: false,
      posts: [
        ...state.posts,
        ...posts
      ]
    }), () => this.iFrameRef.current.contentDocument.getElementsByClassName("filter-label")[0].click());
  }

  async onPostsUpdate (mutationList, observer) {
    const [record] = mutationList;
    let posts = [];
    let toSave = [];

    record.addedNodes.forEach(node => {
      let post = {
        id: node.id,
        type: node.classList.item(1),
        image: node.getElementsByClassName('icbox').length > 0 ? node.getElementsByClassName('icbox')[0].href : null,
        text: node.getElementsByClassName("sb-text")[0] ? node.getElementsByClassName("sb-text")[0].innerText : "",
      };

      posts.push(post);
      
      node.classList.remove(post.type);
      
      if (!this.state.posts.find(p => p.id === post.id)) {
        toSave.push(post);
      }
    });

    this.iFrameRef.current.contentDocument.getElementsByClassName("filter-label")[0].click();

    for (let post of posts) {
      console.log('text:', post.text);
      
      const result = await this.props.doesPostNeedModeration(post.text, post.image);
      await (new Promise(resolve => setTimeout(() => resolve({}), 1000)));
      
      if (!result.moderation) {  
        this.iFrameRef.current.contentDocument.getElementById(post.id).classList.add(post.type);
      }
      
      console.log('result:', result);
    }

    this.iFrameRef.current.contentDocument.getElementsByClassName("filter-label")[0].click();

    this.setState(state => ({
      posts: [
        ...state.posts,
        ...toSave
      ]
    }));
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
  doesPostNeedModeration: (text, image) => dispatch(doesPostNeedModeration(text, image)),
  doesTextNeedModeration: (text) => dispatch(doesTextNeedModeration(text)),
  doesImageNeedModeration: (imageURL) => dispatch(doesImageNeedModeration(imageURL)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Wall);