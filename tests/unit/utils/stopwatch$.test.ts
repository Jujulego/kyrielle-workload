import { WorkloadState } from '@/src/enums/workload-state.js';
import { stopwatch$ } from '@/src/utils/stopwatch$.js';
import { var$ } from 'kyrielle';
import { beforeEach, describe, expect, it, vi } from 'vitest';

beforeEach(() => {
  vi.resetAllMocks();

  vi.spyOn(performance, 'now');
});

describe('stopwatch$', () => {
  it('should initially be empty', () => {
    const duration$ = stopwatch$(var$());

    expect(duration$.defer().start).toBeNull();
    expect(duration$.defer().end).toBeNull();
    expect(duration$.defer().seconds()).toBe(0);
  });

  it('should fill start when state becomes "starting", and compute duration using current timestamp', () => {
    const state$ = var$(WorkloadState.Ready);
    const duration$ = stopwatch$(state$);

    expect(duration$.defer().start).toBeNull();

    vi.mocked(performance.now).mockReturnValueOnce(42);
    state$.mutate(WorkloadState.Starting);

    expect(duration$.defer().start).toBe(42);

    vi.mocked(performance.now).mockReturnValueOnce(84);
    expect(duration$.defer().seconds()).toBe(0.042);
  });

  it('should fill end when state reaches an end state', () => {
    const state$ = var$(WorkloadState.Ready);
    const duration$ = stopwatch$(state$);

    expect(duration$.defer().end).toBeNull();

    vi.mocked(performance.now).mockReturnValueOnce(42);
    state$.mutate(WorkloadState.Starting);

    vi.mocked(performance.now).mockReturnValueOnce(84);
    state$.mutate(WorkloadState.Succeeded);

    expect(duration$.defer().end).toBe(84);
    expect(duration$.defer().seconds()).toBe(0.042);
  });
});
