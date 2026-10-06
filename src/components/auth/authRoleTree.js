import myElTree from "@/components/myElTree/tree.vue";

export default {
    name: 'authRoleTree',
    props: [
        "showRole",//是否展示角色输入框
        "title",    //头部提示
    ],
    data()
    {
        return {
            treeData: [],
            //权限树的节点数组扁平化用来遍历
            treeDataArray: [],
            role: {},
            defaultProps: {
                children: 'children',
                label: 'entityName'
            },
            //默认可以编辑
            isOnlySee : false,
            //是否展示角色输入框
            isShowRole : true,
            search:'',
            openPanel:true,
        }
    },
    mounted()
    {
        this.initShow();
    },
    /**
     * 组件
     */
    components: {
        myElTree,
    },
    methods:
    {
        /**
         * 加载权限实体树
         * @param role 角色
         * @param isOnlySee 是否看
         * @param entityDomain 权限实体使用域1平台端2货主端3供应商
         * @returns {Promise<void>}
         */
        async loadEntityTree(role, isOnlySee, entityDomain)
        {
            let that = this;
            this.role = role;
            this.isOnlySee = isOnlySee;
            //不传权限作用域不调后台
            if (entityDomain < 0){ return ;}
            this.role.entityDomain = entityDomain;
            await this.common.postUrl("entityTF", "loadEntityTree", role, function (data)
            {
                that.treeData = data;
                that.doSearch();
                that.treeDataArray = that.recursionFillArray(data);
            });
        },
        /**
         * 递归填充数组
         * @param data
         */
        recursionFillArray(data)
        {
            let array = [];
            data.forEach(item => {
                array.push(item);
                array = array.concat(this.recursionFillArray(item.children));
            });
            return array;
        },
        /**
         * 是否展示角色输入框
         */
        initShow() {if (this.common.isNotBlank(this.showRole)) { this.isShowRole = this.showRole; } },
        /**
         * 提交
         */
        submit: function ()
        {
            if (this.isShowRole && this.common.isBlank(this.role.roleName))
            {
                this.$message.error("角色名称不能为空!");
                return false;
            }
            //大客户管理列表打开，后台区分调用方法参数
            let that = this;
            if (!this.isShowRole){ this.role.isUpdateAdminEntity = 1; }
            this.role.entitys = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys());
            if(this.role.copy==1){
                this.role.roleId = '';
            }
            this.common.postUrl("roleTF", "commonSaveRoleOrEntity", this.role, function (data)
            {
                that.$parent.doQuery();
                that.$msgbox("操作成功!", function (data)
                {
                    that.$parent.isShowEntityPage(false);
                });
            });
        },
        /**
         * 取消
         */
        cancel()
        {
            this.$parent.isShowEntityPage(false);
        },
        /**
         * 遍历回显已经授权的权限
         * @param data 权限树的节点数组
         * @returns {[]}
         */
        setCheckedKeys(data)
        {
            let array = [];
            if (this.common.isNotBlank(data))
            {
                data.forEach(item => {
                    if (item.hasAuth){ array.push(item.id); }
                })
            }
            return array;
        },
        /**
         * 当复选框被点击的时候触发
         * @param data 当前节点对象
         * @param array 树目前的选中状态对象
         */
        dealNode(data, array)
        {
            //父层级
            let parent = this.recursion(data.parentId, this.treeDataArray, true);
            //子层级
            let children = this.recursion(data.children, this.treeDataArray, false);
            let isAdd = array.checkedKeys.indexOf(data.id) >= 0;
            array.checkedKeys = array.checkedKeys.concat(parent);
            if (isAdd){ array.checkedKeys = array.checkedKeys.concat(children); }
            else
            {
                for (let i = 0; i < children.length; i++)
                {
                    for (let j = 0; j < array.checkedKeys.length; j++)
                    {
                        if (array.checkedKeys[j] === children[i])
                        {
                            array.checkedKeys.splice(j, 1);
                            break;
                        }
                    }
                }
            }
            this.$refs.tree.setCheckedKeys(array.checkedKeys);
        },
        /**
         * 递归
         * @param data 向上是父id,向下是当前节点的子节点对象数组
         * @param arr 权限数组
         * @param isUp 是否向（父）上遍历
         * @returns {[]}
         */
        recursion(data, arr, isUp)
        {
            let array = [];
            if (isUp)
            {
                arr.forEach(item => {
                    if (this.common.isNotBlank(data) && item.id === data)
                    {
                        array.push(data);
                        array = array.concat(this.recursion(item.parentId, arr, isUp));
                    }
                });
            }
            else
            {
                data.forEach(item =>{
                    array.push(item.id);
                    array = array.concat(this.recursion(item.children, arr, isUp));
                })
            }
            return array;
        },
        /**
         * 查询高亮
         */
        doSearch(e){
            let _this = this;
            if(this.timer) clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                _this.reSearch();
                _this.openPanel = false;
                _this.$nextTick(() => {
                    _this.openPanel = true;  
                    _this.$forceUpdate();
                    clearTimeout(this.timer);
                    // 定位搜索栏目
                    _this.$nextTick(() => {
                        let firstMate = document.querySelector(".highlight");
                        if(_this.common.isNotBlank(firstMate)){
                            _this.$refs.authRoleTree.scrollTop = firstMate.offsetTop;                        
                        }
                    })
                })
            },300)
        },
        /**
         * 递归查询高亮
         */
        reSearch(data = this.treeData){
            data.forEach(el => {
                if(el.entityName.indexOf(this.search)>-1 && this.common.isNotBlank(this.search)){
                    el.highlight = true;
                }else{
                    el.highlight = false;
                }
                if(el.children.length>0) this.reSearch(el.children);
            })
        },
        /**
         * 选择
         */
        doSelectSet(event,type){
            if(!event) return;
            this.selectSet(type);
            this.openPanel = false;
            this.$nextTick(() => {
                this.openPanel = true;     
                this.$forceUpdate();             
            })
        },
        /**
         * 选择
         * type  1全选  0不选
         */
         selectSet(type,data = this.treeData){
            data.forEach(el => {
                if(type==1){
                    el.hasAuth = true;
                }else{
                    el.hasAuth = false;
                }
                if(el.children.length>0) this.selectSet(type,el.children);
            })
         },
        toggleExpand(){
            let nodes = this.$refs.tree.store._getAllNodes();
            let expandFlg = false;
            for (let i = 0; i < nodes.length; i++) {
                if(nodes[i].expanded){
                    expandFlg = true;
                    break;
                }
            }
            nodes.forEach(el => {
                el.expanded = !expandFlg;
            });
        }
    },
}
