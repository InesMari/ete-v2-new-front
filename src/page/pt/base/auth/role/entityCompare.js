import treeCompare from "./treeCompare.vue";

export default {
    name: 'entityCompare',
    data() {
        return {
            info: {},
            treeData: [],
            treeDataArray: [],
            treeDataCompare: [],
            treeDataCompareArray: [],

            defaultProps: {
                children: 'children',
                label: 'entityName'
            },
            onlyread:false,
            isExpandAll:true,
            searchQuery: '',
            searchTimer: null,
        }
    },
    mounted() {
        this.loadEntityTree();
    },
    /**
     * 组件
     */
    components: {
        treeCompare,
    },
    methods:
    {
        /**
         * 加载权限实体树
         * @param role 角色
         * @returns {Promise<void>}
         */
        async loadEntityTree() {

            this.info = this.$route.query;
            this.info.entityDomain = 1;
            this.treeData = await this.common.postUrl("entityTF", "loadEntityTree", this.info);
            this.echoArray(this.treeData);
            this.infoCompare = this.common.copyObj(this.info);
            this.infoCompare.roleId = this.infoCompare.compareRoleId;
            this.infoCompare.roleName = this.infoCompare.compareRoleName;
            this.treeDataCompare = await this.common.postUrl("entityTF", "loadEntityTree", this.infoCompare);
            this.echoArray(this.treeDataCompare);
            this.handleChangeCheck(null,1);
            this.handleChangeCheck(null,2);
            console.log(this.info);
        },
        /**
         * 递归数组
         * @param data
         */
        echoArray(data) {
            data.forEach(item => {
                this.$set(item, 'isExpand', true);
                this.$set(item, 'defaultHasAuth', item.hasAuth);
                if (item.children && item.children.length > 0) {
                    this.echoArray(item.children);
                }
            });
        },
        /**
         * 递归填充数组
         * @param data
         */
        recursionFillArray(data) {
            let array = [];
            data.forEach(item => {
                array.push(item);
                array = array.concat(this.recursionFillArray(item.children));
            });
            return array;
        },

        /**
         * 递归获取所有勾选的节点ID
         * @param data 树数据
         * @returns {Array} 勾选的节点ID数组
         */
        getCheckedKeys(data) {
            let checkedKeys = [];
            if (!data || data.length === 0) return checkedKeys;

            data.forEach(item => {
                if (item.hasAuth) {
                    checkedKeys.push(item.id);
                }
                if (item.children && item.children.length > 0) {
                    checkedKeys = checkedKeys.concat(this.getCheckedKeys(item.children));
                }
            });
            return checkedKeys;
        },
        // 优化后的递归统计方法，返回统计结果而不是直接修改data
        totalCheckState(data, type) {
            let stats = {
                checkNums: 0,
                addNums: 0,
                delNums: 0
            };

            data.forEach(item => {
                // 选择统计
                if (item.hasAuth) {
                    stats.checkNums++;
                }
                // 删除统计
                if (item.hasAuth && item.defaultHasAuth !== item.hasAuth) {
                    stats.delNums++;
                }
                // 新增统计
                if (!item.hasAuth && item.defaultHasAuth !== item.hasAuth) {
                    stats.addNums++;
                }
                if (item.children && item.children.length > 0) {
                    const childStats = this.totalCheckState(item.children, type);
                    stats.checkNums += childStats.checkNums;
                    stats.addNums += childStats.addNums;
                    stats.delNums += childStats.delNums;
                }
            });

            return stats;
        },
        // 刷新统计数据
        handleChangeCheck(e, type) {
            this.$nextTick(() => {
                if (type == 1) {
                    const stats = this.totalCheckState(this.treeData, type);
                    this.$set(this.info, 'checkNums', stats.checkNums);
                    this.$set(this.info, 'addNums', stats.addNums);
                    this.$set(this.info, 'delNums', stats.delNums);
                }
                if(type == 2){
                    const stats = this.totalCheckState(this.treeDataCompare, type);
                    this.$set(this.info, 'checkCompareNums', stats.checkNums);
                    this.$set(this.info, 'addCompareNums', stats.addNums);
                    this.$set(this.info, 'delCompareNums', stats.delNums);
                }
            });
        },
        /**
         * 处理树节点展开/收缩同步
         * @param event 展开事件对象
         */
        handleExpandChange(event) {
            const { item, treeRef } = event;
            // 确定同步目标树
            const targetTreeRef = treeRef === 'tree1' ? 'tree2' : 'tree1';
            const targetTree = this.$refs[targetTreeRef];

            if (targetTree) {
                // 同步目标树的对应节点展开/收缩状态
                targetTree.syncExpandState(item.id, item.isExpand);
            }
        },
        showChanges(){
            this.onlyread = true;
            // 使用优化的重置方法避免深拷贝
            this.resetTreeData(this.treeData);
            this.resetTreeData(this.treeDataCompare);

            this.checkHasChanges(this.treeData);
            this.checkHasChanges(this.treeDataCompare);
        },
        /**
         * 显示有变化的节点，隐藏无变化节点
         * @param data 树数据
         * @returns {Boolean} 是否有子节点有变化
         */
        checkHasChanges(data) {
            let hasVisibleChanges = false;

            data.forEach(item => {
                // 首先检查是否有权限变化
                const hasAuthChanged = item.defaultHasAuth !== item.hasAuth;
                this.$set(item, 'isHide', !hasAuthChanged);

                // 如果有子节点，递归处理子节点
                if (item.children && item.children.length > 0) {
                    const childHasChanges = this.checkHasChanges(item.children);
                    // 如果子节点有变化的节点，当前节点也不隐藏
                    if (childHasChanges) {
                        this.$set(item, 'isHide', false);
                        hasVisibleChanges = true;
                    }
                } else {
                    // 叶子节点，如果有变化则标记
                    if (!item.isHide) {
                        hasVisibleChanges = true;
                    }
                }
            });

            return hasVisibleChanges;
        },
        reBack(){
            this.onlyread = false;
            this.reHide(this.treeData);
            this.reHide(this.treeDataCompare);
        },
        // 优化后的重置方法
        resetTreeData(data) {
            data.forEach(item => {
                this.$delete(item, 'isHide');
                if (item.children && item.children.length > 0) {
                    this.resetTreeData(item.children);
                }
            });
        },
        reHide(data){
            data.forEach(item => {
                item.isHide = false;
                if (item.children && item.children.length > 0) {
                    this.reHide(item.children);
                }
            });
        },
        showDifference(){
            this.onlyread = true;
            // 使用优化的重置方法避免深拷贝
            this.resetTreeData(this.treeData);
            this.resetTreeData(this.treeDataCompare);

            this.checkTreeDifferences(this.treeData, this.treeDataCompare);
        },
        /**
         * 递归对比两个树的权限差异
         * @param tree1 第一个树数据
         * @param tree2 第二个树数据
         * @returns {Boolean} 是否有差异
         */
        checkTreeDifferences(tree1, tree2) {
            let hasDifferences = false;

            tree1.forEach(item1 => {
                // 在第二个树中查找对应的节点
                const item2 = tree2.find(item => item.id === item1.id);

                if (item2) {
                    // 对比权限是否有差异
                    const hasAuthDiff = item1.hasAuth !== item2.hasAuth;
                    this.$set(item1, 'isHide', !hasAuthDiff);
                    this.$set(item2, 'isHide', !hasAuthDiff);

                    if (hasAuthDiff) {
                        hasDifferences = true;
                    }

                    // 递归处理子节点
                    if (item1.children && item1.children.length > 0 &&
                        item2.children && item2.children.length > 0) {
                        const childHasDiff = this.checkTreeDifferences(item1.children, item2.children);
                        if (childHasDiff) {
                            this.$set(item1, 'isHide', false);
                            this.$set(item2, 'isHide', false);
                            hasDifferences = true;
                        }
                    }
                } else {
                    // 如果在第二个树中找不到对应节点，显示该节点
                    this.$set(item1, 'isHide', false);
                    hasDifferences = true;
                }
            });

            return hasDifferences;
        },
        save(type){
            switch(type){
                case 1:
                    this.submitLeft();
                    break;
                case 2:
                    this.submitRight();
                    break;
                case 0:
                    this.submitLeft();
                    this.submitRight();
                    break;
            }
            this.$message.success("保存成功");
            this.closePage();
        },
        /**
         * 保存左侧数据
         */
        async submitLeft () {
            const checkedKeys = this.getCheckedKeys(this.treeData);
            this.info.entitys = checkedKeys;
            await this.common.postUrl("roleTF", "commonSaveRoleOrEntity", this.info);
        },
        /**
         * 保存右侧数据
         */
        async submitRight () {
            const checkedKeys = this.getCheckedKeys(this.treeDataCompare);
            this.infoCompare.entitys = checkedKeys;
            await this.common.postUrl("roleTF", "commonSaveRoleOrEntity", this.infoCompare);
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
        /**
         * 切换全部展开/收起
         */
        changeExpand() {
            this.updateExpandState(this.treeData, this.isExpandAll);
            this.updateExpandState(this.treeDataCompare, this.isExpandAll);
        },
        /**
         * 递归更新节点的展开状态
         * @param data 树数据
         * @param isExpand 是否展开
         */
        updateExpandState(data, isExpand) {
            data.forEach(item => {
                this.$set(item, 'isExpand', isExpand);
                if (item.children && item.children.length > 0) {
                    this.updateExpandState(item.children, isExpand);
                }
            });
        },
        /**
         * 处理搜索输入（带防抖）
         * @param query 搜索查询
         */
        handleSearch(query) {
            this.searchQuery = query;
            // 清除之前的定时器
            if (this.searchTimer) {
                clearTimeout(this.searchTimer);
            }
            // 设置1000ms防抖
            this.searchTimer = setTimeout(() => {
                this.searchTree();
            }, 1000);
        },
        /**
         * 搜索树节点
         */
        searchTree() {
            if (!this.searchQuery.trim()) {
                this.reHide(this.treeData);
                this.reHide(this.treeDataCompare);
                return;
            }
            this.filterTree(this.treeData, this.searchQuery.trim());
            this.filterTree(this.treeDataCompare, this.searchQuery.trim());
        },
        /**
         * 递归过滤树节点
         * @param data 树数据
         * @param query 搜索查询
         * @returns {Boolean} 是否有匹配的节点
         */
        filterTree(data, query) {
            let hasMatch = false;

            data.forEach(item => {
                // 检查当前节点名称是否匹配
                const nameMatches = item.entityName && item.entityName.toLowerCase().includes(query.toLowerCase());
                this.$set(item, 'isHide', !nameMatches);

                // 处理子节点
                if (item.children && item.children.length > 0) {
                    const childHasMatch = this.filterTree(item.children, query);
                    // 如果子节点有匹配，显示父节点并展开
                    if (childHasMatch) {
                        this.$set(item, 'isHide', false);
                        this.$set(item, 'isExpand', true);
                        hasMatch = true;
                    }
                } else {
                    // 叶子节点
                    if (nameMatches) {
                        hasMatch = true;
                    }
                }
            });

            return hasMatch;
        },
    },
}
