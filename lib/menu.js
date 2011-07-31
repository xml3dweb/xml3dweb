/*
This script includes methods for handling the object catalog.
It enables the explorer-view.

Authors: Thomas
*/

var X3D = X3D ? X3D : new Object();
X3D.menu = function(){
	return{
		init_nav : function() {
		   for(i = 0; i < document.getElementsByTagName('ul').length; 
			   i++) {
			  if(document.getElementsByTagName('ul')[i].className == 
			  "opened") {
				 id = 
				 document.getElementsByTagName('ul')[i].parentNode.id;
				 toggle(id, false);
			  }
		   }
		   if(window.name.length > 0)       
			  this.load_nav();
		},
		 
		toggle : function(id, save) {
		   ul = "ul_" + id;
		   img = "img_" + id;
		   ul_element = document.getElementById(ul);
		   img_element = document.getElementById(img);
		   if(ul_element) {
			   if(ul_element.className == 'closed') {
				  ul_element.className = "opened";
				  img_element.src = "media/opened.gif";
			   } 
			   else {
				  ul_element.className = "closed";
				  img_element.src = "media/closed.gif";
			   }
		   }
		   if(save == true) this.save_nav();
		},
		 
		save_nav :  function() {
		   var save = "";
		   for(var i = 0; i < document.getElementsByTagName('ul').length;
		   i++) {
			  if((document.getElementsByTagName('ul')[i].className == 
			  "opened" || 
			  document.getElementsByTagName('ul')[i].className == 
			  "closed") && document.getElementsByTagName('ul')[i].id != 
			  'root') 
				 save = save + document.getElementsByTagName('ul')[i].id 
				 + "=" + document.getElementsByTagName('ul')[i].className 
				 + ",";
		   }
		   if(save.lastIndexOf(",") > 0) 
			  save = save.substring(0, save.lastIndexOf(","));
		   window.name = save;
		},
		 
		load_nav : function() {
		   var items = window.name.split(",");
		   if(items.length > 0) {
			  for(var i = 0; i < items.length; i++) {        
				 id_value = items[i].split("=");         
				 if(id_value.length == 2) {
					id = id_value[0];  
					value = id_value[1];
					document.getElementById(id).className = value;
					img = "img_" + id.substring(3, id.length);
					img_element = document.getElementById(img);
					if(value == "closed")
					   img_element.src = "media/closed.gif";  
					else
					   img_element.src = "media/opened.gif";
				 }
			  }
		   }
		},
		toggleList:function(id){
			var listParent = document.getElementById("browseList");
			var elements = listParent.getElementsByTagName("div");
			for(var i=0;i<elements.length;i++){
				if(elements[i].getAttribute("class") =="opened"){
					elements[i].setAttribute("class","closed");
				}
			}
			var list = document.getElementById(id);
			list.setAttribute("class","opened");
		},
		addEntries:function(prefix, objects){
			while(objects.length>0){
				var ele = objects.pop();
				X3D.menu.addEntry(prefix,ele.getAttribute("cat"),ele.getAttribute("id"),ele.getAttribute("image"));
			}
		},
		addEntry:function(prefix, cat, id, imgsrc){
			var img = document.createElement("img");
			img.setAttribute("src",imgsrc);
			img.setAttribute("alt",id);
			img.setAttribute("height","80px");
			img.setAttribute("style","float: left;");
			img.setAttribute("onclick","X3D.tb.createBoxDialog('"+prefix+":"+id+"')");
			
			var list = document.getElementById(cat);
			if(list===null){
				list = document.getElementById("otherObjects");
			}
			list.appendChild(img);
		}
	}
}();