import type { Story } from '../types';
import { stories as initialStories } from '../stores/stories';

export const getAsyncStories = (): Promise<{ data: { stories: Story[] } }> =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ data: { stories: initialStories } }), 2000),
  );
