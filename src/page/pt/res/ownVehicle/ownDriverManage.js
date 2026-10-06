import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import fileViewer from '@/components/myFile/file-viewer.vue';
import myImport from "@/components/myImport/myImport.vue";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'ownDriverManage',
    data()
    {
        return {
            head: [
                {"name": "司机名称", "code": "driverName", "width": "100", "type": "text"},
                {"name": "身份证号", "code": "idCard", "width": "150", "type": "text"},
                {"name": "手机号", "code": "driverPhone", "width": "120", "type": "text"},
                {"name": "在职/离职", "code": "resignStateName", "width": "120", "type": "text"},
                {"name": "离职日期", "code": "resignDate", "width": "150", "type": "text"},
                {"name": "离职原因备注", "code": "resignRemark", "width": "150", "type": "text"},
                {"name": "籍贯", "code": "nativePlace", "width": "150", "type": "text"},
                {"name": "性别", "code": "sexName", "width": "80", "type": "text"},
                {"name": "绑定车辆", "code": "plateNumber", "width": "120", "type": "text"},
                {"name": "准驾车型", "code": "driverClass", "width": "80", "type": "text"},
                {"name": "驾驶证号", "code": "driverLicence", "width": "150", "type": "text"},
                {"name": "从业资格证号", "code": "qualifyCertId", "width": "150", "type": "text"},
                {"name": "发证机关", "code": "licenseIssuingAuthority", "width": "150", "type": "text"},
                {"name": "驾驶证生效日期", "code": "effectiveDate", "width": "120", "type": "text"},
                {"name": "驾驶证过期日期", "code": "expireDate", "width": "120", "type": "text"},
                {"name": "入职日期", "code": "entryDate", "width": "120", "type": "text"},
                {"name": "入职年龄", "code": "entryAge", "width": "80", "type": "text"},
                {"name": "入职驾龄", "code": "entryDriverLicenceAge", "width": "80", "type": "text"},
                {"name": "所属公司", "code": "tenantName", "width": "150", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "100", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "司机状态", "code": "stsName", "width": "80", "type": "diyColorTd"},
                {"name": "查看图片", "code": "", "width": "200", "type": "diy"},
            ],
            query: this.initQuery(),
            stsData: [],
            resignStateData: [],
            srcList: [],
            supplierData: [],
            uploadOpen:false,
            
            showModify:false,
            info: {
                id:null,
                driverName:null,
                resignDate:null,
                resignRemark:null,
            },
            impParam:{isOwn: 1},
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.initData();
        this.doQuery();
    },
    /**
     * 绑定函数
     */
    methods: {
        initQuery(){
            return this.query = {
                driverName: '',
                driverPhone: '',
                sts: '',
                tenantId: '',
            }
        },
        async doQuery(query = this.query) {
            this.uploadOpen=false;
            query.isOwnFlag = 1;
            let {items} = await this.$refs.table.load("driverTF", "queryOwnDriverInfoList", query);
            items.forEach((el) => {
                if (el.sts == 0) {
                    el.disabled = true;
                }
            })
            this.$refs.table.resetData(items);
        },
        async initData()
        {
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', {'codeType': 'STS,RESIGN_STATE'});
            this.stsData = data.STS;
            this.resignStateData = data.RESIGN_STATE;
            this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
        },
        dblclickItem(data)
        {
            this.openPage(0, data);
        },
        /**
         * 显示弹出框
         * type 0查看 1 新增  2 修改
         */
        openPage(type, data)
        {
            let param = {};
            let title = "";
            let urlPath = "/pt/res/ownVehicle/ownDriverInfo.vue";
            if (type == 1)
            {
                param.time = new Date().getTime();
                title = "新增自有车司机";
            }
            else if(type == 2)
            {
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length !== 1)
                {
                    this.$message.error("请选择一条需要修改的司机数据!");
                    return false;
                }
                data = selectData[0];
                param.time = data.id;
                param.id = data.id;
                title = "修改自有车司机";
            }
            else if(type == 0)
            {
                param.time = data.id + "detail";
                param.id = data.id;
                title = "查看自有车司机";
                urlPath = "/pt/res/ownVehicle/ownDriverInfoMain.vue";
            }
            else
            {
                this.$message.error("请刷新试试！");
                return false;
            }
            this.$emit("openTab",{
                urlId: 'ownVehicleDriver' + param.time,
                query: {
                    id: param.id,
                    type,
                    logId: param.id,
                    logType: enumData.LOG_TYPE.DRIVER,
                },
                urlName: title,
                urlPathName: "/res",
                urlPath: urlPath
            });
        },
        /**
         * 启用禁用
         * @returns {boolean}
         */
        updateState()
        {
            let that = this;
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1)
            {
                this.$message.error("请选择一条数据");
                return false;
            }
            let driverIds = '';
            let driverName = '';
            for (let i = 0; i < array.length; i++)
            {
                driverIds += ',' + array[i].id;
                driverName += ',' + array[i].driverName;
            }
            driverIds = driverIds.substr(1);
            driverName = driverName.substr(1);
            let state = array[0].sts == 1 ? 0 : 1;
            let info = '';
            if (array[0].sts == 1)
            {
                info = '禁用';
            } else if (array[0].sts == 0)
            {
                info = '启用';
            }
            this.common.postUrl("driverTF", 'updateDriverState', {driverIds, state, driverName}, function (data)
            {
                if (data)
                {
                    that.doQuery();
                    that.$message.success(info + "成功！");
                }
            }, null, '', true);
        },
        /**
         * 删除司机
         * @returns {boolean}
         */
        delDriver()
        {
            let that = this;
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1)
            {
                this.$message.error("请选择一条数据");
                return false;
            }
            let driverIds = '';
            let driverName = '';
            for (let i = 0; i < array.length; i++)
            {
                driverIds += ',' + array[i].id;
                driverName += ',' + array[i].driverName;
            }
            driverIds = driverIds.substr(1);
            driverName = driverName.substr(1);
            this.common.postUrl("driverTF", 'delDriver', {driverIds, driverName}, function (data)
            {
                if (data)
                {
                    that.doQuery();
                    that.$message.success("删除成功！");
                }
            }, null, '', true);
        },
        /**
         * 显示身份证照片
         * @param data
         */
        showIdCardImg(data)
        {
            if (!data.idCardFrontImgPath && !data.idCardBackImgPath)
            {
                // this.$message.error("没有图片~");
                return;
            }
            this.srcList = [];
            this.srcList.push(data.idCardFrontImgUrl, data.idCardBackImgUrl);
            this.$refs.viewer.show();

        },
        /**
         * 显示司机驾照照片
         * @param data
         */
        showDriverLicenceImg(data)
        {
            if (!data.driverLicenceFrontImg && !data.idCardBackImgPath)
            {
                // this.$message.error("没有图片~");
                return;
            }
            this.srcList = [];
            this.srcList.push(data.driverLicenceFrontImgUrl, data.driverLicenceBackImgUrl);
            this.$refs.viewer.show();
        },
        /**
         * 显示司机从业资格证
         * @param data
         */
        showQualifyCertImgUrl(data)
        {
            if (!data.qualifyCertImgUrl)
            {
                // this.$message.error("没有图片~");
                return;
            }
            this.srcList = [];
            this.srcList.push(data.qualifyCertImgUrl);
            this.$refs.viewer.show();
        },
        open(flag)
        {
            if (flag)
            {
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length != 1) {
                    this.$message.error("请选择一条数据！");
                    return;
                }
                let data = selectData[0];
                if (data.sts == 0 && this.common.isNotBlank(data.resignDate))
                {
                    this.$message.error("该司机已离职！");
                    return;
                }
                this.info = this.common.copyObj(data);
                if (this.common.isBlank(this.info.resignDate))
                {
                    //默认今天
                    this.info.resignDate = this.common.formatDate.getDate();
                }
            }
            this.showModify = flag;
            this.$forceUpdate();
        },
        async resignForDriver()
        {
            await this.common.postUrl('driverTF', 'resignForDriver', this.info);
            this.$message.error("司机离职成功！");
            this.open(false);
            await this.doQuery();
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
                urlId: 'ownDriver' + 'Detail' + data.id,
                query: {
                    logId: data.id,
                    logType: enumData.LOG_TYPE.DRIVER,
                },
                urlName: "自有车司机" + "操作日志",
                urlPathName: "/operateLog",
                urlPath: "/pt/operateLog/operateLog.vue"});
        },
        download(){
            this.$refs.table.downloadExcelFile('自有车司机');
        },
    },
    computed: {
        formData()
        {
            return [
                {"name": "司机名称", "model": "driverName", "type": "input", "isshow": true},
                {"name": "手机号", "model": "driverPhone", "type": "input", "isshow": true},
                {"name": "身份证号", "model": "idCard", "type": "input", "isshow": true},
                {"name": "绑定车辆", "model": "plateNumber", "type": "input", "isshow": true},
                {"name": "司机状态", "model": "sts", "type": "select", "options": this.stsData, "label": "codeName", "value": "codeValue", "method": "doQuery", "isshow": true},
                {"name": "在职/离职", "model": "resignState", "type": "select", "options": this.resignStateData, "label": "codeName", "value": "codeValue", "method": "doQuery", "isshow": true},
                // {"name": "所属公司", "model": "tenantId", "type": "select", "options": this.supplierData, "label": "supplierName", "value": "tenantId", "method": "doQuery", "isshow": true},
            ]
        }
    },
    components: {
        myFileModel,
        fileViewer,
        tableCommon,
        myImport,
        searchList
    },
}
