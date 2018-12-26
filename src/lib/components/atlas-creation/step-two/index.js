import React, { Component, createRef } from 'react';
import styled from 'styled-components';
import {
  Layout,
  Upload,
  message,
  Form,
  Input,
  Button,
  Row,
  Col,
  Modal,
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
import { M3d } from '../../atlas/anatomic-model/m3d';

const { Content } = Layout;

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
const ColForm = styled(Col)`
  margin-bottom: 10px;
`;

const M3dContainer = styled.div`
  width: 900px;
  position: relative;
`


export class StepTwo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint:
        'http://ec2-18-223-172-78.us-east-2.compute.amazonaws.com/api/v1/storage/store',
      atlas: {
        atlas_categories: [],
        title: ''
      },
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
    const atlas = result.data;
    atlas.atlas_categories.map(item => {
      item.anatomic_maps = [];
    });
    this.setState({ atlas });
  }
  componentDidUpdate() {
    console.log(this.state);
  }
  handlerSet = newState => {
    this.setState(newState);
  };
  handlerGet = () => {
    return this.state;
  };
  addAnatomicMap = i => {
    const newMap = {
      img: [],
      xray: [],
      url3d: null,
      m3d: {}
    };
    const atlas = this.state.atlas;
    atlas.atlas_categories[i].anatomic_maps.push(newMap);
    this.setState({ atlas });
  };
  render() {
    const cat = this.state.atlas.atlas_categories.map((item, i) => (
      <div key={i}>
        <SRow>
          <Col span={20}>
            <CategoryName>{item.tag}</CategoryName>
          </Col>
          <Col span={4} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => this.addAnatomicMap(i)}>
              Añadir mapa anatomico
            </Button>
          </Col>
          {item.anatomic_maps.map((amap, j) => {
            const RForm = Form.create()(prevForm);

            return (
              <ColForm key={j} span={24} justify="end">
                <RForm
                  index={{ i: i, j: j }}
                  sState={this.handlerSet}
                  gState={this.handlerGet}
                />
              </ColForm>
            );
          })}
        </SRow>
      </div>
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
          </Content>
        </Layout>
      </div>
    );
  }
}

class prevForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      endpoint:
        'http://ec2-18-223-172-78.us-east-2.compute.amazonaws.com/api/v1/storage/store',
      disabled: false,
      visible: false,
      m3d: {
        modal: false,
      }
    };

    this.m3d = createRef()
  }
  send = async e => {
    e.preventDefault();
    this.setState({ disabled: true });
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
      }
    });
    // const description = values.description;
    // const name = values.name;
    // const cat = values.categories;
    // const newCat = cat.slice(1, cat.length).map(item => {
    //   return { tag: item };
    // });
    // const url =
    //   'http://ec2-18-222-136-65.us-east-2.compute.amazonaws.com/atlas/';
    // const data = {
    //   atla: {
    //     title: name,
    //     description: description,
    //     organization_id: this.props.organizationId,
    //     responsable_id: this.props.responsableId,
    //     cover: {
    //       url: 'http://d2gg5obs453f89.cloudfront.net/' + this.state.cover
    //     },
    //     atlas_categories_attributes: newCat
    //   }
    // };
    // const options = {
    //   method: 'POST',
    //   headers: {
    //     'Access-Control-Allow-Origin': '*',
    //     'Content-Type': 'application/json'
    //   },
    //   data: JSON.stringify(data),
    //   url
    // };
    // const result = await axios(options);
    // this.props.changeStep({ atlasId: result.data.id, step: 2 });
    //   {"description": "Lorem IPSUM",
    //   "m3d": {
    //       "orbit": {
    //           "position": {
    //               "x": 17,
    //               "y": 13,
    //               "z": 550
    //           },
    //           "rotation": {
    //               "x": 1.633995837560991,
    //               "y": 0.049426731896162514,
    //               "z": -3.001684471665421
    //           }
    //       },
    //       "attachments": [
    //           {
    //               "position": {
    //                   "x": -29.12763747984428,
    //                   "y": -5.589877628129436,
    //                   "z": 11.32405740938134
    //               },
    //               "data": {
    //                   "title": "M. Bíceps braquial",
    //                   "content": "Lorem Ipsum"
    //               }
    //           },
    //       ]
    //   },
    // "anatomic_categories_attributes":[
    // {	"atlas_category_id": 22}
    // ],
    //   "url": "http://d2gg5obs453f89.cloudfront.net/1505152217025",
    //   "name": "Brazo"
  };
  handleCoverUpload = (info, type, index) => {
    const i = index[0];
    const j = index[1];
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      const prefix = 'http://d2gg5obs453f89.cloudfront.net/';
      const atlas = this.props.gState().atlas; //this.state.atlas;

      const anatomic_map = atlas.atlas_categories[i].anatomic_maps[j];
      const fileName = info.fileList[0].response.fileNames[0];
      const fUrl = prefix + fileName;
      switch (type) {
        case 'm3d':
          anatomic_map.url3d = fUrl;
          this.setState(() => ({
            m3d: {
              modal: true,
              url: fUrl,
            }
          }))
          break;
        case 'xray':
          anatomic_map.xray.push({ url: fUrl });
          break;
        case 'images':
          anatomic_map.img.push({ url: fUrl });
          break;
        default:
          break;
      }
      // this.setState({ atlas });
      this.props.sState({ atlas });
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };
  showModal = () => {
    this.setState({ visible: true })
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };
  handleCreate = () => {
    this.setState({ visible: false });  
  };

  handleM3dSave = async () => {
    const data = this.m3d.current.getCurrentState()
    console.log(data)
    this.setState(state => ({
      m3d: {
        ...state.m3d,
        loading: true,
      }
    }))
    await new Promise(res => setTimeout(res, 1000))
    this.setState({
      m3d: {
        loading: false,
        modal: false,
      }
    })
  }
  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;
    const { i, j } = this.props.index;
    console.log(this.state)
    return (
      <Form layout="inline" onSubmit={this.send}>
        <Row justify="end">
          <Col span={8}>
            <Form.Item>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Ingrese nombre del mapa anatomico'
                  }
                ]
              })(
                <Input
                  placeholder="Nombre mapa anatomico"
                  disabled={this.state.disabled}
                />
              )}
            </Form.Item>
          </Col>
          <Col
            span={16}
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            Agregar
            <Button disabled={this.state.disabled} onClick={this.showModal}>
              <FaAlignJustify />
              {/* {console.log(this.state.visible)} */}
            </Button>
            <Modal
              visible={this.state.visible}
              title="Añada una descripción del mapa anatomico"
              okText="Guardar"
              cancelText="Cancelar"
              onCancel={this.handleCancel}
              onOk={this.handleCreate}
            />
            <Upload
              action={this.state.endpoint}
              onChange={info => this.handleCoverUpload(info, 'm3d', [i, j])}
              name="file"
            >
              <Button disabled={this.state.disabled}>
                <FaCodepen />
              </Button>
            </Upload>
            <Upload
              action={this.state.endpoint}
              onChange={info => this.handleCoverUpload(info, 'xray', [i, j])}
              name="file"
            >
              <Button disabled={this.state.disabled}>
                <FaXRay />
              </Button>
            </Upload>
            <Button disabled={true}>
              <FaYoutube />
            </Button>
            <Upload
              action={this.state.endpoint}
              onChange={info => this.handleCoverUpload(info, 'images', [i, j])}
              name="file"
            >
              <Button disabled={this.state.disabled}>
                <FaRegImages />
              </Button>
            </Upload>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={this.state.disabled}
              >
                <FaRegSave /> Guardar Mapa Anatomico
              </Button>
            </Form.Item>
          </Col>
        </Row>

        <Modal visible={this.state.m3d.modal} foter={[
          <Button key="save" type="primary" loading={this.state.m3d.loading} onClick={this.handleM3dSave}>Guardar</Button>
        ]} width={1000}>
          {this.state.m3d.url && (
            <M3dContainer>
              <M3d url={this.state.m3d.url} editing={true} ref={this.m3d}/>
            </M3dContainer>
          )}
        </Modal>
      </Form>
    );
  }
}
