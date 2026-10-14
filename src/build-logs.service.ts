import { Injectable } from '@nestjs/common';
import { ChildProcess, spawn } from 'child_process';

export type BuildLogEvent = {
  stream: 'stdout' | 'stderr' | 'system' | 'exit';
  data: string;
};

@Injectable()
export class BuildLogsService {
  private child: ChildProcess | null = null;

  isRunning(): boolean {
    return this.child !== null;
  }

  start(onLog: (event: BuildLogEvent) => void): void {
    if (this.child) {
      onLog({ stream: 'system', data: 'A build is already running.' });
      return;
    }

    const command = process.env.BUILD_COMMAND ?? 'npm run build';
    onLog({ stream: 'system', data: `Running: ${command}` });

    const child = spawn(command, { shell: true });
    this.child = child;

    child.stdout?.on('data', (chunk: Buffer) => {
      onLog({ stream: 'stdout', data: chunk.toString() });
    });

    child.stderr?.on('data', (chunk: Buffer) => {
      onLog({ stream: 'stderr', data: chunk.toString() });
    });

    child.on('error', (error: Error) => {
      onLog({ stream: 'stderr', data: error.message });
      this.child = null;
    });

    child.on('close', (code: number | null) => {
      onLog({ stream: 'exit', data: `Build finished with code ${code ?? 'null'}` });
      this.child = null;
    });
  }
}
