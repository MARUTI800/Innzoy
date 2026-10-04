// Node 24 native TypeScript support; no test-runner dependency is required.
import { registerHooks } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'server-only') return { url: 'data:text/javascript,export%20{}', shortCircuit: true };
    if (specifier.startsWith('@/')) return nextResolve(pathToFileURL(resolve('src', `${specifier.slice(2)}.ts`)).href, context);
    try { return nextResolve(specifier, context); }
    catch (error) {
      if (specifier.startsWith('.') && !/\.[cm]?[jt]sx?$/.test(specifier)) return nextResolve(`${specifier}.ts`, context);
      throw error;
    }
  },
});
