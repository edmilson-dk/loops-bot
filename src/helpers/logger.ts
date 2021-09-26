const date = new Date();

class Logger {
  private readonly day: number = date.getDate();
  private readonly month: number = date.getMonth() + 1;
  private readonly year: number = date.getFullYear();
  private readonly minutes: number = date.getMinutes();
  private readonly hours: number = date.getHours();
  private readonly seconds: number = date.getSeconds();

  private readonly timestamp: string = `${this.day}-${this.month}-${this.year} [${this.hours}:${this.minutes}:${this.seconds}]`;

  public info(message: string): void {
    console.log(`${this.timestamp} [INFO] ${message}`);
  }

  public error(message: string): void {
    console.log(`${this.timestamp} [ERROR] ${message}`);
  }

  public warn(message: string): void {
    console.log(`${this.timestamp} [WARN] ${message}`);
  }
}

export const logger = new Logger();
