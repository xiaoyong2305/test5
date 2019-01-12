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
        // 声音强度使用的6级 信号强度图片
        signalFrames: {
            // ATTRIBUTES:
            default: [],        // The default value will be used only when the component attaching
                                  // to a node for the first time
            type: [cc.SpriteFrame], // optional, default is typeof default
            serializable: true,   // optional, default is true
        },
        // 背景图
        background: {
            default: null,
            type: cc.Node,
            serializable:true,
        },
        // 进度条容器
        progressBarContainer: {
            default: null,
            type: cc.Node,
            serializable:true,
        },
        // 进度条节点
        progressBar: {
            default: null,
            type: cc.Node,
            serializable:true,
        },
        // 音量节点
        volume: {
            default: null,
            type: cc.Node,
            serializable:true,
        },
        // 奖杯节点
        cupNode: {
            default: null,
            type: cc.Node,
            serializable:true,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    start () {
    },

    // update (dt) {},


    // 执行本章时间序列
    runChapter () {
        // cc.log("######### chapter begin! ########");
        // var event_start = new cc.Event.EventCustom('chapter_start', true);
        // event_start.setUserData({"chapter_no":4});

        // this.node.dispatchEvent(event_start);


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
        this.background.active = false;
        // 隐藏进度条
        this.progressBarContainer.active = false;
        // 隐藏音量
        this.volume.active = false;
        // 隐藏奖杯
        this.cupNode.active = false;
    },



    // phase 1 ---- 背景渐入
    actPhase1() {
        // 激活背景图
        this.background.active = true;
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
        this.background.runAction(action4);        
    },
    // phase 2-----倒计时 和 音量动画
    actPhase2() {
        // 激活进度条节点和音量节点
        this.progressBarContainer.active = true;
        this.volume.active = true;
        // 进度条从进度0开始
        var progressBarComp = this.progressBar.getComponent(cc.ProgressBar);
        if (progressBarComp) {
            progressBarComp.progress = 0.0;
        }
        // 音量从最低level开始
        this.setSignalLevel(1);

        // 进度条定时回调
        var progressBarCallback = function(dt) {     
            // var progressBarComp = this.progressBar.getComponent(cc.ProgressBar);       
            progressBarComp.progress += (dt/30.0);
            this.setSignalLevel(Math.floor(Math.random()*6)+1);

            if (progressBarComp.progress >= 1.0) {
                this.unschedule(progressBarCallback);
                this.volume.active = false;
                this.progressBarContainer.active = false;

                // 下一阶段
                this.actPhase3();
            }
        };

        // 启动进度条倒计时，比如 10秒
        this.schedule(progressBarCallback, 0.1);
    },
    // phase 3 ---- 延迟
    actPhase3 () {
        var action1 = cc.delayTime(5);
        var action2 = cc.callFunc(function(target) {
                        this.actPhase4();
                    }, this);
        var action3 = cc.sequence(action1,action2);
        this.node.runAction(action3);
    },
    // phase 4 ---- 奖杯
    actPhase4 () {
        if (this.cupNode){
            this.cupNode.active = true;
            var cup = this.cupNode.getChildByName("cup");
            if (cup) {
                cup.scale = 0.5;
                var action1 = cc.spawn(cc.scaleTo(0.2, 1.2), cc.fadeIn(0.2));
                var action2 = cc.scaleTo(0.1, 0.8);
                var action3 = cc.scaleTo(0.1, 1.0);
                var action4 = cc.delayTime(5);
                var action5 = cc.fadeOut(1);
                var finished = cc.callFunc(function(target) {
                        this.cupNode.active = false;
                        this.actPhase5();
                    }, this);

                var action6 = cc.sequence(action1, action2, action3, action4, action5,finished);
                cup.runAction(action6);
            }
            var light = this.cupNode.getChildByName("light");
            if (light) {
                var action1 = cc.spawn(cc.rotateBy(5.4,180), cc.fadeIn(0.2));
                var action2 = cc.fadeOut(1);
                var action3 = cc.sequence(action1, action2);
                light.runAction(action3);
            }
        }
    },
    // phase 5 ---- what to do?
    actPhase5 () {
    },


    // 卸载本章
    stopChapter () {
        // 初始化 chapter
        this.initializeChapter();
    },


    // 设置声音强度
    setSignalLevel (level) {
        var useLevel = 1;
        if (level < 1 || level > 6)
        {
            cc.log("signal level:%d is out of range", level);
        }else {
            useLevel = level;
        }

        var volumeNode = cc.find("volume", this.node);
        if (volumeNode){
            var volumeSprite = volumeNode.getComponent(cc.Sprite);
            volumeSprite.spriteFrame = this.signalFrames[useLevel -1];
        }        
    },

});
