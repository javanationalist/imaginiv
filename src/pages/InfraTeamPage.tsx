/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Users } from 'lucide-react';
import { PageShell } from '../components/common/PageShell';
import { PageTitle } from '../components/common/PageTitle';
import { DemoLoadingState } from '../components/common/DemoLoadingState';

/**
 * Data-fetching stub ready to connect to the database later.
 */
export const useFetchTeam = () => {
  return { teamMembers: [], loading: true };
};

export const InfraTeamPage: React.FC = () => {
  useFetchTeam();

  return (
    <PageShell>
      {/* 1. Page Title */}
      <PageTitle
        title="inFra Team"
        subtitle="Meet the multidisciplinary collective of directors, narrative architects, sound ecologists, and creative technologists."
        icon={<Users className="w-8 h-8 text-[#52C01B]" strokeWidth={2.3} />}
        categoryTag="Artisan Guild"
        accentColor="green"
      />

      {/* 2. Demo Loading State */}
      <DemoLoadingState />
    </PageShell>
  );
};
