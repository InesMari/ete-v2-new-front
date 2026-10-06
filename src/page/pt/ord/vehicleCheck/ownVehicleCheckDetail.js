import myFileModel from '@/components/myFileModel/myFileModel.vue'
import printJS from 'print-js'
import fileViewer from '@/components/myFile/file-viewer.vue';

export default {
    name: 'ownVehicleCheckDetail',
    data()
    {
        return {
            info:{
                fileList:[]
            },
            srcList:[],
            list: [],
            type: this.$route.query.type,
            // 新增筛选状态
            filterType: 'all', // 'all'显示所有, 'error'显示异常
            radioState:1,
            disabledRadio:false,
            remarkInput:"",
        }
    },
    computed: {
        // 计算属性：过滤后的出车前点检列表
        filteredStartCheckList() {
            if (this.filterType === 'error') {
                return this.info.startCheckList ? this.info.startCheckList.filter(item => item.checkState === 0) : [];
            }
            return this.info.startCheckList || [];
        },
        // 计算属性：过滤后的收车后点检列表
        filteredEndCheckList() {
            if (this.filterType === 'error') {
                return this.info.endCheckList ? this.info.endCheckList.filter(item => item.checkState === 0) : [];
            }
            return this.info.endCheckList || [];
        }
    },
    mounted()
    {
        this.loadRequestFeeById();
    },
    methods: {
        // 新增筛选方法
        setFilter(type) {
            this.filterType = type;
        },
        async loadRequestFeeById()
        {
            this.info = await this.common.postUrl("resVehicleInfoTF", "getVehicleCheckInfo", {id:this.$route.query.id});
            if(this.info.state == 1){       //跟进一次后只能选择处理
                this.disabledRadio = true; 
                this.radioState = 2;
            }
        },
        // 查看大图
        showImg(path){
          this.srcList=[];
          this.srcList.push(path);
          this.$refs.viewer.show();
        },
        async reviewById(){
            let state = this.radioState;
            await this.common.postUrl("resVehicleInfoTF", "confirmVehicleCheck", {id:this.info.id,state,remark:this.remarkInput});
            this.$message.success("操作成功！");
            let that = this;
            const timer = setTimeout(() => {
                clearTimeout(timer);
                that.closePage();
            }, 500);
        },
        /**
         * 打印
         */
        print(){
            // lodopUtil.printHTMLInfoA5("printTable", "打印请款单");   
            printJS({
                printable: 'printTable',
                type: 'html',
                css: '/static/css/vehicleCheckPrint.css',  //真实路径/public//static/css/vehicleCheckPrint.css
                scanStyles: false
            })
        },
        closePage() {
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true);
        },
    },
    components: {
        myFileModel,
        fileViewer
    },
}