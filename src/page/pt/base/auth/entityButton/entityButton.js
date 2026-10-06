import dbTable from "@/components/dbTable/dbTable.vue"
export default {
    name: 'entityButton',
    data()
    {
        return {
            filterText:"",
            isSelMenu:false,    //是否选择了菜单
            treeData:[],        //左侧树结构
            levelStr:"",        //层级
            entityArray:[],     //右侧权限按钮数据
            menuSel:'',         
            copyEntityList:'',  //复制角色列表
            defaultProps: {
                children: 'children',
                label: 'entityName'
            },
            head:[
                {"name":"角色名称","code":"roleName"}
            ]
        }
        /**
         * 变量使用说明
         * treeData，左侧树结构，没操作变动
         * leftData，表格左侧原始数据，赋值到表格时候复制了新对象，原始数据不被指向和操作
         * rightData，表格右侧原始数据，原始数据不被指向和操作
         * 
         */
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.loadEntityTree();
        this.queryRole();
    },
    /**
     * 组件
     */
    components: {
        dbTable,
    },
    /**
     * 绑定函数
     */
    methods: {
        // 权限数据
        async loadEntityTree()
        {
            this.treeData = await this.common.postUrl("entityTF", "loadEntityTreeNew");
            this.reSetTreeData(this.treeData);
        },
        // 遍历增加层级，是否最后一级
        reSetTreeData(data,levelName=""){
            data.forEach(item => {
                item.levelName = levelName + item.entityName;
                if(item.hasChildren){
                    this.reSetTreeData(item.children,item.levelName + ' -> ');
                }else{
                    item.disabled = true;
                }
            })
        },
        // 角色表格
        async queryRole(){
            this.leftData = await this.common.postUrl("roleTF", "loadRoleInfoListNoAdmin",{roleName: ""});
            console.log(this.leftData)
            this.$refs.dbTable.setLeftData(this.common.copyObj(this.leftData));
        },
        // 权限搜索过滤
        filterNode(value, data) {
            if (!value) return true;
            return data.entityName.indexOf(value) !== -1;
        },
        // 选择菜单
        selMenu(data,node,that){
            console.log(data,node);
            if(this.areArraysEqualById(this.rightData,this.$refs.dbTable.getRightData())){
                this.changeMenu(data,node,that);
            }else{
                this.$confirm("数据更改未保存，是否切换菜单", "提示").then(async () =>{
                    this.changeMenu(data,node,that);
                }).catch(() =>{
                    this.$refs.tree.setCurrentKey(node.id)
                    this.$forceUpdate();
                });
            }
        },
        // 切换菜单
        async changeMenu(data,node,that){ 
            // if(data.disabled) return;   //最后一级不做处理
            this.recurse(this.treeData,data.id);    //遍历获取子集
            this.isSelMenu = true;  //显示右侧
            this.levelStr = data.levelName;     //层级显示
            this.currentId = data.id;
            // this.menuSel = data.children[0].id; //默认选中第一个子集
            await this.getRoleEntity(data.id);
            if(this.common.isNotBlank(this.copyEntityList)){    //复制权限
                this.$confirm("是否粘贴角色权限？", "提示").then(async () =>{
                    let rightData = this.common.copyObj(this.rightData);
                    this.copyEntityList.forEach(el => {
                        let isHave = false;
                        rightData.forEach(item => {
                            if(el.id == item.id) isHave = true;
                        })
                        if(!isHave){
                            el.class = 'copy';
                            rightData.push(el);
                        }
                    })
                    this.$refs.dbTable.setRightData(rightData);
                    this.$refs.dbTable.filterLeftData();
                    this.$message.success("粘贴角色权限成功！");
                    // 一次性复制，切换后清空
                    this.copyEntityList = '';
                }).catch(() =>{                    
                    // 一次性复制，切换后清空
                    this.copyEntityList = '';
                });
            }

        },
        // 判断两个数组是否完全相同（长度和元素都一样）
        areArraysEqualById(arr1, arr2, idField = 'id') {
            if(!arr1 || !arr2 || arr2.length<1) return true;
            if (arr1.length !== arr2.length) return false;
            
            // 创建一个基于 ID 的映射
            const map1 = new Map(arr1.map(item => [item[idField], item]));
            const map2 = new Map(arr2.map(item => [item[idField], item]));
            
            // 检查所有 ID 是否都存在且唯一
            if (map1.size !== arr1.length || map2.size !== arr2.length) return false;
            
            // 检查每个 ID 是否都能在另一个数组中找到
            for (const [id] of map1) {
              if (!map2.has(id)) return false;
            }
            
            return true;
          },
        // 获取有对应权限的角色
        async getRoleEntity(id){
            let rightData = await this.common.postUrl("roleTF", "loadCurrentEntityIdAllRoleList",{entityId:id});
            rightData.forEach(el => {
                el.roleId = el.id;
            })
            this.rightData = this.common.copyObj(rightData);
            this.rightDataCache = this.common.copyObj(rightData);
            let leftData = this.common.copyObj(this.leftData);
            this.$refs.dbTable.setRightData(rightData);
            this.$refs.dbTable.setLeftData(leftData);
        },
        // 遍历获取子菜单/按钮
        recurse(data,id){
            for(let i=0;i<data.length;i++){
                let item = data[i];
                if(item.id == id){
                    if(item.hasChildren){
                        this.entityArray = item.children;
                    }else{
                        this.entityArray = [];
                    }
                    return
                }else if(item.hasChildren){
                    this.recurse(item.children,id);
                }
            }
        },
        dbTableChange(tableData,tableDataRight,isAll,type){
            if(type == 1){
                tableData.forEach(item => {
                    item.class = '';
                })
            }
            if(type == 2){
                tableDataRight.forEach(item => {
                    let hasItem = false;
                    this.rightData.forEach(el => {
                        if(item.roleId == el.roleId) hasItem = true;
                    })
                    if(!hasItem && this.common.isBlank(item.class)) item.class = "newAdd";
                })
            }
        },
        // 复制权限
        copyEntity(){
            let roleList = this.$refs.dbTable.getRightData();
            let isChange = false;   //是否有改动
            roleList.forEach(el => {
                if(this.common.isNotBlank(el.class)){
                    isChange = true;
                }
            })
            if(roleList.length != this.rightData.length){
                isChange = true;
            }
            if(isChange){
                this.$message.error("请先保存修改！");
            }else{
                this.copyEntityList = this.common.copyObj(this.rightData);
                this.$message.success("复制成功！");
            }
        },
        // 清空复制
        clearCopy(){
            this.copyEntityList = '';
            this.$message.success("取消成功！");
        },
        // 保存更改
        async save(){
            let roleList = this.$refs.dbTable.getRightData();
            roleList.forEach(item => {
                item.id = item.roleId;
            })
            await this.common.postUrl("roleTF", "saveRoleEntityRel",{entityId:this.currentId,roleList},null,null,null,true);
            await this.getRoleEntity(this.currentId);
            this.$message.success("修改成功！");
        },
        close()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
        },
    },
    watch: {
        filterText(val) {
          this.$refs.tree.filter(val);
        }
    },
}
