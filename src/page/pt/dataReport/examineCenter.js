export default {
    name: 'examineCenter',
    data() {
        return {
            info:{},
        }
    },
    /**
     * 初始化
     */
    mounted(){
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
        async toFcExamineDetail() {
            //查询是否有今年的考核
            let info = await this.common.postUrl('fcExamineTF', 'getThisYearFcExamineInfo', {}, null, null, null, true);
            if(info.id==null){
                this.$message.error("本年度没有财务绩效考核");
                return;
            }
            let id = info.id;
            this.$emit('openTab', {
                urlName: '财务考核详情',
                urlId: 'detail' + id,
                urlPathName: "/fcExamineDetail",
                urlPath: "/pt/fc/examine/fcExamineDetail.vue",
                query: {id, type: 3}
            });
        },
        toQuestionnaireReportMain(){
            let hasAuth = false;
            localStorage.getItem("entityIds").split(",").forEach(item =>
            {
                if (item == 1007045)
                    hasAuth = true;
            });
            if (!hasAuth)
            {
                this.$message.error("您没有查看数据报表的权限,请联系上级授权！");
                return false;
            }
            this.$emit('openTab', {
                urlName: '数据报表',
                urlId: 'reportMain',
                urlPathName: "/reportMain",
                urlPath: "/pt/dataReport/questionnaire/reportMain.vue",
                query: {loadNewest: 1}
            });
        },
        async toWmsExamineItemStatisticsManage() {
            let hasAuth = false;
            localStorage.getItem("entityIds").split(",").forEach(item =>
            {
                if (item == 1007052)
                    hasAuth = true;
            });
            if (!hasAuth)
            {
                this.$message.error("您没有查看核查统计详情的权限,请联系上级授权！");
                return false;
            }
            let id = await this.common.postUrl('wmsExamineTF', 'queryWmsExamineInfoId', {}, null, null, null, true);
            if (id == null) {
                this.$message.error("当前没有物流中心核查统计详情");
                return;
            }
            let item = {
                urlName: '核查统计详情',
                urlId: 'wmsExamineItemStatisticsManage' + id,
                urlPathName: "/wmsExamineItemStatisticsManage",
                urlPath: "/pt/dataReport/wmsExamine/wmsExamineItemStatisticsManage.vue",
                query: {id: id},
            }
            this.$emit('openTab', item);
        }
    }
}
