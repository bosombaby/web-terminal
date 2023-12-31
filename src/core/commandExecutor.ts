import getopts, { ParsedOptions } from "getopts";
import { commandMap } from "./commandRegister";
import { CommandOptionType, CommandType } from "./command";
import TerminalType = YuTerminal.TerminalType;
import helpCommand from "./commands/terminal/help/helpCommand";

/**
 * 执行命令
 * @param text 输入字符串
 * @param terminal 终端
 * @param parentCommand
 */
export const doCommandExecute = async (
  text: string,
  terminal: TerminalType,
  parentCommand?: CommandType
) => {
  //去除命令首尾空格
  text = text.trim();
  if (!text) {
    return;
  }

  console.log("2 得到命令", text);

  // 解析文本，得到命令
  const command: CommandType = getCommand(text, parentCommand);

  if (!command) {
    terminal.writeTextErrorResult("找不到命令");
    return;
  }

  // 解析参数（需传递不同的解析规则）
  const parsedOptions = doParse(text, command.options);
  const { _ } = parsedOptions;
  // 有子命令，执行
  if (
    _.length > 0 &&
    command.subCommands &&
    Object.keys(command.subCommands).length > 0
  ) {
    // 把子命令当做新命令解析，user login xxx => login xxx
    const subText = text.substring(text.indexOf(" ") + 1);
    await doCommandExecute(subText, terminal, command);
    return;
  }

  // 执行命令
  await doAction(command, parsedOptions, terminal, parentCommand);
};

/**
 * 获取命令（匹配）
 * @param text
 * @param parentCommand
 */
const getCommand = (text: string, parentCommand?: CommandType): CommandType => {
  let func = text.split(" ", 1)[0];

  console.log("3 解析开头命令", func);

  // 大小写无关
  func = func.toLowerCase();
  let commands = commandMap;
  // 有父命令，则从父命令中查找
  if (
    parentCommand &&
    parentCommand.subCommands &&
    Object.keys(parentCommand.subCommands).length > 0
  ) {
    commands = parentCommand.subCommands;
  }
  const command = commands[func];

  console.log("3 匹配命令，到map命令集搜索", command);
  return command;
};

/**
 * 解析参数
 * @param text
 * @param commandOptions
 */
const doParse = (
  text: string,
  commandOptions: CommandOptionType[]
): getopts.ParsedOptions => {
  // 过滤掉关键词，有bug，匹配到只剩下一个空格
  const args: string[] = text.split(" ").slice(1);
  console.log("3 => 过滤掉关键词", args);
  // 转换
  const options: getopts.Options = {
    alias: {},
    default: {},
    string: [],
    boolean: [],
  };

  console.log("解析前", options);

  commandOptions.forEach((commandOption) => {
    console.log("原始命令", commandOption);

    const { alias, key, type, defaultValue } = commandOption;
    if (alias && options.alias) {
      options.alias[key] = alias;
    }
    options[type]?.push(key);
    if (defaultValue && options.default) {
      options.default[key] = defaultValue;
    }

    console.log("解析命令", options);
  });

  const parsedOptions = getopts(args, options);
  console.log(parsedOptions._);

  console.log("3 => 解析器执行", parsedOptions);
  return parsedOptions;
};

/**
 * 执行
 * @param command
 * @param options
 * @param terminal
 * @param parentCommand
 */
const doAction = async (
  command: CommandType,
  options: ParsedOptions,
  terminal: TerminalType,
  parentCommand?: CommandType
) => {
  const { help } = options;
  // 设置输出折叠
  if (command.collapsible || help) {
    terminal.setCommandCollapsible(true);
  }
  // 查看帮助
  // e.g. xxx --help => { _: ["xxx"] }
  if (help) {
    const newOptions = { ...options, _: [command.func] };
    helpCommand.action(newOptions, terminal, parentCommand);
    return;
  }

  // 执行命令
  const result = await command.action(options, terminal);
  console.log("4 执行命令", result);
};
