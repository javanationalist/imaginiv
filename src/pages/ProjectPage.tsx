/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Clapperboard } from 'lucide-react';
import { PageShell } from '../components/common/PageShell';
import { PageTitle } from '../components/common/PageTitle';
import { DemoLoadingState } from '../components/common/DemoLoadingState';

/**
 * Data-fetching stub ready to connect to the database later.
 */
export const useFetchProjects = () => {
  return { projects: [], loading: true };
};

export const ProjectPage: React.FC = () => {
  useFetchProjects();

  return (
    <PageShell>
      {/* 1. Page Title */}
      <PageTitle
        title="Project"
        subtitle="Active media productions, narrative documentaries, and spatial client commissions crafted with human tactile care."
        icon={<Clapperboard className="w-8 h-8 text-[#A05C25]" strokeWidth={2.3} />}
        categoryTag="Productions Atelier"
        accentColor="orange"
      />

      {/* 2. Demo Loading State */}
      <DemoLoadingState />
    </PageShell>
  );
};
