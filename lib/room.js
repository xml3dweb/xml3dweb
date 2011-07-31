/*
This script is responsible for the whole room creation. 

Author: Lukas
*/

var X3D = X3D ? X3D : new Object();
X3D.room = function(){
	var a = 0;
    var b = 0;
    var h = 0;
	var id_1;
	var id_2;
	var id_3;
	var id_4;
	var id_5;
	var status_1;
	var status_2;
	var status_3;
	var status_4;
	var status_5;
	var roomCreated = false;
	return {
		/*Set method to set the size for room side a*/
		seta : function(an){
			a =  an;
		},
		/*Set method to set the size for room side b*/
		setb : function(bn){
			b = bn;
		},
		/*Set method to set the size for room height h*/
		seth : function(hn){
			h = hn;
		},
		/*Get method to get the size of room side a*/
        geta : function(){
			return a;
		},
		/*Get method to get the size of room side b*/
		getb : function(){
			return b;
		},
		/*Get method to get the size of room height h*/
		geth : function(){
			return h;
		},
		/*Get method to return the id number of wall 1*/
		getId_1 : function(){
			return id_1;
		},
		/*Get method to return the id number of wall 2*/
		getId_2 : function(){
			return id_2;
		},
		/*Get method to return the id number of wall 3*/
		getId_3 : function(){
			return id_3;
		},
		/*Get method to return the id number of wall 4*/
		getId_4 : function(){
			return id_4;
		},
		/*Get method to return the id number of wall 5*/
		getId_5 : function(){
			return id_5;
		},
		/*Get method for the status of wall 1. Status can be 'Wall deleted' (false) or 'Wall exists'(true)*/
		getStatus_1 : function(){
			return status_1;
		},
		/*Get method for the status of wall 2. Status can be 'Wall deleted' (false) or 'Wall exists'(true)*/
		getStatus_2 : function(){
			return status_2;
		},
		/*Get method for the status of wall 3. Status can be 'Wall deleted' (false) or 'Wall exists'(true)*/
		getStatus_3 : function(){
			return status_3;
		},
		/*Get method for the status of wall 4. Status can be 'Wall deleted' (false) or 'Wall exists'(true)*/
		getStatus_4 : function(){
			return status_4;
		},
		/*Get method for the status of wall 5. Status can be 'Wall deleted' (false) or 'Wall exists'(true)*/
		getStatus_5 : function(){
			return status_5;
		},
		/*Set method to change the status of wall 1. Through the creation of wall 1 the status is set 
		  automatically to true. If wall 1 is deleted the status is set to false. If wall 1 is 
		  recreated the status is set to true again.*/
		setStatus_1 : function(status){
			status_1 = status;
		},
		/*Set method to change the status of wall 2. Through the creation of wall 2 the status is set 
		  automatically to true. If wall 2 is deleted the status is set to false. If wall 2 is 
		  recreated the status is set to true again.*/
		setStatus_2 : function(status){
			status_2 = status;
		},
		/*Set method to change the status of wall 3. Through the creation of wall 3 the status is set 
		  automatically to true. If wall 3 is deleted the status is set to false. If wall 3 is 
		  recreated the status is set to true again.*/
		setStatus_3 : function(status){
			status_3 = status;
		},
		/*Set method to change the status of wall 4. Through the creation of wall 4 the status is set 
		  automatically to true. If wall 4 is deleted the status is set to false. If wall 4 is 
		  recreated the status is set to true again.*/
		setStatus_4 : function(status){
			status_4 = status;
		},
		/*Set method to change the status of wall 5. Through the creation of wall 5 the status is set 
		  automatically to true. If wall 5 is deleted the status is set to false. If wall 5 is 
		  recreated the status is set to true again.*/
		setStatus_5 : function(status){
			status_5 = status;
		},
		/*Rotation method which is needed for the room creation.
		  axis: Axis for the rotation (x, y, z). In this case no z rotation is needed.
		  transformer: Every xml3D object has an transformer which allows to manipulate the object.
					   Through the transformer you can realize the rotation.*/
        doRotation : function(axis, transformer){
            var xml3dObj = document.getElementById('MyXml3d');
            var v = xml3dObj.createXML3DVec3();
            var Rotation = xml3dObj.createXML3DRotation();
            if(axis == 'x'){
                v.x = 1;
                v.y = 0;
                v.z = 0;
            } else {
                v.x = 0;
                v.y = 1;
                v.z = 0;
            }            
            Rotation.setAxisAngle(v, 1.570796);    
            transformer.rotation = transformer.rotation.multiply(Rotation);
        },
		/*Scales the ground wall (floor). For further information see method createRoom.*/
		scaleWall_g : function(transform){
			transform.scale.x = a;
			transform.scale.y = b;
		},
		/*Scales and rotatea the front wall and the back wall. For further information see method createRoom.*/
		scaleRotateWall_f : function(transform){
			transform.scale.x = a;
			transform.scale.y = h;
			X3D.room.doRotation('x', transform);
		},
		/*Scales and rotates the walls on the sides (left and right). For further information see method createRoom.*/
		scaleRotateWall_s : function(transform){
			transform.scale.x = h;
			transform.scale.y = b;
			X3D.room.doRotation('y', transform);
		},
		/*Pushes the all information (Exception is color) of the created wall to other users.*/
		pushWall : function(guid, x, y, z, type, rot, sc){
			X3D.em.publish("data", {
            actionType: "creation",
			parentId: "",
            elementId: guid,
            groupId: 'default',
            genericId: type,
            translation: x+" "+y+" "+z,
            rotation: rot,
            scale: sc
            });			
		},
		/*Pushes the chosen color of the walls or the floor to other users.*/
		pushColor : function(id, values){
				X3D.em.publish("data", {
                    actionType: "update",
                    updateType: "shader",
                    elementId: id,
                    fieldName: 'diffuseColor',
                    value: values
                });	
		},
		/*Check whether a room has been created or not. It is not allowed two create several rooms in one session.*/
		checkForRoom : function(){
			return roomCreated;
		},
		/*Pushes the default light to other users after the properties of the room have been pushed.*/
		pushLight : function(guid,x,y,z){
			X3D.em.publish("data", {
                    actionType: "creation",
					parentId: "",
                    elementId: guid,
                    groupId: 'default',
                    genericId: 'Licht',
                    translation: x+" "+y+" "+z,
                    rotation: "",
                    scale: ""
                    });	
		},
		/*Checks whether an element is a wall or not. This method is used to check incoming objects.
		  If an object is an wall --> another user has created a room.*/
		checkForWalls : function(id, type){
			roomCreated = true;
			if(type.substring(0, type.length-1) == 'Wand'){
				var number = type.substring(type.length-1, type.length);			
				if(number == '1'){
					status_1 = true;
					id_1 = id;
				}
				else if(number == '2'){
					status_2 = true;
					id_2 = id;
				}
				else if(number == '3'){
					status_3 = true;
					id_3 = id;
				}
				else if(number == '4'){
					status_4 = true;
					id_4 = id;
				}
				else if(number == '5'){
					status_5 = true;
					id_5 = id;
				}
			}
		},
		/*Creates room depending on side a, side b and height h.*/
		createRoom : function(){
			a = parseInt(document.getElementById('inpa').value) / 2;
			b = parseInt(document.getElementById('inpb').value) / 2;
			h = parseInt(document.getElementById('inph').value) / 2;
			
			if( a <= 0 || b <= 0 || h <= 0){
				alert("Bitte keine Eingabefelder leer lassen. Nur positive Zahlen erlaubt!");
			}else{
			
				var fc = document.getElementById('FloorColor').value;
				var wc = document.getElementById('WallsColor').value;
				
				roomCreated = true;
				
				id_1 = X3D.main.createElementFromGeneric(X3D.gen.getGUID() ,"default","Wand1", 0, -b, h,null,false); // front
				id_2 = X3D.main.createElementFromGeneric(X3D.gen.getGUID() ,"default","Wand2", -a, 0, h,null,false);  // left
				id_3 = X3D.main.createElementFromGeneric(X3D.gen.getGUID() ,"default","Wand3", 0, 0, 0,null,false); // floor
				id_4 = X3D.main.createElementFromGeneric(X3D.gen.getGUID() ,"default","Wand4", a, 0, h,null,false); // right
				id_5 = X3D.main.createElementFromGeneric(X3D.gen.getGUID() ,"default","Wand5", 0, b, h,null,false); // back
				
				var transform = document.getElementById(document.getElementById(id_1).getAttribute('transform').substring(1));
				X3D.room.scaleRotateWall_f(transform);
				X3D.shader.changeShader2(id_1, 'diffuseColor', X3D.color.convertColor(wc));
				
				transform = document.getElementById(document.getElementById(id_2).getAttribute('transform').substring(1));
				X3D.room.scaleRotateWall_s(transform);
				X3D.shader.changeShader2(id_2, 'diffuseColor', X3D.color.convertColor(wc));				
					
			    transform = document.getElementById(document.getElementById(id_3).getAttribute('transform').substring(1));
				X3D.room.scaleWall_g(transform);
				X3D.shader.changeShader2(id_3, 'diffuseColor', X3D.color.convertColor(fc));

				transform = document.getElementById(document.getElementById(id_4).getAttribute('transform').substring(1));
				X3D.room.scaleRotateWall_s(transform);
				X3D.shader.changeShader2(id_4, 'diffuseColor', X3D.color.convertColor(wc));	
				
				transform = document.getElementById(document.getElementById(id_5).getAttribute('transform').substring(1));	
				X3D.room.scaleRotateWall_f(transform);
				X3D.shader.changeShader2(id_5, 'diffuseColor', X3D.color.convertColor(wc));
				
				status_1 = true;
				status_2 = true;
				status_3 = true;
				status_4 = true;
				status_5 = true;
				
				var pWall1 = function(){X3D.room.pushWall(id_1, 0, -b, h, "Wand1","1 0 0 1.570796",""+a +" " + h +" "+ "1");};
				var t1=setTimeout(pWall1,0);
				var pWall2 = function(){X3D.room.pushWall(id_2, -a, 0, h, "Wand2","0 1 0 1.570796",h +" "+ b +" "+ "1");};
				var t2=setTimeout(pWall2,0);
				var pWall3 = function(){X3D.room.pushWall(id_3, 0, 0, 0, "Wand3","0 0 1 0",a +" "+ b +" "+ "1");};
				var t3=setTimeout(pWall3,0);
				var pWall4 = function(){X3D.room.pushWall(id_4, a, 0, h, "Wand4","0 1 0 1.570796",h + " "+b+" " + "1");};
				var t4=setTimeout(pWall4,0);
				var pWall5 = function(){X3D.room.pushWall(id_5, 0, b, h, "Wand5","1 0 0 1.570796",a +" "+ h+" " + "1");};
				var t5=setTimeout(pWall5,0);
				
				
				var p6=function(){X3D.room.pushColor(id_1, X3D.color.convertColor(wc));};
				var p7=function(){X3D.room.pushColor(id_2, X3D.color.convertColor(wc));};
				var p8=function(){X3D.room.pushColor(id_3, X3D.color.convertColor(fc));};
				var p9=function(){X3D.room.pushColor(id_4, X3D.color.convertColor(wc));};
				var p10=function(){X3D.room.pushColor(id_5, X3D.color.convertColor(wc));};
				var t6=setTimeout(p6,100);
				var t7=setTimeout(p7,100);
				var t8=setTimeout(p8,100);
				var t9=setTimeout(p9,100);
				var t10=setTimeout(p10,100);

                /* add light */
				var lightid = X3D.main.createElementFromGeneric(X3D.gen.getGUID(), "default", "Licht", 0, 0, 5,null,false);
				var plight=function(){X3D.room.pushLight(lightid,0,0,5);};
				var tLight=setTimeout(plight,150);

				 X3D.view.createViewDialog();
				 X3D.dia.hm('box');				 
				 X3D.main.resetXml3D();
			}
		},
	};
}();