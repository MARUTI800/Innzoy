import path from 'node:path';
import { fileURLToPath } from 'node:url';
import base from '../../next.config.mjs';

export default {
  ...base,
  turbopack: { root: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..') },
};
