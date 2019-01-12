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
        chapterStatus: {
            // ATTRIBUTES:
            default: null,        // The default value will be used only when the component attaching
                                  // to a node for the first time
            type: cc.Label, // optional, default is typeof default
            serializable: true,   // optional, default is true
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // // 禁止所有chapter
        // var chapterRootNode = cc.find("Chapters", this.node);
        // var chapterNumber = chapterRootNode.children.length;
        // cc.log("chapter total number=%d", chapterNumber);

        // for (var i=0; i<chapterNumber; i++){
        //     var node = chapterRootNode.children[i];
        //     cc.log("chapter %d name=%s", i, node.name);
        //     node.active = false;
        // }
    },

    start () {
    },
    // update (dt) {},


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


    // // 获取chapter 节点
    // getChapterNode(chapterIndex) {
    //     var chapterRootNode = cc.find("Chapters", this.node);
    //     var chapterNumber = chapterRootNode.children.length;

    //     if (chapterIndex>0 && chapterIndex <chapterNumber)
    //         return chapterRootNode.children[i];
    //     else 
    //         return null;
    // },

    // --------- 监听 chapter 开始结束--------
    onEnable: function () {
        this.node.on('chapter_start', this.procChapterStart, this);
        this.node.on('chapter_end', this.procChapterEnd, this);
    },

    onDisable: function () {
        this.node.off('chapter_start', this.procChapterStart, this);
        this.node.off('chapter_end', this.procChapterEnd, this);
    },

    procChapterStart (event) {
       var  userData = event.detail;
       var  strStatus  = "chapter ";
       strStatus += userData.chapter_no;
       strStatus += "(";
       strStatus += userData.chapter_time;
       strStatus += ")";
       strStatus += " started";
       this.chapterStatus.string = strStatus;

    },
    procChapterEnd (event) {
        var userData =  event.detail;
        var  strStatus  = "chapter ";
        strStatus += userData.chapter_no;
        strStatus += " ended";
        this.chapterStatus.string = strStatus;
    },




    // 测试 chapter button 处理
    procChapterButton(event, customEventData) {
        var node = event.target; // sender 
        cc.log("click button with data: %s",customEventData);

        var chapterNo = parseInt(customEventData);

        if (chapterNo > 0) {
            var chapterBaseComp = this.node.getComponent("ChapterBase");
            chapterBaseComp.activeChapter(chapterNo);
        }else {
            cc.log("chapter No:%d is invalid", chapterNo);
        }
    },


});
