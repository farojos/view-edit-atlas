// import React, { Component } from 'react';
// import styled from 'styled-components';
// import { Layout } from 'antd';
// import axios from 'axios';

// const { Header, Content } = Layout;

// const Title = styled.h1`
//   color: dimgray;
// `;
// const SubTitle = styled.h2`
//   color: gray;
// `;
// const Description = styled.p`
//   color: lightgray;
// `;
// const SHeaderTitle = styled(Header)`
//   position: 'fixed';
//   zindex: 1;
//   width: '100%';
//   background: white;
// `;
// const Container = styled.div`
//   background: 'white';
//   padding: 24px;
//   padding-top: 50px;
//   padding-left: 50px;
//   min-height: 380px;
//   display: flex;
//   flex-direction: row;
// `;

// export class StepOne extends Component {
//   render() {
//     return (
//       <div>
//         <Layout>
//           <Title>Crear Atlas</Title>
//           <SubTitle>Formulario de creación de Atlas</SubTitle>
//         </Layout>
//         <Layout>
//           <Content>
//             <Description>
//               En el siguiente formulario uds debe asignar un nombre al atlas a
//               crear. las categorias que este tenga. Una descripción del atlas en
//               su completitud y una foto representativa del mismo.
//             </Description>
//           </Content>
//         </Layout>
//       </div>
//     );
//   }
// }
import React, { Component } from 'react';
import axios from 'axios';

export class StepOne extends Component {
  constructor() {
    super();
    this.state = {
      file: null
    };
  }

  submitFile = async event => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', this.state.file[0]);
    axios
      .post(`/test-upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        // handle your response;
      })
      .catch(error => {
        // handle your error
      });
  };

  handleFileUpload = event => {
    this.setState({ file: event.target.files });
  };

  render() {
    return (
      <form onSubmit={this.submitFile}>
        <input
          label="upload file"
          type="file"
          onChange={this.handleFileUpload}
        />
        <button type="submit">Send</button>
      </form>
    );
  }
}
