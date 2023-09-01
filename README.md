# 一、前言
**项目概述**：利用暑假的时间在[知识星球](https://wx.zsxq.com/dweb2/index/group/51122858222824)学习[鱼皮](https://space.bilibili.com/12890453/)的 web 终端项目，这是一个通过命令行的方式在浏览器运行的一个工具库

**项目亮点**：

- 避免反复跳转网页，功能全部集成到命令集中，通过像 Linux 一样终端输入输出的方式，更加炫酷
- 网上前端开发比较缺少这种偏逻辑的项目，可以很好的锻炼自己的技术栈
- 考虑到系统较复杂，自主设计 web 微终端、命令系统以及命令集 3 个子系统
- 做这种东西自己会更有兴趣和动力

**开源地址**：[web-terminal](https://github.com/bosombaby/web-terminal)

**命令手册**：command lsit
# 二、系统运行
## 2.1 后台运行
```javascript
// 1. 进入server目录，安装依赖
yarn

// 2. 配置mysql数据库
文件地址：/server/db/ddl.sql

// 3. 配置Redis，具体可查看网上的教程

// 4. 运行后台
yarn run start:dev
```
## 2.2 前台运行
```javascript
//安装前台依赖
yarn 
//运行前台服务
yarn run dev
```

![1.png](https://cdn.nlark.com/yuque/0/2023/png/27367619/1693468402142-c8b2ab9c-5ff9-49c4-a360-43e293306e87.png#averageHue=%23354c58&clientId=ufb35da8d-b3ce-4&from=ui&id=u6e59b779&originHeight=865&originWidth=1913&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=1423470&status=done&style=none&taskId=u5797af38-cbbf-44fb-96d7-0b9247372bd&title=)
# 三、技术选型
## 3.1 构思需求
:::info

1. 这个功能有没有是否影响你项目的上线？（只要不影响，都先不做） 
2. 功能的实用性、是否贴合主题
:::
## 3.2 优先级

1. 终端完成简单的输入输出
2. 对输入的指令进行解析
3. 渲染解析的结果异步加载到 Vue 组件
4. 项目的通用性设计（系统设计，定制规范）
5. 开发多种适配命令
## 3.3 技术准则
:::info
**在有限的条件和特点场景下下，寻求技术最优解**
:::

1. 不要重复造轮子，尽早做技术选型
2. 从系统的大类细分，需要前端/后端/客户端/......，大的方向再细分技术
3. 要从实际出发，贴合业务和项目。比如老项目要考虑版本兼容性，新项目结合实际需求和现有资源
4. 业务量级、核心流程和关键数据、性能偏向哪些方面
5. 从自己/团队现有的技术栈考虑，不要引入冷门的技术
## 3.4 后端技术栈
**主要技术：**

- Node.js后台
- Express、express-session
- MySQL
- Sequelize（ORM 框架）
- Redis

**依赖库**：

- Axios
- 网易云音乐 NeteaseCloudMusicApi
-  百度翻译 API
## 3.5 前端技术栈
**主要技术：**

- Vue 3 前端开发，主流
- Vite 2 前端构建工具，新兴 / 优秀，本地编译速度很快，提高开发效率
- Ant Design Vue 3 组件库（不用 Element UI？用的熟练，ant design 主流，支持 vue 和 react，更通用）
- Pinia 2 状态管理（Vuex，pinia 兼容 vuex）
- TypeScript 类型控制（项目规范，编辑器 / 开发工具会给你提示问题）
- Eslint 代码规范控制（项目规范，自动语法校验）
- Prettier 美化代码（项目规范，自动格式化代码）

**依赖库：**

- axios 网络请求
- dayjs 时间处理
- lodash 工具库
- getopts 命令参数解析
# 四、系统设计

![系统分析.png](https://cdn.nlark.com/yuque/0/2023/png/27367619/1693471413309-0c207b8e-3550-4448-a234-257b3e99c714.png#averageHue=%23f7f6f5&clientId=ufb35da8d-b3ce-4&from=ui&id=u123c1444&originHeight=624&originWidth=801&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=253799&status=done&style=none&taskId=uf9612b24-fd51-4e4e-b881-ff27cee4221&title=)

**系统主要分为以下三个模块：**

- 微终端：系统显示的主界面
- 命令系统：接受匹配的命令，解析执行
- 命令集：用户定义的命令集规则
## 4.1 微终端

1. 接受用户的输入，控制用户的输出
2. 用户输入使用防抖匹配命令集的命令，匹配到在底部显示
3. 用户执行的命令会存储到列表中，方便历史命令接口查询
4. 快捷键如清空屏幕、上下键
5. 操作接口主要是暴露给命令系统的方法，规定可以对终端做哪些操作
### 4.1.1 输入
```javascript
const onSubmitCommand = async (inputText: string) => {
  if (!inputText) {
    return;
  }
  const terminal = terminalRef.value.terminal;

  console.log("1 接受终端输入", inputText, terminal);

  await doCommandExecute(inputText, terminal);
};
```

- 将终端封装成一个组件的形式，外部进行调用
- 外部接受到组件的输入，然后才调用命令系统（分离逻辑，扩展更加容易）
### 4.1.2 提示

- 用户输入使用 watchEffect 追踪，调用 hint.ts 方法
- 使用前缀匹配命令集 map 中第一个命令，返回值，临时渲染到输入框下方
### 4.1.3 历史 
```typescript
const commandList = ref<CommandOutputType[]>([]);
```

- 使用数组列表存储过往数据
- 控制索引，可以根据上下键、list命令查看历史命令
### 4.1.4 快捷键 
```typescript
export const registerShortcuts = (terminal: TerminalType) => {
  document.onkeydown = (e) => {
    // console.log(e);
    let key = e.key;
    // 自动聚焦输入框
    if (key >= "a" && key <= "z" && !e.metaKey && !e.shiftKey && !e.ctrlKey) {
      terminal.focusInput();
      return;
    }
    // 匹配快捷键
    let code = e.code;
    for (const shortcut of shortcutList) {
      if (
        code === shortcut.code &&
        e.ctrlKey == !!shortcut.ctrlKey &&
        e.metaKey == !!shortcut.metaKey &&
        e.shiftKey == !!shortcut.shiftKey
      ) {
        shortcut.action(e, terminal);
      }
    }
  };
};
```

- 全局监听用户键盘输入，并且匹配对应的方法
### 4.1.5 操作接口
```typescript
/**
 * 操作终端的对象
 */
const terminal: TerminalType = {
  writeTextResult,
  writeTextErrorResult,
  writeTextSuccessResult,
  writeResult,
  writeTextOutput,
  writeOutput,
  clear,
  focusInput,
  isInputFocused,
  setTabCompletion,
  doSubmitCommand,
  showNextCommand,
  showPrevCommand,
  listCommandHistory,
  toggleAllCollapse,
  setCommandCollapsible,
};
```

- 微终端可以暴露给外部的操作接口
- 防止未按照规定方式操作屏幕
## 4.2 命令系统

1. 采用匹配 => 解析 => 执行机制实现
2. 子命令通过递归的方式实现子命令解析
### 4.2.1 匹配
```typescript
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
```

- 首次获取传入的text文本，分割首位命令
- 如果有子命令，递归调用函数判断
### 4.2.2 解析
**命令行解析工具**：
[GitHub - jorgebucaran/getopts: Node.js CLI options parser](https://github.com/jorgebucaran/getopts)

```typescript
/**
 * 命令类型
 */
interface CommandType {
  // 命令英文 key（必须唯一）
  func: string;
  // 命令名称
  name: string;
  // 介绍
  desc?: string;
  // 功能别名
  alias?: string[];
  // 参数配置
  params?: CommandParamsType[];
  // 选项配置
  options: CommandOptionType[];
  // 子命令
  subCommands?: Record<string, CommandType>;
  // 执行功能
  action: (
    options: ParsedOptions,
    terminal: TerminalType,
    parentCommand?: CommandType
  ) => void;
  // 结果是否允许折叠
  collapsible?: boolean;
}
```
### 4.2.3 执行

- 调用命令action的方法
- 将结果展示到终端上面
## 4.3 命令集

1. 以单文件分离的方法管理命令集
2. 统一规范命令集
3. 使用 Map ：key  - value 存储结果，避免循环搜索
## 4.4 前后台交互
:::info
需要进行前后端交互，即获取数据的接口如下
:::

- 用户模块：user
- 翻译模块：fanyi
- 背景图片：bg
- 音乐模块：music
# 五、思路扩展

1. 增加更多的命令
2. 开发后台管理系统，开发者上传代码到后台审核，前端用户安装命令包
3. 解决性能优化
4. 适配移动端、桌面端开发
5. 接入gpt形成对话功能模块
6. 开发和用户交互的小游戏，比如猜拳......
7. 私有化存储收藏夹，分类查询修改
8. 优化数据存储，目前数据大部分存储在浏览器，后续可以把一些数据量大的过渡到 MySQL 数据库
# 六、个人收获

- 利用暑假的时间在[知识星球](https://wx.zsxq.com/dweb2/index/group/51122858222824)学习鱼皮的 web 终端项目，学到了很多知识
- 了解了一个项目从0到1的技术选型，要考虑哪些功能，技术栈如何选择
- 简单学习了 Redis 的知识点，重温了express后台的知识点
- 如何更好的分离代码组件设计，做到高内聚，低耦合
- 学习了如何通过 ESLint + Prettier + TypeScript 更好的约束代码开发，学习了前端代码工程化
# 七、后续任务

- [ ] 开发一个获取头像的接口命令
- [ ] 用户登录修改为 linux 模式
- [ ] 完善 todo 命令
- [ ] 扩展后台，目前只有调用翻译、音乐接口、用户登录功能
- [ ] 接入 gpt 进行聊天
# 八、资源列表
**lodash前端工具库**
[Lodash 前端必备神器：学会这些技巧，让你代码量减半、效率翻倍！ - 掘金](https://juejin.cn/post/7241171237601902647)

**pinia如何使用持久化**
[Pinia的使用以及数据持久化 - 掘金](https://juejin.cn/post/7101657189428756516)

**组件库**

[Ant Design Vue — An enterprise-class UI components based on Ant Design and Vue.js](https://antdv.com/components/overview)

