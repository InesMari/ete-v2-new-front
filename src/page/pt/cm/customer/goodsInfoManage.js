import tableCommon from "@/components/table/tableCommon.vue";
import myImport from "@/components/myImport/myImport";
import enumData from "@/page/pt/enum";

export default {
    name: 'goodsInfoManage',
    data() {
        return {
            head: [
                {"name": "货物名称", "code": "goodsName", "width": "110", "type": "text"},
                {"name": "货物类别", "code": "className", "width": "110", "type": "text"},
                {"name": "包装类型", "code": "packingTypeName", "width": "110", "type": "text"},
                {"name": "规格", "code": "goodsModel", "width": "110", "type": "text"},
                {"name": "长(m)", "code": "goodsLength", "width": "80", "type": "text"},
                {"name": "宽(m)", "code": "goodsWidth", "width": "80", "type": "text"},
                {"name": "高(m)", "code": "goodsHeight", "width": "80", "type": "text"},
                {"name": "单个货物体积(m³)", "code": "singleGoodsVolume", "width": "110", "type": "text"}
            ],
            loadParam: {},
            impParam: {tenantId : this.$route.query.tenantId},
            goodsInfo: {},//货物信息
            classData: [],//所有货物类别
            packingTypeData: [],//所有货物包装类型
            showModify: false,
            title: "新增货物",
            uploadOpen : false,
            showSingleVolume: false,
            isOnlySee: false,
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
        this.init();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        myImport,
    },
    /**
     * 绑定函数
     */
    methods: {
        doQuery() {
            this.loadParam.tenantId = this.$route.query.tenantId;
            this.$refs.table.load("workGoodsTF", "queryGoodsData", this.loadParam);
        },
        init() {
            let that = this;
            //查询货物类别
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"GOODS_CLASS_TYPE"}, function (data) {
                that.classData = data;
            });
            //包装类型
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"GOODS_PACKING_TYPE"}, function (data) {
                that.packingTypeData = data;
            });
        },
        clear() {
            this.loadParam = {};
        },
        /** 可选可输 输入框 */
        querySearch(queryString, cb) {
            var restaurants = this.restaurants;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            cb(results);
        },
        createFilter(queryString) {
            return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
            };
        },
        handleSelect(item) {
            this.goodsInfo.classId = item.classId;
        },
        openDialog(flag) {
            this.showModify = flag;
        },
        add(flag) {
            this.title = "新增货物";
            this.goodsInfo = {};
            this.isOnlySee = false;
            this.showSingleVolume = false;
            this.openDialog(flag);
        },
        dblclickItem(item){
            let that = this;
            this.common.postUrl("workGoodsTF", "queryGoodsInfoById", {id:item.id}, function (data) {
                that.goodsInfo = data;
                that.showSingleVolume = that.common.isNotBlank(data.singleGoodsVolume);
                that.goodsInfo.classId = that.goodsInfo.classId+"";
                that.goodsInfo.packingType = that.goodsInfo.packingType+"";
            });
            this.title = "货物详情";
            this.isOnlySee = true;
            this.openDialog(true);
        },
        /** 修改货物 */
        modify() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据！");
                return;
            }
            if(selectData[0].sts==0){
                this.$message.error("无法修改已删除的货物！");
                return;
            }
            let that = this;
            this.common.postUrl("workGoodsTF", "queryGoodsInfoById", {id:selectData[0].id}, function (data) {
                that.goodsInfo = data;
                that.showSingleVolume = that.common.isNotBlank(data.singleGoodsVolume);
                that.goodsInfo.classId = that.goodsInfo.classId+"";
                that.goodsInfo.packingType = that.goodsInfo.packingType+"";
            });
            this.isOnlySee = false;
            this.title = "修改货物";
            this.openDialog(true);
        },
        /** 删除货物 */
        del() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length == 0) {
                this.$message.error("请选择需要删除的货物！");
                return;
            }
            let ids = "";
            let names = "";
            let goodsName = "";
            for (let i = 0; i < selectData.length; i++) {
                ids += selectData[i].id + ",";
                names += "【"+selectData[i].goodsName + "】";
                goodsName += selectData[i].goodsName + ",";
            }
            ids = ids.substring(0, ids.length-1);
            goodsName = goodsName.substring(0, goodsName.length-1);
            let that = this;
            const h = this.$createElement;
            this.$msgbox({
                title: "删除货物",
                message: h('p', null, [
                    h('span', null, "此操作将货物："),
                    h('i', { style: 'color: red' }, names),
                    h('span', null, " 删除，是否继续？"),
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "warning",
            }).then(() => {
                this.common.postUrl("workGoodsTF", "delGoodsInfo", {goodsIdStr:ids,goodsName,tenantId:this.$route.query.tenantId}, function (data) {
                    if (that.common.isNotBlank(data)) {
                        that.doQuery();
                        that.$message.success("删除成功！");
                    }
                },null,'',true);
            }).catch(() => {
                this.$message.info("已取消删除");
            });
        },
        /** 保存货物 */
        saveGoodsInfo() {
            this.goodsInfo.tenantId = this.$route.query.tenantId;
            if(this.common.isBlank(this.goodsInfo.goodsName)){
                this.$message.error("请输入货物名称！");
                return;
            }
            if(this.common.isBlank(this.goodsInfo.classId) || this.goodsInfo.classId<0){
                this.$message.error("请选择货物类别！");
                return;
            }
            if(this.common.isBlank(this.goodsInfo.packingType) || this.goodsInfo.packingType<0){
                this.$message.error("请选择货物包装类型！");
                return;
            }
            let that = this;
            this.common.postUrl("workGoodsTF", "addGoodsInfo", this.goodsInfo, function (data) {
                if (that.common.isNotBlank(data)) {
                    that.doQuery();
                    that.openDialog(false);
                    that.$message.success("保存成功！");
                }
            },null,'',true);
        },
        /**
         * 改变货物属性
         */
        changeProperty(type)
        {
            if (type == 1 && this.goodsInfo.goodsLength > 5)
                this.$message.warning("请注意:您输入的货物长度为:" + this.goodsInfo.goodsLength + "米！");
            if (type == 2 && this.goodsInfo.goodsWidth > 5)
                this.$message.warning("请注意:您输入的货物宽度为:" + this.goodsInfo.goodsWidth + "米！");
            if (type == 3 && this.goodsInfo.goodsHeight > 5)
                this.$message.warning("请注意:您输入的货物高度为:" + this.goodsInfo.goodsHeight + "米！");

            //都不为空计算体积
            if (this.common.isNotBlank(this.goodsInfo.goodsLength) && !isNaN(this.goodsInfo.goodsLength)
                    && this.common.isNotBlank(this.goodsInfo.goodsWidth) && !isNaN(this.goodsInfo.goodsWidth)
                    && this.common.isNotBlank(this.goodsInfo.goodsHeight) && !isNaN(this.goodsInfo.goodsHeight))
            {
                let acreage = this.common.accMul(this.goodsInfo.goodsLength, this.goodsInfo.goodsWidth);
                let volume = this.common.accMul(this.goodsInfo.goodsHeight, acreage);
                this.goodsInfo.singleGoodsVolume = Number((Math.round(volume * 10000) / 10000).toFixed(4));
                this.showSingleVolume = true;
            }
            else
            {
                this.goodsInfo.singleGoodsVolume = '';
                this.showSingleVolume = false;
            }
        },
        gotoLog()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据！");
                return;
            }
            let data = selectData[0];
            this.$emit("openTab",{
                urlId: 'goodsDetail' + data.id,
                query: {
                    logId: data.id,
                    logType: enumData.LOG_TYPE.GOODS,
                },
                urlName: "货物操作日志",
                urlPathName: "/operateLog",
                urlPath: "/pt/operateLog/operateLog.vue"});
        },
    },
}
