import myFileModel from '@/components/myFileModel/myFileModel.vue'
import printJS from 'print-js'
import fileViewer from '@/components/myFile/file-viewer.vue';

export default {
    name: 'vehicleCheckDetail',
    data()
    {
        return {
            info:{
                fileList:[]
            },
            list: [],
            type: this.$route.query.type,
        }
    },
    mounted()
    {
        this.loadRequestFeeById();
    },
    methods: {
        async loadRequestFeeById()
        {
            this.info = await this.common.postUrl("ordWaybillTF", "getOrdWaybillVehicleCheckInfo", {id:this.$route.query.id});
        },
        // 查看大图
        showTickerImg(path){
          this.srcList=[];
          this.srcList.push(path);
          this.$refs.viewer.show();
        },
        review(type){
            if (type === 2)
            {
                this.$prompt('请输入点检不通过原因', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(async ({ value }) => {
                    if (this.common.isBlank(value))
                    {
                        this.$message.error("请输入不通过原因！");
                        return false;
                    }
                    this.info.confirmRemark = value;
                    await this.reviewById(2);
                }).catch(() => {});
            }
            else{
                this.$confirm('您正在点检确认，是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await this.reviewById(1);
                }).catch(() => {
                    // 取消
                });
            }
        },
        async reviewById(type){
            await this.common.postUrl("ordWaybillTF", "confirmOrdWaybillVehicleCheck", {id:this.info.id,type,confirmRemark:this.info.confirmRemark});
            this.$message.success("操作成功！");
            let that = this;
            setTimeout(() => {
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
