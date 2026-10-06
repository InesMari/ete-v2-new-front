import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";
import selectWork from "@/page/pt/wms/selectWork.vue";
import domtoimage from 'dom-to-image';

export default {
    name: 'wmsVehicleManage',
    data()
    {
        return {
            head: [
                {"name": "查看二维码", "code": "", "width": "100", "type": "diy"},
                {"name": "供应商", "code": "supplierTenantName", "width": "250", "type": "text"},
                {"name": "车牌号", "code": "plateNumber", "width": "120", "type": "text"},
                {"name": "司机姓名", "code": "driverName", "width": "120", "type": "text"},
                {"name": "司机手机号", "code": "driverPhone", "width": "150", "type": "text"},
                {"name": "备注", "code": "remark", "width": "160", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "100", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            title: '新增',
            showDialog: false,
            isLock: false,
            info:{
                supplierTenantId:'',
                vehicleId:'',
                driverUserId:'',
                remark:'',
            },
            query: this.initQuery(),
            supplierData: [],
            vehicleData: [],
            driverData: [],
            showSelWork:false,

            showImgDialog:false,
            currentItem:{},
            qrcodeBase64: '', // 存储二维码的base64数据
        }
    },
    mounted()
    {
        this.initSelWork();
        this.initData();
    },
    components: {
        selectWork,
        tableCommon,
        searchList,
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
            //选择仓库之后加载列表
            this.doQuery();
        },
        async doQuery(query = this.query) {
            this.query = query;
            await this.$refs.table.load("wmsVehicleTF", "queryWmsVehicleInfoPage", this.query);
        },
        async initData() {
            this.initSupplierData();
        },
        async initSupplierData()
        {
            this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
        },
        changeSupplier(tenantId)
        {
            if (this.common.isBlank(tenantId))
            {
                this.vehicleData = [];
                this.driverData = [];
                this.info.vehicleId = '';
                this.info.driverUserId = '';
                return;
            }
            for (let i = 0; i < this.supplierData.length; i++)
            {
                let item = this.supplierData[i];
                if (tenantId == item.tenantId)
                {
                    this.info.vehicleId = '';
                    this.info.driverUserId = '';
                    this.initVehicleList(item.tenantId);
                    this.initDriverList(item.tenantId);
                    break;
                }
            }
        },

        //初始化车辆
        async initVehicleList(supplierTenantId)
        {
            let that = this;
            that.vehicleData = [];
            let data = await this.common.postUrl("resVehicleInfoTF", "selVehicleInfoListByCond", {
                tenantId: supplierTenantId,
                rows: 999
            });

            that.vehicleData = data.items;
            that.$forceUpdate();
            if (data.items.length === 1)
            {
                that.$nextTick(()=>{
                    this.info.vehicleId = that.vehicleData[0].vehicleId;
                })
            }
        },
        //初始化司机
        async initDriverList(supplierTenantId)
        {
            this.driverData = [];
            let data = await this.common.postUrl("driverTF", "selDriverInfoListByCond", {
                tenantId: supplierTenantId,
                rows: 999
            });
            this.driverData = data.items;
            this.$forceUpdate();
            if (data.items.length === 1)
            {
                this.info.driverUserId = this.driverData[0].driverUserId;
            }
        },
        initQuery()
        {
            return this.query = {
                supplierTenantName: '',
                plateNumber: '',
                driverName: '',
            };
        },
        async openDialog(flag)
        {
            this.showDialog = flag;
        },
        async dblclickItem(data)
        {
            this.title = '详情';
            this.isLock = true;
        },

        async addInfo()
        {
            this.title = '新增';
            this.isLock = false;
            this.info={};
            await this.openDialog(true);
        },
        async updateInfo()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的数据！");
                return false;
            }
            this.title = '修改';
            this.isLock = false;
            this.info=selectData[0];
        },
        async saveOrUpdateInfo()
        {
            if (this.common.isBlank(this.info.supplierTenantId))
            {
                this.$message.error("请选择供应商！");
                return false;
            }
            if (this.common.isBlank(this.info.vehicleId))
            {
                this.$message.error("请选择车牌号！");
                return false;
            }
            if (this.common.isBlank(this.info.driverUserId))
            {
                this.$message.error("请选择司机！");
                return false;
            }
            await this.common.postUrl("wmsVehicleTF", "saveOrUpdateWmsVehicleInfo", this.info);
            await this.doQuery();
            await this.openDialog(false);
            this.$message.success("保存成功!");
        },

        async deleteInfo()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的数据！");
                return false;
            }
            let that = this;
            this.$confirm("确定需要删除？", "提示").then(() =>{
                this.common.postUrl("wmsVehicleTF", "deleteWmsVehicleInfo", selectData[0], function ()
                {
                    that.doQuery(that.query);
                    that.$message.success("删除成功!");
                });
            }).catch(() =>{})
        },
        async visitCode(item){
            this.currentItem = item;
            this.showImgDialog = true;
            this.$forceUpdate();
        },
        // 下载图片
        downloadImg(){
            // 使用ref获取orderView DOM元素
            const orderViewElement = this.$refs.orderView;
            if (!orderViewElement) {
                this.$message.error('找不到要导出的内容');
                return;
            }

            // 显示加载状态
            const loading = this.$loading({
                lock: true,
                text: '正在生成图片...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });

            // 使用domtoimage生成图片
            domtoimage.toPng(orderViewElement, {
                quality: 1.0,
                width: orderViewElement.scrollWidth,
                height: orderViewElement.scrollHeight,
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'top left'
                }
            })
                .then((dataUrl) => {
                    // 创建下载链接
                    const link = document.createElement('a');
                    link.download = `车辆二维码_${this.currentItem.plateNumber || ''}_${this.currentItem.driverName || ''}_${new Date().getTime()}.png`;
                    link.href = dataUrl;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    loading.close();
                    this.$message.success('图片下载成功！');
                })
                .catch((error) => {
                    console.error('生成图片失败:', error);
                    loading.close();
                    this.$message.error('生成图片失败，请重试');
                });
        },
        forceUpdate(){
            this.$forceUpdate();
        },

    },
    computed:{
        formData(){
            return [
                {"name":"供应商","model":"supplierTenantName","type":"input","placeholder":"供应商","isshow":true},
                {"name":"车牌号","model":"plateNumber","type":"input","placeholder":"车牌号","isshow":true},
                {"name":"司机姓名","model":"driverName","type":"input","placeholder":"司机姓名","isshow":true},
            ]
        }
    },
}
