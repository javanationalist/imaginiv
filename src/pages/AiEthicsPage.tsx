/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Scale } from 'lucide-react';
import { PageShell } from '../components/common/PageShell';
import { PageTitle } from '../components/common/PageTitle';
import { DemoLoadingState } from '../components/common/DemoLoadingState';

/**
 * Data-fetching stub ready to connect to the database later.
 */
export const useFetchAiEthics = () => {
  return { ethicsPillars: [], loading: true };
};

export const AiEthicsPage: React.FC = () => {
  useFetchAiEthics();

  return (
    <PageShell>
      {/* 1. Page Title */}
      <PageTitle
        title="AI Ethics"
        subtitle="Our institutional charter governing responsible artificial intelligence, human authorship guarantees, and copyright integrity."
        icon={<Scale className="w-8 h-8 text-[#A05C25]" strokeWidth={2.3} />}
        categoryTag="Wisdom Tower Charter"
        accentColor="primary"
      />

      {/* 2. Demo Loading State */}
      <DemoLoadingState />
    </PageShell>
  );
};
