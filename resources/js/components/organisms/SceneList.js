import React from 'react';
import SceneItem from './../atoms/SceneItem';
import { deleteScene } from './../../redux/actions/show';
import { connect } from 'react-redux';

class SceneList extends React.Component {
  constructor (props) {
    super(props);

    this.deleteScene = this.deleteScene.bind(this);
  }

  deleteScene (id) {
    this.props.deleteScene(id).then(() => {
      console.log('Deleted', id);
    })
    .catch(err => console.log('Delete error', err));
  }
  
  render () {
    const scenes = this.props.scenes.map(scene => (
      <SceneItem 
        key={scene._id}
        id={scene._id} 
        name={scene.name}
        handleDelete={this.deleteScene} 
        className="mt-2" 
      />
    ));

    return (
      <div>
        {scenes}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  scenes: state.show.scenes.items
});

const mapDispatchToProps = dispatch => ({
  deleteScene: (id) => dispatch(deleteScene(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SceneList);