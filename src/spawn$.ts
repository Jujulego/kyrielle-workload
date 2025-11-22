import { filter$, type Observable, once$, pipe$, type Ref, var$ } from 'kyrielle';
import { execFile } from 'node:child_process';
import { PassThrough, type Readable } from 'node:stream';
import { isWorkloadEnded, WorkloadState } from './enums/workload-state.js';
import { type Job$, job$, type JobProps } from './job$.js';

/**
 * Creates a job spawning a process in a shell.
 * @since 1.0.0
 */
export function spawn$(cmd: string, props: SpawnProps = {}): SpawnJob$ {
  const { cwd = process.cwd(), env = {}, shell = false, ...rest } = props;
  const exitCode$ = var$<number>();
  const stdout = new PassThrough({ allowHalfOpen: false });
  const stderr = new PassThrough({ allowHalfOpen: false });

  const job = job$({
    label: cmd,
    type: 'spawn',
    ...rest,
    onStart({ signal, setState }) {
      const spawned = execFile(cmd, [], {
        shell,
        windowsHide: true,
        signal,
        killSignal: 'SIGTERM',
        cwd,
        env: { ...process.env, ...env },
      });

      spawned.once('spawn', () => setState(WorkloadState.Running));
      spawned.once('error', () => setState(WorkloadState.Failed));
      spawned.once('close', (code) => {
        if (code === 0) {
          setState(WorkloadState.Succeeded);
        } else {
          setState(WorkloadState.Failed);
        }

        if (code !== null) {
          exitCode$.mutate(code);
        }
      });

      spawned.stdout!.pipe(stdout);
      spawned.stderr!.pipe(stderr);
    }
  });

  const ended$ = pipe$(job.state$, filter$(isWorkloadEnded));
  once$(ended$, () => {
    stdout.end();
    stderr.end();
  });

  return {
    ...job,
    cmd,
    cwd,
    env,
    exitCode$,
    stderr,
    stdout,
    exitCode: () => exitCode$.defer() ?? null
  };
}

export interface SpawnJob$ extends Job$ {
  readonly cmd: string;

  /**
   * Directory where to run the command.
   * @since 1.0.0
   */
  readonly cwd: string | undefined;

  /**
   * Environment variables. Will be merged with `process.env`.
   * @since 1.0.0
   */
  readonly env: Readonly<Record<string, string>>;

  /**
   * Spawned process stdout stream.
   * @since 1.0.0
   */
  readonly stdout: Readable;

  /**
   * Spawned process stderr stream.
   * @since 1.0.0
   */
  readonly stderr: Readable;

  /**
   * Spawned process exit code.
   * @since 1.0.0
   */
  exitCode(this: void): number | null;

  /**
   * Reference on spawned process exit code.
   * @since 1.0.0
   */
  readonly exitCode$: Ref<number | undefined> & Observable<number>;
}

export interface SpawnProps extends Omit<JobProps, 'label' | 'onStart' | 'onCancel'> {
  /**
   * Friendly name of the workload.
   * @since 1.0.0
   */
  readonly label?: string;

  /**
   * Directory where to run the command.
   * @since 1.0.0
   */
  readonly cwd?: string;

  /**
   * Environment variables. Will be merged with `process.env`.
   * @since 1.0.0
   */
  readonly env?: Record<string, string>;

  /**
   * Enables shell usage.
   * @since 1.0.0
   */
  readonly shell?: boolean;
}
