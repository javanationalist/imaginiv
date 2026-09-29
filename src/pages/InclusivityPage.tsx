/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HeartHandshake } from 'lucide-react';
import { PageShell } from '../components/common/PageShell';
import { PageTitle } from '../components/common/PageTitle';
import { DemoLoadingState } from '../components/common/DemoLoadingState';

/**
 * Data-fetching stub ready to connect to the database later.
 */
export const useFetchInclusivity = () => {
  return { principles: [], loading: true };
};

export const InclusivityPage: React.FC = () => {
  useFetchInclusivity();

  return (
    <PageShell>
      {/* 1. Page Title */}
      <PageTitle
        title="Inclusivity"
        subtitle="Our commitment to universal accessibility, sensory equity, and welcoming collaborative village spaces."
        icon={<HeartHandshake className="w-8 h-8 text-[#52C01B]" strokeWidth={2.3} />}
        categoryTag="Universal Gathering Square"
        accentColor="green"
      />

      {/* 2. Demo Loading State */}
      <DemoLoadingState />
    </PageShell>
  );
};
