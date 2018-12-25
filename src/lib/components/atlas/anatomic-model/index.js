import React, { Component } from 'react';
import { Row, Col, Menu, Carousel } from 'antd';
import { M3d } from './m3d';
import axios from 'axios';
import styled from 'styled-components';
import YouTube from 'react-youtube';
import {
  FaCodepen,
  FaAlignJustify,
  FaXRay,
  FaYoutube,
  FaRegImages
} from 'react-icons/fa';
const SideBar = styled(Col)`
  border-left: 2px solid lightgray;
  padding-left: 10px;
`;
const Description = styled.p`
  flex-grow: 1;
`;
const Img = styled.img`
  width: 500px;
  height: 500px;
  flex-grow: 1;
`;
const SCarousel = styled(Carousel)`
  padding-left: 20%;
`;
export class AnatomicModel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadedModel: this.props.model,
      model: [],
      loaded: false,
      selected: '1'
    };
  }
  fetchAnatomicMap = async id => {
    const config = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    };
    const url =
      'http://ec2-18-222-136-65.us-east-2.compute.amazonaws.com/anatomic_maps/' +
      id;
    return await axios.get(url, config);
  };
  async componentDidMount() {
    const result = await this.fetchAnatomicMap(this.state.loadedModel);
    this.setState({ model: result.data, loaded: true });
  }
  async componentDidUpdate(prevProps) {
    if (this.props.model !== prevProps.model) {
      const result = await this.fetchAnatomicMap(this.props.model);
      this.setState({
        model: result.data,
        loaded: true,
        loadedModel: this.props.model
      });
    }
  }
  handleClick = e => {
    this.setState({
      selected: e.key
    });
  };

  render() {
    const model = this.state.loaded ? (
      <M3d url={this.state.model.url} initial={this.state.model.m3d} />
    ) : (
      <div />
    );
    let content;
    switch (this.state.selected) {
      case '1':
        content = (
          <div>
            <h1>{this.state.model.name}</h1>
            <Description>{this.state.model.description}</Description>
          </div>
        );
        break;
      case '2':
        content = model;
        break;
      case '3':
        const radio = this.state.model.radio ? (
          this.state.model.radio.map(item => <Img src={item.url} />)
        ) : (
          <div />
        );
        content = <Carousel>{radio}</Carousel>;
        break;
      case '4':
        const video = this.state.model.video ? (
          this.state.model.radio.map(item => <YouTube videoId={item.url} />)
        ) : (
          <div />
        );
        content = <SCarousel>{video}</SCarousel>;
        break;
      case '5':
        const image = this.state.model.img ? (
          this.state.model.img.map(item => <Img src={item.url} />)
        ) : (
          <div />
        );
        content = <Carousel>{image}</Carousel>;
        break;
      default:
        content = <div />;
        break;
    }
    return (
      <Row type={'flex'} style={{ width: '100%' }}>
        <Col span={18} style={{}}>
          {content}
        </Col>
        <SideBar span={6}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%' }}
            onClick={this.handleClick}
          >
            <Menu.Item key="1">
              <FaAlignJustify />
              &ensp; Descripción
            </Menu.Item>
            <Menu.Item key="2">
              <FaCodepen />
              &ensp;Vista 3D
            </Menu.Item>
            <Menu.Item key="3">
              <FaXRay />
              &ensp;Radiogafía
            </Menu.Item>
            <Menu.Item key="4">
              <FaYoutube />
              &ensp;Videos
            </Menu.Item>
            <Menu.Item key="5">
              <FaRegImages />
              &ensp;Imagenes
            </Menu.Item>
          </Menu>
        </SideBar>
      </Row>
    );
  }
}
