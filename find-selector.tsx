import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { PageTitle } from './src/components/common/PageTitle';
import { ProjectPage } from './src/pages/ProjectPage';

const html = renderToStaticMarkup(
  <div id="root">
    <div>
      <MemoryRouter>
        <ProjectPage />
      </MemoryRouter>
    </div>
  </div>
);

console.log("RENDERED HTML:\n", html);
