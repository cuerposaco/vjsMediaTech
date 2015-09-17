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
		this.Tech_el = videojs.Component.prototype.createEl('div', {
			id: this.id_,
			className: 'vjs-tech',
		});
		this.playerEl_.insertBefore(this.el_, this.playerEl_.firstChild);

		/**
		*	Tech Ready!!!!
		*/
		this.triggerReady();
	}
});

/**
*	Playback Methods
*/
videojs.Shaka.prototype.play = function(){};
videojs.Shaka.prototype.pause = function(){};
videojs.Shaka.prototype.paused = function(){};
/**
*	TimeRange Methods
*/
videojs.Shaka.prototype.duration = function(){};
videojs.Shaka.prototype.buffered = function(){};
videojs.Shaka.prototype.currentTime = function(){};
videojs.Shaka.prototype.setCurrentTime = function (seconds){};
/**
*	Volume Methods
*/
videojs.Shaka.prototype.volume = function(){};
videojs.Shaka.prototype.setVolume = function (volume){};
videojs.Shaka.prototype.muted = function(){};
videojs.Shaka.prototype.setMuted = function (muted){};
/**
*	FullScreen Methods
*/
videojs.Shaka.prototype.supportsFullScreen = function(){};

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

/** 
* Tech support Testing 
*/
videojs.Shaka.isSupported = function() {
	return true;
};

// You can use video/xxx as a media in your HTML5 video to specify the source
videojs.Shaka.canPlaySource = function(srcObj) {
	//return (srcObj.type === 'video/mp4');
	return 'maybe';
};

// Always can control the volume
videojs.Shaka.canControlVolume = function() {
	return true;
};