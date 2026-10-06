export default {
  name: 'addPlan',
  data() {
    return {
      inputvalue:"",
      options:[
        
      ],
      showDialog:false,
    }
  },
  mounted() {
    
  },
  methods: {
    showEditDialog(){
      this.showDialog = true;
    }
  },
}