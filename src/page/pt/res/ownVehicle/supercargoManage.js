import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import fileViewer from '@/components/myFile/file-viewer.vue';
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";
import myImport from "@/components/myImport/myImport.vue";

export default {
    name: 'supercargoManage',
    data()
    {
        return {
            head: [
                {"name": "押运员姓名", "code": "supercargoName", "width": "90", "type": "text"},
                {"name": "性别", "code": "sexName", "width": "100", "type": "text"},
                {"name": "绑定司机姓名", "code": "bidDriverName", "width": "100", "type": "text"},
                {"name": "手机号码", "code": "billId", "width": "180", "type": "text"},
                {"name": "身份证号码", "code": "idCard", "width": "200", "type": "text"},
                {"name": "押运员证号", "code": "supercargoLicence", "width": "150", "type": "text"},
                {"name": "押运证生效日期", "code": "effectiveDate", "width": "120", "type": "text"},
                {"name": "押运证失效日期", "code": "expireDate", "width": "120", "type": "text"},
                {"name": "入职日期", "code": "entryDate", "width": "100", "type": "text"},
                {"name": "入职年龄", "code": "entryAge", "width": "100", "type": "text"},
                {"name": "在职/离职", "code": "resignStateName", "width": "120", "type": "text"},
                {"name": "离职日期", "code": "resignDate", "width": "150", "type": "text"},
                {"name": "离职原因备注", "code": "resignRemark", "width": "150", "type": "text"},
                {"name": "住址", "code": "address", "width": "350", "type": "text"},
                {"name": "入职押运龄", "code": "entrySupercargoAge", "width": "100", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "查看图片", "code": "", "width": "280", "type": "diy"},
            ],
            query: {},
            vehicleLengthTypeData: [],
            srcList: [],
            uploadOpen: false,
            showModify:false,
            info: {
                id:null,
                driverName:null,
                resignDate:null,
                resignRemark:null,
            },
            stsData: [],
        }
    },
    mounted()
    {
        this.initData();
        this.doQuery();
    },
    components: {
        myImport,
        myFileModel,
        fileViewer,
        tableCommon,
        searchList
    },
    methods: {
        async doQuery(query = this.query)
        {
            this.uploadOpen = false;
            this.query = query;
            let {items} = await this.$refs.table.load("supercargoService", "querySupercargoPage", this.query);
            items.forEach((el) => {
                if (el.sts == 0) {
                    el.disabled = true;
                }
            })
            this.$refs.table.resetData(items);
        },
        async initData()
        {
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', {'codeType': 'STS'});
            this.stsData = data.STS;
        },
        /**
         * 0 查看 1 增加 2 修改
         * @param type
         * @returns {boolean}
         */
        openPage(type, data)
        {
            let param = {};
            let title = "";
            let urlPath = "/pt/res/ownVehicle/supercargoInfo.vue";
            if (type == 1)
            {
                param.time = new Date().getTime();
                title = "新增押运员";
            }
            else if(type == 2)
            {
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length !== 1) {
                    this.$message.error("请选择一条需要修改的押运员！");
                    return false;
                }
                data = selectData[0];
                param.time = data.id;
                param.id = data.id;
                title = "修改押运员";
            }
            else if(type == 0)
            {
                param.time = data.id + "detail";
                param.id = data.id;
                title = "查看押运员";
                urlPath = "/pt/res/ownVehicle/supercargoInfoMain.vue";
            }
            else
            {
                this.$message.error("请刷新试试！");
                return false;
            }
            this.$emit("openTab",{
                urlId: 'supercargoInfo' + param.time,
                query: {id: param.id, type,
                    logId: param.id,
                    logType: enumData.LOG_TYPE.SUPERCARGO,
                },
                urlName: title,
                urlPathName: "/res",
                urlPath: urlPath});
        },
        dblclickItem(data)
        {
            this.openPage(0, data);
        },
        async deleteSupercargoInfo()
        {
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1)
            {
                this.$message.error("请选择一个需要删除的押运员!");
                return false;
            }
            let that = this;
            this.$confirm("确定需要删除？", "提示").then(() =>{
                this.common.postUrl("supercargoService", "deleteSupercargoById", array[0], function (data)
                {
                    that.doQuery();
                    that.$message.success("押运员删除成功!");
                });
            }).catch(() =>{})
        },
        showIdCardImg(data)
        {
            if (!data.idCardFrontImgUrl && !data.idCardBackImgUrl)
                return;
            this.srcList = [];
            this.srcList.push(data.idCardFrontImgUrl, data.idCardBackImgUrl);
            this.$refs.viewer.show();
        },
        showSupercargoLicenceImg(data)
        {
            if (!data.supercargoLicenceImgUrl)
                return;
            this.srcList = [];
            this.srcList.push(data.supercargoLicenceImgUrl);
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
                    this.$message.error("该押运员已离职！");
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
        async resignForSupercargo()
        {
            await this.common.postUrl('supercargoService', 'resignForSupercargo', this.info);
            this.$message.error("押运员离职成功！");
            this.open(false);
            await this.doQuery();
        },
        download(){
            this.$refs.table.downloadExcelFile('押运员');
        },
    },
    computed: {
        formData()
        {
            return [
                {"name": "押运员姓名", "model": "supercargoName", "type": "input", "isshow": true},
                {"name": "手机号码", "model": "billId", "type": "input", "isshow": true},
            ]
        }
    },
}
