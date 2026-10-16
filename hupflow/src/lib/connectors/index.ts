import { SocialConnector, SocialProvider } from './types';
import { linkedInConnector } from './linkedin';
import { xTwitterConnector } from './x-twitter';
import { instagramConnector } from './instagram';
import { threadsConnector } from './threads';

export * from './types';
export * from './encryption';

const registry: Partial<Record<SocialProvider, SocialConnector>> = {
  linkedin: linkedInConnector,
  x: xTwitterConnector,
  instagram: instagramConnector,
  threads: threadsConnector,
};

export function getSocialConnector(provider: SocialProvider): SocialConnector {
  const connector = registry[provider];
  if (!connector) {
    throw new Error(`Conector para a rede social "${provider}" não encontrado ou não implementado.`);
  }
  return connector;
}
