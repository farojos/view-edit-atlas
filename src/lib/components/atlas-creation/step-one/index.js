import React, { Component } from 'react';
import styled from 'styled-components';
import { Layout, Upload, message, Form, Input, Icon, Button } from 'antd';

import { FaRegImages } from 'react-icons/fa';
import axios from 'axios';

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
let id = 0;

class DynamicFieldSet extends Component {
  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  };
  componentDidMount() {
    this.add();
  }
  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(++id);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.send(values);
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    };
    const formItemDescription = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 12 }
      }
    };
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={''}
        required={false}
        key={k}
      >
        {getFieldDecorator(`categories[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: 'Agregue una categoria o elimine este campo'
            }
          ]
        })(
          <Input
            placeholder="Nombre de categoria"
            style={{ width: '60%', marginRight: 8 }}
          />
        )}
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            disabled={keys.length === 1}
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ));
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item {...formItemDescription}>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: 'Agrega un nombre al Atlas'
              }
            ]
          })(<Input placeholder="Agrega un nombre" />)}
        </Form.Item>

        <Form.Item {...formItemDescription}>
          {getFieldDecorator('description', {
            rules: [
              {
                required: true,
                message: 'Agrega una descripción al Atlas'
              }
            ]
          })(<Input placeholder="Agrega una descripción" />)}
        </Form.Item>
        {formItems}
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
            <Icon type="plus" /> Agregar categorias
          </Button>
        </Form.Item>
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="primary" htmlType="submit">
            Guardar
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
const DF = Form.create()(DynamicFieldSet);
export class StepOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint:
        'http://ec2-18-223-172-78.us-east-2.compute.amazonaws.com/api/v1/storage/store',
      cover: null
    };
  }
  send = async values => {
    console.log(values);
    const description = values.description;
    const name = values.name;
    const cat = values.categories;
    // .slice(1,a.length)
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
    return (
      <div>
        <Layout>
          <Title>Crear Atlas</Title>
          <SubTitle>Formulario de creación de Atlas</SubTitle>
        </Layout>
        <Layout>
          <Content>
            <Description>
              En el siguiente formulario uds debe asignar un nombre al atlas a
              crear. las categorias que este tenga. Una descripción del atlas en
              su completitud y una foto representativa del mismo.
            </Description>
            <Upload
              action={this.state.endpoint}
              onChange={this.handleCoverUpload}
              name="file"
            >
              {/* <Button>
                <FaCodepen />
              </Button>
              <Button>
                <FaXRay />
              </Button> */}
              <Button>
                <FaRegImages /> Subir imagen de portada
              </Button>
            </Upload>
            <DF send={this.send} />
          </Content>
        </Layout>
      </div>
    );
  }
}
