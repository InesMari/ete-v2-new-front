import {
	Message,
	MessageBox
} from 'element-ui'

let CreatedOKLodop7766 = null;

//====判断是否需要安装CLodop云打印服务器:====
const needCLodop = function() {
	try {
		var ua = navigator.userAgent;
		if (ua.match(/Windows\sPhone/i) != null)
			return true;
		if (ua.match(/iPhone|iPod/i) != null)
			return true;
		if (ua.match(/Android/i) != null)
			return true;
		if (ua.match(/Edge\D?\d+/i) != null)
			return true;
		if (ua.match(/QQBrowser/i) != null)
			return false;
		var verTrident = ua.match(/Trident\D?\d+/i);
		var verIE = ua.match(/MSIE\D?\d+/i);
		var verOPR = ua.match(/OPR\D?\d+/i);
		var verFF = ua.match(/Firefox\D?\d+/i);
		var x64 = ua.match(/x64/i);
		if ((verTrident == null) && (verIE == null) && (x64 !== null))
			return true;
		else if (verFF !== null) {
			verFF = verFF[0].match(/\d+/);
			if (verFF[0] >= 42)
				return true;
		} else if (verOPR !== null) {
			verOPR = verOPR[0].match(/\d+/);
			if (verOPR[0] >= 32)
				return true;
		} else if ((verTrident == null) && (verIE == null)) {
			var verChrome = ua.match(/Chrome\D?\d+/i);
			if (verChrome !== null) {
				verChrome = verChrome[0].match(/\d+/);
				if (verChrome[0] >= 42)
					return true;
			}
			;
		}
		;
		return false;
	} catch (err) {
		return true;
	}
	;
};

//====页面引用CLodop云打印必须的JS文件：====
if (needCLodop()) {
	//让其它电脑的浏览器通过本机打印（适用例子）：
	oscript = document.createElement("script");
	oscript.src = "/CLodopfuncs.js";
	var head = document.head || document.getElementsByTagName("head")[0]
			|| document.documentElement;
	head.insertBefore(oscript, head.firstChild);
	//让本机浏览器打印(更优先)：
	var oscript = document.createElement("script");
	oscript.src = "http://localhost:8000/CLodopfuncs.js?priority=1";
	var head = document.head || document.getElementsByTagName("head")[0]
			|| document.documentElement;
	head.insertBefore(oscript, head.firstChild);

	var oscript2 = document.createElement("script");
	oscript2.src = "http://localhost:18000/CLodopfuncs.js?priority=1";
	var head = document.head || document.getElementsByTagName("head")[0]
			|| document.documentElement;
	head.insertBefore(oscript2, head.firstChild);

	var oscript3 = document.createElement("script");
	oscript3.src = "http://localhost:8001/CLodopfuncs.js?priority=1";
	var head = document.head || document.getElementsByTagName("head")[0]
			|| document.documentElement;
	head.insertBefore(oscript3, head.firstChild);
};

