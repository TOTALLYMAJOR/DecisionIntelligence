import { AnthropicAnalysisProvider } from './anthropic-provider';
import { MockAnalysisProvider } from './mock-provider';
import { OpenAiAnalysisProvider } from './openai-provider';
import type { AiAnalysisProvider, AiProviderMode, AnalysisRequest, RoutedAnalysisResult } from './types';

const providers = {
  mock: new MockAnalysisProvider(),
  openai: new OpenAiAnalysisProvider(),
  anthropic: new AnthropicAnalysisProvider(),
} satisfies Record<'mock' | 'openai' | 'anthropic', AiAnalysisProvider>;

export const resolveProviderMode = (value = process.env.AI_PROVIDER_MODE): AiProviderMode => {
  const normalized = value?.trim().toLowerCase();
  return normalized === 'openai' || normalized === 'anthropic' || normalized === 'dual' ? normalized : 'mock';
};

export const analyzeWithConfiguredProviders = async (
  request: AnalysisRequest,
  mode = resolveProviderMode(),
): Promise<RoutedAnalysisResult> => {
  const selected = mode === 'dual' ? [providers.openai, providers.anthropic] : [providers[mode]];
  const results = await Promise.all(selected.map((provider) => provider.analyze(request)));
  return {
    mode,
    authorityBoundary: 'Provider results are independent review candidates. They are never silently merged and never mutate historical or canonical knowledge.',
    results,
  };
};
