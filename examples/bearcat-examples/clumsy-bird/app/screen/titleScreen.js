var TitleScreen = function() {
	this.$id = "titleScreen";
	this.$init = "init";
	this.$backgroundLayer = null;
	this.$groundEntity = null;
	this.ctor = null;
}

TitleScreen.prototype.init = function() {
	var groundEntity = this.$groundEntity;
	var backgroundLayer = this.$backgroundLayer;
	this.ctor = me.ScreenObject.extend({
		init: function() {
			this.font = null;
			this.logo = null;
		},

		onResetEvent: function() {
			me.audio.stop("theme");
			game.data.newHiScore = false;
			// me.game.world.addChild(new BackgroundLayer('bg', 1));
			me.game.world.addChild(backgroundLayer.get('bg', 1));

			me.input.bindKey(me.input.KEY.ENTER, "enter", true);
			me.input.bindKey(me.input.KEY.SPACE, "enter", true);
			me.input.bindPointer(me.input.mouse.LEFT, me.input.KEY.ENTER);

			this.handler = me.event.subscribe(me.event.KEYDOWN, function(action, keyCode, edge) {
				if (action === "enter") {
					me.state.change(me.state.PLAY);
				}
			});

			//logo
			var logoImg = me.loader.getImage('logo');
			this.logo = new me.SpriteObject(
				me.game.viewport.width / 2 - 170, -logoImg,
				logoImg
			);
			me.game.world.addChild(this.logo, 10);

			var logoTween = new me.Tween(this.logo.pos)
				.to({
					y: me.game.viewport.height / 2 - 100
				}, 1000)
				.easing(me.Tween.Easing.Exponential.InOut).start();

			// this.ground1 = new Ground(0, me.video.getHeight() - 96);
			this.ground1 = groundEntity.get(0, me.video.getHeight() - 96);
			// this.ground2 = new Ground(me.video.getWidth(), me.video.getHeight() - 96);
			this.ground2 = groundEntity.get(me.video.getWidth(), me.video.getHeight() - 96);
			me.game.world.addChild(this.ground1, 11);
			me.game.world.addChild(this.ground2, 11);

			me.game.world.addChild(new(me.Renderable.extend({
				// constructor
				init: function() {
					// size does not matter, it's just to avoid having a zero size
					// renderable
					this.parent(new me.Vector2d(), 100, 100);
					//this.font = new me.Font('Arial Black', 20, 'black', 'left');
					this.text = me.device.touch ? 'Tap to start' : 'PRESS SPACE OR CLICK LEFT MOUSE BUTTON TO START \n\t\t\t\t\t\t\t\t\t\t\tPRESS "M" TO MUTE SOUND';
					this.font = new me.Font('gamefont', 20, '#000');
				},
				update: function() {
					return true;
				},
				draw: function(context) {
					var measure = this.font.measureText(context, this.text);
					this.font.draw(context, this.text, me.game.viewport.width / 2 - measure.width / 2, me.game.viewport.height / 2 + 50);
				}
			})), 12);
		},

		onDestroyEvent: function() {
			// unregister the event
			me.event.unsubscribe(this.handler);
			me.input.unbindKey(me.input.KEY.ENTER);
			me.input.unbindKey(me.input.KEY.SPACE);
			me.input.unbindPointer(me.input.mouse.LEFT);
			this.ground1 = null;
			this.ground2 = null;
			this.logo = null;
		}
	});
}

TitleScreen.prototype.get = function() {
	return new this.ctor();
}

bearcat.module(TitleScreen, typeof module !== 'undefined' ? module : {});