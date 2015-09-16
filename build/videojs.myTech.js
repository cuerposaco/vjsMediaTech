(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
videojs.Shaka = videojs.MediaTechController.extend({
	
	init: function(player, options, ready){
		
		var self 		= this;
		/**
		*	Instancia del player de videojs
		*/
		this.player_ 	= player;
		/**
		*	Objecto HTML donde se encuentra instanciado el player
		*/
		this.playerEl_ 	= player.el();

		/**
		*	MediaTechController super()
		*/
		videojs.MediaTechController.call(this, player, options, ready);

		/**
		*	Check Mobile
		*/
		// autoplay is disabled for mobile
		if (this.isIos || this.isAndroid) {
			this.player_.options()['autoplay'] = false;
		}

		/**
		*	Copia de los sources si existen
		*/
		if(typeof options['source'] !== 'undefined') {
			for(var key in options['source']) {
			  if(options['source'].hasOwnProperty(key)) {
			    player.options()[key] = options['source'][key];
			  }
			}
		}
		
		/**
		*	Creacion del elemento contenedor de la technologia
		*/
		this.playerEl_.className += ' vjs-Shaka';
		this.Tech_id = this.player_.id() + '_Shaka_api';
		this.Tech_el = videojs.Component.prototype.createEl('video', {
			id: this.Tech_id,
			className: 'vjs-tech'
		});
		this.playerEl_.insertBefore(this.Tech_el, this.playerEl_.firstChild);

		//videojs.Shaka.prototype.src.call(this, options.source && options.source.src);

		this.startShaka();
		/**
		*	Tech Ready!!!!
		*/
		//this.triggerReady();
	}
});

videojs.Shaka.prototype.startShaka=function(){

	// Find the video element.
	this.shaka_video = document.getElementById(this.Tech_id);

	// Attach the player to the window so that it can be easily debugged.
	var player = this.shaka_player = new shaka.player.Player(this.shaka_video);

	// Listen for errors from the Player.
	player.addEventListener('error', function(event) {
		console.error(event);
	});
	var mpdUrl = this.options().source.src; //'https://turtle-tube.appspot.com/t/t2/dash.mpd';
	var estimator = new shaka.util.EWMABandwidthEstimator();
	var source = new shaka.player.DashVideoSource(mpdUrl, null, estimator);

	// Load the source into the Player.
	// Then query the video tracks to display in the videoTracks list element.
	// Resize the video element to match the aspect ratio of the active track.
	// Finally, begin playback.
	var self = this;
	player.load(source).then(function() {
		self.triggerReady();
		if(self.player_.options()['autoplay']){
			self.play();
		}
	});
}

videojs.Shaka.prototype.play = function(){
	this.player_.trigger('playing');
	this.player_.trigger('play');
	this.shaka_video.play();
	this.state = 0;
};
videojs.Shaka.prototype.pause = function(){
	this.player_.trigger('pause');
	this.shaka_video.pause();
	this.state = 1;
};
videojs.Shaka.prototype.paused = function(){
	return Boolean(this.state);
};
videojs.Shaka.prototype.duration = function(){
	return this.shaka_video.duration;
};
videojs.Shaka.prototype.buffered = function(){};
videojs.Shaka.prototype.currentTime = function(){
	return this.shaka_video.currentTime;
};
videojs.Shaka.prototype.setCurrentTime = function (seconds){
	this.shaka_video.currentTime = seconds;
};
videojs.Shaka.prototype.volume = function(){
	return this.shaka_video.volume;
};
videojs.Shaka.prototype.setVolume = function (volume){
	this.shaka_video.volume = volume;
};
videojs.Shaka.prototype.muted = function(){
	return this.shaka_video.muted;
};
videojs.Shaka.prototype.setMuted = function (muted){
	this.shaka_video.muted = muted;
};
videojs.Shaka.prototype.supportsFullScreen = function(){
	return true;
};
videojs.Shaka.prototype.buffered = function(){
	return videojs.createTimeRange(0,this.shaka_player.getStreamBufferSize());
};



// (function(){
//   // Create setters and getters for attributes
//   var api = videojs.Shaka.prototype,
//     readWrite = 'rtmpConnection,rtmpStream,preload,defaultPlaybackRate,playbackRate,autoplay,loop,mediaGroup,controller,controls,volume,muted,defaultMuted'.split(','),
//     readOnly = 'error,networkState,readyState,seeking,initialTime,startOffsetTime,paused,played,ended,videoTracks,audioTracks,videoWidth,videoHeight'.split(','),
//     // Overridden: buffered, currentTime, currentSrc
//     i;

//   function createSetter(attr){
//     var attrUpper = attr.charAt(0).toUpperCase() + attr.slice(1);
//     api['set'+attrUpper] = function(val){ return this.el_.vjs_setProperty(attr, val); };
//   }
//   function createGetter(attr) {
//     api[attr] = function(){ return this.el_.vjs_getProperty(attr); };
//   }
//   // Create getter and setters for all read/write attributes
//   for (i = 0; i < readWrite.length; i++) {
//     createGetter(readWrite[i]);
//     createSetter(readWrite[i]);
//   }

//   // Create getters for read-only attributes
//   for (i = 0; i < readOnly.length; i++) {
//     createGetter(readOnly[i]);
//   }
// })();

// is supported on all platforms
videojs.Shaka.isSupported = function() {
	// Instalamos los polyfills para poder comprobar si el navegador soporta la Tech
	shaka.polyfill.installAll(); 
	// Comprobamos la compatibilidad del navegador con la Tech
	return shaka.player.Player.isBrowserSupported();
};

// You can use video/xxx as a media in your HTML5 video to specify the source
videojs.Shaka.canPlaySource = function(srcObj) {
	var mpegDashRE = /\.mpd/i;
	return mpegDashRE.test(srcObj.src);
	//return 'maybe';
};

// Always can control the volume
videojs.Shaka.canControlVolume = function() {
	return true;
};
},{}]},{},[1]);
