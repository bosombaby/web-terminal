import { CommandType } from "../../command";
import { defineAsyncComponent } from "vue";
import ComponentOutputType = YuTerminal.ComponentOutputType;

/**
 * 随机获取头像，先使用前端展示，可以选择输出格式
 *  - https://deno-avatar.deno.dev/
 *  - https://multiavatar.com/
 * @author bosom
 */
const avatarCommand: CommandType = {
  func: "avatar",
  name: "头像",
  desc: "随机获取头像",
  alias: ["head"],
  collapsible: true,
  params: [
    {
      key: "prompt",
      desc: "随机词语",
      required: true,
    },
  ],
  options: [
    {
      key: "svg",
      desc: "头像格式svg", //默认png，可选svg等
      alias: ["s", "a", "b", "c"],
      type: "boolean",
      defaultValue: false,
    },
  ],

  // avatar 哈哈 -s svg
  action(options, terminal) {
    console.log(options);

    const { _, svg } = options;
    const prompt = _.length > 0 ? _[0] : "";
    const type = svg ? "svg" : "png";
    const output: ComponentOutputType = {
      type: "component",
      component: defineAsyncComponent(() => import("./AvatarBox.vue")),
      props: {
        prompt,
        type,
      },
    };

    console.log(output);

    terminal.writeResult(output);
    return;
  },
};

export default avatarCommand;
