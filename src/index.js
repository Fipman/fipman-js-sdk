"use strict";
const validStorages = ["s3"];
let _options = null, _callback = null;
let uploaderURL = "http://client.fipman.com/?options="; //Fipman Uploader App Url
const style = ".fipman-overlay{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1000;background:rgba(239, 239, 242, 0.8)}.fipman-container{position:fixed;overflow:hidden;min-height:300px;top:50px;right:150px;bottom:50px;left:150px;box-sizing:content-box;-webkit-box-sizing:content-box}";
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
		maxFileSize: (options.maxFileSize || 0) * 1000
	});
	setIframe();

	return uploaderURL; //for test
};

const setIframe = function () {
	iframeContainer = "<div><div id='fipman-inner-container' class='fipman-container'>";
	iframeContainer += "<iframe name='filepicker_dialog' id='filepicker_dialog' border='0' frameborder='0' marginwidth='0' marginheight='0' src='" + uploaderURL + "' style='width: 100%; height: 100%; border: none; position: relative;'></iframe>'";
	iframeContainer += "</div>";
	return iframeContainer;
};

const calculateModalPosition = function(){
	var docWidth = document.documentElement.clientWidth;
	var docHeight = document.documentElement.clientHeight;	

	var iframeRatio = 1.86;
	var iframeWidth = docWidth - 300;
	var iframeHeight = iframeWidth / iframeRatio;
	var bottomPosition = iframeHeight <= docHeight ? (docHeight - 50 - iframeHeight) : 50;
	
	document.getElementById("fipman-inner-container").style.bottom = bottomPosition +"px";
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
	window.removeEventListener("resize", calculateModalPosition);
};

const setEventListener = function () {
	window.addEventListener("message", onEventMessage, true);
	window.addEventListener("resize", calculateModalPosition);
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

	calculateModalPosition();
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