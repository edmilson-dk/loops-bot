import chalk from "chalk";

const date = new Date();

class Logger {
  private readonly day: number = date.getDate();
  private readonly month: number = date.getMonth() + 1;
  private readonly year: number = date.getFullYear();
  private readonly minutes: number | string =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  private readonly hours: number | string =
    date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  private readonly seconds: number | string =
    date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
  private readonly pmOrAm: string = this.hours >= 12 ? "PM" : "AM";

  private readonly timestamp: string = `${this.day}-${this.month}-${this.year} [${this.hours}h:${this.minutes}m:${this.seconds}s - ${this.pmOrAm}]`;

  public info(message: string): void {
    console.log(chalk.cyan(`${this.timestamp} [INFO] - ${message}`));
  }

  public error(message: string): void {
    console.log(chalk.red(`${this.timestamp} [ERROR] - ${message}`));
  }

  public warn(message: string): void {
    console.log(chalk.yellow(`${this.timestamp} [WARN] - ${message}`));
  }
}

export const logger = new Logger();
