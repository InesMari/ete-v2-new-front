import tableCommon from "@/components/table/tableCommon.vue";
import EZUIKit from "ezuikit-js";
import selectWork from "@/page/pt/wms/selectWork.vue";
import videoPlayer from "@/components/videoPlayer/videoPlayer.vue";

export default {
    name: 'deviceMonitorManage',
    data()
    {
        return {
            head: [
                {"name": "设备序列号", "code": "deviceSerial", "width": "150", "type": "text"},
                {"name": "通道号", "code": "channelNo", "width": "90", "type": "text"},
                {"name": "设备名称", "code": "name", "width": "200", "type": "text"},
                {"name": "操作", "code": "", "width": "120", "type": "diy"}
            ],
            query:{
                name: '',
            },
            name: '',
            id:'',
            player:'',
            showModifyNameflag: false,
            deviceShow:false,
            showSelWork:false,
            userId:this.common.userInfo().userId,
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.initSelWork();
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        EZUIKit,
        selectWork,
        videoPlayer,
    },
    /**
     * 绑定函数
     */
    methods: {
        initSelWork(){
            this.userInfo = this.common.userInfo();
            if(!this.userInfo.workId){
                this.showSelWork = true;
            }else{
                this.firstIn = false;
                this.doQuery();
            }
        },
        selWork(){
            this.showSelWork = false;
            this.$forceUpdate();
            if(!this.firstIn){
                this.$emit('closeOthers', {});
            }
            this.userInfo = this.common.userInfo();
            this.firstIn = false;
            this.doQuery();
        },
        /**
         * 列表查询
         */
        doQuery(query=this.query) {
            this.query = query;
            this.$refs.table.load("resMonitorDeviceTF", "queryMonitorPage", this.query);
            // this.$refs.table.resetData([{}]);
        },
        clear(){
            this.query.name='';
        },
        closeModifyName(){
            this.showModifyNameflag=false;
        },
        async modifyName() {
            await this.common.postUrl("resMonitorDeviceTF", "updateMonitorName", {id:this.id,name:this.name});
            this.doQuery();
            this.$message.success("设备名称修改成功！");
            this.showModifyNameflag=false;
        },
        async toSync() {
            await this.common.postUrl("resMonitorDeviceTF", "toSyncMonitorName", {});
            this.doQuery();
            this.$message.success("同步最新名称成功！");
        },
        showModifyName(item){
            this.name = item.name;
            this.id = item.id;
            this.showModifyNameflag=true;
        },
        openMonitor(item){
            console.log(item)
            this.deviceShow = true;
            this.$nextTick(()=>{
                this.$refs.videoPlayer.init(item);
            })
            return
            let url = "ezopen://";
            if(item.verifyCode){
                url += item.verifyCode + "@";
            }
            url += "open.ys7.com/"+item.deviceSerial+"/"+item.channelNo+".hd.live";

            if(this.player){
                this.player.play({
                    url:url
                })
            }else{
                this.$nextTick(() => {
                    this.player = new EZUIKit.EZUIKitPlayer({
                        autoplay: true,
                        id: "video-container",
                        accessToken: item.accessToken,
                        url: url,
                        template: "security", // simple - 极简版;standard-标准版;security - 安防版(预览回放);voice-语音版；
                        // 视频上方头部控件
                        // header: ["capturePicture", "save", "zoom"], // 如果templete参数不为simple,该字段将被覆盖
                        // plugin: ['talk'],                       // 加载插件，talk-对讲
                        // // 视频下方底部控件
                        // footer: ["talk", "broadcast", "hd", "fullScreen"], // 如果template参数不为simple,该字段将被覆盖
                        // audio: 1, // 是否默认开启声音 0 - 关闭 1 - 开启
                        // openSoundCallBack: data => console.log("开启声音回调", data),
                        // closeSoundCallBack: data => console.log("关闭声音回调", data),
                        // startSaveCallBack: data => console.log("开始录像回调", data),
                        // stopSaveCallBack: data => console.log("录像回调", data),
                        // capturePictureCallBack: data => console.log("截图成功回调", data),
                        // fullScreenCallBack: data => console.log("全屏回调", data),
                        // getOSDTimeCallBack: data => console.log("获取OSDTime回调", data),
                        width: 556,
                        height: 390
                    });
                });
            }
        },
        closeMonitor(){
            this.$refs.videoPlayer.close();
            this.deviceShow = false;
        }

    },
}
