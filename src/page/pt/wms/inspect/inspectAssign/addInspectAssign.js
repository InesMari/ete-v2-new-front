import enumData from "@/page/pt/enum";

export default {
    name: "addInspectAssign",
    components: {},
    data() {
        return {
            info: {
                id: null,
                workStoreId: null,
                standardId: null,
                inspectionTimes: null,
                executor: null,
                principal:null,
            },
            appointInspectionDate: null,
            limitPickerOptions:this.common.copyObj(enumData.DATE_SHORTCUT_OPTIONS),
            view: false,
            type: this.$route.query.type,
            workData: [],
            standardData: [],
            inspectionTimesData: [],
            list:[{
                equipment:null,
                equipmentNum:null,
                sts:1,
            }],
            inspectionTimesList:[],
            orgUserData:[],
            imgNameList:[
                {
                    imgName: null
                }
            ],
            passData:[
                {value:false,name:'周一'},
                {value:false,name:'周二'},
                {value:false,name:'周三'},
                {value:false,name:'周四'},
                {value:false,name:'周五'},
                {value:false,name:'周六'},
                {value:false,name:'周日'},
            ],
        };
    },
    mounted()
    {
        if (this.type == 2)
        {
            this.loadDataById();
        }
        this.initData();
    },
    methods: {
        async loadDataById()
        {
            let data = await this.common.postUrl('wmsInspectionAppointService', 'loadWmsInspectionAppointDataById', {id: this.$route.query.id});
            this.info = data.info;
            for(let i = 0; i < this.info.passWeekend.length; i++) {
                if(parseInt(this.info.passWeekend[i])==1){
                    this.passData[i].value=true;
                }
            }
            this.inspectionTimesList = data.inspectionTimesList;
            this.standardDtlList = data.standardDtlList;
            this.list = data.list;
            this.imgNameList = data.imgNameList;
            this.appointInspectionDate = data.appointInspectionDate;
            this.loadWorkUser(false);
            this.$forceUpdate();
        },
        async initData()
        {
            this.inspectionTimesData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WMS_INSPECTION_TIMES"});
            this.workData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
            this.standardData = await this.common.postUrl("wmsInspectionStandardService", "queryWmsInspectionStandardList", {});
        },
        async loadWorkUser(flag)
        {
            if (flag)
            {
                this.info.executor = [];
            }
            this.orgUserData = await this.common.postUrl("userTF", "loadWorkUserList", {workId: this.info.workStoreId});
            await this.changeStandard();
        },
        changeTimes()
        {
            //没有初始化的时候初始化一次
            if (this.info.inspectionTimes == 3 && this.inspectionTimesList.length === 0)
            {
                let now = new Date();
                let beginHour = 8;
                for (let i = 0; i < 12; i++)
                {
                    if (beginHour == 24)
                    {
                        beginHour = 0;
                    }
                    let item = {time: [
                            new Date(now.getFullYear(), now.getMonth(), now.getDate(), beginHour, 0),
                            new Date(now.getFullYear(), now.getMonth(), now.getDate(), beginHour + 2, 0)
                        ]}
                    this.inspectionTimesList.push(item);
                    beginHour = beginHour + 2;
                }
            }
        },
        async changeStandard()
        {
            if (this.common.isNotBlank(this.info.standardId) && this.common.isNotBlank(this.info.workStoreId))
            {
                let equipmentType = null;
                let workId = this.info.workStoreId;
                this.standardData.forEach(item => {
                    if (this.info.standardId == item.id)
                    {
                        equipmentType = item.equipmentType;
                    }
                })
                if (this.common.isNotBlank(equipmentType))
                {
                    this.list = await await this.common.postUrl("assetTF", "queryWmsEquipmentPurchaseList", {equipmentType, workId});
                    this.list.forEach(item => {
                        item.sts = 1;
                    })
                }
                this.$forceUpdate();
            }
        },
        deleteTime(index)
        {
            this.inspectionTimesList.splice(index, 1);
            this.$forceUpdate();
        },
        addListItem()
        {
            this.list.push({sts: 1});
        },
        removeListItem(index)
        {
            this.list.splice(index, 1);
        },
        addImgItem()
        {
            this.imgNameList.push({});
        },
        removeImgItem(index)
        {
            this.imgNameList.splice(index, 1);
        },
        async save()
        {
            if (this.common.isBlank(this.info.workStoreId))
            {
                this.$message.error("仓库不能为空!");
                return false;
            }
            if (this.common.isBlank(this.info.standardId))
            {
                this.$message.error("巡检事项不能为空!");
                return false;
            }
            if (this.common.isBlank(this.info.inspectionTimes))
            {
                this.$message.error("巡检频率不能为空!");
                return false;
            }
            if (this.info.inspectionTimes == 2)
            {
                if (this.common.isBlank(this.appointInspectionDate))
                {
                    this.$message.error("每月截止日期不能为空!");
                    return false;
                }
                this.inspectionTimesList = [{appointInspectionDate: this.appointInspectionDate}];
            }
            else if (this.info.inspectionTimes == 3)
            {
                if (this.common.isBlank(this.inspectionTimesList) || this.inspectionTimesList.length == 0)
                {
                    this.$message.error("频率时间区段不能为空!");
                    return false;
                }
                for (let i = 0; i < this.inspectionTimesList.length; i++)
                {
                    let item = this.inspectionTimesList[i];
                    let time = item.time;
                    let begin = time[0];
                    let end = time[1];
                    if (this.common.isBlank(begin))
                    {
                        this.$message.error("请选择第" + (i + 1) + "行指定时间区间开始时间！");
                        return false;
                    }
                    if (this.common.isBlank(end))
                    {
                        this.$message.error("请选择第" + (i + 1) + "行指定时间区间结束时间！");
                        return false;
                    }
                    //处理下数据
                    if (begin instanceof Date)
                    {
                        item.inspectionBeginDate = this.common.formatDate.getDateTime(begin);
                    }
                    else
                    {
                        item.inspectionBeginDate = this.common.formatDate.getDate() + " " + begin;
                    }
                    if (end instanceof Date)
                    {
                        item.inspectionEndDate = this.common.formatDate.getDateTime(end);
                    }
                    else
                    {
                        item.inspectionEndDate = this.common.formatDate.getDate() + " " + end;
                    }
                }
            }
            if (this.common.isBlank(this.info.executor) || this.info.executor.length == 0)
            {
                this.$message.error("执行人不能为空!");
                return false;
            }
            if (this.common.isBlank(this.info.principal) || this.info.principal.length == 0)
            {
                this.$message.error("负责人不能为空!");
                return false;
            }
            if (this.common.isBlank(this.list) || this.list.length == 0)
            {
                // this.$message.error("巡检设备数据不能为空!");
                // return false;
            }
            let param = this.common.copyObj(this.info);
            param.inspectionTimesList = this.inspectionTimesList;
            param.executor = this.info.executor;
            param.list = this.list;
            param.imgNameList = this.imgNameList;
            param.passWeekend = '';
            for (let i = 0; i < this.passData.length; i++) {
                if(this.passData[i].value){
                    param.passWeekend += '1';
                }else{
                    param.passWeekend += '0';
                }
            }
            await this.common.postUrl('wmsInspectionAppointService', 'saveOrUpdateWmsInspectionAppoint', param, null, null, null, true);
            this.$message.success("提交成功")
            this.closePage();
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
};