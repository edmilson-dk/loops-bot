type ParsedCommandType = {
  command: string;
  args: string[];
};

export function getBotCommandArgs(message: string): ParsedCommandType {
  const args = message.split(" ");

  return {
    command: args[0],
    args: args.slice(1).filter((arg) => arg !== ""),
  };
}
