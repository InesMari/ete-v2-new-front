export default {
    name: 'treeCompare',
    props: {
        treedata: {
            type: Array,
            default: () => []
        },
        treeRef: {
            type: String,
            default: ''
        },
        searchQuery: {
            type: String,
            default: ''
        }
    },
    methods: {
        toggleExpand(item) {
            this.$set(item, 'isExpand', !item.isExpand);
            // 触发展开事件，通知父组件
            this.$emit('expand-change', {
                item: item,
                treeRef: this.treeRef
            });
        },
        handleCheckChange(item) {
            // 更新子级勾选状态（向下递归）\
            this.updateChildrenCheckState(item)
            // 触发父组件的check事件
            this.$emit('change-check', item);
        },
        changeChecked(children){
            let obj = null;
            if(children){
                for(let el of this.treedata){
                    if(el.id == children.parentId && !el.hasAuth){
                        this.$set(el, 'hasAuth', true);
                        obj = el;
                        break;
                    }
                }
            }
            this.$emit('change-check', obj)
        },
        getAuthStatus(item) {
            if (item.defaultHasAuth != item.hasAuth) {
                return item.hasAuth ? 'added' : 'removed'
            }
            return ''
        },
        // 获取高亮的文本HTML
        getHighlightedText(text, query) {
            if (!text || !query || !query.trim()) {
                return text;
            }
            const regex = new RegExp(`(${this.escapeRegExp(query)})`, 'gi');
            return text.replace(regex, '<span class="highlight">$1</span>');
        },
        // 转义正则表达式特殊字符
        escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        },
        // 更新子级勾选状态（向下递归）
        updateChildrenCheckState(parent) {
            if (!parent.children || parent.children.length === 0) return;

            this.updateAllChildren(parent.children, parent.hasAuth);
        },
        // 更新所有子节点的勾选状态
        updateAllChildren(children, hasAuth) {
            children.forEach(child => {
                this.$set(child, 'hasAuth', hasAuth);
                // 递归更新子节点的子节点
                if (child.children && child.children.length > 0) {
                    this.updateAllChildren(child.children, hasAuth);
                }
            });
        },
        // 外部调用的同步展开/收缩方法
        syncExpandState(nodeId, isExpanded) {
            this.findAndToggleNode(this.treedata, nodeId, isExpanded);
        },
        // 递归查找并设置节点展开状态
        findAndToggleNode(nodes, nodeId, isExpanded) {
            if (!nodes || nodes.length === 0) return;

            for (let node of nodes) {
                if (node.id === nodeId) {
                    this.$set(node, 'isExpand', isExpanded);
                    return true;
                }
                if (node.children && node.children.length > 0) {
                    if (this.findAndToggleNode(node.children, nodeId, isExpanded)) {
                        return true;
                    }
                }
            }
            return false;
        }
    }
}