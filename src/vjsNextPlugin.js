(function(window, videojs) {
	var Timer = function(_endTime){

		var startTime 	= null;
		var lastTime	= null;
		var currentTime = null;
		var endTime 	= (_endTime || 60) * 1000;
		var loopID 		= null;
		var ended 		= true;

		function start(){
			startTime = currentTime = Date.now();
			loopID = requestAnimationFrame(loop);
			console.log("START!!!", endTime, startTime);
		}
		function stop(){
			console.log("STOP!!!")
			cancelAnimationFrame(loopID);
			ended = true;
		}
		function pause(){
			console.log("PAUSE!!!")
			cancelAnimationFrame(loopID);
			lastTime = currentTime - startTime;
		}
		function resume(){
			startTime += lastTime;
			loopID = requestAnimationFrame(loop);
		}
		function getCurrentTime(){
			var diffTime = currentTime - startTime;
			return {
				elapsedTime: diffTime,
				restTime: endTime - diffTime,
				percentTime: (endTime - diffTime) / endTime * 100
			};
		}
		function loop(){
			var ended = ( (startTime+endTime) <= currentTime );
			console.log( "LOOP", getCurrentTime(), getCurrentTime().restTime/1000 );
			if(!ended){
				currentTime = Date.now();
				loopID = requestAnimationFrame(loop);
			} else {
				stop();
			}
		}
		

		return {
			start: start,
			stop: stop,
			pause: pause,
			resume: resume,
			getCurrentTime: getCurrentTime
		}

	}

	var NextPlugin = function(options){

		console.log("NEXTPLUGIN");
		var player = this;

		player.on('ended', function() {
			document.querySelector('.vjs-poster').style.display = 'none';

			var results = Math.ceil(Math.random()*12);

			request = new XMLHttpRequest
			request.open('GET', 'https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=XRYN2xt11Ek&type=video&maxResults='+results+'&key=AIzaSyAZjdFtEqGEmBrBAUuTyF0o0UOZjc27Fls', true);
			request.send();

			request.onload = function() {
				results = JSON.parse(this.response).items;

				var container = document.createElement('div');
				container.className = 'vjs-wall-container'; 
				player.el().appendChild(container);

				if(results.length===1){

				}

				for(var videoItem in results) {
					var item = results[videoItem];
					var id = item.id.videoId;
					var title = item.snippet.title;
					var thumbnails = item.snippet.thumbnails;

					var image = document.createElement('div');
					image.className = 'vjs-wall-container-item';
					image.innerHTML = '<a id="vjs-wall-container-item-link-' + id + '" class="vjs-wall-container-item-link" href="https://www.youtube.com/watch?v=' + id + '" target="_blank" style="background: url(' + thumbnails.default.url + ') no-repeat; background-size: cover;"><div class="vjs-videowall-container-item-text"><div class="vjs-videowall-container-item-text-title">' + title + '</div></div></a>';

					image.onclick = function(){
						player.play();
						return false
					}
					container.appendChild(image);
				}
			};
		});
		player.on('play', function(){	
			var container = document.querySelector('.vjs-wall-container');
			if(container != null){
				container.remove();
			}
		});
	}
	
	videojs.plugin('nextRelated', NextPlugin);

})(window, window.videojs);

/*
vjs.plugin('youtubeVideowall', function(options) {
		var player = this;

		function getVideoId(url)
		{
			var regId = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*)./;
			var match = url.match(regId);

			return (match && match[2].length == 11) ? match[2] : null;
		}

		Element.prototype.remove = function() {
			this.parentElement.removeChild(this);
		}

		NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
			for(var i = 0, len = this.length; i < len; i++) {
				if(this[i] && this[i].parentElement) {
					this[i].parentElement.removeChild(this[i]);
				}
			}
		}

		player.on('ended', function()
		{
			document.querySelector('.vjs-poster').style.display = 'none';

			request = new XMLHttpRequest
			request.open('GET', 'https://gdata.youtube.com/feeds/api/videos/' + getVideoId(player.options()['src']) + '/related?alt=json&max-results=12', true);
			request.send();

			request.onload = function() 
			{
				results = JSON.parse(this.response).feed.entry;

				var container = document.createElement('div');
				container.className = 'vjs-youtube-videowall-container'; 
				player.el().appendChild(container);

				for(var item in results)
				{
					var title = results[item].title.$t;
					var author = results[item].author[0].name.$t;
					var views = results[item].yt$statistics.viewCount;
					var link = results[item].link[0].href;

					var image = document.createElement('div');
					image.className = 'vjs-youtube-videowall-container-item';
					image.innerHTML = '<a id="vjs-youtube-videowall-container-item-link-' + item + '" class="vjs-youtube-videowall-container-item-link" href="' + link + '" target="_blank" style="background: url(http://img.youtube.com/vi/' + getVideoId(link) + '/mqdefault.jpg) no-repeat; background-size: cover;"><div class="vjs-youtube-videowall-container-item-text"><div class="vjs-youtube-videowall-container-item-text-title">' + title + '</div><div class="vjs-youtube-videowall-container-item-text-meta">' + author + '<br>' + views + '</div></div></a>';

					container.appendChild(image);

					document.getElementById('vjs-youtube-videowall-container-item-link-' + item).onclick = function()
					{
						video = this.getAttribute('href')
						player.src(video);
						player.options()['src'] = video;
						return false;		
					}
				}
			};
		});

		player.on('play', function()
		{	
			var container = document.querySelector('.vjs-youtube-videowall-container');
			if(container != null)
			{
				container.remove();
			}
		});
	});
*/