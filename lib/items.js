/*
	This script ist used to maintain list of locked/selected 
	elements in the right content pane.
	
	authors: Holger
	created: 28.06.2011
*/

var X3D = X3D ? X3D : new Object();
X3D.items = function(){
	const listPrefix = "list_";
	var log, logname = "lib/items.js";
	return{
		/*
			initializes the log.
		*/
		init:function(){
			log = X3D.log.get(logname);
		},
		/*
			The main entry method to create a new list object into the right content panel.
		*/
		createEntry : function(eleId,isChild){
			var element = document.getElementById(eleId);
			var type = element.getAttribute("type");
			if(isChild)type=element.parentElement.getAttribute("type");
			if(type === "light" || type === "ground" || type ==="wall"||type ==="onwall"){
				var div = document.createElement("div");
				div.setAttribute("elem","elem");
				var check = document.createElement("input");
				var text = document.createTextNode(element.getAttribute("name"));
				if(isChild){
					div.style.color ="#FF0000";
					var img = document.createElement("img");
					img.setAttribute("src","media/right.gif");
					div.appendChild(img);
				} 
				check.setAttribute("id",listPrefix+eleId);
				check.setAttribute("type","checkbox");
				check.setAttribute("value","xyz");
				check.setAttribute("name","zutat");
				div.appendChild(check);
				div.appendChild(text);
				this.addEntry(div,type);
				X3D.main.on('click',function(){
						X3D.items.checkValue(eleId);
					},check);
			}
			
		},
		/*
			This method is called when the checkboxes are clicked.  
			It selects/deselects the objects in X3D.main.selectedElems
		*/
		checkValue:function(eleId){
			var checkbox = document.getElementById(listPrefix+eleId);
			log.info("Checkbox with id "+eleId+" has value: "+ checkbox.checked);
			if(checkbox.checked){
				X3D.main.selectElementById(eleId);
				log.info("Selection element with id: "+eleId);
			} else {
				X3D.main.deselectElementById(eleId);
			}
			
		},
		/*
			Mainly used by createEntry method.  It inserts the new list object
			in the correct position in the list.
		*/
		addEntry:function(element,category){
			var position;
			if(category === "light"){
				position = document.getElementById("rightContent_light");
			} else if(category === "ground"){
				position = document.getElementById("rightContent_ground");
			}else if(category === "wall"){
				position = document.getElementById("rightContent_wall");
			}else if(category === "onwall"){
				position = document.getElementById("rightContent_onwall");
			}
			//var list = document.getElementById("rightContent");
			position.appendChild(element);
		},
		/*
			Removes all list objects.  Is needed to reset the list after all Changes are comitted.
			
			TODO
		*/
		removeAllEntries: function(){
			var ids = [];
			ids.push("rightContent_light");
			ids.push("rightContent_ground");
			ids.push("rightContent_wall");
			ids.push("rightContent_onwall");
			for(var i =0;i<ids.length;i++){
				var element = document.getElementById(ids[i]);
				while(element.hasChildNodes()){
					element.removeChild(element.firstChild);
				}
			}
		},
		removeEntryById: function(id){
			//var list = document.getElementById("rightContent");
			var entry = document.getElementById(listPrefix+id).parentNode;
			entry.parentNode.removeChild(entry);
		},
		
	}
}();