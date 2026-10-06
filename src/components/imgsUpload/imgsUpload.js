import myFileModel from '@/components/myFileModel/myFileModel.vue'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import Vue from 'vue'
Vue.use(Viewer)

export default {
    name: 'imgsUpload',
    props:[
        'types'
    ],
    data(){
        return{
            isshowUploadDialog:true,
            imgList:[], //已上传图片信息,
            imgSeeList:[],
        }
    },
    mounted(){

    },
    methods:{
        /**
         * 图片上传成功回调
         * codeName     类型名车
         * codeValue    类型id
         * componentId  组件ID
         */
        fileCallback(data){
            console.log(data);
            this.types.forEach(el => {
                if(el.codeValue == data.componentId){
                    data.showName = el.codeName+"."+data.fileType;
                    data.codeName = el.codeName;
                    data.codeValue = el.codeValue;
                }
            })
            data.time = this.getTime();
            this.imgList.push(data);
            this.$refs['file'+data.componentId][0].clean();
            this.$forceUpdate();
        },
        // 获取时间
        getTime(){
            let time = new Date();  // 程序计时的月从0开始取值后+1
            let m = time.getMonth() + 1;
            let t = time.getFullYear() + "-" + m + "-"
            + time.getDate() + " " + time.getHours() + ":"
            + time.getMinutes() + ":" + time.getSeconds();
            return t;
        },
        //查看图片
        showImg(data){
            this.imgSeeList = [this.common.getBigImgPath(data.fullPath)];
            const viewer = this.$el.querySelector('.imgsUploadViewer').$viewer
            viewer.show()
        },
        // 删除图片
        delImg(index){
            //删除数据
            this.common.postUrl("fileCommonTF","doDel",{flowId:this.imgList[index].flowId});
            this.imgList.splice(index,1);
        },
        // 展示
        show(){
            this.isshowUploadDialog = true;
        },
        // 隐藏
        hide(){
            this.isshowUploadDialog = false;
            this.imgList = [];
        },
        // 确定回调
        sure(){
            this.$emit("successCallback",this.imgList);
            this.hide();
        }
    },
    components: {
      myFileModel
    },
}
