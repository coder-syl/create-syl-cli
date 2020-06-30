import chalk from "chalk";
import symbol from "log-symbols";
import ora from "ora";
var ProgressBar = require("progress");
const { execSync } = require("child_process");

import {
    ifExistFold,
    prompt,
    downloadTemplate,
    updateJsonFile,
    hasYarn,
} from "./util";

let create = async(projectName) => {
    if (projectName === undefined) {
        console.log(symbol.error, chalk.red("请输入项目名"));
    } else {
        ifExistFold(projectName).then(() => {
            prompt().then((answer) => {
                // 目前只建了一个vue的模板，所以只能先跳过react🌶
                if (answer.frame === "react") {
                    console.log(
                        symbol.warning,
                        chalk.yellow("react模板还在路上，莫急莫急~")
                    );
                    process.exit(1);
                }

                /**
                 * 根据用户输入的配置信息下载模版&更新模版配置
                 * 下载模版比较耗时,这里通过ora插入下载loading, 提示用户正在下载模版
                 */
                let loading = ora("模板下载中...");

                let Api = "";
                switch (answer.frame) {
                    case "vue":
                        Api = "direct:https://github.com/syl-template/vue-template";
                        break;
                    case "electron-vue":
                        Api =
                            "direct:https://github.com/syl-template/electron-vue-template";
                        break;
                    case "react":
                        Api = "direct:https://github.com/coder-syl/evue";
                        break;
                    default:
                        break;
                }
                loading.start(`模板下载中...${Api}
                `);

                downloadTemplate(projectName, Api).then(
                    () => {
                        loading.succeed("模板下载完成");

                        // 下载完成后,根据用户输入更新配置文件
                        const fileName = `${projectName}/package.json`;
                        answer.name = projectName;
                        console.log(symbol.success, chalk.green("开始更新package.json"));
                        updateJsonFile(fileName, answer)
                            .then(
                                () => {
                                    console.log(
                                        symbol.success,
                                        chalk.green("package.json更新完成。")
                                    );
                                },
                                () => {
                                    console.log(
                                        symbol.success,
                                        chalk.green("package.json更新失败")
                                    );
                                }
                            )
                            .then(() => {
                                console.log(symbol.success, chalk.green("正在安装依赖"));
                                hasYarn() ?
                                    execSync("yarn install", {
                                        stdio: "inherit",
                                        cwd: `./${projectName}`,
                                    }) :
                                    execSync("npm install", {
                                        stdio: "inherit",
                                        cwd: `./${projectName}`,
                                    });
                            });
                    },
                    () => {
                        loading.fail("模板下载失败");
                    }
                );
            });
        });
    }
};

module.exports = create;