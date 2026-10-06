import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import enumData from "@/page/pt/enum.js"

export default {
    name: 'waybillMileageManage',
    data()
    {
        return {
            head: [
                {"name": "派车单号/短驳配送单", "code": "waybillNum", "width": "150", "type": "diy"},
                {"name": "车牌号码", "code": "plateNumber", "width": "150", "type": "text"},
                {"name": "司机", "code": "driverUserName", "width": "150", "type": "text"},
                {"name": "起始公里(km)", "code": "startMileage", "width": "150", "type": "text"},
                {"name": "结束公里(km)", "code": "endMileage", "width": "150", "type": "text"},
                {"name": "里程数(km)", "code": "totalMileage", "width": "150", "type": "text"},
                {"name": "确认状态", "code": "confirmStateName", "width": "150", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            query: {},
            info: this.initInfo(),
            confirmStateData: [],
            dialogShow: false,
            isOnlySee: false,
            saveShow: false,
            disabledWaybill: false,
            waybillData: [],
            title: '上传公里数',
        }
    },
    mounted()
    {
        this.initStaticData();
        this.doQuery();
    },
    components: {
        tableCommon,
        searchList,
        enumData,
        myFileModel,
    },
    methods: {
        initInfo()
        {
            return this.info = {
                id: null,
                waybillId: null,
                startMileage: null,
                endMileage: null,
                totalMileage: 0,
                type: 1,
            }
        },
        async initStaticData()
        {
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', {'codeType': 'FC_CONFIRM_STATE'});
            this.confirmStateData = data.FC_CONFIRM_STATE;
            this.$forceUpdate();
        },
        async doQuery(query = this.query)
        {
            this.query = query;
            if(this.common.isNotBlank(this.query.createDate) && this.query.createDate.length==2){
                this.query.startCreateDate = this.query.createDate[0];
                this.query.endCreateDate = this.query.createDate[1];
            }else{
                this.query.startCreateDate = '';
                this.query.endCreateDate = '';
            }
            this.$refs.table.load("ordWaybillTF", "queryOrdWaybillMileageInfoPage", this.query);
        },
        async uploadMileage()
        {
            this.saveShow = true;
            this.disabledWaybill = false;
            this.isOnlySee = false;
            this.title = '上传公里数';
            await this.openDialog(true, {type: 1}, 1);
        },
        async updateUploadMileage()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改公里数的派车单！");
                return false;
            }
            this.saveShow = true;
            this.isOnlySee = false;
            this.disabledWaybill = true;
            this.title = '修改信息';
            await this.openDialog(true, selectData[0]);
        },
        async openDialog(flag, data, isNotUploadMileage)
        {
            this.initInfo();
            if (flag)
            {
                this.waybillData = await this.common.postUrl("ordWaybillTF", "queryOrdWaybillList", {isOwn: 1, isNotUploadMileage, isLoadWms: 1});
                this.$nextTick(() => {
                    this.$refs.begin.clean();
                    this.$refs.end.clean();
                })
                if (data)
                {
                    this.info = this.common.copyObj(data);
                    this.$nextTick(() => {
                        if (data.startMileageFileId)
                            this.$refs.begin.initDate(data.startMileageFileId);
                        if (data.endMileageFileId)
                            this.$refs.end.initDate(data.endMileageFileId);
                    })
                }
            }
            this.dialogShow = flag;
        },
        async dblclickItem(data)
        {
            this.saveShow = false;
            this.isOnlySee = true;
            this.disabledWaybill = true;
            this.title = '查看信息';
            await this.openDialog(true, data);
        },
        toDetail(item)
        {
            if (item.type == 2)
            {
                this.$emit('openTab', {
                    urlName: '查看配送',
                    urlId: 'wmsWaybillDetail' + item.waybillId,
                    urlPathName: "/wms/waybill",
                    urlPath: "/pt/wms/waybill/wmsWaybillDetail.vue",
                    query: {id: item.waybillId}
                });
            }
            else
            {
                this.$emit("openTab",{
                    urlId: 'waybillDetail' + item.waybillId,
                    query: {waybillId: item.waybillId},
                    urlName: "派车单详情",
                    urlPathName: "/detail",
                    urlPath: "/pt/ord/waybill/detail/waybillDetail.vue"});
            }
        },
        changeMileage()
        {
            this.info.totalMileage = 0;
            let startMileage = this.info.startMileage;
            let endMileage = this.info.endMileage;
            if (this.common.isNotBlank(startMileage) && this.common.isNotBlank(endMileage))
            {
                if (isNaN(startMileage))
                {
                    startMileage = 0;
                }
                if (isNaN(endMileage))
                {
                    endMileage = 0;
                }
                if (parseFloat(startMileage) >= parseFloat(endMileage))
                {
                    return false;
                }
                else
                    this.info.totalMileage = this.common.accSub(endMileage, startMileage);
            }
        },
        successCallback(imgData)
        {
            if (imgData.componentId == 1)
            {
                this.info.startMileageFileId = imgData.flowId;
                this.info.startMileageFilePath = imgData.storePath;
            }
            else
            {
                this.info.endMileageFileId = imgData.flowId;
                this.info.endMileageFilePath = imgData.storePath;
            }
        },
        async saveMileage()
        {
            let that = this.info;
            if (this.common.isBlank(this.info.waybillId))
            {
                let index = this.info.key.indexOf("-");
                if (this.common.isNotBlank(this.info.key) && index > 0)
                {
                    this.info.waybillId = this.info.key.substring(0, index);
                }
                else
                {
                    this.$message.error("请选择派车单号！");
                    return false;
                }
            }
            if (this.common.isBlank(this.info.startMileage))
            {
                this.$message.error("请填写起始公里！");
                return false;
            }
            if (this.common.isBlank(this.info.endMileage))
            {
                this.$message.error("请填写结束公里！");
                return false;
            }
            if (this.common.isBlank(this.info.startMileageFileId))
            {
                this.$message.error("请上传起始公里图片！");
                return false;
            }
            if (this.common.isBlank(this.info.endMileageFileId))
            {
                this.$message.error("请上传起始公里图片！");
                return false;
            }
            let info = this.common.copyObj(this.info);
            await this.common.postUrl("ordWaybillTF", 'saveMileage', info, null, null, '', true);
            this.$message.success("上传公里数成功！");
            await this.openDialog(false);
            await this.doQuery();
        },
        async clearMileage()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除公里数的派车单！");
                return false;
            }
            let that = this;
            this.$confirm("确定需要删除？", "提示").then(() =>{
                this.common.postUrl("ordWaybillTF", "clearMileage", selectData[0], function ()
                {
                    that.$message.success("删除成功!");
                    that.doQuery();
                });
            }).catch(() =>{})
        },
        async confirmMileage()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要确认公里数的派车单！");
                return false;
            }
            let that = this;
            this.$confirm("是否确认里程？", "提示").then(() =>{
                this.common.postUrl("ordWaybillTF", "confirmMileage", selectData[0], function ()
                {
                    that.$message.success("操作成功!");
                    that.doQuery();
                });
            }).catch(() =>{})
        },
        async cancelConfirmMileage()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要取消确认公里数的派车单！");
                return false;
            }
            let that = this;
            this.$confirm("是否取消确认里程？", "提示").then(() =>{
                this.common.postUrl("ordWaybillTF", "cancelConfirmMileage", selectData[0], function ()
                {
                    that.$message.success("操作成功!");
                    that.doQuery();
                });
            }).catch(() =>{})
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
                urlId: 'waybillMileage' + 'Detail' + data.id,
                query: {
                    logId: data.id,
                    logType: enumData.LOG_TYPE.WAYBILL_MILEAGE,
                },
                urlName: "公里数" + "操作日志",
                urlPathName: "/operateLog",
                urlPath: "/pt/operateLog/operateLog.vue"});
        },
        download(){
            this.$refs.table.downloadExcelFile('派车单公里数管理列表');
        },
    },
    computed: {
        formData()
        {
            return [
                {"name": "派车单号", "model": "waybillNum", "type": "input", "isshow": true},
                {"name": "车牌号码", "model": "plateNumber", "type": "input", "isshow": true},
                {"name": "司机", "model": "driverUserName", "type": "input", "isshow": true},
                {"name": "确认状态", "model": "confirmState", "type": "select", "options": this.confirmStateData, "label": "codeName", "value": "codeValue", "method": "doQuery", "isshow": true},
                {"name":"创建时间","model":"createDate","type":"daterange","isshow":true},
            ]
        }
    },
}
