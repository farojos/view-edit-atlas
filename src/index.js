import React from 'react';
import { render } from 'react-dom';
import { AtlasComponent, AtlasCreation } from './lib';

render(
  <div style={{ padding: '10%' }}>
    {/* <AtlasComponent atlas="68c67704-6f82-4503-bd96-7863461ffcda" /> */}
    <AtlasCreation
      finish={console.log}
      responsableId={'fd1b2d5e-7500-4b69-9880-ab1d8b9fe148'}
      organizationId={'fd1b2d5e-7500-4b69-9880-ab1d8b9fe148'}
    />
  </div>,
  document.getElementById('root')
);
