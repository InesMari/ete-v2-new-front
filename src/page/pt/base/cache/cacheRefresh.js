import enumData from "@/page/pt/enum";
import myImport from "@/components/myImport/myImport";

export default {
    name: 'cacheRefresh',
    data()
    {
        return {
            items:[],
            showUploadPage: false,//展示上传
            url: 'https://mapopen-pub-webserviceapi.bj.bcebos.com/geocoding/Township_Area_A_20220722.xlsx'
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        myImport,
    },
    /**
     * 绑定函数
     */
    methods: {

        /**
         * 列表查询
         */
        doQuery(){
            let that = this;
            this.common.postUrl("cacheRefreshTF", "queryAllRefreshCaches", {}, function (data) {
                that.items = data;
            });
        },
        toRefreshAll(){
            let that = this;
            this.common.postUrl("cacheRefreshTF", "refreshAllCaches", {}, function (data) {
                that.$message.success("刷新成功");
            });

        },
        toRefresh(name){
            let that = this;
            this.common.postUrl("cacheRefreshTF", "refreshCache", {cacheName:name}, function (data) {
                that.$message.success("刷新成功");
            });

        },
        //后面有时间再看看 导入数据更新同步百度最新地址库信息功能
        showUpload(flag)
        {
            this.showUploadPage = flag;
            this.$forceUpdate();
        },
        sureReceivedSuccess()
        {
            this.showUpload(false);
            this.$message.success("更新成功！");
        },
        updateCityData()
        {
            if (this.$refs.myImport.$refs.upload.uploadFiles.length === 0)
            {
                this.$message.error("请上传百度地图行政区划adcode映射表下载的Excel文件！");
                return false;
            }
            this.$refs.myImport.submitFileForm();
        },
    },
}
