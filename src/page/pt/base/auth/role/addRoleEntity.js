import treeCompare from "./treeCompare.vue";

export default {
    name: 'addRoleEntity',
    data() {
        return {
            info: {},
            treeData: [],
            onlyread: false,
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
         * @returns {Promise<void>}
         */
        async loadEntityTree() {
            this.info = this.$route.query;
            this.info.entityDomain = 1;
            this.treeData = await this.common.postUrl("entityTF", "loadEntityTree", this.info);
            this.echoArray(this.treeData);
            this.handleChangeCheck();
        },
        /**
         * 递归初始化数组，设置默认权限状态
         * @param data 树数据
         */
        echoArray(data) {
            data.forEach(item => {
                this.$set(item, 'isExpand', true);
                this.$set(item, 'defaultHasAuth', item.hasAuth);
                // 判断是否为叶子节点，并且所有兄弟节点也是叶子节点
                if (!item.children || item.children.length === 0) {
                    // 检查所有兄弟节点的children是否都为空
                    const allSiblingsAreLeaf = data.every(sibling => !sibling.children || sibling.children.length === 0);
                    if (allSiblingsAreLeaf) {
                        this.$set(item, 'lastDeep', true);
                    }
                } else {
                    this.echoArray(item.children);
                }
            });
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
        /**
         * 递归统计权限变化情况
         * @param data 树数据
         * @returns {Object} 统计结果 {checkNums, addNums, delNums}
         */
        totalCheckState(data) {
            let stats = {
                checkNums: 0,
                addNums: 0,
                delNums: 0
            };

            data.forEach(item => {
                // 统计已授权数量
                if (item.hasAuth) {
                    stats.checkNums++;
                }
                // 统计删除数量（从true变false）
                if (item.defaultHasAuth && !item.hasAuth) {
                    stats.delNums++;
                }
                // 统计新增数量（从false变true）
                if (!item.defaultHasAuth && item.hasAuth) {
                    stats.addNums++;
                }
                if (item.children && item.children.length > 0) {
                    const childStats = this.totalCheckState(item.children);
                    stats.checkNums += childStats.checkNums;
                    stats.addNums += childStats.addNums;
                    stats.delNums += childStats.delNums;
                }
            });

            return stats;
        },
        /**
         * 刷新统计数据
         */
        handleChangeCheck() {
            this.$nextTick(() => {
                const stats = this.totalCheckState(this.treeData);
                this.$set(this.info, 'checkNums', stats.checkNums);
                this.$set(this.info, 'addNums', stats.addNums);
                this.$set(this.info, 'delNums', stats.delNums);
            });
        },
        /**
         * 仅显示有变化的节点
         */
        showChanges() {
            this.onlyread = true;
            this.checkHasChanges(this.treeData);
        },
        /**
         * 递归标记有变化的节点，隐藏无变化节点
         * @param data 树数据
         * @returns {Boolean} 是否有子节点有变化
         */
        checkHasChanges(data) {
            let hasVisibleChanges = false;

            data.forEach(item => {
                // 检查是否有权限变化
                const hasAuthChanged = item.defaultHasAuth !== item.hasAuth;
                this.$set(item, 'isHide', !hasAuthChanged);

                // 如果有子节点，递归处理
                if (item.children && item.children.length > 0) {
                    const childHasChanges = this.checkHasChanges(item.children);
                    // 如果子节点有变化，当前节点也不隐藏
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
        /**
         * 返回显示所有节点
         */
        reBack() {
            this.onlyread = false;
            this.resetTreeData(this.treeData);
        },
        /**
         * 重置节点显示状态
         * @param data 树数据
         */
        resetTreeData(data) {
            data.forEach(item => {
                this.$set(item, 'isHide', false);
                if (item.children && item.children.length > 0) {
                    this.resetTreeData(item.children);
                }
            });
        },
        /**
         * 保存数据
         */
        async save() {
            const checkedKeys = this.getCheckedKeys(this.treeData);
            this.info.entitys = checkedKeys;
            if(this.info.copy == 1) this.info.roleId = "";
            await this.common.postUrl("roleTF", "commonSaveRoleOrEntity", this.info);
            this.$message.success("保存成功");
            this.closePage();
        },
        /**
         * 关闭当前页面
         */
        closePage() {
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true);
        },
        /**
         * 切换全部展开/收起
         */
        changeExpand() {
            this.updateExpandState(this.treeData, this.isExpandAll);
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
                this.resetTreeData(this.treeData);
                return;
            }
            this.filterTree(this.treeData, this.searchQuery.trim());
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
        /**
         * 获取高亮的文本HTML
         * @param text 原始文本
         * @param query 搜索关键词
         * @returns {String} 高亮后的HTML
         */
        getHighlightedText(text, query) {
            if (!text || !query || !query.trim()) {
                return text;
            }
            const regex = new RegExp(`(${this.escapeRegExp(query)})`, 'gi');
            return text.replace(regex, '<span class="highlight">$1</span>');
        },
        /**
         * 转义正则表达式特殊字符
         * @param string 字符串
         * @returns {String} 转义后的字符串
         */
        escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        },
    },
}
