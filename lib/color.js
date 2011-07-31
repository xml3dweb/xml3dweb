/*
	This script is used to generate Drop-Down-List for color selection.
	
	author: Lukas
*/

var X3D = X3D ? X3D : new Object();
X3D.color = function(){
	// Structure of the colorList [*][0] = name, [*][1] = values
	colorList = new Array();
	colorList[0] = new Array();
	colorList[0][0] = 'Black';
	colorList[0][1] = '0 0 0';
	
	colorList[1] = new Array();
	colorList[1][0] = 'Red';
	colorList[1][1] = "1 0 0";
	
	colorList[2] = new Array();
	colorList[2][0] = 'Green'
	colorList[2][1] = "0 1 0";
	
	colorList[3] = new Array();
	colorList[3][0] = 'Blue';
	colorList[3][1] = "0 0 1";
	
	colorList[4] = new Array();
	colorList[4][0] = 'Yellow';
	colorList[4][1] = "1 1 0";	

	colorList[5] = new Array();	
	colorList[5][0] = 'Purple'
	colorList[5][1] = "1 0 1";	
	
	colorList[6] = new Array();
	colorList[6][0] = 'Turquoise'
	colorList[6][1] = "0 1 1";	
		
	colorList[7] = new Array();	
	colorList[7][0] = 'Grey';
	colorList[7][1] = "0.3 0.3 0.3";
	
	return {
		/*Returns for a given color its values.*/
		convertColor : function(color){
			for(var i = 0; i < colorList.length; i++){
				if(colorList[i][0] == color){
					return colorList[i][1];
				}	
			}
			return "0";
		},
		/*Creates an empty default option.*/
		createDefaultValue : function(parent){
			var opt = document.createElement('option');
			opt.setAttribute('value', 'default');
			parent.appendChild(opt);
		},
		/*Creates a color option.*/
		createOptionColor : function(parent, name){
			var opt = document.createElement('option');
			var text = document.createTextNode(name);
			opt.appendChild(text);
			opt.setAttribute('value', name);
			opt.setAttribute('style', 'background-color:' + name);
			parent.appendChild(opt);
		},
		/*Creates a Drop Down Menu. If defaultValue is true then the first value will be empty.*/
		createDropDownMenu : function(defaultValue){
			var select = document.createElement('select');
			if(defaultValue){
				this.createDefaultValue(select);
			}
			for(var i = 0; i < colorList.length; i++){
				this.createOptionColor(select, colorList[i][0]);
			}
			return select;
		}
	}
}();