import React, { Component } from 'react';
import styled from 'styled-components';
import { Layout, Menu, Row, Col } from 'antd';
import 'antd/dist/antd.css';
import './index.css'; // Override global ant-design css with specific css selectors
import axios from 'axios';
import { AnatomicModel } from './anatomic-model';
const { Header, Content } = Layout;
const Title = styled.h1`
  color: gray;
`;
const SHeaderTitle = styled(Header)`
  position: 'fixed';
  zindex: 1;
  width: '100%';
  background: white;
`;
const Container = styled.div`
  background: 'white';
  padding: 24px;
  padding-top: 50px;
  padding-left: 50px;
  min-height: 380px;
  display: flex;
  flex-direction: row;
`;
const Item = styled(Menu.Item)`
  flex-grow: 1;
  display: flex;
`;
const SubMenu = styled(Menu.SubMenu)`
  flex-grow: 1;
  display: flex;
`;
const Img = styled.img`
  width: 500px;
  height: 500px;
  flex-grow: 1;
`;
const Description = styled.p`
  flex-grow: 1;
`;

class AtlasComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      atlas: {
        title: '',
        cover: '',
        atlas_categories: []
      },
      selected: null
    };
  }

  async componentDidMount() {
    const config = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    };
    const url =
      'http://ec2-18-222-136-65.us-east-2.compute.amazonaws.com/atlas/' +
      this.props.atlas;
    const result = await axios.get(url, config);
    const atlas_categories = result.data.atlas_categories.map(async item => {
      const category =
        'http://ec2-18-222-136-65.us-east-2.compute.amazonaws.com/atlas_categories/' +
        item.id;
      const anatomic_maps = await axios.get(category, config);
      return anatomic_maps.data;
    });
    const ls = await Promise.all(atlas_categories);
    result.data.atlas_categories = ls;
    this.setState({ atlas: result.data });
  }
  equal_size_string(str, size = 16) {
    if (str.length > size) return str.substring(0, size - 3) + '...';
    return str + '\xa0'.repeat(size - str.length);
  }
  handleClick = e => {
    this.setState({
      selected: e.key
    });
  };

  render() {
    const categories = this.state.atlas.atlas_categories.map(item => (
      <SubMenu
        key={item.tag}
        title={
          <span>
            <span>{this.equal_size_string(item.tag)}</span>
          </span>
        }
      >
        {item.anatomic_maps.map(amap => (
          <Item key={amap.id}>{amap.name}</Item>
        ))}
      </SubMenu>
    ));
    const image = this.state.atlas.cover
      ? this.state.atlas.cover.url
      : 'https://nextviewventures.com/wp-content/uploads/2015/09/placeholder-square.jpg';
    // Render component
    const mainContent = this.state.selected ? (
      <AnatomicModel model={this.state.selected} />
    ) : (
      <Row type={'flex'} style={{ width: '100%' }}>
        <Col span={12}>
          <Img src={image} />
        </Col>
        <Col span={12}>
          <Description>{this.state.atlas.description}</Description>
        </Col>
      </Row>
    );

    return (
      <div>
        <Layout>
          <SHeaderTitle>
            <Title onClick={() => this.setState({ selected: null })}>
              {this.state.atlas.title}
            </Title>
          </SHeaderTitle>
        </Layout>
        <Layout>
          <Menu
            theme="light"
            mode="horizontal"
            style={{
              background: 'dimgray',
              display: 'flex'
            }}
            onClick={this.handleClick}
          >
            {categories}
          </Menu>
          <Content>
            <Container>{mainContent}</Container>
          </Content>
        </Layout>
      </div>
    );
  }
}
export { AtlasComponent };
