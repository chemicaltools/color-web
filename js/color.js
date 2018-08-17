var jcrop_api,imagew,imageh,imageurl,fac = new FastAverageColor()
var concentration=function(r,g,b){return (r/g-0.2496)/0.0078 }
$(function(){
	imageurl=$("#target").attr("src")
	getImageWidth(imageurl,function(w,h){
		imagew=w
		imageh=h
	})
	setJcrop()
	fac.getColorAsync(document.getElementById("target"),showcolor,{
			left:0,
			top:0,
			width:100,
			height:100
		});
});
function showcolor(color){
	$("#color").css("background-color",color.hex);
	value=color.value
	c=concentration(value[0],value[1],value[2]).toFixed(4)
	$("#RGB").html("R: "+value[0]+"<br/>G: "+value[1]+"<br>B: "+value[2]+"<br>c: "+c)
}
function setJcrop(){
	$('#target').Jcrop({
		onChange: showPreview,
		onSelect: showPreview,
		onRelease: hidePreview,
		aspectRatio: 1,
		boxWidth:$("#main-content").width(),
		boxHeight:$("#main-content").height()
	},function(){ jcrop_api = this;});
}
function showPreview(coords){
	var rx = 100 / coords.w;
	var ry = 100 / coords.h;
	$('#preview').css({
		width: Math.round(rx * imagew) + 'px',
		height: Math.round(ry * imageh) + 'px',
		marginLeft: '-' + Math.round(rx * coords.x) + 'px',
		marginTop: '-' + Math.round(ry * coords.y) + 'px'
	});
	fac.getColorAsync(document.getElementById("target"),showcolor,{
			left:coords.x,
			top:coords.y,
			width:coords.w,
			height:coords.h
		});
}
function hidePreview(){
	$('#preview').stop().fadeOut('fast');
}
function c(v){
	var reader = new FileReader();
	reader.onload = function (evt) {
		imageurl=evt.target.result
		jcrop_api.destroy()
		$("#target").attr("src",imageurl)
		$("#preview").attr("src",imageurl)
		getImageWidth(imageurl,function(w,h){
			imagew=w
			imageh=h
		})
		setJcrop()
	}
	reader.readAsDataURL(v.files[0]);
}

function getImageWidth(url,callback){
    var img = new Image();
    img.src = url;
    if(img.complete){
        callback(img.width, img.height);
    }else{
        img.onload = function(){
            callback(img.width,img.height);
        }
    }
}