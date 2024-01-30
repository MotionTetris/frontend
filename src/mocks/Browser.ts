// src/mocks/browser.ts
import { setupWorker } from 'msw/browser';
import { handlers } from './Handlers.ts';

export const worker = setupWorker(...handlers);

worker.start();