//====获取LODOP对象的主过程：====
const getLodop = function(oOBJECT, oEMBED) {
	var strHtmInstall = "<font color='#FF00FF'>打印控件未安装!点击  <a href='/file/install_lodop32.exe' target='_blank' style='font-size:20px;color:#ff0000'>执行下载并安装</a>,安装后请刷新页面或重新进入。</font>";
	var strHtmUpdate = "<font color='#FF00FF'>打印控件需要升级!点击  <a href='/file/install_lodop32.exe' target='_blank' style='font-size:20px;color:#ff0000'>执行下载并升级</a>,升级后请重新进入。</font>";
	var strHtm64_Install = "<font color='#FF00FF'>打印控件未安装!点击  <a href='/file/install_lodop64.exe' target='_blank' style='font-size:20px;color:#ff0000'>执行下载并安装</a>,安装后请刷新页面或重新进入。</font>";
	var strHtm64_Update = "<font color='#FF00FF'>打印控件需要升级!点击  <a href='/file/install_lodop64.exe' target='_blank' style='font-size:20px;color:#ff0000' >执行升级并安装</a>,升级后请重新进入。</font>";
	var strHtmFireFox = "<font color='#FF00FF'>（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）</font>";
	var strHtmChrome = "<font color='#FF00FF'>(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）</font>";
	var strCLodopInstall = "<font color='#FF00FF'>CLodop云打印服务(localhost本地)未安装启动!点击 <a href='/file/CLodopPrint_Setup_for_Win32NT.exe' target='_blank' style='font-size:20px;color:#ff0000' >执行下载并安装</a>,安装后请刷新页面。</font>";
	var strCLodopUpdate = "<font color='#FF00FF'>CLodop云打印服务需升级!点击  <a href='/file/CLodopPrint_Setup_for_Win32NT.exe' target='_blank' style='font-size:20px;color:#ff0000'>执行升级并安装</a>,升级后请刷新页面。</font>";
	var LODOP;
	try {
		var isIE = (navigator.userAgent.indexOf('MSIE') >= 0)
				|| (navigator.userAgent.indexOf('Trident') >= 0);
		if (needCLodop()) {
			
			try {
				LODOP = getCLodop();
			} catch (err) {
			}
			;
			if (!LODOP && document.readyState !== "complete") {
				Message("C-Lodop没准备好，请稍后再试！");
				return;
			}
			;
			if (!LODOP) {
				if (isIE){
					MessageBox.alert(strCLodopInstall,"提示",{
						dangerouslyUseHTMLString:true
					});
				}
				else
					{
						MessageBox.alert(strCLodopInstall,"提示",{
							dangerouslyUseHTMLString:true
						});
					}
					
				return;
			} else {

				if (CLODOP.CVERSION < "2.0.4.0") {
					if (isIE)
						MessageBox.alert(strCLodopUpdate,"提示",{
							dangerouslyUseHTMLString:true
						});
					else
						MessageBox.alert(strCLodopUpdate,"提示",{
							dangerouslyUseHTMLString:true
						});
				}
				;
				if (oEMBED && oEMBED.parentNode)
					oEMBED.parentNode.removeChild(oEMBED);
				if (oOBJECT && oOBJECT.parentNode)
					oOBJECT.parentNode.removeChild(oOBJECT);
			}
			;
		} else {
			var is64IE = isIE && (navigator.userAgent.indexOf('x64') >= 0);
			//=====如果页面有Lodop就直接使用，没有则新建:==========
			if (oOBJECT != undefined || oEMBED != undefined) {
				if (isIE)
					LODOP = oOBJECT;
				else
					LODOP = oEMBED;
			} else if (CreatedOKLodop7766 == null) {
				LODOP = document.createElement("object");
				LODOP.setAttribute("width", 0);
				LODOP.setAttribute("height", 0);
				LODOP
						.setAttribute("style",
								"position:absolute;left:0px;top:-100px;width:0px;height:0px;");
				if (isIE)
					LODOP.setAttribute("classid",
							"clsid:2105C259-1E0C-4534-8141-A753534CB4CA");
				else
					LODOP.setAttribute("type", "application/x-print-lodop");
				document.documentElement.appendChild(LODOP);
				CreatedOKLodop7766 = LODOP;
			} else
				LODOP = CreatedOKLodop7766;
			//=====Lodop插件未安装时提示下载地址:==========
			if ((LODOP == null) || (typeof (LODOP.VERSION) == "undefined")) {
				if (navigator.userAgent.indexOf('Chrome') >= 0)
					MessageBox.alert(strHtmChrome,"提示",{
						dangerouslyUseHTMLString:true
					});
				if (navigator.userAgent.indexOf('Firefox') >= 0)
					MessageBox.alert(userAgent,"提示",{
						dangerouslyUseHTMLString:true
					});
				if (is64IE)
					MessageBox.alert(strHtm64_Install,"提示",{
						dangerouslyUseHTMLString:true
					});
				else if (isIE)
					MessageBox.alert(strHtmInstall,"提示",{
						dangerouslyUseHTMLString:true
					});
				else
					MessageBox.alert(strHtmInstall,"提示",{
						dangerouslyUseHTMLString:true
					});
				return LODOP;
			}
			;
		}
		;
		if (LODOP.VERSION < "6.2.0.3") {
			if (needCLodop())
				MessageBox.alert(strCLodopUpdate,"提示",{
					dangerouslyUseHTMLString:true
				});
			else if (is64IE)
				MessageBox.alert(strHtm64_Install,"提示",{
					dangerouslyUseHTMLString:true
				});
			else if (isIE)
				MessageBox.alert(strHtmInstall,"提示",{
					dangerouslyUseHTMLString:true
				});
			else
				MessageBox.alert(strHtmInstall,"提示",{
					dangerouslyUseHTMLString:true
				});
			return LODOP;
		}
		;
		//===如下空白位置适合调用统一功能(如注册语句、语言选择等):===
		// LODOP.SET_LICENSES("","CA7D06E8F6CBCEF583213ABFCB278404","C94CEE276DB2187AE6B65D56B3FC2848","");
		LODOP.SET_LICENSES("", "128170832841C6D2DC03B40159673C41",
		"C94CEE276DB2187AE6B65D56B3FC2848",
		"A98059EB2341CD527B4BF6DD39357B4E");
		//===========================================================
		return LODOP;
	} catch (err) {
		alert("getLodop出错:" + err);
	}
	;
};

export{
	getLodop,
	needCLodop,
}