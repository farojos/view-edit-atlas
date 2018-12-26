import React, { Component } from 'react';
import styled from 'styled-components';
import {
  Layout,
  Upload,
  message,
  Form,
  Input,
  Icon,
  Button,
  Row,
  Col
} from 'antd';
import {
  FaAlignJustify,
  FaYoutube,
  FaRegImages,
  FaCodepen,
  FaXRay,
  FaRegSave
} from 'react-icons/fa';
import { GoBook } from 'react-icons/go';

import axios from 'axios';
import Item from 'antd/lib/list/Item';

const { Header, Content } = Layout;

const Title = styled.h1`
  color: dimgray;
`;
const SubTitle = styled.h2`
  color: gray;
`;
const Description = styled.p`
  color: lightgray;
`;
const SRow = styled(Row)`
  border-top: 2px solid lightgray;
  padding: 10px;
`;
const Book = styled(GoBook)`
  margin-right: 5px;
  display: inline-block;
`;
const CategoryName = styled.h2`
  color: gray;
  display: inline-block;
`;

export class StepTwo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint:
        'http://ec2-18-223-172-78.us-east-2.compute.amazonaws.com/api/v1/storage/store',
      atlas: {
        atlas_categories: [],
        title: ''
      }
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
      this.props.atlasId;
    const result = await axios.get(url, config);
    this.setState({ atlas: result.data });
  }
  send = async values => {
    console.log(values);
    const description = values.description;
    const name = values.name;
    const cat = values.categories;
    const newCat = cat.slice(1, cat.length).map(item => {
      return { tag: item };
    });
    const url =
      'http://ec2-18-222-136-65.us-east-2.compute.amazonaws.com/atlas/';
    const data = {
      atla: {
        title: name,
        description: description,
        organization_id: this.props.organizationId,
        responsable_id: this.props.responsableId,
        cover: {
          url: 'http://d2gg5obs453f89.cloudfront.net/' + this.state.cover
        },
        atlas_categories_attributes: newCat
      }
    };
    const options = {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(data),
      url
    };
    const result = await axios(options);
    this.props.changeStep({ atlasId: result.data.id, step: 2 });
  };

  handleCoverUpload = info => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      this.setState({ cover: info.fileList[0].response.fileNames[0] });
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  render() {
    const cat = this.state.atlas.atlas_categories.map(item => (
      <SRow key={item.tag}>
        <Col span={20}>
          <CategoryName>{item.tag}</CategoryName>
        </Col>
        <Col span={4} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button>Añadir mapa anatomico</Button>
        </Col>
        <Col span={24} justify="end">
          <Row justify="end">
            <Col span={8}>
              <CategoryName>{item.tag}</CategoryName>
            </Col>
            <Col
              span={16}
              style={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              Agregar
              <Button>
                <FaAlignJustify />
              </Button>
              <Upload
                action={this.state.endpoint}
                onChange={this.handleCoverUpload}
                name="file"
                style={{ display: 'inline-block' }}
              >
                <Button>
                  <FaCodepen />
                </Button>
              </Upload>
              <Upload
                action={this.state.endpoint}
                onChange={this.handleCoverUpload}
                name="file"
                style={{ display: 'inline-block' }}
              >
                <Button>
                  <FaXRay />
                </Button>
              </Upload>
              <Button>
                <FaYoutube />
              </Button>
              <Upload
                action={this.state.endpoint}
                onChange={this.handleCoverUpload}
                name="file"
                style={{ display: 'inline-block' }}
              >
                <Button>
                  <FaRegImages />
                </Button>
              </Upload>
              <Button>
                <FaRegSave /> Guardar Mapa Anatomico
              </Button>
            </Col>
          </Row>
        </Col>
      </SRow>
    ));
    return (
      <div>
        <Layout>
          <Title>Crear Atlas</Title>
          <SubTitle>Formulario de creación de Atlas</SubTitle>
        </Layout>
        <Layout>
          <Content>
            <Description>
              En el siguiente formulario uds debe crear mapas anatomicos
              agrupados en las categorias previamente creadas.
            </Description>
            <SRow>
              <h2>
                <Book />
                {this.state.atlas.title}
              </h2>
            </SRow>
            {cat}
            {/* <Upload
              action={this.state.endpoint}
              onChange={this.handleCoverUpload}
              name="file"
              style={{ display: 'inline-block' }}
            >
              <Button style={{ display: 'inline-block' }}>
                <FaCodepen />
              </Button>
              <Button style={{ display: 'inline-block' }}>
                <FaXRay />
              </Button>
            </Upload>
            <Upload
              action={this.state.endpoint}
              onChange={this.handleCoverUpload}
              name="file"
              style={{ display: 'inline-block' }}
            >
              <Button style={{ display: 'inline-block' }}>
                <FaRegImages />
              </Button>
            </Upload> */}
            {/* <DF send={this.send} /> */}
          </Content>
        </Layout>
        {/* <div>{this.props.atlasId}</div> */}
      </div>
    );
  }
}
