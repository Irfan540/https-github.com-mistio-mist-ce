define('app/views/shell', [
	'text!app/templates/shell.html','ember'],
	/**
	 *
	 * Shell dialog
	 *
	 * @returns Class
	 */
	function(shell_html) {
		return Ember.View.extend({
			tagName: false,
			machineBinding: 'Mist.machine',

			submit: function(){
				var machine = this.machine;
				if(!machine){
					Mist.backendsController.forEach(function(backend){
						backend.machines.forEach(function(m){
							if(m.selected && m.hasKey){
								console.log('machine selected');
								machine = m;
							}
						});
					}); 
				}
				if(!machine || !this.command){
					return;
				}
				
				this.set('machine', machine);
				var that = this;
				
				var command = this.command;
				
				this.machine.shell(command, function(output){
					if(that.shellOutput){
						var previousOutput = that.shellOutput + "\n$" + command + "\n" + output;	
					} else {
						var previousOutput = "$" + command + "\n" + output;
					}
					that.set('shellOutput', previousOutput);
				});
				this.clear();
			},
						
			clear: function(){
				this.set('command', '');
			},
			
			disabledClass: function(){
				if(this.command && this.command.length > 0){
					return '';
				} else {
					return 'ui-disabled';
				}
			}.property('command'),

		    init: function() {
				this._super();
				// cannot have template in home.pt as pt complains
				this.set('template', Ember.Handlebars.compile(shell_html));
			},
		});
	}
);
