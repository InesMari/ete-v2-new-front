export default {
    name: 'dataReport',
    data() {
        return {
            info:{},
        }
    },
    /**
     * 初始化
     */
    mounted(){
        this.init();
    },
    /**
     * 组件
     */
    components: {

    },
    /**
     * 绑定函数
     */
    methods: {
        init(){
            let that = this;
            this.common.postUrl("fcTF", "queryDataReportStatisticsInfo", {}, function (data) {
                if(data){
                    that.info = data;
                }
            });
        },
        /**
         *
         * @param path
         * @param pId
         * @param urlName
         * @param urlId
         * @param urlPathName
         */
        go(path, pId, urlName, urlId) {
            let hasAuth = false;
            localStorage.getItem("entityIds").split(",").forEach(item =>
            {
                if (item == pId)
                    hasAuth = true;
            });
            if (!hasAuth)
            {
                this.$message.error("您没有查看"+urlName+"的权限,请联系上级授权！");
                return false;
            }
            if (this.common.isBlank(urlId))
                urlId = path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf(".vue"));
            let query = { pId: pId};
            this.$emit("openTab",{
                urlId: urlId + pId,
                query: query,
                urlName: urlName,
                urlPathName: "/"+urlId,
                urlPath: path});
        },
    }
}
