import { CronJob } from "cron";

import { FetchApi } from "./fetch-api";

export class ManagerCronsJobs {
  private readonly fetchApi: FetchApi = new FetchApi();

  public startUpdatedMusicsJob(): void {
    // job start every 1 hour

    const job = new CronJob(
      "0 */1 * * *",
      async () => {
        await this.fetchApi.emitUpdateMusicList();
      },
      null,
      true,
      "America/Los_Angeles",
    );

    job.start();
  }
}
