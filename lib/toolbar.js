/*
	Script: toolbar.js
	Author: Simon, Holger, Lukas, Thomas
	Description: This script is responsible for handling interaction 
	with the toolbar in the user interace.  Until now it also includes the Dialog
	Instances such as create element, create room, change color, change texture.
*/
var X3D = X3D ? X3D : new Object();
X3D.tb = function() {
    var that = this;
    var log, logname = "lib/toolbar.js";
    var selection='';
    return {
        init: function(statusel) {
            log = X3D.log.get(logname);
            log.info("initialized");
            X3D.em.subscribe("connected", function(state) {
                statusel.css('background-color', state ? '#00ff00' : '#ff0000');
            });
 
        },
		
		/*
			This method inserts the possible shaders into 
			the itemList of the dialog. It also automatically creates an onclick 
			on the option thus selecting this option.
		*/
        addShadersToList: function(itemList){
            var shaders = X3D.main.getElementsOfType('shader');
            X3D.util.deleteAllChilds(itemList);
            //var newdiv = document.createElement('div');
            //var olEle = document.createElement('ol');
            //olEle.setAttribute('id','shaders');
            for(var i =0;i<shaders.length;i++){
                var ele = this.createOption(shaders[i]);
                itemList.appendChild(ele);
            }
        },
		/*
			This method adds the texture Options to the itemList of the diaglog.
			They are taken from generics
		*/
        addTexturesToList: function(itemList){
            var textures = X3D.main.getElementsOfType('texture');
            X3D.util.deleteAllChilds(itemList);
            //var newdiv = document.createElement('div');
            //var olEle = document.createElement('ol');
            //olEle.setAttribute('id','shaders');
            for(var i =0;i<textures.length;i++){
                var ele = this.createOption(textures[i]);
                itemList.appendChild(ele);
            }
        },
		/*
			This method adds the predefined Colors Options to the itemList of the diaglog. 
			They are taken from generics.
		*/
        addColorsToList: function(itemList){
            var colors = X3D.main.getElementsOfType('color');
            X3D.util.deleteAllChilds(itemList);
            //var newdiv = document.createElement('div');
            //var olEle = document.createElement('ol');
            //olEle.setAttribute('id','shaders');
            for(var i =0;i<colors.length;i++){
                var ele = this.createOption(colors[i]);
                itemList.appendChild(ele);
            }
        },
		/*
			This method gets the possible XML3D template Objects 
			and adds the options to the itemsList which are displayed in the
			dialog.
		*/
        addDataToList : function(items){
            var datas = X3D.main.getElementsOfType('group');
            X3D.util.deleteAllChilds(items);
            for(var i =0;i<datas.length;i++){
				if(datas[i].substring(datas[i].length-5, datas[i].length-1) == 'Wand') continue; // Drops Walls from the createBoxDialog list
                var ele = this.createOption(datas[i]);
                items.appendChild(ele);
            }
        },
		/*
			This method creates the change texture dialog
			and then displays it.  It always deletes the current dialog.
		*/
        changeTextureDialog : function(){
            if(X3D.main.elementsAreSelected()){
                var items = document.getElementById('items');
                var content = document.getElementById('dialogContent');
                X3D.util.deleteAllChilds(content);
                X3D.util.deleteAllChilds(items);
                this.addTexturesToList(items);
				this.addHeaderToDialog("Change Texture");
                var button = document.getElementById('submitButton');
                //var onclicktext = button.getAttribute('onclick');
                //onclicktext.replace('X3D.tb.submitChangeShader();','');
                //onclicktext = 'X3D.tb.submitChangeShader();'+onclicktext;
                button.setAttribute('onclick','X3D.tb.submitChangeShader();');
				var diaButtons = document.getElementById('dialogButtons');
				X3D.util.deleteAllChilds(diaButtons);
				var delButton = document.createElement('button');
				delButton.setAttribute('onclick','X3D.tb.setSelection("notexture");X3D.tb.submitChangeShader();X3D.dia.hm("box");');
				var textN = document.createTextNode("Remove Texture");
				delButton.appendChild(textN);
				diaButtons.appendChild(delButton);
                X3D.dia.showDialog();
            }
        },
		/*
			This method creates the change color dialog and displays it to the user. 
			The current dialog is deleted.
		*/
        changeColorDialog : function(){
            if(X3D.main.elementsAreSelected()){
                var items = document.getElementById('items');
                var content = document.getElementById('dialogContent');
				var diaButtons = document.getElementById('dialogButtons');
				X3D.util.deleteAllChilds(diaButtons);
                X3D.util.deleteAllChilds(content);
                X3D.util.deleteAllChilds(items);
				selection = null;
				
				var oc = X3D.color.createDropDownMenu(true);
				oc.setAttribute('id','ObjectColor');
				var label_oc = document.createTextNode('Object(s) color: '); 
				content.appendChild(label_oc);
				content.appendChild(oc);
				var brs5 = document.createElement('br');
				content.appendChild(brs5);
				
                var label = document.createTextNode("- or -");
                content.appendChild(label);
                //this.addColorsToList(items);
				this.addHeaderToDialog("Change Color");
                //adding input fields
                var inputField2 = document.createElement('input');
                inputField2.setAttribute('id','inp2');
                inputField2.defaultValue='0.0';
                var inputField3 = document.createElement('input');
                inputField3.setAttribute('id','inp3');
                inputField3.defaultValue='0';
                var inputField4 = document.createElement('input');
                inputField4.setAttribute('id','inp4');
                inputField4.defaultValue='0';
                var inputField5 = document.createElement('input');
                inputField5.setAttribute('id','inp5');
                inputField5.defaultValue='0';
                if(X3D.main.lengthSelectedElems()===1){
                    var shader = X3D.shader.findShader(0);
                    var children = shader.getElementsByTagName('*');
                    for(var i=0;i<children.length;i++){
                        if(children[i].getAttribute('name')==='diffuseColor'){
                            var texts = children[i].firstChild.nodeValue.split(' ');						
                            inputField3.defaultValue = Math.round(texts[0]*255);
                            inputField4.defaultValue = Math.round(texts[1]*255);
                            inputField5.defaultValue = Math.round(texts[2]*255);
                        }
                        if(children[i].getAttribute('name')==='transparency'){
                            var text= children[i].firstChild.nodeValue;
                            inputField2.defaultValue = text;
                        }
                    }
                }
                var label2 = document.createTextNode('T:');
                var label3 = document.createTextNode('R:');
                var label4 = document.createTextNode('G:');
                var label5 = document.createTextNode('B:');
                var brs = document.createElement('br');
                var brs2 = document.createElement('br');
                var brs3 = document.createElement('br');
                var brs4 = document.createElement('br');
                content.appendChild(brs);
                content.appendChild(label2);
                content.appendChild(inputField2);
                content.appendChild(brs2);
                content.appendChild(label3);
                content.appendChild(inputField3);
                content.appendChild(brs3);
                content.appendChild(label4);
                content.appendChild(inputField4);
                content.appendChild(brs4);
                content.appendChild(label5);
                content.appendChild(inputField5);
                var button = document.getElementById('submitButton');
                /*button.onclick = function() {
                    X3D.main.submitChangeColor();
                    X3D.dia.hm('box');
                };*/
                button.setAttribute('onclick','X3D.tb.submitChangeColor();');
                X3D.dia.showDialog();
				document.getElementById("ObjectColor").style.visibility ="visible";
            }
        },
		/*
			This method creates the add new xml3d object dialog.  It 
			deletes the current one.
		*/
        createBoxDialog : function(genericsTag){
			/*if(!roomCreated){
				alert("Bitte erst Raum erstellen!");
			}
			else{*/
				var content = document.getElementById('dialogContent');
				X3D.util.deleteAllChilds(content);
				var items = document.getElementById('items');
				X3D.util.deleteAllChilds(items);
				var diaButtons = document.getElementById('dialogButtons');
				X3D.util.deleteAllChilds(diaButtons);
				if(genericsTag===null)this.addDataToList(items);
				else {
					selection = genericsTag;
					var text = selection.split(':');
					var type = X3D.gen.getObjectType(text[0],text[1]);
				}
				var inputField2 = document.createElement('input');
				inputField2.setAttribute('id','inp2');
				inputField2.defaultValue ='0';
				var inputField3 = document.createElement('input');
				inputField3.setAttribute('id','inp3');
				inputField3.defaultValue ='0';
				var inputField4 = document.createElement('input');
				inputField4.setAttribute('id','inp4');
				inputField4.defaultValue ='0';
				var label2 = document.createTextNode('Enter X:');
				var label3 = document.createTextNode('Enter Y:');
				var label4 = document.createTextNode('Enter Z:');
				var label5 = document.createTextNode('Please enter starting position:');
				this.addHeaderToDialog("Inserting new Object");
				var brs = document.createElement('br');
				var brs2 = document.createElement('br');
				var brs3 = document.createElement('br');
				var brs4 = document.createElement('br');
				
				content.appendChild(label5);
				content.appendChild(brs);
				content.appendChild(label2);
				content.appendChild(inputField2);
				content.appendChild(brs2);
				content.appendChild(label3);
				content.appendChild(inputField3);
				content.appendChild(brs3);
				if(type=="ground"){} else{
					content.appendChild(label4);
					content.appendChild(inputField4);
				}
				var button = document.getElementById('submitButton');
				/*var onclicktext = button.getAttribute('onclick');
				onclicktext.replace('X3D.tb.submitCreateBoxDialog();','');
				onclicktext = 'X3D.tb.submitCreateBoxDialog();'+onclicktext;*/
				button.setAttribute('onclick','X3D.tb.submitCreateBoxDialog();');
				X3D.dia.showDialog();
				
			//}
        },
		/*
			Handels the events from the add new xml3d object dialog.
		*/
        submitCreateBoxDialog : function(){
            var x = document.getElementById('inp2').value;
            var y = document.getElementById('inp3').value;
            var z = document.getElementById('inp4');
			if(z==null)z="0";
			else z = z.value;
            if(X3D.util.isNumeric(x) && X3D.util.isNumeric(y) && X3D.util.isNumeric(z) && selection != null){
                if(document.getElementById(name)){
                } else {
                    //X3D.main.createElement(name.value,x.value,y.value,z.value, selection);
                    log.info('Selection: '+selection);
                    var texts = selection.split(':');
                    if(texts.length!=2)log.error('Text array not correct');
                    
                    //var guid = X3D.gen.getGUID();
                    log.info("Paramter: "+' '+texts[0]+' '+texts[1]+' '+ x+' '+ y+' '+ z);
                    X3D.main.createElementMain(texts[0],texts[1], x, y, z);
                    /*X3D.em.publish("data", {
                        actionType: "creation",
                        elementId: guid,
                        groupId: texts[0],
                        genericId: texts[1],
                        translation: x+" "+y+" "+z,
                        rotation: "",
                        scale: ""
                    });*/
                }
            } else {
                alert('please insert numbers');
            }
            selection = null;
            X3D.dia.hm('box');
        },
		
		/*
			This method handels the events of the change color dialog.
		*/
        submitChangeColor : function(){
            var transparency = document.getElementById('inp2').value;
            var r = document.getElementById('inp3').value;
            var g = document.getElementById('inp4').value;
            var b = document.getElementById('inp5').value;
			var color = document.getElementById('ObjectColor').value;
            if(color != 'default'){
                log.info('Changing Color by Selection');
                X3D.shader.changeColor(color);
            } else if(X3D.util.isNumeric(transparency) && X3D.util.isNumeric(r) && 
            X3D.util.isNumeric(g) && X3D.util.isNumeric(b)){
                log.info('Changing color by Value');
                X3D.shader.changeColorValue(transparency,r,g,b);
            } else {
                alert('please check input');
            }
            selection = null;
            X3D.dia.hm('box');
        },
		/*
			Handels the events of the change texture dialog
		*/
        submitChangeShader : function(){
            X3D.shader.changeTexture(selection);
            selection = null;
            X3D.dia.hm('box');
        },
		/*
			This is a utility method allowing the creation of a clickable option.  
			They are displayed in a dialog.  When pressed, their id is stored, so that
			this selection is used for further steps.
		*/	
        createOption : function(option){
            var optionElem = document.createElementNS('http://www.w3.org/1999/xhtml','li');
            var optButton = document.createElementNS('http://www.w3.org/1999/xhtml','button');
            //optButton.setAttribute('id',option);
            var text = document.createTextNode(option);
            optButton.appendChild(text);
            optButton.setAttribute('onclick','X3D.tb.setSelection("'+option+'");')
            optionElem.appendChild(optButton);
            
            return optionElem;
        },
		/*
			Used by the Options to store their id.
		*/
        setSelection : function(element){
            selection = element;
        },
		/*
			Method is used to get the selected options id.
		*/
        getSelection : function(){
            return selection;
        },
		createOptionColor : function(parent, name){
			var opt = document.createElement('option');
			var text = document.createTextNode(name);
			opt.appendChild(text);
			opt.setAttribute('value', name);
			opt.setAttribute('style', 'background-color:' + name);
			parent.appendChild(opt);
		},
		addHeaderToDialog:function(title){
			var label6 = document.createTextNode(title);
				var div = document.createElement("div");
				div.appendChild(label6);
				div.style.fontWeight = "bold";
				div.style.fontSize="x-large";
				var items = document.getElementById("items");
				if(items.firstChild!=null)items.insertBefore(div,items.firstChild);
				else items.appendChild(div);
		},
		/*Dialog for room creation. The user is able to define the room measures and can predefine colors 
		  for the walls and the floor.*/
        createRoomDialog : function(){
			roomCreated = X3D.room.checkForRoom(); 
			if(roomCreated == true){ 
				alert("Raum wurde schon erstellt!");
			}else{
				var content = document.getElementById('dialogContent');
				X3D.util.deleteAllChilds(content);
				var items = document.getElementById('items');
				X3D.util.deleteAllChilds(items);
				var diaButtons = document.getElementById('dialogButtons');
				X3D.util.deleteAllChilds(diaButtons);
				this.addHeaderToDialog("Create Room");
				var inputField_a = document.createElement('input');
				inputField_a.setAttribute('id','inpa');
				var inputField_b = document.createElement('input');
				inputField_b.setAttribute('id','inpb');
				var inputField_h = document.createElement('input');
				inputField_h.setAttribute('id','inph');
				var label_t = document.createTextNode('Cubic measures');
				var label_a = document.createTextNode('Enter a:');
				var label_b = document.createTextNode('Enter b:');
				var label_h = document.createTextNode('Enter h:');
				var brs = document.createElement('br');
				var brs2 = document.createElement('br');
				var brs3 = document.createElement('br');
				var brs4 = document.createElement('br');
				
				var fc = X3D.color.createDropDownMenu(false);
				fc.setAttribute('id','FloorColor');
				var label_fc = document.createTextNode('Floor color: '); 
				var wc = X3D.color.createDropDownMenu(false);
				wc.setAttribute('id','WallsColor');
				var label_wc = document.createTextNode('Walls color: '); 
				var brs5 = document.createElement('br');
				var brs6 = document.createElement('br');
				
				content.appendChild(label_t);
				content.appendChild(brs);
				content.appendChild(label_a);
				content.appendChild(inputField_a);
				content.appendChild(brs2);
				content.appendChild(label_b);
				content.appendChild(inputField_b);
				content.appendChild(brs3);
				content.appendChild(label_h);
				content.appendChild(inputField_h);
				content.appendChild(brs4);
				content.appendChild(label_fc);
				content.appendChild(fc);
				content.appendChild(brs5);
				content.appendChild(label_wc);
				content.appendChild(wc);
				
				var button = document.getElementById('submitButton');
				button.setAttribute('onclick','X3D.room.createRoom();');
				X3D.dia.showDialog();
				document.getElementById("FloorColor").style.visibility ="visible";
				document.getElementById("WallsColor").style.visibility ="visible";
			}
        },
		updateModeDisplay:function(mode){
			var display=document.getElementById('currentMode');
			display.setAttribute('value',mode);
			
		},
    };
}();
