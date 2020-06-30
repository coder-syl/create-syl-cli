'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _create = require('./create');

var _create2 = _interopRequireDefault(_create);

var _init = require('./init');

var _init2 = _interopRequireDefault(_init);

var _dev = require('./dev');

var _dev2 = _interopRequireDefault(_dev);

var _build = require('./build');

var _build2 = _interopRequireDefault(_build);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//项目打包
// 项目初始化
let actionMap = {
    // 项目创建
    create: {
        description: '创建一个新的项目', // 描述
        usages: [// 使用方法
        'create-syl-template create ProjectName'],
        alias: 'c' // 命令简称
    },
    // 项目初始化
    init: {
        description: '初始化项目',
        usages: ['create-syl-template init'],
        alias: 'i'
    },
    // 启动项目
    dev: {
        description: '本地启动项目',
        usages: ['create-syl-template dev'],
        options: [{
            flags: '-p --port <port>',
            description: '端口',
            defaultValue: 3000
        }],
        alias: 'd'
    },
    //打包
    build: {
        description: '服务端项目打包',
        usages: ['create-syl-template build'],
        options: [{
            flags: '-u --username <port>',
            description: 'github用户名',
            defaultValue: ''
        }, {
            flags: '-t --token <port>',
            description: 'github创建的token',
            defaultValue: ''
        }],
        alias: 'b'
    }
}; // 项目启动
// 项目创建


Object.keys(actionMap).forEach(action => {

    // 指定选项
    if (actionMap[action].options) {
        Object.keys(actionMap[action].options).forEach(option => {
            let obj = actionMap[action].options[option];
            _commander2.default.option(obj.flags, obj.description, obj.defaultValue);
        });
    }
    _commander2.default.command(action).description(actionMap[action].description).alias(actionMap[action].alias).action(() => {
        switch (action) {
            // 到这里具体命令实现逻辑还空缺，我们先打日志，看下命令处理情况
            case 'create':
                (0, _create2.default)(...process.argv.slice(3));
                break;
            case 'init':
                console.log(process.cwd(), ' process.cwd()');
                // init(program.username, program.token);
                break;
            case 'dev':
                (0, _dev2.default)(_commander2.default.port);
                break;
            case 'build':
                (0, _build2.default)();
                break;
            default:
                break;
        }
    });
});

// 指定版本号，并可以输出-h -v 已经option的选项
_commander2.default.version(require('../package.json').version, '-v --version').parse(process.argv);

if (!process.argv.slice(2).length) {
    _commander2.default.outputHelp();
}