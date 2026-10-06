import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import fileViewer from '@/components/myFile/file-viewer.vue';


export default {
    name: 'consumingManage',
    data()
    {
        return {
            head: [
                {"name": "固定资产编号", "code": "stockNum", "width": "200", "type": "text"},
                {"name": "物种品类", "code": "feeSubTypeName", "width": "200", "type": "text"},
                {"name": "品名", "code": "projectName", "width": "150", "type": "text"},
                {"name": "库存地", "code": "workName", "width": "200", "type": "text"},
                {"name": "规格型号", "code": "specification", "width": "120", "type": "text"},
                {"name": "数量单位", "code": "unit", "width": "100", "type": "text"},
                {"name": "领用数量", "code": "useNums", "width": "100", "type": "text"},
                {"name": "领用部门", "code": "useOrgName", "width": "160", "type": "text"},
                {"name": "领用日期", "code": "useDate", "width": "150", "type": "text"},
                {"name": "领用人", "code": "useUserName", "width": "150", "type": "text"},
                {"name": "领用备注", "code": "useRemark", "width": "150", "type": "text"},
                {"name": "审核状态", "code": "verifyStateName", "width": "150", "type": "text"},
                {"name": "审核时间", "code": "verifyDate", "width": "150", "type": "text"},
                {"name": "审核人", "code": "verifyUserName", "width": "150", "type": "text"},
                {"name": "审核备注", "code": "verifyRemark", "width": "150", "type": "text"},
                {"name": "领用图片", "code": "file", "width": "150", "type": "diy"},
            ],
            query: {
                stockNum: '',
                verifyState:this.$route.query.todo == 1 ? '0' : null,
                useOrgName:this.$route.query.todo == 1 ? this.common.userInfo().oneLevelOrgName : null,
                stockDtlId:this.$route.query.stockDtlId,
            },
            verifyStateData: [],
            srcList: [],
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.doQuery();
        this.initStaticData();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        searchList,
        fileViewer,
    },
    /**
     * 绑定函数
     */
    methods: {
        async initStaticData()
        {
            this.feeTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_TYPE"});
            this.feeSubTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_TYPE_SUB"});
            this.orgData = await this.common.postUrl("regionOrgTF", "getOrgInfoList", {});
            for (let i = 0; i < this.feeTypeData.length; i++)
            {
                let item = this.feeTypeData[i];
                if (item.codeValue <= 5)
                {
                    this.feeTypeData.splice(i, 1);
                    i--;
                }
            }
            this.treeData = [];
            this.feeTypeData.forEach(item => {
                let data = this.common.copyObj(item);
                let codeValue = data.codeValue;
                data.children = [];
                this.feeSubTypeData.forEach(item2 => {
                    if (item2.codeId == codeValue)
                    {
                        let data2 = this.common.copyObj(item2);
                        data.children.push(data2);
                    }
                })
                this.treeData.push(data);
            });
            this.verifyStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VERIFY_STATE"});
        },
        async doQuery(query = this.query)
        {
            this.query = query;
            let {items} = await this.$refs.table.load("purStockService", "queryPurConsumingPage", this.query);
        },
        consumingBack()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条归还的领用!");
                return;
            }
            let param = {id: selectData[0].id};
            this.$confirm("您正在操作领用归还,是否继续?", "归还",{
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
                center: true,
                closeOnClickModal: false,
                distinguishCancelAndClose: true
            }).then(async ({value}) =>{
                await this.common.postUrl("purStockService", "saveConsumingBack", param);
                await this.doQuery();
                this.$message.success("操作成功！");
            }).catch(async action =>{
                if (action === 'cancel')
                {
                    //取消
                    await this.doQuery();
                }
            });
        },
        verifyConsuming()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条审核的领用数据!");
                return;
            }
            if(selectData[0].verifyState != '0'){
                this.$message.error("已审核的领用数据不能重复审核!");
                return;
            }
            if(selectData[0].useOrgId != this.common.userInfo().orgId){
                this.$message.error("不是本部门的领用数据，您没有权限审核!");
                return;
            }
            let param = {id: selectData[0].id};
            let that = this;
            this.$prompt("您正在审核领用，是否继续?", "提示",{
                confirmButtonText: '通过',
                cancelButtonText: '不通过',
                type: 'warning',
                center: true,
                showInput: true,
                closeOnClickModal: false,
                distinguishCancelAndClose: true,
                inputPlaceholder: '审核备注',
                beforeClose:async function (action, instance, done)
                {
                    param.verifyRemark = instance.inputValue;
                    if (action == 'confirm')
                    {
                        param.type = 1;
                        await that.common.postUrl("purStockService", "verifyConsuming", param, null, null, '', true);
                        await that.doQuery();
                        that.$message.success("操作成功！");
                    }
                    else if (action === 'cancel')
                    {
                        param.type = 2;
                        await that.common.postUrl("purStockService", "verifyConsuming", param, null, null, '', true);
                        await that.doQuery();
                        that.$message.success("操作成功！");
                    }
                    done();
                }
            });
        },
        deleteConsuming()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条删除的领用数据!");
                return;
            }
            let param = {id: selectData[0].id};
            let that = this;
            this.$confirm("您正在删除领用，是否继续?", "提示",{
                type: 'warning',
                center: true,
                closeOnClickModal: false,
                distinguishCancelAndClose: true,
                beforeClose:async function (action, instance, done)
                {
                    if (action == 'confirm')
                    {
                        await that.common.postUrl("purStockService", "deleteConsuming", param, null, null, '', true);
                        await that.doQuery();
                        that.$message.success("操作成功！");
                    }
                    else if (action === 'cancel')
                    {
                        await that.doQuery();
                        that.$message.success("取消操作！");
                    }
                    done();
                }
            });
        },
        showImg(data){
            if(!data.url){
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
        clear(){
            this.query={};
        },
    },
    computed:{
        formData(){
            return [
                {"name":"品名","model":"projectName","type":"input","isshow":true},
                {"name":"规格型号","model":"specification","type":"input","isshow":true},
                {"name":"领用人","model":"useUserName","type":"input","isshow":true},
                {"name":"领用部门","model":"useOrgName","type":"input","isshow":true},
                {"name":"审核状态","model":"verifyState","type":"select","options":this.verifyStateData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"固定资产编号","model":"stockNum","type":"input","isshow":true},
            ]
        }
    },
}
