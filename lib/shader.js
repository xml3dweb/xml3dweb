/*
	Script: shader.js
	Author: Holger
	Description: This script is responsible for handling Shader Methods and properties.  
	It receives calls from the UI and Communication Layer
*/
var X3D = X3D ? X3D : new Object();
X3D.shader = function() {
	const shaderPrefix = 'shader_';
	var log, logname = "lib/shader.js";
	const NS_XML3D = 'http://www.xml3d.org/2009/xml3d';
	return {
		init: function(statusel) {
            log = X3D.log.get(logname);
            log.info("initialized"); 
        },
		/*
			Method adds all default values to a shader.  This is needed so that the undo function 
			works.  Otherwise values that are newly created cannot be undone as only a backup is created.
		*/
		addDefaultValues:function(shader){
			if(!X3D.main.checkProperty(shader,"diffuseColor"))this.addFieldShader(shader,"diffuseColor",'float3',"1 1 1");
			if(!X3D.main.checkProperty(shader,"emissionColor"))this.addFieldShader(shader,"emissionColor",'float3',"0 0 0");
			if(!X3D.main.checkProperty(shader,"ambientColor"))this.addFieldShader(shader,"ambientColor",'float3',"0 0 0");
			if(!X3D.main.checkProperty(shader,"specularColor"))this.addFieldShader(shader,"specularColor",'float3',"0 0 0");
			if(!X3D.main.checkProperty(shader,"shininess"))this.addFieldShader(shader,"shininess",'float',"0.2");
			if(!X3D.main.checkProperty(shader,"transparency"))this.addFieldShader(shader,"transparency",'float',"0");
			if(!X3D.main.checkProperty(shader,"reflectionColor"))this.addFieldShader(shader,"reflectionColor",'float3',"0 0 0");
			if(!X3D.main.checkProperty(shader,"castShadow"))this.addFieldShader(shader,"castShadow",'int',"1");
		},
		/*Checks if an element has its own shader.  Otherwise the linked shader of the element is copied.  
		If the element does not have one, an empty shader is created.*/
        testShader:function(element){
            //log.info("element: "+element);
            var shader = element.getAttribute('shader');
            var oldShader = element.getAttribute('oldShader');
            var elemId = element.getAttribute('id');
            var shaderName = shaderPrefix+elemId;
            if(shader === '#'+shaderName){    
            
            } else if(oldShader === '#'+shaderName){
            
            } else if(oldShader != null && shader.length>0){
                //log.info('Copying Old Shader');
                var newShader = this.copyShader(shaderName,removeRoute(oldShader));
				this.addDefaultValues(newShader);
                element.setAttribute('oldShader','#'+shaderName);
                X3D.main.resetXml3D();
            } else if(shader != null && shader.length>0){
                //log.info('Copying Shader');
                var newShader = this.copyShader(shaderName,removeRoute(shader));
				this.addDefaultValues(newShader);
                element.setAttribute('shader','#'+shaderName);
                X3D.main.resetXml3D();
            } else{
                //log.info('Creating Shader');
                var newShader = this.createShader(shaderName);
				this.addDefaultValues(newShader);
                element.setAttribute('shader','#'+shaderName);
                X3D.main.resetXml3D();
            }
            return shaderName;
        },
		/* main function to change a shader.  It is able to handle 
		all properties specified in specification of urn:xml3d:shader:phong. Parameters:
			eleID: XML3D element which is using the shader
			fieldname: Property to be changed
			value: either the direkt value of the prefix and id of the generics database
		*/
        changeShader2:function(eleID,fieldname,value){
            //log.info(this.testShader(document.getElementById(eleID))+' id: '+shaderPrefix+eleID);
            var shader = document.getElementById(shaderPrefix+eleID);
            //log.debug('Shader: '+shader.getAttribute('id'));

            /* shader example:
             *
             * <shader id="Material.001" script="urn:xml3d:shader:phong">
             *   <float name="ambientIntensity">0.0</float>
             *   <float3 name="diffuseColor">1.000000 1.000000 0.800000</float3>
             *   <float3 name="specularColor">0.500000 0.500000 0.500000</float3>
             *   <float name="shininess">0.0978473581213</float>
             * </shader>
             */

            /* the synchronisation does not quite work yet, because our JSON
             * data format does not support adding such nodes: we do not have
             * the possibility to set the "name" attribute when updating using
             * mode 2 (which is, updating child nodes). this needs to be fixed!
             *
             * fixing it might turn out to be quite easy by adding another
             * field, but we might also go for another JSON format (I would
             * rather opt for that.)
             *
             * also, we might need another message type like "updateOrCreate",
             * since i am not sure whether all clients will have the required
             * data nodes that will be updated.
             *
             * --simon
			 * Solved
			 * --holger
             */
            switch(fieldname){
                case 'diffuseColor':
                case 'specularColor':
                case 'emissionColor':
                case 'ambientColor':
                case 'reflectionColor':
                this.addFieldShader(shader, fieldname, 'float3',value);
                break;
				
                case 'ambientIntensity':
                case 'shininess':
                case 'transparency':
                this.addFieldShader(shader,fieldname,'float',value);
                break;
				
                case 'texture':
                this.addNewTexture(shader,value);
                break;
				
                case 'castShadow':
                this.addFieldShader(shader,fieldname,'int',value);
                break
            }
        },
		/* Creates xml to be inserted into the shader, depending on the parameters. Parameters:
			shader: shader element to be changed
			fieldname: property of shader to be changed
			fieldtype: tagname of the xml element
			value: direct value or generics id

            XXX: What happens if there are multiple elements named $fieldname?
			Answer: Each shader can only habe one element of $fieldname.
		*/
        addFieldShader:function(shader,fieldname,fieldtype,value){
            log.debug('adding folowing to shade'+shader.getAttribute('id')+' fieldname: '+fieldname+' fieldtype: '+fieldtype+' value: '+value);
            var field = document.createElementNS(NS_XML3D,fieldtype);
            field.setAttribute('name',fieldname);
            var textNode = document.createTextNode(value);
            field.appendChild(textNode);
            var elements = shader.getElementsByTagName(fieldtype);
            for(var i =0;i<elements.length;i++){
                if(elements[i].getAttribute('name')===fieldname){
                    shader.removeChild(elements[i]);
                    break;
                } 
            }
            shader.appendChild(field);
			X3D.main.resetXml3D();
        },
		/*
		Retrieves the texture template from generics and copies it. 
		The texture element is appended to the shader. Parameters:
			shader: shader element where changes are made
			value: the generics id of the texture template.
		*/
        addNewTexture:function(shader,value){
			log.info("Adding new texture: "+value);
			log.info("Adding new texture: "+value);
			if(value =="notexture"){
				var texture =shader.getElementsByTagName('texture');
				for(var i =0;i<texture.length;i++){
					shader.removeChild(texture[i]);
				}
				log.info("Removed Texture");
			}else{
				var texture =shader.getElementsByTagName('texture');
				log.info('Length: '+texture.length);
				var text = value.split(':');
				var origTexture = X3D.gen.searchElement(text[0],text[1]);
				var newTexture = X3D.gen.copyElement(origTexture);
				newTexture.removeAttribute('id');
				newTexture.setAttribute("genericstag",value);
				
				for(var i =0;i<texture.length;i++){
					shader.removeChild(texture[i]);
				}
				shader.appendChild(newTexture);
			}
            X3D.main.resetXml3D();
        },
		/*
		The main method to be called from the ui to change a texture.  Parameters:
			textureID: generics id of the texture template
		*/
        changeTexture:function(textureID){
			var selectedElems=X3D.main.getSelectedElems();
			var commands = [];
            for(var i = 0;i<selectedElems.length;i++){
				var command = new ShaderCommand();
				var id = selectedElems[i].getAttribute('id');
				command.newIds.push(id);
				command.newFields.push('texture');
				command.newValues.push(textureID);
                //this.changeShader2(id,'texture',textureID);
                log.info('Changing Textire of:'+selectedElems[i].getAttribute('id')+' Texture: '+textureID);
				commands.push(command);
				var shader = X3D.shader.findShaderElementId(id);
				this.createBackupShader(command,id,shader);
			} 
			X3D.queue.pushMultipleCommands(commands);
			
        },
		createBackupShader:function(command,id,shader){
			var elements = shader.getElementsByTagName("*");
			log.info("Length: "+elements.length);
			var hasTexture = false;
			command.log = log;
			for(var i = 0;i<elements.length;i++){
				if(elements[i].tagName =="texture" || elements[i].tagName =="img"){
					if(elements[i].tagName =="texture"){
						command.oldIds.push(id);
						command.oldFields.push("texture");
						command.oldValues.push(elements[i].getAttribute("genericstag"));
					}
					log.info("Shader has texture:"+elements[i].getAttribute("genericstag"));
					hasTexture = true;
					continue;
				}
				//if(elements[i].getAttribute("name") === 'diffuseColor'){
					//X3D.main.changeShader2(id,'diffuseColor', elements[i].firstChild.value);
					log.info("Elementtag: "+elements[i].tagName+"Value "+i+elements[i].firstChild.nodeValue);
					command.oldIds.push(id);
					command.oldFields.push(elements[i].getAttribute("name"));
					command.oldValues.push(elements[i].firstChild.nodeValue);
					
				//}
				
			}
			if(hasTexture){
				
			}else{
				command.oldIds.push(id);
				command.oldFields.push("texture");
				command.oldValues.push("notexture");
			}
			
		},
		/*	
		The main method to be called from the ui to change a color of selected elements by direct values.
		*/
        changeColorValue:function(transparency,r,g,b){
			var selectedElems=X3D.main.getSelectedElems();
			//var execFunctions =[];
			var command = new ShaderCommand();
            for(var i = 0;i<selectedElems.length;i++){
				
				var elem = selectedElems[i].getAttribute('id');
				log.info('test'+elem);
				command.newIds.push(elem);
				command.newFields.push('transparency');
				command.newValues.push(transparency);
				command.newIds.push(elem);
				command.newFields.push('diffuseColor');
				command.newValues.push(X3D.util.convertRgbToFloat(r,g,b));
				var shader = X3D.shader.findShaderElementId(elem);
				this.createBackupShader(command,elem,shader);
				
            }
			
			X3D.queue.pushCustomCommand(command);
        },
		
		/*	
		The main method to be called from the ui to change a color of selected elements by reference of generics color id.
		*/
        changeColor:function(color/*colorId*/){
			convertedColor = X3D.color.convertColor(color);
			var selectedElems=X3D.main.getSelectedElems();
			var command = new ShaderCommand();
			for(var i = 0;i<selectedElems.length;i++){
				var elem = selectedElems[i].getAttribute('id');
				var shader = X3D.shader.findShaderElementId(elem);
				//this.changeShader2(elem,'diffuseColor',convertedColor);
				command.newIds.push(elem);
				command.newFields.push("diffuseColor");
				command.newValues.push(convertedColor);
				this.createBackupShader(command,elem,shader);
			}
			X3D.queue.pushCustomCommand(command);
			//X3D.shader.changeShader2(id_3, 'diffuseColor', X3D.color.convertColor(fc));
			
			/*var selectedElems=X3D.main.getSelectedElems();		
            var text = colorId.split(':');
            var origElem = X3D.gen.searchElement(text[0],text[1]);
            var colorElem = X3D.gen.copyElement(origElem);
            log.info('ColorElem: '+colorElem+ ' NodeType: '+colorElem.nodeTyoe);*
			var command = new ShaderCommand();
            for(var i = 0;i<selectedElems.length;i++){
				var elem = selectedElems[i].getAttribute('id');
				var shader = X3D.shader.findShaderElementId(elem);
				
                var children = colorElem.getElementsByTagName('*');
                for(var j =0;j<children.length;j++){
                    log.info('node: '+children[j].tagName+' nodeType: '+children[j].nodeType);
                    if(children[j].nodeType === 1){
                        log.info(children[j].getAttribute('name'));
						command.newIds.push(elem);
						command.newFields.push(children[j].getAttribute('name'));
						command.newValues.push(children[j].firstChild.nodeValue);
                        //this.changeShader2(selectedElems[i].getAttribute('id'),children[j].getAttribute('name'),children[j].firstChild.nodeValue);
                    }
					
                }
				this.createBackupShader(command,elem,shader);
				
            }
			X3D.queue.pushCustomCommand(command);*/
        },
		/*
		Returns the shader of an selected element depeding on the 
		position of the array of selected elements.
		*/
        findShader:function(pos){
			var selectedElems=X3D.main.getSelectedElems();
            if(pos<selectedElems.length){
                var shaderId = shaderPrefix+selectedElems[pos].getAttribute('id');
                return document.getElementById(shaderId);
            }
        },
        /*
		Returns the shader of an selected element depeding on the 
		position of the array of selected elements.
		*/
        findShaderElementId:function(id){
                var shaderId = shaderPrefix+id;
                return document.getElementById(shaderId);
        },
		/*
		Creates a default shader which resembles the blue shader.
		*/
        createShader:function(name){
            if(document.getElementById(name)){
            } else {
                var shader = document.createElementNS(NS_XML3D,'shader');
                shader.setAttribute('id',name);
                shader.setAttribute('script','urn:xml3d:shader:phong');
                var floatEle = document.createElementNS(NS_XML3D,'float3');
                floatEle.setAttribute('name','diffuseColor');
                var floatText = document.createTextNode("0.0 0.0 1.0");
                floatEle.appendChild(floatText);
                var floatEle2 = document.createElementNS(NS_XML3D,'float');
                floatText = document.createTextNode("1.0");
                floatEle2.setAttribute('name','ambientIntensity');
                floatEle2.appendChild(floatText);
                shader.appendChild(floatEle);
                shader.appendChild(floatEle2);
				document.getElementById('3dDefs').appendChild(shader);
                X3D.main.resetXml3D();
                log.info('Shader Created: '+document.getElementById(name).getAttribute('id'));
				return shader;
            }
        },
		
		
		/*
			returns a copy of a  with new id.
		*/
        copyShader:function(newShader,oldShader){
            return this.copyElementById(newShader,oldShader);
        },
	};
}();