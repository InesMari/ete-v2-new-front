<template>
    <div class="videoDemo" id="videoDemo">
        <myFileModel ref="businessLicense" @successCallback="successCallback"></myFileModel>
        <video id="myVideo" :src="src" controls ></video>
    </div>
  </template>
    
<script>  
import myFileModel from '@/components/myFileModel/myFileModel.vue';
export default{
    name: "videoDemo",
    components: {
        myFileModel
    },
    data() {
        return {
            src:'',
        };
    },
    mounted() {
        var video = document.getElementById("myVideo");
        video.addEventListener('canplaythrough', function() {
            console.log(this.duration )
        });
    },
    methods: {
        successCallback(imgData){
            this.src = imgData.fileUrl;
        },
    }
    
}
</script>
<style lang="scss" scoped>
    
  </style>