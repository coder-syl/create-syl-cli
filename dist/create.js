"use strict";

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _logSymbols = require("log-symbols");

var _logSymbols2 = _interopRequireDefault(_logSymbols);

var _ora = require("ora");

var _ora2 = _interopRequireDefault(_ora);

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ProgressBar = require("progress");
const { execSync } = require("child_process");

let create = async projectName => {
    if (projectName === undefined) {
        console.log(_logSymbols2.default.error, _chalk2.default.red("请输入项目名"));
    } else {
        (0, _util.ifExistFold)(projectName).then(() => {
            (0, _util.prompt)().then(answer => {
                // 目前只建了一个vue的模板，所以只能先跳过react🌶
                if (answer.frame === "react") {
                    console.log(_logSymbols2.default.warning, _chalk2.default.yellow("react模板还在路上，莫急莫急~"));
                    process.exit(1);
                }

                /**
                 * 根据用户输入的配置信息下载模版&更新模版配置
                 * 下载模版比较耗时,这里通过ora插入下载loading, 提示用户正在下载模版
                 */
                let loading = (0, _ora2.default)("模板下载中...");

                let Api = "";
                switch (answer.frame) {
                    case "vue":
                        Api = "direct:https://github.com/syl-template/vue-template";
                        break;
                    case "electron-vue":
                        Api = "direct:https://github.com/syl-template/electron-vue-template";
                        break;
                    case "react":
                        Api = "direct:https://github.com/coder-syl/evue";
                        break;
                    default:
                        break;
                }
                loading.start(`模板下载中...${Api}
                `);

                (0, _util.downloadTemplate)(projectName, Api).then(() => {
                    loading.succeed("模板下载完成");

                    // 下载完成后,根据用户输入更新配置文件
                    const fileName = `${projectName}/package.json`;
                    answer.name = projectName;
                    console.log(_logSymbols2.default.success, _chalk2.default.green("开始更新package.json"));
                    (0, _util.updateJsonFile)(fileName, answer).then(() => {
                        console.log(_logSymbols2.default.success, _chalk2.default.green("package.json更新完成。"));
                    }, () => {
                        console.log(_logSymbols2.default.success, _chalk2.default.green("package.json更新失败"));
                    }).then(() => {
                        console.log(_logSymbols2.default.success, _chalk2.default.green("正在安装依赖"));
                        (0, _util.hasYarn)() ? execSync("yarn install", {
                            stdio: "inherit",
                            cwd: `./${projectName}`
                        }) : execSync("npm install", {
                            stdio: "inherit",
                            cwd: `./${projectName}`
                        });
                    });
                }, () => {
                    loading.fail("模板下载失败");
                });
            });
        });
    }
};

module.exports = create;