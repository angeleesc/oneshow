import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

class TabNavigation extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      selected: 0,
    };
  }

  handleTabChange (i, e) {
    e.preventDefault();

    this.setState({ selected: i });
  }

  render () {
    const navItems = this.props.items.map((item, i) => {
      let classNames = classnames('nav-item', {
        'd-none': this.props.fullscreen && i === 1,
        active: this.state.selected === i,
        show: this.state.selected === i
      });
      
      return (
        <li key={i} className={classNames} role="tab" style={{cursor: 'pointer'}}>
          <a className="nav-link" onClick={this.handleTabChange.bind(this, i)}>{item}</a>
        </li>
      )
    });

    const tabsContent = this.props.children.map((tab, i) => {
      let classNames = classnames('tab-pane', 'fade', {
        active: this.state.selected === i,
        show: this.state.selected === i
      });

      return (
        <div key={i} className={classNames}>
          {tab}
        </div>
      );
    })

    return (
      <div>
        <ul className="nav nav-tabs justify-content-center">
          {navItems}
        </ul>
        <div className="tab-content">
          {tabsContent}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  fullscreen: state.app.fullscreen,
});

export default connect(mapStateToProps)(TabNavigation);