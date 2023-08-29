import { CommandType } from "../../../command";
import { useTodoStore } from "../todoStore";
import TaskType = Todo.TaskType;

/**
 *  删除任务命令
 *  @author bosom
 */

const deleteCommand: CommandType = {
    func: 'delete',
    name: '删除任务',
    options: [{
        key: "name",
        desc: "任务名称",
        alias: ["n"],
        type: "string",
        required: true
    }],
    action(options, terminal) {
        //获取pinia数据
        const todoStore = useTodoStore()

        const { name } = options;
        let target: number = -1
        todoStore.taskList.forEach((item, index) => {
            if (item.name === name) {
                target = index
            }
        })
        if (target == -1) {
            terminal.writeTextErrorResult('无待删除的任务')
        } else {
            const res = todoStore.deleteTask(target)
            terminal.writeTextSuccessResult('删除成功')
        }
    }
}

export default deleteCommand;