import tableCommon from "@/components/table/tableCommon.vue";
import authRoleTree from "@/components/auth/authRoleTree.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import fileViewer from '@/components/myFile/file-viewer.vue';
import searchList from "@/components/searchList/searchList.vue";
import myImport from "@/components/myImport/myImport.vue";
import enumData from "@/page/pt/enum.js"

export default {
    name: 'temporaryCustomerManage',
    data()
    {
        return {
            head: [
                {"name": "客户名称", "code": "name", "width": "250", "type": "text"},
                {"name": "营业资料", "code": "attachments", "width": "150", "type": "diy"},
                // {"name": "是否启用", "code": "stsName", "width": "120", "type": "diyColorTd"},
                {"name": "客户联系人", "code": "adminUser", "width": "120", "type": "text"},
                {"name": "联系电话", "code": "linkPhone", "width": "150", "type": "text"},
                {"name": "客户地址", "code": "address", "width": "350", "type": "text"},
                {"name": "备注", "code": "remark", "width": "200", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},

            ],
            query: {
                custName: '',
                linkPhone: '',
                sts: '',
            },
            stsData: [],
            srcList: [],
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
        async doQuery(query = this.query)
        {
            this.query = query;
            this.query.isTemporaryCustomer = 1;
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
                {'codeType': 'STS'});
            this.stsData = data.STS;
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
                urlPath: "/pt/cm/customer/addTemporaryCustomer.vue",
                query: {
                    tenantId: array[0].tenantId,
                },
            }
            this.$emit('openTab', item);
        },
        /**
         * 修改客户
         */
        toUpgradeCustomer()
        {
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1)
            {
                this.$message.error("请选择一条客户信息~");
                return false;
            }
            let item = {
                urlName: "升级合同客户",
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
        dblclickItem(data)
        {
            let item = {
                urlName: "客户详情",
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
        download(){
          this.$refs.table.downloadExcelFile('临时客户列表');
        },
    },
    computed: {
        formData()
        {
            return [
                {"name":"客户名称","model":"custName","type":"input","placeholder":"客户名称","isshow":true},
                {"name":"联系电话","model":"linkPhone","type":"input","placeholder":"联系电话","isshow":true},
                {"name":"是否启用","model":"sts","type":"select","options":this.stsData,"label":"codeName","value":"codeValue","placeholder":"是否启用","method":"doQuery","isshow":true},
            ]
        }
    },
}
