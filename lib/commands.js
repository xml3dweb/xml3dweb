var X3D = X3D ? X3D : new Object();

/*
	This is an Interface for a typical Command.  It has the functions
	execute and undo which need to be overriden to fit needs of other content.
*/
function Command(){
}
Command.prototype.execute = function(){
}
Command.prototype.undo = function(){
}
Command.prototype.push = function(){
}
/*
	A CommandMacro is used to combine different Commands into one
	which ensures that they are executed and undone at the same time.
*/
function CommandMacro(){
	this.commands = [];
	this.log=null;

}
CommandMacro.prototype = new Command();
CommandMacro.prototype.execute = function(){
	for(var i =0;i<this.commands.length;i++){
		this.commands[i].execute();
	}
}
CommandMacro.prototype.push = function(){
	for(var i =0;i<this.commands.length;i++){
		this.log.info("pushing");
		this.commands[i].push();
	}
}
CommandMacro.prototype.undo = function(){
	for(var i =0;i<this.commands.length;i++){
		this.commands[i].undo();
	}
}

/*
 * changes a shader of an object back and forth
 */
function ShaderCommand(){
	this.oldIds = [];
	this.oldFields = [];
	this.oldValues = [];
	this.newIds = [];
	this.newFields = [];
	this.newValues = [];
	this.log = null;
}
ShaderCommand.prototype = new Command();
ShaderCommand.prototype.execute = function(){
	this.log.info("Doing undo from protoype");
	this.log.info("Length: "+this.newIds.length);
	for(var i =0;i<this.newIds.length;i++){
		X3D.shader.changeShader2(this.newIds[i],this.newFields[i], this.newValues[i]);
	}
}
ShaderCommand.prototype.push = function(){
	for(var i =0;i<this.newIds.length;i++){
		X3D.em.publish("data", {
                    actionType: "update",
                    updateType: "shader",
                    elementId: this.newIds[i], // only GUID, quickfix
                    fieldName: this.newFields[i],
                    value: this.newValues[i]
                });
	}
}
ShaderCommand.prototype.undo = function(){
	this.log.info("Doing undo from protoype");
	this.log.info("Length: "+this.oldIds.length);
	for(var i =0;i<this.oldIds.length;i++){
		X3D.shader.changeShader2(this.oldIds[i],this.oldFields[i], this.oldValues[i]);
	}
}

/*
 * modifies the position of an object back and forth
 */
function TranslationCommand(){
	this.oldIds = [];
	this.oldFields = [];
	this.oldValues = [];
	this.newIds = [];
	this.newFields = [];
	this.newValues = [];
	this.log = null;
}
TranslationCommand.prototype = new Command();
TranslationCommand.prototype.execute = function(){
	this.log.info("Doing execute from protoype");
	this.log.info("Length: "+this.newIds.length);
	for(var i =0;i<this.newIds.length;i++){
		X3D.move.changeTransformerTranslation(this.newIds[i],this.newFields[i], this.newValues[i]);
	}
}
TranslationCommand.prototype.push = function(){
	for(var i =0;i<this.newIds.length;i++){
		X3D.em.publish("data", {
                    actionType: "update",
                    updateType: "translation",
                    elementId: this.newIds[i], // only GUID, quickfix
                    fieldName: this.newFields[i],
                    value: this.newValues[i].toString()
                });
	}
}
TranslationCommand.prototype.undo = function(){
	this.log.info("Doing undo from protoype");
	this.log.info("Length: "+this.oldIds.length);
	for(var i =0;i<this.oldIds.length;i++){
		//this.log.info("id"+this.oldIds[i]+" field"+this.oldFields[i]+" value: "+ this.oldValues[i]);
		X3D.move.changeTransformerTranslation(this.oldIds[i],this.oldFields[i], this.oldValues[i]);
	}
}

/*
 * rotates an object back and forth
 */
function RotateCommand(){
	this.oldIds = [];
	this.oldFields = [];
	this.oldValues = [];
	this.newIds = [];
	this.newFields = [];
	this.newValues = [];
	this.log = null;
}
RotateCommand.prototype = new Command();
RotateCommand.prototype.execute = function(){
	this.log.info("Doing execute from protoype");
	this.log.info("Length: "+this.newIds.length);
	for(var i =0;i<this.newIds.length;i++){
		X3D.move.changeTransformerRotation(this.newIds[i],this.newFields[i], this.newValues[i]);
	}
}
RotateCommand.prototype.push = function(){
	for(var i =0;i<this.newIds.length;i++){
		X3D.em.publish("data", {
                    actionType: "update",
                    updateType: "rotation",
                    elementId: this.newIds[i], // only GUID, quickfix
                    fieldName: this.newFields[i],
                    value: this.newValues[i].toString()
                });
	}
}
RotateCommand.prototype.undo = function(){
	this.log.info("Doing undo from protoype");
	this.log.info("Length: "+this.oldIds.length);
	for(var i =0;i<this.oldIds.length;i++){
		X3D.move.changeTransformerRotation(this.oldIds[i],this.oldFields[i], this.oldValues[i]);
	}
}
