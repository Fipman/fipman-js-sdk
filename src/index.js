"use strict";
const validStorages = ["s3"];
let _options = null, _callback = null;
let uploaderURL = "https://www.fipman.com/uploader/?options="; //Fipman Uploader App Url
const style = ".fipman-overlay{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1000;background:rgba(0,0,0,.8)}.fipman-container{position:fixed;overflow:hidden;min-height:300px;top:100px;right:100px;bottom:100px;left:100px;background:#eee;box-sizing:content-box;-webkit-box-sizing:content-box}.fipman-close{position:fixed;top:104px;right:108px;width:35px;height:35px;z-index:20;cursor:pointer}.fipman-close>a{text-indent:-9999px;overflow:hidden;display:block;width:100%;height:100%;background:url(https://d1zyh3sbxittvg.cloudfront.net/close.png) 50% 50% no-repeat}";
let iframeContainer = "";

const init = function (options) {
	if (!validateOptions(options))
		return;

	_options = options;
	uploaderURL += JSON.stringify({
		apiKey: options.apiKey,
		blob: options.storage,
		lang: options.language || "en",
		allowMultipleUpload: options.allowMultipleUpload === undefined ? true : options.allowMultipleUpload,
		allowFiles: options.allowFiles || "*",
		maxFileSize: options.maxFileSize || 0
	});
	setIframe();

	return uploaderURL; //for test
};

const setIframe = function () {
	iframeContainer = "<div class='fipman-container'><div class='fipman-close'><a onClick='return fipmanClient.hide()'>X</a></div>";
	iframeContainer += "<iframe name='filepicker_dialog' id='filepicker_dialog' border='0' frameborder='0' marginwidth='0' marginheight='0' src='" + uploaderURL + "' style='width: 100%; height: 100%; border: none; position: relative;'></iframe>'";
	iframeContainer += "</div>";
	return iframeContainer;
};

const onEventMessage = function (e) {
	if (e.data.event_id === "fipman-end") {
		var data = e.data.data;
		_callback(undefined, data);
		hide();

	} else if (e.data.event_id === "fipman-error") {
		_callback({ message: e.data.errorMessage }, undefined);
		hide();
	}
};

const removeEventListener = function () {
	window.removeEventListener("message", onEventMessage, true);
};

const setEventListener = function () {
	window.addEventListener("message", onEventMessage, true);
};

const hide = function () {
	var containerTag = document.getElementById("fipman-container");
	if (containerTag)
		containerTag.parentNode.removeChild(containerTag);

	var styleTag = document.getElementById("fipman-styles");
	if (styleTag)
		styleTag.parentNode.removeChild(styleTag);

	var htmlTag = document.getElementsByTagName("html")[0];
	htmlTag.style.overflow = "";
	removeEventListener();
	return false;
};

const show = function (callback) {
	if (!_options) return;

	_callback = callback;
	var header = document.getElementsByTagName("head")[0];
	var body = document.getElementsByTagName("body")[0];

	var styleTag = document.createElement("style");
	styleTag.id = "fipman-styles";
	styleTag.innerHTML = style;
	header.appendChild(styleTag);

	var container = document.createElement("div");
	container.id = "fipman-container";
	container.onclick = function () {
		hide();
	};
	container.classList = "fipman-overlay";
	container.innerHTML = iframeContainer;

	body.appendChild(container);

	var htmlTag = document.getElementsByTagName("html")[0];
	htmlTag.style.overflow = "hidden";

	setEventListener();
};

const validateOptions = function (options) {
	if (!options) {
		throw new Error("Fipman needs initials options to run!");
	} else if (!options.apiKey) {
		throw new Error("Fipman needs api key!");
	} else if (!options.storage) {
		throw new Error("Fipman needs storage location!");
	} else if (!validStorages.includes(options.storage.toLowerCase())) {
		throw new Error("Fipman needs valid storage!");
	}
	else {
		return true;
	}
};

if (window._DEV_) { //Export for test
	module.exports = { init, show, hide, validateOptions, setIframe, uploaderURL, style };
} else {
	module.exports = { init, show, hide };
}



