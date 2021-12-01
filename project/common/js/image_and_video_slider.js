jQuery(document).ready(function ($) {                
                
         $(".media-video").each(function() {       
                         var video = this;
                         var source =  $(this).find('Source:first').attr('src');;
                           
                         
                         if (Hls.isSupported()) {                          
                         var hls = new Hls();
                         if (source != null) {
                         hls.loadSource(source);              
                         }
                        else { hls.loadSource(video.currentSrc); }
                         hls.attachMedia(video);
                         // video.src = source
                         
                         } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                         video.src = source;
                         } 
                                
         });
     
     
         
 var options = {
     $FillMode: 2,                                       //[Optional] The way to fill image in slide, 0 stretch, 1 contain (keep aspect ratio and put all inside slide), 2 cover (keep aspect ratio and cover whole slide), 4 actual size, 5 contain for large image, actual size for small image, default value is 0
     $AutoPlay: 0,                                       //[Optional] Auto play or not, to enable slideshow, this option must be set to greater than 0. Default value is 0. 0: no auto play, 1: continuously, 2: stop at last slide, 4: stop on click, 8: stop on user navigation (by arrow/bullet/thumbnail/drag/arrow key navigation)
     $Idle: 100,                                        //[Optional] Interval (in milliseconds) to go for next slide since the previous stopped if the slider is auto playing, default value is 3000
     $PauseOnHover: 1,                                   //[Optional] Whether to pause when mouse over if a slider is auto playing, 0 no pause, 1 pause for desktop, 2 pause for touch device, 3 pause for desktop and touch device, 4 freeze for desktop, 8 freeze for touch device, 12 freeze for desktop and touch device, default value is 1
 
     $ArrowKeyNavigation: 1,                            //[Optional] Steps to go for each navigation request by pressing arrow key, default value is 1.
     $SlideEasing: $Jease$.$OutQuint,                    //[Optional] Specifies easing for right to left animation, default value is $Jease$.$OutQuad
     $SlideDuration: 800,                                //[Optional] Specifies default duration (swipe) for slide in milliseconds, default value is 500
     $MinDragOffsetToSlide: 20,                          //[Optional] Minimum drag offset to trigger slide, default value is 20
     //$SlideWidth: 600,                                 //[Optional] Width of every slide in pixels, default value is width of 'slides' container
     //$SlideHeight: 300,                                //[Optional] Height of every slide in pixels, default value is height of 'slides' container
     $SlideSpacing: 0,                                  //[Optional] Space between each slide in pixels, default value is 0
     $UISearchMode: 1,                                   //[Optional] The way (0 parellel, 1 recursive, default value is 1) to search UI components (slides container, loading screen, navigator container, arrow navigator container, thumbnail navigator container etc).
     $PlayOrientation: 1,                                //[Optional] Orientation to play slide (for auto play, navigation), 1 horizental, 2 vertical, 5 horizental reverse, 6 vertical reverse, default value is 1
     $DragOrientation: 1,                                //[Optional] Orientation to drag slide, 0 no drag, 1 horizental, 2 vertical, 3 either, default value is 1 (Note that the $DragOrientation should be the same as $PlayOrientation when $Cols is greater than 1, or parking position is not 0)
 
     $BulletNavigatorOptions: {                          //[Optional] Options to specify and enable navigator or not
         $Class: $JssorBulletNavigator$,                 //[Required] Class to create navigator instance
         $ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
         $SpacingX: 8,                                   //[Optional] Horizontal space between each item in pixel, default value is 0
         $Orientation: 1                                //[Optional] The orientation of the navigator, 1 horizontal, 2 vertical, default value is 1
     },
 
     $ArrowNavigatorOptions: {                           //[Optional] Options to specify and enable arrow navigator or not
         $Class: $JssorArrowNavigator$,                  //[Requried] Class to create arrow navigator instance
         $ChanceToShow: 2                                 //[Optional] Steps to go for each navigation request, default value is 1
     }
};
     
 var jssor_slider1 = new $JssorSlider$("slider1_container", options);
 
var stageObj=this;
 
for(var a=1;a<=totalVideo;a++)
{
	this["myVar"+a]=0;
	this["intervSet"+a] = 0;
	this["vidClip"+a] = document.getElementById("myVideo"+a); 
	if(this["vidClip"+a]!=null && this["vidClip"+a]!=undefined)
	{
		$('.playBtn'+a).on('click', function(evt) {
						var nameSplit=Number(evt.target.classList[0].split("playBtn")[1]);                           
						if(stageObj["intervSet"+nameSplit] == 1){
						clearInterval(stageObj["myVar"+nameSplit]);
						stageObj["intervSet"+nameSplit] = 0;
						}
						//document.getElementById("myVideo"+nameSplit).play();
						stageObj["vidClip"+nameSplit].play();
						stageObj["myVar"+nameSplit] = setInterval(function(){stageObj["myTimer"+nameSplit](nameSplit)}, 200);
						stageObj["intervSet"+nameSplit] = 1;
		});
		
		$('.pauseBtn'+a).on('click', function(evt) {
						var nameSplit=Number(evt.target.classList[0].split("playBtn")[1]);           
						if(stageObj["intervSet"+nameSplit] == 1){
						clearInterval(stageObj["myVar"+nameSplit]);
						stageObj["intervSet"+nameSplit] = 0;
						}
						stageObj["vidClip"+nameSplit].pause();                                
		});
	
		// toggle button class when finished
		this["vidClip"+a].onended = function(evt) {
						var nameSplit=Number(evt.target.id.split("myVideo")[1]);
						if(stageObj["intervSet"+nameSplit] == 1){
										clearInterval(stageObj["myVar"+nameSplit]);
										stageObj["intervSet"+nameSplit] = 0;
						}
						$('.mybuttons'+nameSplit).show();
		};
		 $('#myVideo'+a).on('click', function(evt) {           
						var nameSplit=Number(evt.target.id.split("myVideo")[1]);          
						 if(stageObj["intervSet"+nameSplit] == 1){
										clearInterval(stageObj["myVar"+nameSplit]);
										stageObj["intervSet"+nameSplit] = 0;
						}
						$('.mybuttons'+nameSplit).show();
						stageObj["vidClip"+nameSplit].pause();                                
	
		});
		
		this["myTimer"+a]=function(aValues){                  
						var nameSplit=aValues;
						clearInterval(stageObj["myVar"+nameSplit]);
						stageObj["intervSet"+nameSplit] = 0;
						$('.mybuttons'+nameSplit).hide();
		}
	}
 
}
 
 
if($("div").hasClass("loaderImage_white"))
{
	$(".loaderImage_white").on('click', function() {
		for(var b=1;b<=totalVideo;b++)
		{
			clearInterval(stageObj["myVar"+a]);
		}                      
		for(var a=1;a<=totalVideo;a++)
		{
			if(stageObj["vidClip"+a]!=null && stageObj["vidClip"+a]!=undefined)
			{
				stageObj["vidClip"+a].pause();
				stageObj["vidClip"+a].currentTime = 0;
				$('.mybuttons'+a).show();
			} 
		}
	
	});
}
else if($("div").hasClass("loaderImage_black"))
{              
	$(".loaderImage_black").on('click', function() {
		for(var b=1;b<=totalVideo;b++)
		{
			clearInterval(stageObj["myVar"+a]);
		}
		for(var a=1;a<=totalVideo;a++)
		{
			if(stageObj["vidClip"+a]!=null && stageObj["vidClip"+a]!=undefined)
			{
				stageObj["vidClip"+a].pause();
				stageObj["vidClip"+a].currentTime = 0;
				$('.mybuttons'+a).show();
			}
		}   
	
	});
}        
         
             //responsive code begin
             //you can remove responsive code if you don't want the slider scales while window resizing
         function ScaleSlider() {
             var bodyWidth = document.body.clientWidth;
             if (bodyWidth)
                 jssor_slider1.$ScaleWidth(Math.min(bodyWidth, 1920));
             else
                 window.setTimeout(ScaleSlider, 30);
         }
          ScaleSlider();
         
                     $(window).bind("load", ScaleSlider);
                     $(window).bind("resize", ScaleSlider);
                     $(window).bind("orientationchange", ScaleSlider);
             //responsive code end
 
});



