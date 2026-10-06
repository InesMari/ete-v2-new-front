import Player from '@/components/videoPlayer/videoPlay-js.js'

export default {
    name: 'videoPlayer',
    data() {
        return {
            info: {
                videoType: '1',
            },
            streamURL: "rtsp://rtspproxy505-hzpaas-hzaliedge.lechange.com:8556/4e12fbd34fd7247fa0817bd56db62fff?expire=1744792422&digest=e87ce4c0c4816a7523e740528e8a3a0a&proto=Private3&eventLiveID=BB0991EPAJC95E510079fbac5e849e4f21",
            isFullScreen:false,
        }
    },
    async mounted() {
        let _this = this;
        this.player = new Player(['player'], {
            playError: _this.playError,
            playFileOver: _this.playFileOver,
            talkStart: _this.talkStart,
        })
        this.player.init()
        this.streamURL = await this.common.postUrl("resMonitorDeviceTF", "getDeviceStreamUrl", {deviceSerial:"BB0991EPAJC95E5",verifyCode:"Ete1888*",channelNo:"0",businessType:"real"});
        // this.play();
        console.log(this.player)
    },
    methods: {
        async play() {
            let _this = this;
            // debugger
            this.player && this.player.play('player', {
                streamURL: _this.streamURL,
                deviceId: 'BB0991EPAJC95E5',
                channelId: '1',
                bitStream: 0,
                isLive: _this.info.videoType == 1 ? true : false,
            })
        },
        playError(id, msg) {
            console.log(`-----------${id}Window playback failed-------:`, msg)
        },
        playFileOver(id) {
            console.log(`-----------${id}End of window playback-------`)
        },
        talkStart(id) {
            console.log(`----------${id}Window open intercom-----------`)
        },
        download() {

        },
        fullScreen() {
            this.isFullScreen = !this.isFullScreen;
        },
        downloadInit() {
            let _this = this;
            if (!_this.isDownloading) {
                const params = {
                    deviceId: playConfigs.value.deviceId,
                    channelId: playConfigs.value.channelId,
                    businessType: playConfigs.value.businessType,
                    beginTime: playConfigs.value.beginTime,
                    endTime: playConfigs.value.endTime,
                    streamType: playConfigs.value.streamType,
                    protoType: playConfigs.value.protoType,
                    encryptMode: playConfigs.value.encryptMode,
                    assistStream: playConfigs.value.assistStream ? '1' : '0',
                    devCode: aesEncrypt(playConfigs.value.devCode, playConfigs.value.sk, '86E2DB6D77B5E9CD'),
                    accessKey: playConfigs.value.accessKey,
                }
                return new Promise((resolve) => {
                    isGetUrl.value = true
                    openApiFetch(
                        '/open-api/api-iot/device/createDeviceStreamUrl',
                        playConfigs.value.accessKey,
                        playConfigs.value.sk,
                        playConfigs.value.productId,
                        playConfigs.value.appAccessToken,
                        params,
                    )
                        .then((data) => {
                            const url = data.data && data.data.url
                            if (url) {
                                message.info('录像下载开始...')
                                _this.isDownloading = true
                                downloadURL.value = url
                                _this.player &&
                                _this.player.download('player', {
                                        streamURL: downloadURL.value,
                                        deviceId: playConfigs.value.deviceId,
                                        channelId: playConfigs.value.channelId,
                                        bitStream: playConfigs.value.streamType,
                                        isLive: !!isLive.value,
                                    })
                                resolve()
                            } else {
                                const errMsg = data.code == 'DV1019' ? '设备能力级不支持！' : '获取流地址失败'
                                reject(errMsg)
                            }
                            isGetUrl.value = false
                        })
                        .catch(() => {
                            isGetUrl.value = false
                        })
                })
            } else {
                message.info('录像下载中...')
            }
        },
    },
}