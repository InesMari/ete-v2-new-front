import myFileModel from '@/components/myFileModel/myFileModel.vue'
import printJS from 'print-js'

export default {
    name: 'contractDetail',
    data() {
        return {
            options:[
                {value:"0",label:"负责人1"},
                {value:"1",label:"负责人2"},
                {value:"2",label:"负责人3"},
            ],
            model:""
        }
    },
    mounted() {
        
    },
    /**
     * 组件
     */
    components: {
        myFileModel,
    },
    methods: {
        success(){
            this.$confirm('您正在操作评审确认，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
            // 确定
            }).catch(() => {
            // 取消          
            });
        },
        fail(){
            this.$prompt('请输入评审不通过原因：', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
            // 确认
            }).catch(() => {
            // 取消     
            });
        },
        
    print(){
        printJS({
            printable: 'printTable',
            type: 'html',
            css: './static/css/contract.css',  //真实路径/public//static/css/contract.css
            scanStyles: false
        })
        // that.common.postUrl("fcPayTF", "addPrintTimes", that.info,function (){
        //   that.loadFcPayInfoById();
        // });
      }
    },
}
