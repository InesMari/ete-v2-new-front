
export default {
  name: 'workInfo',
  props:{workInfo:{type: Array}},
  data() {
    return {
      mergeWorkDialogShow: false,
      mergeWorkList: [],
    }
  },
  mounted(){
  },
  components: {
  },
  methods: {
    showMergeWorkDialog(mergeWorkList){
      if(mergeWorkList.length>0){
        this.mergeWorkDialogShow = true;
        this.mergeWorkList = mergeWorkList;
      }
    },
  },
}
