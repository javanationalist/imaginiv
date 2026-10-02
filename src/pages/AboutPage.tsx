/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass } from 'lucide-react';
import { PageShell } from '../components/common/PageShell';
import { PageTitle } from '../components/common/PageTitle';
import { DemoLoadingState } from '../components/common/DemoLoadingState';

/**
 * Data-fetching stub ready to connect to the database later.
 */
export const useFetchAboutInfo = () => {
  return { aboutData: null, loading: true };
};

export const AboutPage: React.FC = () => {
  useFetchAboutInfo();

  return (
    <PageShell>
      {/* 1. Page Title */}
      <PageTitle
        title="About Imaginiv"
        subtitle="The story, vision, mission, and collaborative village philosophy behind our multidisciplinary creative studio."
        icon={<Compass className="w-8 h-8 text-[#A05C25]" strokeWidth={2.3} />}
        categoryTag="Village Hall & Atelier"
        accentColor="primary"
      />

      {/* 2. Demo Loading State */}
      <DemoLoadingState />
    </PageShell>
  );
};
