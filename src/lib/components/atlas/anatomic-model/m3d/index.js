import React, { Component, createRef } from 'react';
import axios from 'axios';
import Renderer3D, {
  Loading,
  InfoPanel,
  ConfigGui,
  Controls
} from 'renderer3d-model';
import { Button } from 'antd';

export class M3d extends Component {
  constructor(props) {
    super(props);
    this.render3d = createRef();
    this.loading = createRef();
    this.infoPanel = createRef();
    this.configGui = createRef();
    this.renderer = {};
    this.state = {
      url: '',
      initial: {}
    };
  }
  componentDidMount() {
    this.loadModel();
  }

  loadModel = () => {
    this.renderer = new Renderer3D({
      modelUrl: this.props.url,
      loading: this.loading.current,
      infoPanel: this.infoPanel.current,
      container: this.render3d.current,
      configGui: this.configGui.current,
      editable: false,
      initial: this.props.initial,
      callbacks: {
        addAttachment: console.log,
        removeAttachment: console.log,
        updateAttachmentData: console.log,
        updateAttachmentDefaultScreen: console.log,
        updateAttachmentPosition: console.log,
        updateDefaultOrbit: console.log
      }
    });
    this.renderer.animate();
  };

  reset = () => {
    this.renderer.resetControls();
  };
  setCurrentAsInitial = () => {
    this.renderer.setCurrentAsInitial();
  };

  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}
      >
        <div style={{ height: 600 }}>
          <div
            ref={this.render3d}
            style={{ width: '100%', height: 600, position: 'absolute' }}
          >
            <Loading ref={this.loading} />
            <InfoPanel ref={this.infoPanel} />
            <ConfigGui ref={this.configGui} />
            <Controls />
          </div>
        </div>
        <Button onClick={this.reset}>Reset</Button>
        {/* <button onClick={this.setCurrentAsInitial}>ChangeInitial</button> */}
      </div>
    );
  }
}
