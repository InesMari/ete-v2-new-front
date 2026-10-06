import tableCommon from "@/components/table/tableCommon.vue";
import authRoleTree from "@/components/auth/authRoleTree.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import fileViewer from '@/components/myFile/file-viewer.vue';
import searchList from "@/components/searchList/searchList.vue";
import myImport from "@/components/myImport/myImport.vue";
import enumData from "@/page/pt/enum.js"

export default {
    name: 'customerManage',
    data()
    {
        return {
            head: [
                {"name": "客户名称", "code": "name", "width": "250", "type": "text"},
                {"name": "附件", "code": "attachments", "width": "150", "type": "diy"},
                // {"name": "所属区域", "code": "regionIdsName", "width": "200", "type": "text"},
                {"name": "所属部门", "code": "orgNames", "width": "200", "type": "text"},
                {"name": "结款信用", "code": "creditLevel", "width": "280", "type": "diy"},
                {"name": "账期(天)", "code": "accountPeriod", "width": "120", "type": "text"},
                {"name": "是否启用", "code": "stsName", "width": "120", "type": "diyColorTd"},
                {"name": "客户联系人", "code": "adminUser", "width": "120", "type": "text"},
                {"name": "登录账号", "code": "linkPhone", "width": "150", "type": "text"},
                {"name": "所属行业", "code": "belongingIndustryName", "width": "150", "type": "text"},
                {"name": "客户代表", "code": "custManageUserName", "width": "150", "type": "text"},
                {"name": "是否购买方", "code": "isAcctName", "width": "120", "type": "text"},
                {"name": "短信提醒司机送达", "code": "smsRemindDriverDeliverName", "width": "120", "type": "text"},
                {"name": "关联购买方名称", "code": "acctCustIdsName", "width": "120", "type": "text"},
                {"name": "地址", "code": "address", "width": "350", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},

            ],
            query: {
                custName: '',
                linkPhone: '',
                sts: '',
                isAcct: '',
                acctName: '',
            },
            showEntityPage: false,
            showAddCustomer: false,
            stsData: [],
            dic_whether: [],
            dialogTitle: '',
            customer: {
                custName: '',
                address: '',
                linkman: '',
                linkPhone: '',
                regionIds: '',
                // orgId:'',
                custManage: '',
                logisticsMode: '',
                belongingIndustry: '',
                invoiceType: '',
                taxNumber: '',
                regAddress: '',
                regPhone: '',
                regBank: '',
                accountName: '',
                regAccount: '',
                accountPeriod: '',
                businessLicenseImg: '',
                businessLicenseImgPath: '',
                invoiceInfoImg: '',
                invoiceInfoImgPath: '',
                taxRate: '9',
                loadTaxRate: '6',
            },
            invoiceTypeData: [],
            logisticsModeData: [],
            belongingIndustryData: [],
            regionData: [],//所有区域数据
            orgData: [],//所有部门数据
            staffData: [],//平台所有员工的信息
            regionOrgData: [],//选择区域对应的部门数据
            orgStaffData: [],//选择组织对应的员工
            orgStaffData2: [],
            srcList: [],
            isAdd: false,

            //1到5星,自动计算并显示，新客户5星，1次逾期付款4星，逾期一个月付款3星，逾期两个月付款2星，逾期三个月付款1星，1星为风险客户
            colors:['#99A9BF', '#F7BA2A', '#FF9900'],
            texts:['逾期超90天付款', '逾期超60天付款', '逾期超30天付款', '逾期超30天内付款', '守信客户'],
            creditLevelData:[
                {
                    codeValue: 1,
                    codeName: '逾期超90天付款',
                },
                {
                    codeValue: 2,
                    codeName: '逾期超60天付款',
                },
                {
                    codeValue: 3,
                    codeName: '逾期超30天付款',
                },
                {
                    codeValue: 4,
                    codeName: '逾期30天内付款',
                },
                {
                    codeValue: 5,
                    codeName: '守信客户',
                }
            ],

            uploadOpen:false,
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.doQuery();
        this.initData();
    },
    /**
     * 组件
     */
    components: {
        myImport,
        myFileModel,
        tableCommon,
        authRoleTree,
        fileViewer,
        searchList,
    },
    /**
     * 绑定函数
     */
    methods: {

        /**
         *
         */
        async doQuery(query = this.query)
        {
            this.query = query;
            let {items} = await this.$refs.table.load("customerTF", "queryCustomerList", this.query);
            items.forEach((el) =>
            {
                if (el.sts == 0)
                {
                    el.disabled = true;
                }
            })
            this.$refs.table.resetData(items);
        },
        /**
         * 初始化数据
         */
        async initData()
        {

            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes',
                {'codeType': 'STS,WHETHER,INVOICE_TYPE,LOGISTICS_MODE,BELONGING_INDUSTRY'});
            this.stsData = data.STS;
            this.dic_whether = data.WHETHER;
            this.invoiceTypeData = data.INVOICE_TYPE;
            this.logisticsModeData = data.LOGISTICS_MODE;
            this.belongingIndustryData = data.BELONGING_INDUSTRY;

            let that = this;
            //加载区域数据
            this.common.postUrl("regionOrgTF", "getRegionInfoList", {}, function (data)
            {
                that.regionData = data;
                for (let i = 0; i < that.regionData.length; i++)
                {
                    that.regionData[i].id = that.regionData[i].id + '';
                }
            });
            //加载区域数据
            this.common.postUrl("regionOrgTF", "getOrgInfoList", {}, function (data)
            {
                that.orgData = data;
            });
            //加载所有的人员
            this.common.postUrl("regionOrgTF", "getStaffInfoList", {}, function (data)
            {
                that.staffData = data;
                that.orgStaffData = data;

                const map = new Map()
                const newArr = []
                data.forEach(item => {
                    if (!map.has(item.userId)) { // has()用于判断map是否包为item的属性值
                        map.set(item.userId, true) // 使用set()将item设置到map中，并设置其属性值为true
                        newArr.push(item)
                    }
                })
                that.orgStaffData2 =newArr;
            });
        },
        regionChange(val)
        {
            this.regionOrgData = [];
            // this.customer.orgId = '';
            this.customer.custManage = '';
            for (let i = 0; i < this.orgData.length; i++)
            {
                if (this.orgData[i].regionId == val)
                {
                    this.regionOrgData.push(this.orgData[i]);
                }
            }
        },
        orgChange(val)
        {
            this.orgStaffData = [];
            this.customer.custManage = '';
            for (let i = 0; i < this.staffData.length; i++)
            {
                if (this.staffData[i].orgId == val)
                {
                    this.orgStaffData.push(this.staffData[i]);
                }
            }
        },
        /**
         * 查看详情
         */
        toCustomerDetail(data, type)
        {
            if (type != 2)
            {
                let array = this.$refs.table.getSelectItem();
                if (array.length !== 1)
                {
                    this.$message.error("请选择一条客户信息~");
                    return false;
                }
                data = array[0];
            }
            let item = {
                urlName: this.common.isBlank(data.abbreviationName) ? "客户详情" : data.abbreviationName + "-客户详情",
                urlId: 'customerDetail' + data.tenantId,
                urlPathName: "/customer",
                urlPath: "/pt/cm/customer/customerDetailMain.vue",
                query: {
                    tenantId: data.tenantId,
                    custId: data.custId,
                    roleId: data.roleId,
                    tenantName: data.name,
                    pId: 1001003,
                    unShowCheck: 1,
                    logId: data.custId,
                    logType: enumData.LOG_TYPE.CUSTOMER,
                },
            }
            this.$emit('openTab', item);
        },
        /**
         * 修改客户
         */
        toUpdateCustomer()
        {
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1)
            {
                this.$message.error("请选择一条客户信息~");
                return false;
            }
            let item = {
                urlName: "修改客户",
                urlId: 'editCustomer' + array[0].tenantId,
                urlPathName: "/customer",
                urlPath: "/pt/cm/customer/addCustomer.vue",
                query: {
                    tenantId: array[0].tenantId,
                    pId: 1001003,
                    unShowCheck: 1,
                },
            }
            this.$emit('openTab', item);
        },
        /**
         * 清空
         */
        clear()
        {
            this.query = {
                custName: '',
                linkPhone: '',
                sts: '',
                isAcct: '',
                acctName: '',
            };
        },
        /**
         * 是否展示权限页
         * @param flag 开关展示
         */
        isShowEntityPage(flag)
        {
            this.showEntityPage = flag;
        },
        /**
         * 加载权限实体树
         */
        loadEntityTree()
        {
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1)
            {
                this.$message.error("请选择一条客户信息~");
                return false;
            }
            this.$refs.authRoleTree.loadEntityTree({roleId: array[0].roleId, isPT: 1}, false, 2);
            this.isShowEntityPage(true);
        },

        dblclickItem(data)
        {
            this.toCustomerDetail(data, 2);
        },
        /**
         * 关闭新增客户弹出框
         */
        closeAddCustomer()
        {
            this.showAddCustomer = false;
            this.$refs.businessLicense.clean();
            this.$refs.invoiceInfo.clean();
        },
        addCustomer()
        {
            if (!this.customer.custName)
            {
                this.$message.error("公司名称不能为空");
                return;
            }
            if (this.customer.custName.length < 2)
            {
                this.$message.error("公司名称长度不对");
                return;
            }
            if (this.common.checkNum(this.customer.custName))
            {
                this.$message.error("公司名称不能全部为数字");
                return;
            }
            if (!this.customer.address)
            {
                this.$message.error("公司地址不能为空");
                return;
            }
            if (this.customer.address.length < 2)
            {
                this.$message.error("公司地址不能为空");
                return;
            }
            if (this.common.checkNum(this.customer.address))
            {
                this.$message.error("公司地址不能全部为数字");
                return;
            }
            if (!this.customer.linkman)
            {
                this.$message.error("客户联系人不能为空");
                return;
            }
            if (this.customer.linkman.length < 2)
            {
                this.$message.error("客户联系人长度不对");
                return;
            }
            if (this.common.checkNum(this.customer.linkman))
            {
                this.$message.error("客户联系人不能全部为数字");
                return;
            }
            if (!this.customer.linkPhone)
            {
                this.$message.error("登录账号不能为空");
                return;
            }
            // if(this.customer.linkPhone.length!=11){
            //     this.$message.error("联系电话格式不对！");
            //     return;
            // }
            if (!this.customer.regionIds)
            {
                this.$message.error("所属区域不能为空");
                return;
            }
            // if(!this.customer.orgId){
            //     this.$message.error("所属部门不能为空");
            //     return;
            // }
            if (!this.customer.logisticsMode)
            {
                this.$message.error("物流模式不能为空");
                return;
            }
            if (!this.customer.belongingIndustry)
            {
                this.$message.error("所属行业不能为空");
                return;
            }
            if (this.customer.accountPeriod && this.customer.accountPeriod > 365)
            {
                this.$message.error("账期不能超过365天");
                return;
            }
            let that = this;
            let method = 'addCustomerInfo';
            if (this.customer.tenantId)
            {
                method = 'updateCustomerInfo';
            }
            this.customer.businessLicenseImg = this.$refs.businessLicense.getImageData().flowId;
            this.customer.businessLicenseImgPath = this.$refs.businessLicense.getImageData().storePath;
            this.customer.invoiceInfoImg = this.$refs.invoiceInfo.getImageData().flowId;
            this.customer.invoiceInfoImgPath = this.$refs.invoiceInfo.getImageData().storePath;
            this.common.postUrl("customerTF", method, this.customer, function (data)
            {
                if (data)
                {
                    that.showAddCustomer = false;
                    that.doQuery();
                    that.$msgbox(that.dialogTitle + "成功！");
                }
            }, null, '', true);
        },
        updateCustomerState(state)
        {
            let that = this;
            let array = this.$refs.table.getSelectItem();
            if (array.length == 0)
            {
                this.$message.error("请至少选择一条客户信息");
                return false;
            }
            let tenantIds = '';
            let names = '';
            for (let i = 0; i < array.length; i++)
            {
                tenantIds += ',' + array[i].tenantId;
                names += ',' + array[i].name;
                if (array[i].sts == state)
                {
                    if (state == 0)
                    {
                        this.$message.error("客户当前是禁用状态");
                        return false;
                    }
                    if (state == 1)
                    {
                        this.$message.error("客户当前是启用状态");
                        return false;
                    }
                }
            }
            tenantIds = tenantIds.substr(1);
            names = names.substr(1);
            let msg = state == 0 ? '禁用' : '启用';
            this.common.postUrl("customerTF", 'updateCustomerState', {tenantIds, names, state}, function (data)
            {
                that.doQuery();
                that.$message.success(msg + "成功！");
            }, null, '', true);
        },
        /**
         * 显示营业资料
         * @param data
         */
        showBusinessLicense(data)
        {
            if (!data.businessLicenseImgUrl)
            {
                this.$message.error("没有图片~");
                return;
            }
            this.srcList = [];
            this.srcList.push(data.businessLicenseImgUrl);
            this.$refs.viewer.show();
        },
        /**
         * 显示开票资料
         * @param data
         */
        showInvoiceInfo(data)
        {
            if (!data.invoiceInfoImgUrl)
            {
                this.$message.error("没有图片~");
                return;
            }
            this.srcList = [];
            this.srcList.push(data.invoiceInfoImgUrl);
            this.$refs.viewer.show();
        },
        successCallback(imgData)
        {
            let that = this;
            this.common.postUrl("supplierTF", 'getBusinessLicenseInfo', {fileId: imgData.storePath}, function (data)
            {
                if (data)
                {
                    if (!that.customer.custName)
                    {
                        that.customer.custName = data.companyName;
                    }
                    if (!that.customer.address)
                    {
                        that.customer.address = data.companyAddress;
                    }
                    if (!that.customer.linkman)
                    {
                        that.customer.linkman = data.artificialPerson;
                    }
                    if (!that.customer.taxNumber)
                    {
                        that.customer.taxNumber = data.credit;
                    }
                    if (!that.customer.regAddress)
                    {
                        that.customer.regAddress = data.companyAddress;
                    }
                    if (!that.customer.accountName)
                    {
                        that.customer.accountName = data.companyName;
                    }
                }
            });
        },
        checkBillId()
        {
            let that = this;
            if (this.isAdd)
            {
                this.common.postUrl("userTF", "getUserName", {billId: that.customer.linkPhone}, function (data)
                {
                    if (data.userName)
                    {
                        that.$message.warning("登录账号：" + that.customer.linkPhone + "对应的用户已经存在，名称为：" + data.userName + "，请确认是否添加他为管理员");
                    }
                });
            }
        },
        uploadSuccess()
        {
            this.doQuery();
            this.uploadOpen=false;
            this.$message.success("导入成功！");
        },
        download(){
          this.$refs.table.downloadExcelFile('合同客户列表');
        },
        downloadCustomerCommission(){
            // 后端导出
            let queryUrl = 'customerTF|queryCustomerCommissionList';
            let excelKeys='name,orgName,custTypeName,offerUserName,findUserName';
            let excelLables='客户,提成部门,客户分级,客户信息提供人员,直接开发人员';
            let loadParam = this.common.copyObj(this.query);
            this.common.downloadExcelFile(queryUrl,loadParam,excelLables,excelKeys,'提成人员列表','customerCommissionManageTable');
        },
    },
    computed: {
        formData()
        {
            return [
                {"name":"客户名称","model":"custName","type":"input","placeholder":"客户名称","isshow":true},
                {"name":"手机号","model":"linkPhone","type":"input","placeholder":"手机号","isshow":true},
                {"name":"是否启用","model":"sts","type":"select","options":this.stsData,"label":"codeName","value":"codeValue","placeholder":"是否启用","method":"doQuery","isshow":true},
                {"name":"结款信用","model":"creditLevel","type":"select","options":this.creditLevelData,"label":"codeName","value":"codeValue","placeholder":"结款信用","method":"doQuery","isshow":true},
                {"name":"是否购买方","model":"isAcct","type":"select","options":this.dic_whether,"label":"codeName","value":"codeValue","placeholder":"是否购买方","method":"doQuery","isshow":true},
                {"name":"短信提醒司机送达","model":"smsRemindDriverDeliver","type":"select","options":this.dic_whether,"label":"codeName","value":"codeValue","placeholder":"短信提醒司机送达","method":"doQuery","isshow":true},
                {"name":"关联购买方名称","model":"acctName","type":"input","placeholder":"关联购买方名称","isshow":true},
                {"name":"客户代表","model":"custManageUserName","type":"input","placeholder":"客户代表","isshow":true},
            ]
        }
    },
}
