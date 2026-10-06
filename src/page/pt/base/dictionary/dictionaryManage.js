import tableCommon from "@/components/table/tableCommon.vue"

export default {
    name: 'dictionaryManage',
    data()
    {
        return {
            head: [
                {"name": "名称", "code": "codeName", "width": "200", "type": "text"},
                {"name": "类型", "code": "codeTypeAlias", "width": "150", "type": "text"},
                {"name": "描述", "code": "codeDesc", "width": "200", "type": "text"},
                {"name": "codeValue", "code": "codeValue", "width": "150", "type": "text"},
                {"name": "codeId", "code": "codeId", "width": "150", "type": "text"},
                {"name": "sortId", "code": "sortId", "width": "150", "type": "text"},
            ],
            codeTypeSelectData: [],
            title: '新增字典',
            showDialog: false,
            isLock: false,
            query: this.initQuery(),
            dictionary: this.initDictionary(),
            btnTitle:'打开异动(当前关)',
            cityData: [],
            showCityTip: false,
        }
    },
    mounted()
    {
        this.doQuery();
        this.initData();
    },
    components: {
        tableCommon,
    },
    methods: {
        async doQuery()
        {
            await this.$refs.table.load("commonTF", "queryDictionaryDataPage", this.query);
        },
        async initData()
        {
            this.codeTypeSelectData = await this.common.postUrl("commonTF", "loadSysStaticDataGroupByCodeType", {});
            this.cityData = await this.common.postUrl("selectStaticDataTF", "selectCity", {});
            this.getBtnTitle();
        },
        async getBtnTitle() {
            this.data = await this.common.postUrl("commonTF", "getFeeChangeSwitch", {});
            if (this.data) {
                this.btnTitle = '关闭异动(当前开)';
            }else{
                this.btnTitle = '打开异动(当前关)';
            }
            this.$forceUpdate();
        },
        initQuery()
        {
            this.query = {
                codeName: '',
                codeDesc: '',
                codeType: '',
                codeId: '',
                codeTypeAlias: '',
            };
            return this.query;
        },
        initDictionary()
        {
            return this.dictionary = {
                codeType: null,
                codeName: null,
                codeDesc: null,
                sortId: null,
                codeId: null,
                codeValue: null,
                codeTypeAlias: null,
            };
        },
        async openDialog(flag)
        {
            this.showDialog = flag;
            this.$forceUpdate();
        },
        async dblclickItem(data)
        {
            this.title = '字典明细';
            this.isLock = true;
            this.dictionary = this.common.copyObj(data);
            this.showCityTip = this.dictionary.codeType == 'BASE_CITY';
            await this.openDialog(true);
        },
        async addDictionary()
        {
            this.title = '新增字典';
            this.isLock = false;
            this.initDictionary();
            this.showCityTip = this.dictionary.codeType == 'BASE_CITY';
            await this.openDialog(true);
        },
        async updateDictionary()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的字典数据！");
                return false;
            }
            this.dictionary = this.common.copyObj(selectData[0]);
            this.title = '修改字典';
            this.isLock = false;
            this.showCityTip = this.dictionary.codeType == 'BASE_CITY';
            await this.openDialog(true);
        },
        async saveOrUpdateDictionary()
        {
            if (this.common.isBlank(this.dictionary.codeName))
            {
                this.$message.error("请填写名称！");
                return false;
            }
            if (this.common.isBlank(this.dictionary.codeType))
            {
                this.$message.error("请选择类型！");
                return false;
            }
            if (this.showCityTip)
            {
                if (this.common.isBlank(this.dictionary.codeId))
                {
                    this.$message.error("请选择城市编码辅助识别编码！");
                    return;
                }
            }
            await this.common.postUrl("commonTF", "saveOrUpdateDictionary", this.dictionary);
            await this.doQuery();
            await this.openDialog(false);
            await this.initData();//重新加载新的下拉数据
            this.$message.success(this.dictionary.id> 0 ? "修改成功!" : "保存成功!");
        },
        async deleteDictionary()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的字典数据！");
                return false;
            }
            const h = this.$createElement;
            this.$msgbox({
                title: "删除字典",
                message: h('p', null, [
                    h('span', null, "此操作将名称为："),
                    h('i', { style: 'color: red' }, selectData[0].codeName),
                    h('span', null, " 的删除，是否继续？"),
                ]),
                showCancelButton: true,
                confirmButtonText: '确认删除',
                center:true,
                type: "warning",
            }).then(() => {
                let that = this;
                this.common.postUrl("commonTF", "deleteDictionaryDataById", selectData[0], function (data) {
                    that.doQuery(that.query);
                    that.$message.success("删除成功!");
                },null,'',true);
            }).catch(() => {
                this.$message.info("已取消删除");
            });
        },
        switchFeeChange(){
            let that = this;
            this.common.postUrl("commonTF", "switchFeeChange", {}, function ()
            {
                if(that.btnTitle=='打开异动(当前关)'){
                    that.btnTitle='关闭异动(当前开)'
                }else{
                    that.btnTitle='打开异动(当前关)'
                }
                that.$forceUpdate();
                that.$message.success("操作成功!");
            });
        },
        /**
         * 选择类型自动选择类型别名
         */
        changeCodeType()
        {
            this.dictionary.codeTypeAlias = null;
            this.codeTypeSelectData.forEach(item => {
                if (item.codeType == this.dictionary.codeType)
                    this.dictionary.codeTypeAlias = item.codeTypeAlias;
            });
            this.showCityTip = this.dictionary.codeType == 'BASE_CITY';
            if (this.showCityTip)
                this.$message.success("基地类型的数据请从【城市编码辅助】选择基地所在城市即可！");
            this.$forceUpdate();
        },
    },
}
