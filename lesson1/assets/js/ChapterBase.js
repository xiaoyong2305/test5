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
        chapterData: null, // chapter 数据

        // chapter 倒计时
        chapterProgressBar: {
            default: null,
            type: cc.ProgressBar,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 禁止所有chapter
        var chapterRootNode = cc.find("Chapters", this.node);
        var chapterNumber = chapterRootNode.children.length;
        cc.log("chapter total number=%d", chapterNumber);

        for (var i=0; i<chapterNumber; i++){
            var node = chapterRootNode.children[i];
            cc.log("chapter %d name=%s", i, node.name);
            node.active = false;
        }
    },

    start () {

    },
    // update (dt) {},

    // 开启 chapter 章节倒计时定时器
    startChapterTimer () {
        cc.log("######### chapter %d start! time(%d) ########", 
            this.chapterData.chapterNo, this.chapterData.chapterTime);

        // 发送chapter启动通知
        var event_start = new cc.Event.EventCustom('chapter_start', true);
        event_start.setUserData({"chapter_no":this.chapterData.chapterNo,"chapter_time":this.chapterData.chapterTime});
        this.node.dispatchEvent(event_start);

        // 章节定时器回调
        var chapterBaseTimerCallback = function(dt) {
            this.chapterProgressBar.progress += (dt/this.chapterData.chapterTime);
            if (this.chapterProgressBar.progress >= 1.0) {
                this.unschedule(chapterBaseTimerCallback);
                this.stopChapterTimer();
            }
        };

        // 清除之前的定时器
        this.unschedule(chapterBaseTimerCallback);
        // chapter 计时进度归零
        this.chapterProgressBar.progress = 0;

        // 启动章节定时器
        this.schedule(chapterBaseTimerCallback, 0.1);
    },

    // chapter 结束
    stopChapterTimer() {
        cc.log("######## chapter end! ##########");
        var event_end = new cc.Event.EventCustom('chapter_end', true);
        event_end.setUserData({"chapter_no":this.chapterData.chapterNo,"chapter_time":this.chapterData.chapterTime});

        this.node.dispatchEvent(event_end);
    },
    

    // // play button click 处理
    // playChapter(event, customEventData) {
    //     var node = event.target; // sender 
    //     cc.log("click button with data: %s",customEventData);

    //     var chapterNo = parseInt(customEventData);

    //     if (chapterNo > 0) {
    //         this.activeChapter(chapterNo);
    //     }else {
    //         cc.log("chapter No:%d is invalid", chapterNo);
    //     }
    // },


    // ------------- chapter manager -------------
    // 激活指定chapter
    activeChapter(chapterNo) {
        cc.log("try to active chapter%d", chapterNo);

        var chapterName = "Chapter";
        chapterName += chapterNo;

        // get chapter node
        var chapterNode = this.getChapterNode(chapterNo);
        if (chapterNode) {
            var chapterData = this.getChapterData(chapterNode);
            if (chapterData) {
                // save chapter data
                this.chapterData = chapterData;

                // 去激活所有chapter
                this.deActiveAllChapters();
                // 激活当前 chapter
                chapterNode.active = true;
                // chapter base 定时器启动
                this.startChapterTimer();
                // 如果安装了功能部件，激活功能部件
                var functionComponent = this.getChapterFunctionComponent(chapterNode, chapterData.chapterComponentName);
                if (functionComponent) {//
                    functionComponent.runChapter();
                }
            }else{
                cc.log("active chapter%d fail, chapter data invalid!", chapterNo);
            }
        }else{
            cc.log("active chapter%d fail, chapter node not exist!", chapterNo);
        }
    },

    // 去激活所有chapter
    deActiveAllChapters() {
        var chapterRootNode = cc.find("Chapters", this.node);
        var chapterNumber = chapterRootNode.children.length;

        for (var i=0; i<chapterNumber; i++){
            var node = chapterRootNode.children[i];
            node.active = false;
        }
    },

    // 获取chapter 节点（根据 chapter 节点的名称）
    getChapterNode(chapterNo) {
        var chapterPath = "/Chapters/Chapter";
        chapterPath += chapterNo;

        return cc.find(chapterPath, this.node);
    },
    // 获取chapter 数据并简单check
    getChapterData(chapterNode) {
        var chapterDataComp = chapterNode.getComponent("ChapterData");
        if (chapterDataComp) {
            var chapterNo = chapterDataComp.chapterNo;
            var chapterTime = chapterDataComp.chapterTime;
            var chapterComponentName = chapterDataComp.chapterComponentName;

            if (chapterNo > 0 && chapterTime > 0 && typeof(chapterComponentName) == "string"){
                return {"chapterNo":chapterNo, 
                        "chapterTime":chapterTime, 
                        "chapterComponentName":chapterDataComp.chapterComponentName};                        
            }else {
                return null;
            }
        }else {
            return null;
        }
    },

    // 获取chapter 功能组件
    getChapterFunctionComponent(chapterNode, chapterComponentName) {
        var funcComp = chapterNode.getComponent(chapterComponentName);
        return funcComp;
    },

});
