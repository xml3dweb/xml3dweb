/*
This script is responsible for the whole view. It creates the different default views and 
allows the user to switch between them. Besides it defines the movement direction for the 
objects.

Author: Lukas, Holger
*/

var X3D = X3D ? X3D : new Object();
X3D.view = function() {
	var currentDirection = "yplus";
	var log, logname = "lib/move.js";
	var next_pos = 1;
	var initialized = 0; 
	const shaderPrefix = X3D.main.getShaderPrefix();
	return{
		init:function(){
			 log = X3D.log.get(logname);
		},
		/*
			Enables the setting of the current direction.  Current direction is responsible for deciding how an object can be moved. 
		*/
		setCurrentDirection:function(direction){
			currentDirection = direction;
		},
		getCurrentDirection:function(direction){
			return currentDirection;
		},
		/*Rotation for the adjustment of the default views*/
        doRotation : function(camera, axis, direction, angle){
			var xml3dObj = document.getElementById('MyXml3d');
			var v = xml3dObj.createXML3DVec3();
			var Rotation = xml3dObj.createXML3DRotation();
			if(axis == 'x'){
				v.x = 1;
				v.y = 0;
				v.z = 0;
			} else if (axis == 'y'){
				v.x = 0;
				v.y = 1;
				v.z = 0;
			}
			else{
				v.x = 0;
				v.y = 0;
				v.z = 1;
			}
			if(direction == 0)
				Rotation.setAxisAngle(v, (angle));
			else
				Rotation.setAxisAngle(v, (-angle));
				
			camera.orientation = camera.orientation.multiply(Rotation);
		},
		/*Creates the height for the first default view. This depends on the measures by the room.
		(h = height, a and b are the values for the sides)*/
		calculateZ_c : function(a, b, h){
			if((a*1.75) >= (b*3))
				return ((a-1) * 1.75 + h * 2 + 3);
			else	
				return ((b-1) * 3 + h * 2 + 3);
		},
		/*Creates the distance between room and view position for the second and fourth default view*/
		calculateY_c : function(a, b, h){
			if(a == 0.5){
				return(h * 3 + b);		
			}else if(h == 0.5 && a == 1){
					return(2 + b); 
			}else{
				if(2 * a >= 3 * h)
					return(2 * a + b - 0.5);
				else
					return(3 * h + b - 0.5); 
			}		
		},
		/*Creates the distance between room and view position for the third and fifths default view*/
		calculateX_c : function(a, b, h){
			if(b == 0.5){
				return(h * 3 + a);		
			}else if(h == 0.5 && b == 1){
					return(2 + a); 
			}else{
				if(2 * b >= 3 * h)
					return(2 * b + a - 0.5);
				else
					return(3 * h + a - 0.5); 
			}	
		},
		/*Initialize default views for the createViewDialog*/	
		initializeViews : function (){
			
			var a = X3D.room.geta();
			var b = X3D.room.getb();
			var h = X3D.room.geth();
			var c;
			
			c = document.getElementById('camera_1');
			c.position.x = 0; 
			c.position.y = 0; 
			c.position.z = this.calculateZ_c(a,b,h);
			
			c = document.getElementById('camera_2');
			c.position.x = 0;
			c.position.y = -1 * this.calculateY_c(a,b,h);
			c.position.z = h;
			this.doRotation(c, 'x', 0, 1.570796);
			console.log(c.position.y);
			
			c = document.getElementById('camera_3');
			c.position.x = -1 * this.calculateX_c(a,b,h);
			c.position.y = 0;
			c.position.z = h;	
			this.doRotation(c, 'z', 1, 1.570796);
			this.doRotation(c, 'x', 0, 1.570796);			
			
			
			c = document.getElementById('camera_4');
			c.position.x = 0;
			c.position.y = this.calculateY_c(a,b,h);
			c.position.z = h;
			this.doRotation(c, 'z', 0, 3.141592);
			this.doRotation(c, 'x', 0, 1.570796);
			
			
			c = document.getElementById('camera_5');
			c.position.x = this.calculateX_c(a,b,h);
			c.position.y = 0;
			c.position.z = h;
			this.doRotation(c, 'z', 0, 1.570796);
			this.doRotation(c, 'x', 0, 1.570796);
		},
		/* Dialog which allowes the user to toggle between default views over the view button*/ 
		createViewDialog : function(){	
			var xml3dObj = document.getElementById('MyXml3d');
			var roomCreated = X3D.room.checkForRoom();
			var id = 0;
			
			if(roomCreated == false){
				alert("Erst Raum erstellen!");
			}
			else{
				if(initialized == 0){
					var a = X3D.room.geta();
					var b = X3D.room.getb();
					var h = X3D.room.geth();

					if(a == 0 && b == 0 && h == 0){
						log.info('a und b un h werden initilaisiert');
						var id_5 = X3D.room.getId_5();
						var id_4 = X3D.room.getId_4();
						var trans1 = document.getElementById(X3D.move.getTransformerPrefix() + id_4);
						a = trans1.translation.x;
						var trans2 = document.getElementById(X3D.move.getTransformerPrefix() + id_5);
						b = trans2.translation.y;
						h = trans2.translation.z;
						X3D.room.seta(a);
						X3D.room.setb(b);
						X3D.room.seth(h);
					}
						
					this.initializeViews();
					initialized = 1;
				}
					
				if(next_pos == 1){
					xml3dObj.setAttribute('activeView', '#camera_1');
					this.recreateDeletedWalls();
					X3D.view.setCurrentDirection(X3D.view.yplus);
					next_pos = 2;
				}
				else if(next_pos == 2){
					xml3dObj.setAttribute('activeView', '#camera_2');
					this.recreateDeletedWalls();
					id = X3D.room.getId_1();
					X3D.room.setStatus_1(false);
					X3D.main.deleteElementById(id);
					X3D.view.setCurrentDirection(X3D.view.yplus);
					next_pos = 3;
				}
				else if(next_pos == 3){
					xml3dObj.setAttribute('activeView', '#camera_3');
					this.recreateDeletedWalls();
					id = X3D.room.getId_2();
					X3D.room.setStatus_2(false);
					X3D.main.deleteElementById(id);
					X3D.view.setCurrentDirection(X3D.view.xplus);
					next_pos = 4;
				}
				else if(next_pos == 4){
					xml3dObj.setAttribute('activeView', '#camera_4');
					this.recreateDeletedWalls();
					id = X3D.room.getId_5();
					X3D.room.setStatus_5(false);
					X3D.main.deleteElementById(id);
					X3D.view.setCurrentDirection(X3D.view.yminus);
					next_pos = 5;
				}
				else{
					xml3dObj.setAttribute('activeView', '#camera_5');
					this.recreateDeletedWalls();
					id = X3D.room.getId_4();
					X3D.room.setStatus_4(false);
					X3D.main.deleteElementById(id);
					X3D.view.setCurrentDirection(X3D.view.xminus);
					next_pos = 1;
				}
			}

			X3D.main.resetXml3D();
		},
		/*Recreates deleted walls. The shader of the wall is also recoverd*/
		recreateDeletedWalls : function(){
			var a = X3D.room.geta();
			var b = X3D.room.getb();
			var h = X3D.room.geth();
			
			var shader = '';
			var shaderName = '';
			var id = '';
			
			var transform;
			
			var tmp = X3D.room.getStatus_1();			
			if(tmp == false){
				id = X3D.room.getId_1();
				shaderName = shaderPrefix + id;
				shader = document.getElementById(shaderName);
				var command_wall1 = new ShaderCommand();
				X3D.shader.createBackupShader(command_wall1,id,shader);
				if(shader!=null)shader.parentNode.removeChild(shader);
								
				X3D.room.setStatus_1(true);
				X3D.main.createElementFromGeneric(id,"default","Wand1", 0, -b, h,null,false);
				transform = document.getElementById(document.getElementById(id).getAttribute('transform').substring(1));
				X3D.room.scaleRotateWall_f(transform);
				command_wall1.undo();
			}
			tmp = X3D.room.getStatus_2();
			if(tmp == false){
				id = X3D.room.getId_2();
				shaderName = shaderPrefix + id;
				shader = document.getElementById(shaderName);
				var command_wall2 = new ShaderCommand();
				X3D.shader.createBackupShader(command_wall2,id,shader);
				if(shader!=null)shader.parentNode.removeChild(shader);
								
				X3D.room.setStatus_2(true);	
				X3D.main.createElementFromGeneric(id,"default","Wand2", -a, 0, h);
				transform = document.getElementById(document.getElementById(id).getAttribute('transform').substring(1));
				X3D.room.scaleRotateWall_s(transform);
				command_wall2.undo();
			}
			tmp = X3D.room.getStatus_4();
			if(tmp == false){
				id = X3D.room.getId_4();
				shaderName = shaderPrefix + id;
				shader = document.getElementById(shaderName);
				var command_wall4 = new ShaderCommand();
				X3D.shader.createBackupShader(command_wall4,id,shader);
				if(shader!=null)shader.parentNode.removeChild(shader);
				
				X3D.room.setStatus_4(true);
				X3D.main.createElementFromGeneric(id,"default","Wand4", a, 0, h);
				transform = document.getElementById(document.getElementById(id).getAttribute('transform').substring(1));
				X3D.room.scaleRotateWall_s(transform);
				command_wall4.undo();
			}
			tmp = X3D.room.getStatus_5();
			if(tmp == false){
				id = X3D.room.getId_5();
				shaderName = shaderPrefix + id;
				shader = document.getElementById(shaderName);
				var command_wall5 = new ShaderCommand();
				X3D.shader.createBackupShader(command_wall5,id,shader);
				if(shader!=null)shader.parentNode.removeChild(shader);
				
				X3D.room.setStatus_5(true);	
				X3D.main.createElementFromGeneric(id,"default","Wand5", 0, b, h);
				transform = document.getElementById(document.getElementById(id).getAttribute('transform').substring(1));	
				X3D.room.scaleRotateWall_f(transform);
				command_wall5.undo();
			}
		},
	}
}();
/*
These are the constants needed to define the various possible directions
*/
X3D.view.yplus ="yplus";
X3D.view.xminus = "xminus";
X3D.view.yminus = "yminus";
X3D.view.xplus = "xplus";

/*
These are the constants to define the xml3d object class
*/
X3D.view.ground = "ground";
X3D.view.wall = "wall";
X3D.view.light = "light";
X3D.view.onwall = "onwall";