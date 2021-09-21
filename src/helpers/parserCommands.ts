import { COMMANDS_NAMES } from "../constants";

type ParsedCommandType = {
  command: string;
  args: string[];
};

export function getBotCommandArgs(message: string): ParsedCommandType {
  const args = message.split(" ");

  return {
    command: args[0].toLowerCase(),
    args: args.slice(1).filter((arg) => arg !== ""),
  };
}

export function isValidCommand(command: string): boolean {
  const containsCommand = COMMANDS_NAMES.includes(command);

  if (!command.startsWith("!")) return false;
  return containsCommand;
}
