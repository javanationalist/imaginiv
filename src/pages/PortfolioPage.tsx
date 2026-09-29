/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Images } from 'lucide-react';
import { PageShell } from '../components/common/PageShell';
import { PageTitle } from '../components/common/PageTitle';
import { DemoLoadingState } from '../components/common/DemoLoadingState';

/**
 * Data-fetching stub ready to connect to the database later.
 */
export const useFetchPortfolio = () => {
  return { portfolioItems: [], loading: true };
};

export const PortfolioPage: React.FC = () => {
  useFetchPortfolio();

  return (
    <PageShell>
      {/* 1. Page Title */}
      <PageTitle
        title="Portfolio"
        subtitle="A curated showcase of our narrative cinema, brand identities, spatial pavilions, and tactile publications."
        icon={<Images className="w-8 h-8 text-[#2F8FE0]" strokeWidth={2.3} />}
        categoryTag="Showcase Pavilion"
        accentColor="blue"
      />

      {/* 2. Demo Loading State */}
      <DemoLoadingState />
    </PageShell>
  );
};
