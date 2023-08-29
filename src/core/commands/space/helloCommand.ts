import { CommandType } from "../../command";

// 输出hello命令
const helloCommand: CommandType = {
    func: 'hello',
    name: '输出hello',
    options: [],
    action(options, terminal): void {
        const output = `你好啊`;
        terminal.writeTextResult(output);
    }
}

export default helloCommand;