/*
 * movement methods
 * authors: holger, simon, lukas
 */
var X3D = X3D ? X3D : new Object();
X3D.move = function() {
	const transformerPrefix = 'transe_';
	var log, logname = "lib/move.js";
	var planeModus = 'plane';
    var rotateModus = 'rotate';
    var roomModus = 'room';
    var rotateRoomModus = 'rotateRoom';
	return{
		init : function(){
			 log = X3D.log.get(logname);
		},
		getTransformerPrefix : function(){
			return transformerPrefix;
		},
        /* checks if a given transformer exists and creates a new one if not */
        checkOrCreateTransformer:function(element){
                log.info("element: "+element);
                var transform = element.getAttribute('transform');
                var elemId = element.getAttribute('id');
                var transformerName = transformerPrefix+elemId;
                if(transform === '#'+transformerName){

                } else if(transform != null && transform.length>0){
                    //log.info('Copying Transformer');
                    this.copyTransformer(transformerName,removeRoute(transform));
                    element.setAttribute('transform','#'+transformerName);
                } else{
                    //log.info('Creating Transformer');
                    this.createTransformer(transformerName);
                    element.setAttribute('transform','#'+transformerName);
                }
				X3D.main.resetXml3D();
                return transformerName;
        },
		/*Returns the translation of a transformer*/
        getTransformerPosition: function(transf) {
            var t = document.getElementById(transf);
            log.debug("trans "+t);
            if (!t) return null;
            else return t.getAttribute("translation");
        },
		/*
			Return the current direction, depending on the keynumber
			pressed and the current perspective.  For reference:
			37: left arrow
			38: up arrow
			39: right arrow
			40: down arrow
		*/
		getDirection:function(keyNumber){
			currentDirection = X3D.view.getCurrentDirection();
			console.log("KeyNumber: "+keyNumber+" CurrectDirection: "+currentDirection);
			if(currentDirection === X3D.view.xminus){
				switch(keyNumber){
					case 37:
					return "down";
					case 38:
					return "left";
					case 39:
					return "up";
					case 40:
					return "right";
				}
			}
			if(currentDirection === X3D.view.yplus){
				switch(keyNumber){
					case 37:
					return "left";
					case 38:
					return "up";
					case 39:
					return "right";
					case 40:
					return "down";
				}
			}
			if(currentDirection === X3D.view.yminus){
				switch(keyNumber){
					case 37:
					return "right";
					case 38:
					return "down";
					case 39:
					return "left";
					case 40:
					return "up";
				}
			}
			if(currentDirection === X3D.view.xplus){
				switch(keyNumber){
					case 37:
					return "up";
					case 38:
					return "right";
					case 39:
					return "down";
					case 40:
					return "left";
				}
			}
		},
		addValuesToCommand:function(command,id,property,value){
			command.newIds.push(id);
			command.newFields.push(property);
			command.newValues.push(value);
			command.oldIds.push(id);
			command.oldFields.push(property);
			command.oldValues.push(-value);
			command.log = log;
			return command;
		},
		/*
			Depending on mode and the key pressed, all selected elements either move or rotate a certain way.
		*/
        moveSelectedObject : function(key, movement) {
			var keyNumber =parseInt(key);
			var commands = [];
			var direction = this.getDirection(keyNumber);
            if (direction == null) {
                log.error("unknown direction, canceling movement");
                return;
            }
			var mode = X3D.main.getMode();
			var selectedElems=X3D.main.getSelectedElems();
            for(var i = 0;i<selectedElems.length;i++){
				log.info("Number selected elems"+selectedElems.length);
                var element = selectedElems[i];
				var elementType = element.getAttribute("type");
				this.checkOrCreateTransformer(element);
				var elementId = element.getAttribute("id");

                /* room elements must not be moved */
				if(X3D.main.checkBuildingElement(elementId) || X3D.main.isChildOfContainer(elementId))
					continue;
                switch(direction){
                    case "left": {
                        if (mode === planeModus || mode === roomModus) {
							var command = this.addValuesToCommand(new TranslationCommand(),elementId,"x",-movement);
							commands.push(command);
						}
						else if (mode === rotateModus){
							var command = this.createRotateCommand(elementId,"z",-1.57);
							log.info("Number of elements in command: "+command.newIds.length);
							commands.push(command);
						}
                        break;
                    }
                    case "up": {
						if(mode===planeModus){
							var command = this.addValuesToCommand(new TranslationCommand(),elementId,"y",movement);
							commands.push(command);
						}
                        else if(mode===roomModus && elementType != X3D.main.ground){
							var command = this.addValuesToCommand(new TranslationCommand(),elementId,"z",movement);
							commands.push(command);
						}
                        else if (mode ===rotateModus && elementType != X3D.main.ground){
							var command = this.createRotateCommand(elementId,"x",1.57);
							log.info("Number of elements in command: "+command.newIds.length);
							commands.push(command);
						}
                        break;
                    }
                    case "right": {
                        //transformer.translation.x += 0.1;
                        if(mode===planeModus||mode===roomModus){
							var command = this.addValuesToCommand(new TranslationCommand(),elementId,"x",movement);
							commands.push(command);
						}
						else if (mode ===rotateModus){
							var command = this.createRotateCommand(elementId,"z",1.57);
							log.info("Number of elements in command: "+command.newIds.length);
							commands.push(command);
						}
                        break;
                    }
                    case "down":{ //down
						if(mode===planeModus){
							var command = this.addValuesToCommand(new TranslationCommand(),elementId,"y",-movement);
							commands.push(command);
						}
                        else if(mode===roomModus && elementType != X3D.main.ground){
							var command = this.addValuesToCommand(new TranslationCommand(),elementId,"z",-movement);
							commands.push(command);
						}
                        else if (mode ===rotateModus && elementType != X3D.main.ground){
							var command = this.createRotateCommand(elementId,"x",-1.57);
							log.info("Number of elements in command: "+command.newIds.length);
							commands.push(command);
						}
                        break;
                    }
                }
            }
			X3D.queue.pushMultipleCommands(commands);
            X3D.main.resetXml3D();
        },
		createRotateCommand:function(elementId,property,value){
			log.info("Creating rotate command");
			var transformer = document.getElementById(transformerPrefix+elementId);
			var oldRotate=this.getRotateAsString(transformer);
			var command =new RotateCommand();
			this.addValuesToCommand(command,elementId,property,value);
			command.execute();
			var newRotate=this.getRotateAsString(transformer);
			command =new RotateCommand();
			command.newIds.push(elementId);
			command.newFields.push("abs");
			command.newValues.push(newRotate);
			command.oldIds.push(elementId);
			command.oldFields.push("abs");
			command.oldValues.push(oldRotate);
			command.log = log;
			log.info("returning command");
			return command;

		},
		checkTranslationBoundaries:function(eleID,property,value){
			var x =X3D.room.geta();
			var y = X3D.room.getb();
			value = parseFloat(value);
			value-=0.005;
			if(x==0 || y==0)return value;
			x = parseFloat(x);
			y = parseFloat(y);

			var transe = document.getElementById(transformerPrefix+eleID);
			if (property == 'y'){
				var curY = parseFloat(transe.translation.y);
				log.info("Checking Boundaries, x: "+x+" y: "+y+" value: "+value+" curY: "+curY);
				if((curY + value)> y){
					var difference = y - curY;
					return difference;
					if(difference<0)return 0.0;
					else return difference;
				}
				else if((curY + value)< -y){
					var difference = curY-(-y);
					difference= -difference;
					if(difference>0)return 0.0;
					else return difference;
				}
			}else if (property=='x'){
				var curX = parseFloat(transe.translation.x);
				log.info("Checking Boundaries, x: "+x+" y: "+y+" value: "+value+" curX: "+curX);
				if((curX + value)> x){
					var difference = x - curX;
					if(difference<0)return 0.0;
					else return difference;
				}
				else if((curX + value)< -x){
					var difference = curX-(-x);
					difference= -difference;
					if(difference>0)return 0.0;
					else return difference;
				}
			}
			return value;
		},
		/*
			Entry method to change the translation of an object.
			Parameters:
			* elemid: Id of the group element to be changed
			* property: x,y,z
			* value: number by which the property is to be changed.
		*/
		changeTransformerTranslation:function(elemid, property,value){
			value = parseFloat(value);
			value = this.checkTranslationBoundaries(elemid,property,value);
			if(value!=0.0){
				var transformerId = transformerPrefix+elemid;
				var transformer = document.getElementById(transformerId);
				//log.info("translation before: "+transformer.translation.x);
				if(property === "x"){
					transformer.translation.x +=value;
				} else if(property === "y"){
					transformer.translation.y +=value;
				} else if(property === "z"){
					transformer.translation.z +=value;
				}
				transformerId = X3D.main.getLightPrefix()+transformerPrefix+elemid;
				transformer = document.getElementById(transformerId);
				if(transformer != null){
					if(property === "x"){
						transformer.translation.x +=value;
					} else if(property === "y"){
						transformer.translation.y +=value;
					} else if(property === "z"){
						transformer.translation.z +=value;
					}
				}
				X3D.main.resetXml3D();
			}
			//log.info("translation after: "+transformer.translation.x);
		},
		/* Method depricated
		*/
        changeTransformerTranslationX:function(transformer,value){
			value = parseFloat(value);
            transformer.translation.x += value;

        },
		/* Method depricated
		*/
        changeTransformerTranslationY:function(transformer,value){
			value = parseFloat(value);
            transformer.translation.y += value;
        },
		/* Method depricated
		*/
        changeTransformerTranslationZ:function(transformer,value){
			value = parseFloat(value);
            transformer.translation.z += value;
        },

		/*
			Entry Method to change rotation of an object.
			Paramters:
			elemid: ID of the group element
			Property: y,x,z depending on the direction
			value: the radian of the rotation
		*/
		changeTransformerRotation:function(elemid, property,value){
			var transformerId = transformerPrefix+elemid;
			var transformer = document.getElementById(transformerId);
			if(property === "abs"){
				transformer.setAttribute("rotation",value);
			} else if(property === "x"){
				this.rotateX(transformer,value);
			} else if(property === "y"){
				this.rotateY(transformer,value);
			} else if(property === "z"){
				this.rotateZ(transformer,value);
			}
			X3D.main.resetXml3D();
		},
		getRotateAsString:function(transformerEle){
			//var rot = transformerEle.rotate;
			var rot =""+transformerEle.rotation.axis.x+" "+transformerEle.rotation.axis.y+" "+transformerEle.rotation.axis.z+" "+transformerEle.rotation.angle;
			log.info("Rotation as string: "+rot);
			return rot;
		},
        rotateZ : function(transformer,radian){
			log.info("rotating z: "+radian);
			var rotate = X3D.util.createRotate(0,0,1,radian);
			log.info("Rotate: "+rotate.axis.x+" radian: "+rotate.angle);
            transformer.rotation = transformer.rotation.multiply(rotate);
        },
        rotateX : function(transformer,radian){
			log.info("rotating x: "+radian);
            var rotate = X3D.util.createRotate(1,0,0,radian);
			log.info("Rotate: "+rotate.axis.x+" radian: "+rotate.angle);
            transformer.rotation = transformer.rotation.multiply(rotate);
        },
        rotateY : function(transformer,radian){
			log.info("rotating y: "+radian);
            var rotate = X3D.util.createRotate(0,1,0,radian);
			log.info("Rotate: "+rotate.axis.x+" radian: "+rotate.angle);
            transformer.rotation = transformer.rotation.multiply(rotate);
        },
		/*
			Creates a default transformer in case an object doesn'T have one yet.
		*/
        createTransformer:function(name){
            if(document.getElementById(name)){
            } else {
                this.createTransformerAtPos(name, 0,0,0);
            }
        },
		/*
		Creates a transformer with a with a given translation.
		*/
        createTransformerAtPos:function(id, x, y, z){
            if(document.getElementById(name)){
            } else {
                var transformer = document.createElementNS(X3D.main.getNS(),'transform');
                transformer.setAttribute('id',id);
                transformer.setAttribute('translation',x+' '+y+' '+z);
                transformer.setAttribute('scale',1+' '+1+' '+1);
                transformer.setAttribute('rotation',0+' '+0+' '+0+' '+0);
                document.getElementById('3dDefs').appendChild(transformer);
                X3D.main.resetXml3D();
                log.info('Transformer Created: '+document.getElementById(id).getAttribute('id'));
            }
        },
		/*
			Returns a copy of a transformer with new id.
		*/
        copyTransformer:function(newTransformer,oldTransformer){
            return this.copyElementById(newTransformer,oldTransformer);
        },

	}
}();
