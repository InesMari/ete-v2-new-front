import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";
import fileViewer from '@/components/myFile/file-viewer.vue';
import selectWork from "@/page/pt/wms/selectWork.vue";
import enumData from "@/page/pt/enum";


export default {
    name: 'wmsWorkOrderManage',
    data()
    {
        return {
            head: [
                {"name": "作业单号", "code": "orderNum", "width": "150", "type": "text"},
                {"name": "仓库名称", "code": "workName", "width": "200", "type": "text"},
                {"name": "供应商", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "登记状态", "code": "registerStateName", "width": "120", "type": "text"},
                {"name": "确认状态", "code": "confirmStateName", "width": "120", "type": "text"},
                {"name": "操作凭证", "code": "count", "width": "150", "type": "diy"},
                {"name": "现场图片", "code": "count2", "width": "150", "type": "diy"},
                {"name": "费用类型", "code": "itemTypeName", "width": "150", "type": "text"},
                {"name": "作业名称", "code": "itemName", "width": "150", "type": "text"},
                {"name": "计费单位", "code": "unit", "width": "110", "type": "text"},
                {"name": "登记数量", "code": "num", "width": "110", "type": "text"},
                {"name": "结算数量", "code": "settleNum", "width": "110", "type": "text"},
                {"name": "税率(%)", "code": "tax", "width": "110", "type": "text"},
                // {"name": "未税单价", "code": "price", "width": "110", "type": "text"},
                // {"name": "含税单价", "code": "priceWithTax", "width": "110", "type": "text"},
                {"name": "未税金额", "code": "fee", "width": "110", "type": "text"},
                {"name": "含税金额", "code": "feeWithTax", "width": "110", "type": "text"},
                {"name": "结算未税金额", "code": "settleFee", "width": "110", "type": "text"},
                {"name": "结算含税金额", "code": "settleFeeWithTax", "width": "110", "type": "text"},
                {"name": "登记时间", "code": "registerDate", "width": "150", "type": "text"},
            ],
            confirmStateData: [],
            registerStateData: [],
            itemTypeData: [],
            query: {
                orderNum: null,
                workName: null,
                tenantName: null,
                confirmState: null,
                registerState: null,
                itemType: null,
                itemName: null,
                confirmDate: null,
                registerDate: null,
            },
            srcList: [],
            showSelWork: false,
        }
    },
    mounted()
    {
        this.initSelWork();
        this.doQuery();
        this.initData();
    },
    components: {
        tableCommon,
        searchList,
        fileViewer,
        selectWork,

    },
    computed: {
        formData()
        {
            return [
                {"name":"作业单号","model":"orderNum","type":"input","placeholder":"作业单号","isshow":true},
                // {"name":"仓库名称","model":"workName","type":"input","placeholder":"仓库名称","isshow":true},
                {"name":"供应商名称","model":"tenantName","type":"input","placeholder":"供应商名称","isshow":true},
                {"name":"确认状态","model":"confirmState","type":"select","options":this.confirmStateData,"label":"codeName","value":"codeValue","placeholder":"登记状态","method":"doQuery","isshow":true},
                {"name":"登记状态","model":"registerState","type":"select","options":this.registerStateData,"label":"codeName","value":"codeValue","placeholder":"登记状态","method":"doQuery","isshow":true},
                {"name":"费用类型","model":"itemType","type":"select","options":this.itemTypeData,"label":"codeName","value":"codeValue","placeholder":"费用类型","method":"doQuery","isshow":true},
                {"name":"作业名称","model":"itemName","type":"input","placeholder":"单号","isshow":true},
                {"name":"确认时间","model":"confirmDate","type":"daterange","isshow":true},
                {"name":"登记时间","model":"registerDate","type":"daterange","isshow":true},
            ]
        }
    },
    methods: {
        initSelWork(){
            this.userInfo = this.common.userInfo();
            if(!this.userInfo.workId){
                this.showSelWork = true;
            }else{
                this.firstIn = false;
                this.doQuery();
            }
        },
        selWork(){
            this.showSelWork = false;
            this.$forceUpdate();
            if(!this.firstIn){
                this.$emit('closeOthers', {});
            }
            this.userInfo = this.common.userInfo();
            this.firstIn = false;
            this.doQuery();
        },
        async initData()
        {
            let data = await this.common.postUrl("commonTF", "getSysStaticDataByCodeTypes", {codeType: "CONFIRM_STATE,REGISTER_STATE,WMS_FEE_ITEM_TYPE"});
            let confirmStateData = data.CONFIRM_STATE;
            this.registerStateData = data.REGISTER_STATE;
            this.itemTypeData = data.WMS_FEE_ITEM_TYPE;
            for(let i = 0; i < confirmStateData.length; i++)
            {
                if (confirmStateData[i].codeValue != 0 && confirmStateData[i].codeValue != 1)
                {
                    confirmStateData.splice(i, 1);
                }
            }
            this.confirmStateData = confirmStateData;
        },
        async doQuery(query = this.query)
        {
            this.query = query;
            if(this.common.isNotBlank(this.query.confirmDate) && this.query.confirmDate.length === 2){
                this.query.beginConfirmDate = this.query.confirmDate[0];
                this.query.endConfirmDate = this.query.confirmDate[1];
            }else{
                this.query.beginConfirmDate = null;
                this.query.endConfirmDate = null;
            }
            if(this.common.isNotBlank(this.query.registerDate) && this.query.registerDate.length === 2){
                this.query.beginRegisterDate = this.query.registerDate[0];
                this.query.endRegisterDate = this.query.registerDate[1];
            }else{
                this.query.beginRegisterDate = null;
                this.query.endRegisterDate = null;
            }
            await this.$refs.table.load("workOrderService", "queryWorkOrderPage", this.query);
        },
        async show(data)
        {
            if (data.count == 0)
            {
                this.$message.error("没有图片~");
                return;
            }
            this.srcList = [];
            let list = await this.common.postUrl("workOrderService", "loadWorkOrderFileListById", {id: data.id, type: 1});
            for (let i = 0; i < list.length; i++)
            {
                this.srcList.push(list[i].url);
            }
            this.$refs.viewer.show();
        },
        async show2(data)
        {
            if (data.count == 0)
            {
                this.$message.error("没有图片~");
                return;
            }
            this.srcList = [];
            let list = await this.common.postUrl("workOrderService", "loadWorkOrderFileListById", {id: data.id, type: 2});
            for (let i = 0; i < list.length; i++)
            {
                this.srcList.push(list[i].url);
            }
            this.$refs.viewer.show();
        },
        confirm()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要确认的数据！");
                return false;
            }
            let data = selectData[0];
            if (data.confirmState != 0)
            {
                this.$message.error("只有未审核的数据才可以确认！");
                return false;
            }
            let msg = `
                    <p style="text-align:center;">作业单号：${data.orderNum}</p>
                    <p style="text-align:center;">操作供应商：${data.tenantName}</p>
                    <p style="text-align:center;">作业名称：${data.itemName}</p>
                    <p style="text-align:center;">作业数量：${data.num}</p>
                    <p style="text-align:center;font-weight:bold;margin-top:10px;">是否继续？</p>
                    `;
            let that = this;
            this.$confirm(msg, "确认提示", {
                center: true,
                confirmButtonText: '提交',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true
            }).then(async () => {
                await this.common.postUrl("workOrderService", "confirmWorkOrderById", data);
                await that.doQuery();
                that.$message.success("确认成功!");
            }).catch(() => {})
        },
        exportExcel()
        {
            this.query.isExport = 1;
            this.$refs.table.downloadExcelFile();
        },
        print()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要确认的数据！");
                return false;
            }
            let data = selectData[0];
            let id = data.id;
            this.$emit('openTab', {
                urlName: '打印作业单',
                urlId: 'workOrderInfo-print' + id,
                urlPathName: "/wms",
                urlPath: "/pt/wms/workOrder/workOrderInfo.vue",
                query: {id: id, type: 5}//0详情 5 复印
            });
        },
        dblclickItem(item)
        {
            let id = item.id;
            this.$emit('openTab', {
                urlName: '作业单详情',
                urlId: 'workOrderInfo-detail' + id,
                urlPathName: "/wms",
                urlPath: "/pt/wms/workOrder/workOrderInfoMain.vue",
                query: {id: id, type: 0,
                    logId: id,
                    logType: enumData.LOG_TYPE.WORK_ORDER,
                }//0详情 5 复印
            });
        },
        settleSum()
        {
            this.$emit('openTab', {
                urlName: '结算统计',
                urlId: 'wmsWorkOrderSettleSumManage',
                urlPathName: "/wms",
                urlPath: "/pt/wms/workOrder/wmsWorkOrderSettleSumManage.vue",
                query: {}
            });
        },

        //测试接口调用  后面需要删除  todo
        test()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的数据！");
                return false;
            }
            let param = selectData[0];
            param.operaterCertificateList = [
                {
                    fileId:'43638358481001',
                    filePath:'group1/M00/05/C8/rBKgRGUpBGWAGnmBAAAgJ0kfLJ050.jpeg'
                }
            ];
            param.scenePictureList = [
                {
                    fileId:'73294762511000',
                    filePath:'group1/M00/05/C8/rBKgRGUw2s6ARi44AAAd8jxg0ro65.jpeg'
                }
            ];
            param.customerDetailList = [
                {
                    tenantId:'6',
                    num:10
                },
                {
                    tenantId:'7',
                    num:5
                },
                {
                    tenantId:'3',
                    num:12
                }
            ];
            this.common.postUrl("workOrderService", "saveOrUpdateWorkOrderForWechat", param);
            this.$message.success("登记成功!");
        },
    },
}
