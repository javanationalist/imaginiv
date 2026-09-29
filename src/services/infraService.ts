/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { InfraMessage } from '../types';

/**
 * inFra Assistant Foundation Architecture
 * Prepares secure integration with Gemini Flash model via backend service proxy
 * to prevent exposing API keys in client-side source code.
 */
export interface InfraQueryOptions {
  context?: string;
  tone?: 'creative' | 'technical' | 'brief';
}

export const infraService = {
  // Recommended Gemini Flash model configuration for Framedia Creative
  MODEL_NAME: 'gemini-2.5-flash',

  async queryAssistant(userPrompt: string, _options?: InfraQueryOptions): Promise<InfraMessage> {
    try {
      // In production, this calls the server-side proxy route /api/infra
      const response = await fetch('/api/infra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt, model: this.MODEL_NAME }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          id: 'infra_' + Date.now(),
          sender: 'infra',
          text: data.reply || 'inFra is ready to assist your creative village project.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }
    } catch {
      // Graceful fallback for initial foundation stage
    }

    return {
      id: 'infra_' + Date.now(),
      sender: 'infra',
      text: `Hello from inFra! I am the Framedia Creative village assistant architecture. Foundation ready for full generation.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  },
};
