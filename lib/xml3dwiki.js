/*
This script includes methods and objects needed to change XML3D objects 
in the DOM of the document.  

Authors: Holger, Simon, Lukas, Thomas
*/



var X3D = X3D ? X3D : new Object();
X3D.main = function() {
	var testing = false;
    var that = this;
    var elems = [];
	var lockelid = '';
    var mode =  'plane';
    var planeModus = 'plane';
    var rotateModus = 'rotate';
	const shaderPrefix = 'shader_';
    var roomModus = 'room';
    var rotateRoomModus = 'rotateRoom';
    var allModes=[];
    var modeIndex =0;
	var command_wall1 = null;
	var command_wall2 = null;
	var command_wall4 = null;
	var command_wall5 = null;
    var selectedElems = [];
	var lockedElems = [];
    var removeRoute = function(textValue){
		if(textValue ==null)return null;
        var transformerId = textValue.substring(1,textValue.length);
        return transformerId;
    }
    var log, logname = "lib/xml3dwiki.js";
    var xRotate,yRotate,zRotate;
    const NS_XML3D = 'http://www.xml3d.org/2009/xml3d';
	const lightPrefix = 'light_';
	var command;
    return {
		getNS:function(){
			return NS_XML3D;
		},
		toggleTesting:function(){
			if(testing)testing=false;else testing = true;
			log.info("Testing set to: "+testing);
		},
		sendInit:function(){
			X3D.em.publish("data",{actionType: "init"});	
		},
		getLockedElems:function(){
			return lockedElems;
		},
		getShaderPrefix:function(){
			return shaderPrefix;
		},
		getLightPrefix:function(){
			return lightPrefix;
		},
		getSelectedElems:function(){
			return selectedElems;
		},
		
		/*
			initialize X3D.main.  Adding key listener for positioning.  
			Initialize modes and rotations.
		*/
		init: function() {
				
                log = X3D.log.get(logname);
                var scene = document.getElementById("MyXml3d");
                if(scene && scene.setOptionValue) {
                    scene.setOptionValue("accumulatepixels", true);
                    scene.setOptionValue("oversampling", 1);
                }

                //Look for the element with the Id myButtonBox and attach an onclick element
                X3D.main.registerEvent(document, "keydown", X3D.main.capturekey);

                log.info("Main Javascript has now been initialized");
                X3D.main.initRotates();
                X3D.main.initModes();
        },
		/*
			This function decides which modes are used for toggling.
		*/
        initModes : function(){
            allModes.push(planeModus);
            allModes.push(roomModus);
            allModes.push(rotateModus);
			X3D.tb.updateModeDisplay(mode);
            //allModes.push(rotateRoomModus);
        },
		
        /*
		Get all elements by Idt gen    
        It could take more than one parameter
		*/
        getById:function(){
            var tempElems = []; //temp Array to save the elements found
            for(var i = 0;i<arguments.length;i++){
                if(typeof arguments[i] === 'string'){ //Verify if the parameter is an string
                    tempElems.push(document.getElementById(arguments[i])); //Add the element to tempElems
                }
            }
            elems = tempElems; //All the elements are copied to the property named elems
            return this; //Return this in order to chain
        },
		/*
			Creates various standard rotations.
		*/
        initRotates : function(){
            var root = document.getElementById('MyXml3d');
            var rect = root.createXML3DVec3();
            rect.x=0;
            rect.y=0;
            rect.z=1;
            zRotate = root.createXML3DRotation();
            zRotate.setAxisAngle(rect,0.785); // In Radian ungefaehr 45 Grad
            rect.z=0;
            rect.x=1;
            xRotate=root.createXML3DRotation();
            xRotate.setAxisAngle(rect,0.785);
            rect.x=0;
            rect.y=1;
            yRotate=root.createXML3DRotation();
            yRotate.setAxisAngle(rect,0.785);
        },
		
		/*
			Returns current mode
		*/
        getMode : function(){
            return mode;
        },
		/*
			toggle between the used modes.
		*/
        toggleMode : function(){
            if(modeIndex>=allModes.length-1){
                modeIndex=0;
                mode = allModes[0];
				X3D.tb.updateModeDisplay(mode);
            } else {
                modeIndex+=1;
                mode = allModes[modeIndex];
				X3D.tb.updateModeDisplay(mode);
            }
            X3D.em.publish("toggleMode", mode);
            log.info('You are now in the '+mode+' mode.');
        },
		
		getCurrentView : function(){
			var xml3dObj = document.getElementById('MyXml3d');
			//console.log('getter: '+xml3dObj.activeView+xml3dObj.getAttribute('activeView'));
			return document.getElementById(xml3dObj.activeView);
		},
		initFreemode : function(){
			var xml3dObj = document.getElementById('MyXml3d');
			if(xml3dObj.activeView != '#freeMode'){
				var view = this.getCurrentView();
				var view2 = X3D.gen.copyElement(view);
				view2.setAttribute('id','freeMode');
				xml3dObj.activeView = '#freemode';
			}
		},
		/*
			Main method for getting various template XML3D objects.
		*/
        getElementsOfType:function(type){
            return this.getElementsOfTypeGeneric(type);
        },
		/*
			Returns elements of a certain tagname from the generics database.
		*/
        getElementsOfTypeGeneric:function(type){
            return X3D.gen.getElementsOfType(type);
        },
        //Add a new class to the elements
        //This does not delete the old class, it just add a new one
        /*addClass:function(name){
            for(var i = 0;i<elems.length;i++){
                        elems[i].className += ' ' + name; //Here is where we add the new class
                    }
                    return this; //Return this in order to chain
        },*/
            
                
        //Add an Event to the elements found by the methods: getById and getByClass
        //--Action is the event type like 'click','mouseover','mouseout',etc
        //--Callback is the function to run when the event is triggered
         on: function(action, callback, element){
           if(element.addEventListener){
                    element.addEventListener(action,callback,false);//Adding the event by the W3C for Firefox, Safari, Opera...   
                
            }
           else if(element.attachEvent){
                        element.attachEvent('on'+action,callback);//Adding the event to Internet Exploder :(
            }
            return this;//Return this in order to chain
        },
		/* deprecated method
		
        createElement:function(x, y, z, data){
            var box = document.createElementNS(NS_XML3D,'group');

            // find free id
            var id;
            do {
                id = (int)(Math.rand()*10000);
            } while (document.getElementById("box"+id));
            
            box.setAttribute('id',"box"+id);
            box.setAttribute('shader','#blueShader');
            var transformerName = transformerPrefix+id;
            this.createTransformerAtPos(transformerName,x,y,z);
            box.setAttribute('transform','#'+transformerName);
            var newmesh = document.createElementNS(NS_XML3D,'mesh');
            newmesh.setAttribute('type','triangles');
            newmesh.setAttribute('src','#'+data);
            box.appendChild(newmesh);
            document.getElementById('MyXml3d').appendChild(box);
            this.getById(id).on('click',function(){
                        //Look for the elements with the Id example2,example3, example4 and add the class 'boxesOnChange'
                        X3D.main.getById(id).selectElement();
                    });
            this.resetXml3D();
            log.info("A new object with the id: "+id+" was created");
            return this;
        },*/
		
		/*
			This is the main Entry point to inserting a new element from the UI.  It
			should not be used for messages coming from P@P. It supports Elements 
			with multiple components.
			Parameters:
				prefix: prefix of the generics xml doc
				genericsID: unique id of the element inside xml doc
				x,y,z: Starting values of the transformer translation
		
		*/
		createElementMain:function(prefix, genericID, x, y, z){
			var parentID = X3D.gen.getGUID();
			this.createElementFromGeneric(parentID,prefix, genericID, x, y, z,"",true);
			var parent = document.getElementById(parentID);
			if(parent.getAttribute("container")==="true"){
				var components =[];
				var elements = parent.getElementsByTagName('dependant');
				for(var i=0;i<elements.length;i++){
					components.push(elements[i].getAttribute("link"));
				}
				for(var i =0;i<components.length;i++){
					guid = X3D.gen.getGUID();
					this.createElementFromGeneric(guid,prefix, components[i], 0, 0, 0,parentID,true);
				}
				for(var i=0;i<elements.length;i++){
					elements[i].parentElement.removeChild(elements[i]);
				}
				
			} 
		},
		/*
			This is method adds an element from generics into the dom.  It is used by messages coming up
			from P@P and from other methods.
			Parameters:
				guid: The new guid for the object
				prefix: prefix of the generics xml doc
				genericsID: unique id of the element inside xml doc
				x,y,z: Starting values of the transformer translation
				parentID: Used for components to add them to a parent group object
				push: True of false depending if it should be pushed to P@P
		*/
        createElementFromGeneric:function(guid, prefix, genericID, x, y, z,parentID,push){
            var lock=true;
			log.info('Prefix:'+prefix+':genericID:'+genericID+' X:'+x+' y:'+y+' z: '+z+" parentid: "+parentID);
            var newElement = X3D.gen.insertGenericGroup(guid, prefix, genericID);
			var translation = "";
			if(x !=0 || y !=0||z!=0){
				translation=x+" "+y+" "+z;
			}
			if(push && newElement!=null){
				X3D.em.publish("data", {
                        actionType: "creation",
                        elementId: guid,
                        groupId: prefix,
                        genericId: genericID,
                        translation: x+" "+y+" "+z,
						parentId:parentID,
                        rotation: "",
                        scale: ""
                    });
			}
			var parent;
			if(parentID != null){
				var temp = document.getElementById(parentID);
				if(temp != null) {
					parent = temp;
					lock = false;
				} else parent = document.getElementById('MyXml3d');
			} else parent = document.getElementById('MyXml3d');
			log.info("Parent Id: "+parent.getAttribute("id"))
			parent.appendChild(newElement);
			if(lock)this.addSelectListener(newElement);
			log.info('New Group was created: '+newElement.getAttribute('id'));
			X3D.main.resetXml3D();
            var newTransformerID=X3D.move.checkOrCreateTransformer(newElement);
            var transformer = document.getElementById(newTransformerID);
            var newShaderID=X3D.shader.testShader(newElement);
            var shader = document.getElementById(newShaderID);
			var texture = shader.getElementsByTagName("texture");
			if(texture.length>0){
				texture[0].setAttribute("genericstag",prefix+":"+texture[0].getAttribute("genericstag"));
				log.info("Shader genericstag set: "+texture[0].getAttribute("genericstag"));
			}
			
			X3D.shader.addDefaultValues(shader);
            //log.info('Test Shader complete: '+newShaderID);
            //log.info('Adjusting Translation');
            X3D.move.changeTransformerTranslationX(transformer,x);
            X3D.move.changeTransformerTranslationY(transformer,y);
            X3D.move.changeTransformerTranslationZ(transformer,z); /* !%&/$ ... */
			this.insertLight(newElement.id);
            return newElement.id;
        },
		insertLight:function(eleId){
			
			var element = document.getElementById(eleId);
			var type = element.getAttribute("light");
			log.info("Id: "+eleId+ " type: "+type);
			if(type === "light"){
				var newGroup = document.createElementNS(NS_XML3D,'group');
				newGroup.setAttribute("id",lightPrefix+eleId);
				var lightTransform = this.copyElementById(lightPrefix+X3D.move.getTransformerPrefix()+eleId,X3D.move.getTransformerPrefix()+eleId);
				lightTransform.translation.z+=1;
				newGroup.setAttribute("transform","#"+lightPrefix+X3D.move.getTransformerPrefix()+eleId);
				var lightEle = document.createElementNS(NS_XML3D,'light');
				lightEle.setAttribute("shader","#ls_Spot");
				newGroup.appendChild(lightEle);
				var myxml3d = document.getElementById("MyXml3d");
				myxml3d.appendChild(newGroup);
				this.resetXml3D();
			}
		},
		checkWalls : function(eleID, push){
			var shaderName = shaderPrefix + eleID;
			var shader = document.getElementById(shaderName);
			if(eleID == X3D.room.getId_1()){
				command_wall1 = new ShaderCommand();
				X3D.shader.createBackupShader(command_wall1,eleID,shader);
				X3D.room.setStatus_1(false);
				return true;
			}else if(eleID == X3D.room.getId_2()){
				command_wall2 = new ShaderCommand();
				X3D.shader.createBackupShader(command_wall2,eleID,shader);
				X3D.room.setStatus_2(false);
				return true;
			}else if(eleID == X3D.room.getId_4()){
				command_wall4 = new ShaderCommand();
				X3D.shader.createBackupShader(command_wall4,eleID,shader);
				X3D.room.setStatus_4(false);
				return true;
			}else if(eleID == X3D.room.getId_5()){
				command_wall5 = new ShaderCommand();
				X3D.shader.createBackupShader(command_wall5,eleID,shader);
				X3D.room.setStatus_5(false);
				return true;
			}
			return false;
		},
		
        deleteElementById:function(id, push){
			if(id != X3D.room.getId_3()){
				var type;
				if(this.checkWalls(id) == true){
					push = false; 
					type = 'wall';
					this.deselectElementById(id);
				}	
				else{
					type = 'nowall';
				}	
				//console.log('ID_L:' + id)
				var element = document.getElementById(id);
				var shader = document.getElementById(shaderPrefix+id);
				var transformer = document.getElementById(X3D.move.getTransformerPrefix()+id);
				if(element.getAttribute("light")=="light"){
					var lighttrans = document.getElementById(lightPrefix+X3D.move.getTransformerPrefix()+id);
					var light = document.getElementById(lightPrefix+id);
					lighttrans.parentNode.removeChild(lighttrans);
					light.parentNode.removeChild(light);
				}
				var mesh = element.getElementsByTagName('mesh')[0];
				var data ;
				var dataObj
				if(mesh != null)data= removeRoute(mesh.getAttribute('src'));
				if(data != null) dataObj = document.getElementById(data);
				if(push){
					X3D.em.publish("data", {
					actionType: "delete", 
					elementId: id
				});
				}
				element.parentNode.removeChild(element);
				if(type != 'wall'){
					if(shader!=null)shader.parentNode.removeChild(shader);
				}	
				//if(dataObj!=null)dataObj.parentNode.removeChild(dataObj);
				if(transformer !=null)transformer.parentNode.removeChild(transformer);
				if(this.contains(lockedElems, id)){
					X3D.items.removeEntryById(id);
					lockedElems.splice(this.indexOfEle(lockedElems,id),1);
				}
			}
			this.resetXml3D();
		},
        /* Deletes selected elements and their dependencies.*/
        deleteElement: function() {
			if(this.deleteElementQueueCheck()){
				while(selectedElems.length>0){
					var ele = selectedElems.pop();
					if(ele.getAttribute("container")==="true"){
						var elements = ele.getElementsByTagName("group");
						var ids=[];
						for(var i =0;i<elements.length;i++){
							ids.push(elements[i].id);
						}
						while(ids.length>0){
							var id = ids.pop();
							this.deleteElementById(id,true);
						}
					}
					this.deleteElementById(ele.id,true);
				}
			}
        },
		deleteElementQueueCheck:function(){
			var isEmpty = X3D.queue.isEmpty();
			if(isEmpty){
				return true;
			} else {
				this.queueNotEmptyDialog();
				return false;
			}
		},
		queueNotEmptyDialog:function(){
			var items = document.getElementById('items');
			var content = document.getElementById('dialogContent');
			X3D.util.deleteAllChilds(content);
			X3D.util.deleteAllChilds(items);
			var text = document.createTextNode("Before you can delete the object, you need to save current changes.  Do you want to continue?");
			items.appendChild(text);
			var button = document.getElementById('submitButton');
			button.setAttribute('onclick','X3D.main.submitQueueNotEmptyDialog();');
			X3D.dia.showDialog();
		},
		submitQueueNotEmptyDialog:function(){
			var backupSelectedElems = [];
			X3D.queue.pushCommandsToP2P();
			X3D.main.deleteElement();
			X3D.main.commitChanges();
			X3D.dia.hm('box');
		},
        /* TODO: deletes a selected element with all its relations / dependencies */
        killElementWithFamily: function(elementId) {
            var element = document.getElementById(elementId);
            element.parentNode.removeChild(element);
        },
        
		/*
			This method is used to detect, if a property already exists.  Can be used by
			oder elements than a shader.
		*/
		checkProperty:function(shader,property){
			var elements = shader.getElementsByTagName("*");
			for(var i =0;i<elements.length;i++){
				if(elements[i].getAttribute("name")===property){
					return true;
				} else {
				}
			}
			return false;
		},
        /* returns true if sarray contains ele, false otherwise */
        contains: function (sarray, ele){
            for (var i = 0; i < sarray.length; i++){
                if(sarray[i] == ele) return true;
            }
            return false;
        },
        
        /* returns the index of ele within sarray, -1 otherwise */
        indexOfEle: function (sarray, ele){
            for (var i = 0; i < sarray.length; i++){
                if(sarray[i] === ele) return i;
            }
            return -1;
        },
		
		/*//Returns whether elements are selected
        elementsAreSelected : function(){
            if(selectedElems.length>0)return true;
                else return false;
        },*/
		//Returns number of selected elements
        lengthSelectedElems : function(){
            return selectedElems.length;
        },
		
        /* changes the shader of the selected elements to the given one.
				DEPRECATED
		*/
        /*changeShader: function (shaderID){
            log.info('Changing Shader of selected Elements');
            var texts = shaderID.split(':');
            var shader = document.getElementById(texts[0]+texts[1]);
            if(!shader) {
                X3D.gen.importGenericDependant(texts[0],texts[1]);
                shader = document.getElementById(texts[0]+texts[1]);
            } else {
                for(var i = 0;i<selectedElems.length;i++){
                    selectedElems[i].setAttribute('oldShader','#'+texts[0]+texts[1]);
                    log.debug('Changing Shader of;'+selectedElems[i].getAttribute('id')+' with shader: '+texts[0]+texts[1]);
                }
            }
            this.resetXml3D();
        },*/

        /* returns true if elements are selected, false otherwise */
        elementsAreSelected : function(){
            return (selectedElems.length > 0);
        },
		isContainer:function(eleID){
			var element = document.getElementById(eleID);
			var container = element.getAttribute("container");
			return (container==="true");
		},
		isChildOfContainer:function(eleID){
			var element = document.getElementById(eleID);
			return this.isContainer(element.parentElement.id);
		},
        selectElementById:function(id){
			var element = document.getElementById(id);
			selectedElems.push(element);
		},
		deselectElementById:function(id){
			var element = document.getElementById(id);
			if(this.contains(selectedElems, element)){
				selectedElems.splice(this.indexOfEle(selectedElems,element),1);
			}
		},
        /* 
			highlights selected elements with a red shader or 
			restores the old one 
			
			Depecrated because of locking.
		
		*/
        selectElement: function(){
            for (var i = 0; i < elems.length; i++){
                var element = elems[i];
                if(this.contains(selectedElems, element)){
                    var elemAttr = element.getAttribute('oldShader');
                    element.setAttribute('shader',elemAttr);
                    element.removeAttribute('oldShader');
                    selectedElems.splice(this.indexOfEle(selectedElems,element),1);
                    this.resetXml3D();
                } else {
                    var redShader = '#redShader'
                    var elemAttr = element.getAttribute('shader');
                    element.setAttribute('shader',redShader);
                    element.setAttribute('oldShader',elemAttr);
                    selectedElems.push(element);
                    this.resetXml3D();
                }
            }
            return this;
        },
        
        /* creates temporary elements to visualize the position of lights */
        toggleLights: function() {
            var lights = document.getElementsByTagName("light");
            log.debug("found lightshader: "+lights.length);
            for (var i = 0; i < lights.length; i++) {
                var l = lights[i];
                var t = l.parentNode.getAttribute("transform").substr(1); // seriously, wtf
                log.debug("light "+i+" has transformer "+t);
                var v = l.getAttribute("visualizer");
                if (v) log.debug("light is visualized");
                var p = this.getTransformerPosition(t);
                log.debug("translation of light: "+p);
                p = p.split(" "); // or t.translation.{x,y,z}
                log.debug("position "+p[0]+", "+p[1]+", "+p[2]);
                if (v == null) {
                    var v = X3D.main.createElementFromGeneric(X3D.gen.getGUID(), "default", "Quadrat", p[0], p[1], p[2]);
                    l.setAttribute("visualizer", v);
                } else {
                    // TODO: Also delete transformer
                    var n = document.getElementById(v);
                    n.parentNode.removeChild(n);
                    l.removeAttribute("visualizer");
                }
            }
        },
        
        
        //Show and Hide the elements found
        resetXml3D: function(){
            var xml3dobj = document.getElementById('MyXml3d');
            xml3dobj.update();
        },
		
		/* 
		Event listener for key events.  Also notifies the X3D.listener.
		*/
        capturekey:function(e){
			if(X3D.dia.active) return true;

            var key=(typeof event!='undefined')?window.event.keyCode:e.keyCode;
            /* in case of rotation, the rotation can be done directly */
            if(key == 82) {
                X3D.main.toggleMode();
            }

            if(key == 81){
                if(mode == rotateRoomModus)
                    mode = allModes[modeIndex];
                else {
                    mode = rotateRoomModus;
					X3D.main.initFreemode();
					}
                log.info('Mode: '+mode);
            }
            
            /* in case of movements, we wait until key goes up */
            if(selectedElems.length===0){
            } else{
                var keyNumber = parseInt(key);
                X3D.main.aggr.tkeydown = new Date().getTime();
                X3D.main.aggr.key = keyNumber;
                if(key < 41 && key >36){
                    // make sure the keydown event is only triggered once
                    log.debug("movement key "+key+" is down (@"+X3D.main.aggr.tkeydown+")");
                    X3D.main.unregisterEvent(document, "keydown", X3D.main.capturekey);
                    X3D.main.registerEvent(document, "keyup", X3D.main.moveAggregator);
                    return false;
                } else if (key == 46) {
                    X3D.main.deleteElement();
                    return false;
                }
            }

			console.log(X3D.listener.getStatus());
            return X3D.listener.handleKeyEvent(e);         
        },
        moveAggregator : function() {
            log.debug("movement key "+X3D.main.aggr.key+" is up (@"+X3D.main.aggr.tkeydown+")");
            var elapsed = new Date().getTime() - X3D.main.aggr.tkeydown;
            var movement = elapsed/1000;
            log.debug("elapsed time is "+elapsed/1000+"s (mov "+movement+")");
            X3D.main.unregisterEvent(document, "keyup", X3D.main.moveAggregator);
            X3D.main.registerEvent(document, "keydown", X3D.main.capturekey);
            X3D.move.moveSelectedObject(X3D.main.aggr.key, movement);
            return false;
        },
		
		

        /* checks whether element is a part of a room */
		checkBuildingElement  : function(eleID){
			if(eleID == X3D.room.getId_1()){
				return true;
			}else if(eleID == X3D.room.getId_2()){
				return true;
			}else if(eleID == X3D.room.getId_3()){
				return true;
			}else if(eleID == X3D.room.getId_4()){
				return true;
			}else if(eleID == X3D.room.getId_5()){
				return true;
			}
			return false;
		},

		
		
		/*
		Returns a copy of an generics template and sets the copy with a new id.
		*/
		copyElementById:function(newEle, oldEle){
			var oldElem = document.getElementById(oldEle);
            var ele = X3D.gen.copyElement(oldElem);
            ele.setAttribute('id',newEle);
            document.getElementById('3dDefs').appendChild(ele);
            return ele;
		},
		/*
		Addes the select listener to an element.
		*/
        addSelectListener:function(element){
            log.info('Adding listener to '+element.getAttribute('id'));
            /*this.on('click',function(){
						
                        X3D.main.getById(element.getAttribute('id')).selectElement();
                    },element);*/
			this.on('contextmenu',function(e){
						lockelid = element.getAttribute('id');
						log.info("Lockelid: "+lockelid);
						if(X3D.main.contains(lockedElems, lockelid)){
							
						}else if(X3D.main.checkForWall()){ X3D.main.wallDialog();
						}else 	{X3D.main.lockDialog();}
						
						return false;
                    },element);
        },
		
		
		checkForWall : function(){
			var id_1 = X3D.room.getId_1();
			var id_2 = X3D.room.getId_2();
			var id_4 = X3D.room.getId_4();
			var id_5 = X3D.room.getId_5(); 
			if(lockelid == id_1 || lockelid == id_2 || lockelid == id_4 || lockelid == id_5)
				return true;
			else
				return false;
		},
		
		wallDialog : function(){
			var items = document.getElementById('items3');
            var content = document.getElementById('dialogContent3');
            X3D.util.deleteAllChilds(content);
            X3D.util.deleteAllChilds(items);
			var label1 = document.createTextNode('Would you like to hide or to lock this wall?');
			content.appendChild(label1);
			var button3 = document.getElementById('hideButton');
			var button4 = document.getElementById('lockButton');
			var button5 = document.getElementById('cancelButton');
			var brs = document.createElement('br');
			content.appendChild(brs);
			button3.setAttribute('onclick','X3D.main.hideWall();');
			button4.setAttribute('onclick','X3D.main.requestLock();X3D.dia.hm(\'box3\');');
			button5.setAttribute('onclick','X3D.dia.hm(\'box3\');');
			X3D.dia.showEmptyDialog();
		},
		hideWall : function(){
			X3D.dia.hm('box3');	
			this.deleteElementById(lockelid,false);
		},
		
		/*
			Dialog for locking of elements 
		*/
		lockDialog : function(){
                var items = document.getElementById('items');
                var content = document.getElementById('dialogContent');
                X3D.util.deleteAllChilds(content);
                X3D.util.deleteAllChilds(items);
				var label = document.createTextNode('Would you like to lock the element in order to edit?');
				content.appendChild(label);
				var button1 = document.getElementById('submitButton');
				button1.setAttribute('onclick','X3D.main.requestLock();');
                X3D.dia.showDialog();	
		},
		requestLock:function(){
				
				log.info("Lockelid: "+lockelid);
				X3D.dia.hm('box');
				X3D.em.publish("data", {
                    actionType: "lockRequest",
                    elementId: lockelid,
                });
				if(testing)this.lockElement(lockelid); //TODO remove this code in production
		},
		commitChanges : function(){
			X3D.queue.pushCommandsToP2P();
			log.info("pushed comands to P2P");
			for(var i =0;i<lockedElems.length;i++){
				this.releaseLock(lockedElems[i]);
			}
			lockedElems.length =0;
			selectedElems.length =0;
			X3D.items.removeAllEntries();
		},
		removeAllChanges : function(){
			X3D.queue.undoAll();
			for(var i =0;i<lockedElems.length;i++){
				this.releaseLock(lockedElems[i]);
			}
			lockedElems = [];
			selectedElems=[];
			X3D.items.removeAllEntries();
		},
		lockElement: function(id){
			if(this.contains(lockedElems, id)){
			}else {
				lockedElems.push(id);
				X3D.items.createEntry(id,false);
				log.info("IsContainer: "+this.isContainer(id));
				if(this.isContainer(id)){
					var element = document.getElementById(id);
					var components = element.getElementsByTagName("group");
					for(var i=0;i<components.length;i++){
						var subele=components[i].id;
						log.info("locking child: "+subele);
						lockedElems.push(subele);
						X3D.items.createEntry(subele,true);
					}
				}
				
				
			}
		},
		releaseLock: function(id){
			X3D.em.publish("data", {
                    actionType: "lockRelease",
                    elementId: id,
                });
		},
        registerEvent : function(element, eventname, callback) {
            element.addEventListener(eventname, callback, false);
        },
        unregisterEvent : function(element, eventname, callback) {
            element.removeEventListener(eventname, callback, false);
        },
		/*
			Dialog for noConnection lock
			ToDO: Aktivieren für ShowCase
		*/
		noConnectionDialog : function(){
            return;
            var items = document.getElementById('items2');
            var content = document.getElementById('dialogContent2');
            X3D.util.deleteAllChilds(content);
            X3D.util.deleteAllChilds(items);
			var label = document.createTextNode('Trying to establish connection...');
			content.appendChild(label);
            content.appendChild(document.createElement("br"));
            content.appendChild(document.createElement("br"));
            var img = document.createElement('img');
            img.setAttribute("src", "media/loading.gif");
            content.appendChild(img);
            X3D.dia.showConnectionDialog();	
		}
		
    }
        

}();


X3D.main.ground ="ground";
/*
 * used for keyup repetition recognition
 */
X3D.main.aggr = {
  tkeydown : null,
  movAggr : null,
  key : null
}
