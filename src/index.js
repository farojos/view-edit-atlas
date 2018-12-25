import React from 'react';
import { render } from 'react-dom';
import { AtlasComponent, AtlasCreation } from './lib';

render(
  <div>
    <AtlasComponent atlas="68c67704-6f82-4503-bd96-7863461ffcda" />
    {/* <AtlasCreation /> */}
  </div>,
  document.getElementById('root')
);
