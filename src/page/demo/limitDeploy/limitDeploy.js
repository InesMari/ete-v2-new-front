import {treeData,tree} from '@/static/json.js'
  
export default {
    name: 'list',
    data() {
        return {
            treeData:treeData.items,
            defaultProps:{
                children: 'children',
                label: 'regionName'
            }
        }
    },
    mounted() {
        console.log(this.treeData);
    },
    methods: {
        
    },
}