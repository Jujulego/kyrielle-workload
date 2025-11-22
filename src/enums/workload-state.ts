/**
 * State of a given workload.
 * @since 1.0.0
 */
export enum WorkloadState {
  /**
   * Workload is blocked, not yet ready to be started
   * @since 1.0.0
   */
  Blocked = 'blocked',

  /**
   * Workload is waiting to be started
   * @since 1.0.0
   */
  Ready = 'ready',

  /**
   * Workload is starting
   * @since 1.0.0
   */
  Starting = 'starting',

  /**
   * Workload is running
   * @since 1.0.0
   */
  Running = 'running',

  /**
   * Workload successfully ended
   * @since 1.0.0
   */
  Succeeded = 'succeeded',

  /**
   * Workload failed
   * @since 1.0.0
   */
  Failed = 'failed',

  /**
   * Workload is canceling
   * @since 1.0.0
   */
  Canceling = 'canceling',

  /**
   * Workload was canceled
   * @since 1.0.0
   */
  Canceled = 'canceled',
}

/**
 * Checks if given state is a waiting state, before anything is done
 * @since 1.0.0
 */
export function isWorkloadWaiting(state: WorkloadState): boolean {
  return [WorkloadState.Blocked, WorkloadState.Ready].includes(state);
}

/**
 * Checks if given state is an active state
 * @since 1.0.0
 */
export function isWorkloadActive(state: WorkloadState): boolean {
  return [WorkloadState.Starting, WorkloadState.Running, WorkloadState.Canceling].includes(state);
}

/**
 * Checks if given state is an end state, workload is either done, failed or completed, and nothing is happening anymore
 * @since 1.0.0
 */
export function isWorkloadEnded(state: WorkloadState): boolean {
  return [WorkloadState.Succeeded, WorkloadState.Failed, WorkloadState.Canceled].includes(state);
}
