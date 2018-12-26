import React, { Component } from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { StepOne } from './step-one';
import { StepTwo } from './step-two';
export class AtlasCreation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 2,
      atlasId: '68c67704-6f82-4503-bd96-7863461ffcda'
    };
  }
  changeStep = state => {
    this.setState(state);
  };
  render() {
    const step =
      this.state.step === 1 ? (
        <StepOne
          changeStep={this.changeStep}
          responsableId={this.props.responsableId}
          organizationId={this.props.organizationId}
        />
      ) : (
        <StepTwo finish={this.props.finish} atlasId={this.state.atlasId} />
      );
    return <div>{step}</div>;
  }
}
