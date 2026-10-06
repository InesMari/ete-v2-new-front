import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import fileViewer from '@/components/myFile/file-viewer.vue';

export default {
    name: 'purchaseInOrderManage',
    data()
    {
        return {
            head: [
                {"name": "入库地", "code": "workName", "width": "120", "type": "text"},
                {"name": "采购入库编码", "code": "deliveryNum", "width": "250", "type": "text"},
                {"name": "采购单单号", "code": "purchaseNum", "width": "150", "type": "diy"},
                {"name": "预计发货/提货时间", "code": "deliverDate", "width": "150", "type": "text"},
                {"name": "入库日期", "code": "inDate", "width": "150", "type": "text"},
                {"name": "供应商名称", "code": "tenantName", "width": "300", "type": "text"},
                {"name": "采购方名称", "code": "settleBodyName", "width": "300", "type": "text"},
                {"name": "物种品类", "code": "feeSubTypeName", "width": "250", "type": "text"},
                {"name": "品名", "code": "projectNames", "width": "150", "type": "text"},
                {"name": "采购数量", "code": "purchaseNums", "width": "120", "type": "text"},
                {"name": "入库数量", "code": "deliveryTotalNums", "width": "120", "type": "text"},
                {"name": "交货单", "code": "url", "width": "100", "type": "diy"},
                {"name": "备注", "code": "remark", "width": "160", "type": "text"},
                {"name": "入库人员", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "入库操作时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "使用客户", "code": "useCustomerName", "width": "150", "type": "text"},
                {"name": "客户确认状态", "code": "confirmStateName", "width": "160", "type": "text"},
                {"name": "客户确认时间", "code": "confirmDate", "width": "150", "type": "text"},
            ],
            query: {
                workId: null,
                deliveryNum: null,
                purchaseNum: null,
                tenantName: null,
                feeType: null,
                feeSubType: null,
                projectName: null,
                useCustomerName: null,
                inDate: null,
            },
            workData: [],
            feeTypeData: [],
            feeSubTypeData: [],
            srcList: [],
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.query.deliveryNum = this.$route.query.deliveryNum;
        this.doQuery();
        this.initStaticData();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        searchList,
        fileViewer
    },
    /**
     * 绑定函数
     */
    methods: {
        async initStaticData()
        {
            this.feeTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_TYPE"});
            for (let i = 0; i < this.feeTypeData.length; i++)
            {
                let item = this.feeTypeData[i];
                if (item.codeValue <= 5)
                {
                    this.feeTypeData.splice(i, 1);
                    i--;
                }
            }
            this.feeSubTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_TYPE_SUB"});
            this.workData = await this.common.postUrl("devPurchaseOrderService", "queryDeliveryWorkId", {workId:0});
        },
        async doQuery(query = this.query)
        {
            this.query = query;
            if (this.common.isNotBlank(this.query.inDate) && this.query.inDate.length == 2)
            {
                this.query.beginInDate = this.query.inDate[0];
                this.query.endInDate = this.query.inDate[1];
            } else
            {
                this.query.beginInDate = '';
                this.query.endInDate = '';
            }
            await this.$refs.table.load("purPurchaseOrderDeliveryService", "queryPurInStockPage", this.query);
        },
        dblclickItem(item)
        {
            this.open({
                query: {id: item.id},
                urlId: 'inOrderDetail' + item.id,
                urlName: '入库管理详情',
                urlPathName: '/inOrderDetail',
                urlPath: "/pt/purchase/inOrder/inOrderDetail.vue",
            });
        },
        toPurOrder(item){
            this.open({
                query:{id:item.purchaseId,type:0},
                urlId: 'detailPurOrder' + item.purchaseId + 0,
                urlName: '采购单详情',
                urlPathName: '/purFeeDetail',
                urlPath: "/pt/purchase/purOrder/addPurOrder.vue",
            });
        },
        open(data)
        {
            this.$emit("openTab", {
                query: data.query,
                urlId: data.urlId,
                urlName: data.urlName,
                urlPathName: data.urlPathName,
                urlPath: data.urlPath
            });
        },
        showBigImg(data)
        {
            if(this.common.isBlank(data.url)){
                this.$message.error("没有图片~");
                return;
            }
            let typeList = {
                img:".gif,.GIF,.jpg,.JPG,.png,.PNG,.jpeg,.JPEG,.ico,.ICO",
                table:".xls,.xlsx,.XLS,.XLSX",
                file:"file"
            };
            let fileTypeName = data.url.substring(data.url.lastIndexOf('.'), data.url.length);
            if(typeList['img'].indexOf(fileTypeName)>-1){
                this.srcList=[];
                this.srcList.push(data.url);
                this.$refs.viewer.show();
            }else{
                data.url = data.url.replace("_big", "");
                let url = data.url;
                let fileType = this.common.getFileType('',url);
                if(fileType=='pdf'){   //查看pdf
                    let idx = url.indexOf("?");
                    if(idx>=0){
                        url = url.substring(idx,0);
                    }
                    this.srcList=[];
                    this.srcList.push(url);
                    this.$refs.viewer.show();
                }else if(fileType=='excel'||fileType=='word'||fileType=='ppt'){
                    this.srcList=[];
                    this.srcList.push(url);
                    this.$refs.viewer.show();
                }else{  //下载文件
                    this.common.downloadFile(url)
                }
            }
        },
        async inOrderConfirm() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要确认的数据！");
                return false;
            }
            if (selectData[0].confirmState!=0)
            {
                this.$message.error("只有未确认的数据才可以确认！");
                return false;
            }
            let param = this.common.copyObj(selectData[0]);
            this.$prompt("您正在确认，确认后采购物品会进入库存，是否继续?", "提示",{
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                showInput: true,
                center: true,
                closeOnClickModal: false,
                distinguishCancelAndClose: true,
                inputPlaceholder: '确认备注'
            }).then(async ({value}) =>{
                param.confirmRemark = value;
                await this.common.postUrl("purPurchaseOrderDeliveryService", "savePurPurchaseOrderDeliveryConfirm", param);
                await this.doQuery();
                this.$message.success("操作成功！");
            }).catch(async action =>{
                if ( action === 'cancel') {
                    this.$message.success("已取消操作！")
                }
            });
        },

    },
    computed: {
        formData()
        {
            return [
                {"name":"入库地","model":"workId","type":"select","options":this.workData,"label":"workName","value":"workId","placeholder":"仓库名称","method":"doQuery","isshow":true},
                {"name":"采购入库编码","model":"deliveryNum","type":"input","isshow":true},
                {"name":"采购单单号","model":"purchaseNum","type":"input","isshow":true},
                {"name":"供应商名称","model":"tenantName","type":"input","isshow":true},
                {"name":"物品种类","model":"feeType","type":"select","options":this.feeTypeData,"label":"codeName","value":"codeValue","placeholder":"物品种类","method":"doQuery","isshow":true},
                {"name":"物品子种类","model":"feeSubType","type":"select","options":this.feeSubTypeData,"label":"codeName","value":"codeValue","placeholder":"物品种类","method":"doQuery","isshow":true},
                {"name":"品名","model":"projectName","type":"input","isshow":true},
                {"name":"入库日期","model":"inDate","type":"daterange","isshow":true},
                {"name":"使用客户","model":"useCustomerName","type":"input","isshow":true},
            ]
        }
    },
}
