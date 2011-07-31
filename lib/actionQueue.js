/*
	Skipt: actionQueue.js
	Namespace: X3D.queue
	Author: Holger
	Description: This skript enables undo and redo functions for the user interface.  
	Can be improved to act as a history.
*/


X3D.queue = function() {
	var log, logname = "lib/actionQueue.js";
	var commands = [];
	var commandsUndone = [];
	
	return {
		init: function() {
            log = X3D.log.get(logname);
            log.info("initialized");
			//index =0;
        },
		isEmpty:function(){
			if(commands.length ==0)return true;
			else return false;
		},
		/*
			This method empties the lists of commands.
		*/
		resetCommands : function(){
			commands = [];
			commandsUndone = [];
		},
		pushCommandsToP2P : function(){
			for(var i =0;i<commands.length;i++){
				log.info("pushing command "+i);
				commands[i].push();
			}
			commands=[];
			commandsUndone=[];
		},
		createCommand : function(){
			return new Command();
		},
		/*
			Adds a new Command to the queue.  
			Paramters are the new exec and undo method.
			The Command is EXECUTED during the method call.
		*/
		pushCommand : function(exec,undo){
			var command = new Command();
			command.execute = exec;
			command.undo = undo;
			commands.push(command);
			commandsUndone = [];
			command.execute();
		},
		/*
			Adds a command to the queue and EXECUTES it.  Another Script
			should not execute command directly as it would be executed twice.
			This is to ensure, that the commandsUndone array is cleared correctly.
		*/
		pushCustomCommand : function(command){
			commands.push(command);
			commandsUndone = [];
			command.execute();
		},
		
		/*
		*/
		pushMultipleCommands : function(commandArray){
			var command = new CommandMacro();
			command.log = log;
			command.commands = commandArray;
			this.pushCustomCommand(command);
			
		},
		/*
			This method is used to undo the last action
		*/
		undo : function(){
			if(commands.length >0){
				var command = commands.pop();
				command.undo();
				commandsUndone.push(command);
				log.debug("undoing");
				return true;
			}else return false;
		},
		undoAll:function(){
			while(this.undo()){
			}
		},
		/*
			This method is used to redo the last undone action.  
			If an execute method has been called, all undone actions
			are lost.
		*/
		redo : function(){
			if(commandsUndone.length >0){
				var command = commandsUndone.pop();
				command.execute();
				commands.push(command);
			}
		},
		/*
			This is a test method which enures that queue is working properly.
		*/
		test: function(){
			var number =0;
			var execute = function(){
				number = number+1;
				log.info("Number: "+number);
			};
			var undo = function(){
				number = number-1;
				log.info("Number: "+number);
			};
			this.pushCommand(execute,undo);
			this.pushCommand(execute,undo);
			this.pushCommand(execute,undo);
			this.undo();
			this.undo();
			this.redo();
			this.pushCommand(execute,undo);
		}
	}
}();