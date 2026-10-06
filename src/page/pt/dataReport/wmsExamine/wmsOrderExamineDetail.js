import dbTable from "@/components/dbTable/dbTable.vue";
import fileViewer from '@/components/myFile/file-viewer.vue';

export default {
    name: 'wmsOrderExamineDetail',
    data() {
        return {
            info:{    //全部信息的对象容器
                baseInfo:{

                },
                examineItemList:[]
            },
            head:[
                {"name": "核查项目", "code": "itemName", "width": "120", "type": "text"},
                {"name": "操作时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "操作人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "核查状态", "code": "itemStsName", "width": "120", "type": "text"},
                {"name": "备注", "code": "remark", "width": "220", "type": "text"},
                {"name": "图片", "code": "imgUrl", "width": "120", "type": "diy"},
            ],

            srcList: [],
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initInfo();
    },
    /**
     * 组件
     */
    components: {
        dbTable,
        fileViewer
    },
    /**
     * 绑定函数
     */
    methods: {
        initInfo(){
            let that = this;
            this.common.postUrl("wmsExamineTF", "getOrderDetail", {id:this.$route.query.id,operation:this.$route.query.operation}, function (data) {
                that.info = data;
            });
        },
        /**
         * 显示大图
         * @param data
         */
        showBigImg(data)
        {
            this.srcList=[];
            this.srcList.push(data.imgUrl);
            this.$refs.viewer.show();
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
        },
    },
}
