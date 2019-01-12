// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // 背景图
        backgroundNode: {
            default: null,
            type: cc.Node,
        },        
        // 进度条节点
        progressBarNode: {
            default: null,
            type: cc.Node,
        },
        // question节点
        questionNode: {
            default: null,
            type: cc.Node,
        },
        // word picure
        wordPictureNode: {
            default: null,
            type: cc.Node,
        },
        // yes Toggle
        yesToggleNode: {
            default: null,
            type: cc.Node,
        },
        // no Toggle
        noToggleNode:{
            default:null,
            type:cc.Node,
        },
        // // yesNoSelectNode
        // yesNoSelectNode: {
        //     default:null,
        //     type: cc.Node,
        // },

        // // yes button
        // yesButtonNode: {
        //     default: null,
        //     type:cc.Node,
        // },
        // // no button
        // noButtonNode: {
        //     default: null,
        //     type: cc.Node,
        // },
        // // yes check
        // yesCheckNode: {
        //     default: null,
        //     type: cc.Node,
        // },
        // // no check
        // noCheckNode: {
        //     default: null,
        //     type: cc.Node,
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    start () {
    },

    // update (dt) {},


    // 执行本章时间序列
    runChapter () {

        // 初始化 chapter
        this.initializeChapter();

        // ------------ 动作序列 phase 1 ------------
        this.actPhase1();
    },

    // 初始化本chapter
    initializeChapter () {
        // -------停止所有动作------
        this.node.stopAllActions();

        // -------隐藏所有显示元素------
        // 隐藏背景图
        this.backgroundNode.active = false;
        // 隐藏进度条
        this.progressBarNode.active = false;
        // 隐藏问题
        this.questionNode.active = false;
        // yes toggle
        this.yesToggleNode.active = false;
        // no toggle
        this.noToggleNode.active = false;


        // // 隐藏 yes no 
        // this.yesNoSelectNode.active = false;
        // // 隐藏yes 按钮
        // this.yesButtonNode.active = false;
        // // 隐藏no 按钮
        // this.noButtonNode.active = false;
        // // 隐藏 yes check
        // this.yesCheckNode.active = false;
        // // 隐藏 no check
        // this.noCheckNode.active = false;
    },

    // phase 1 ---- 背景渐入 单词图片渐入
    actPhase1() {
        // 激活背景图
        this.backgroundNode.active = true;
        // // 激活单词图片
        this.wordPictureNode.active = true;
        // 背景图 1秒 渐入
        var action1 = cc.fadeIn(1);
        // 延迟 5秒
        var action2 = cc.delayTime(5);
        // 下一阶段
        var action3 = cc.callFunc(function(target) {
                        this.actPhase2();
                    }, this);
        var action4 = cc.sequence(action1,action2,action3);
        // 背景执行动作
        this.backgroundNode.runAction(action4);    

        var action5 = cc.fadeIn(1);
        // 单词图片执行动作
        this.wordPictureNode.runAction(action5);
    },
    // phase 2 ---- 问题显示
    actPhase2() {
        // 激活问题
        this.questionNode.active = true;
        this.questionNode.opacity = 0;
        // 渐入
        var action1 = cc.fadeIn(1);
        // 延迟
        var action2 = cc.delayTime(5);
        // 渐出
        var action3 = cc.fadeOut(1);
        // next phase
        var action4 = cc.callFunc(function(target) {
            this.actPhase3();
        },this);
        // 序列化执行
        var action5 = cc.sequence(action1, action2, action3, action4);
        // 问题执行动作
        this.questionNode.runAction(action5);
    },
    // phase 3 ----- 按钮, 进度条渐入
    actPhase3 () {
        // 激活按钮
        // this.yesButtonNode.active = true;
        // this.noButtonNode.active = true;
        // this.yesNoSelectNode.active = true;
        this.yesToggleNode.active = true;
        this.noToggleNode.active = true;

        // 按钮渐入
        // this.yesButtonNode.runAction(cc.fadeIn(0.5));
        // this.noButtonNode.runAction(cc.fadeIn(0.5));
        // this.yesNoSelectNode.runAction(cc.fadeIn(0.5));
        this.yesToggleNode.runAction(cc.fadeIn(0.5));
        this.noToggleNode.runAction(cc.fadeIn(0.5));

        // 激活倒计时
        this.progressBarNode.active = true;
        var action1 = cc.callFunc(function(target) {
            this.actPhase4();
        },this);
        var action2 = cc.sequence(cc.fadeIn(0.5), action1);
        this.progressBarNode.runAction(action2);
    },
    // phase 4 ---- 启动倒计时
    actPhase4 () {
        var progressBarComp = this.progressBarNode.getComponent(cc.ProgressBar);
        if (progressBarComp) {
            progressBarComp.progress = 0.0;
        }
        var timeLength = 30.0;   //倒计时时间（秒）
        // 进度条定时回调
        var progressBarCallback = function(dt) {     
            progressBarComp.progress += (dt/timeLength);

            if (progressBarComp.progress >= 1.0) {
                this.unschedule(progressBarCallback);
                // 下一阶段
                this.actPhase5();
            }
        };

        // 启动进度条倒计时，比如 10秒
        this.schedule(progressBarCallback, 0.1);
    },
    // phase 5 ----- 延迟
    actPhase5 () {
        cc.log("chapter end");    
        // disable toggle 
        var yesToggleComp = this.yesToggleNode.getComponent(cc.Toggle);
        var noToggleComp = this.noToggleNode.getComponent(cc.Toggle);
        yesToggleComp.enabled = false;
        noToggleComp.enabled = false;
    },

    // ----处理yes or no button ----
    // 测试 chapter button 处理
    procYesNoSelect(event, customEventData) {
        var node = event.node; // sender 
        cc.log("%s with data: %s",node.name, customEventData);

        var yesToggleComp = this.yesToggleNode.getComponent(cc.Toggle);
        var noToggleComp = this.noToggleNode.getComponent(cc.Toggle);

        if (node.name == 'yesToggle') {
            // 选中了yes
            yesToggleComp.isChecked = true;
            noToggleComp.isChecked = false;

        }else {
            // 选中了no
            yesToggleComp.isChecked = false;
            noToggleComp.isChecked = true;
        }
    },

    // 卸载本章
    stopChapter () {
        // 初始化 chapter
        this.initializeChapter();
    },

    //
});
