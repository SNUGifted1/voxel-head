'use strict';

var Input = {
	browserify: function(objectBrowserify) {
		for (var strKey in objectBrowserify) {
			global[strKey] = objectBrowserify[strKey];
		}
	},

	functionException: null,
	functionKeyup: null,
	functionKeydown: null,

	boolUp: false,
	boolPressedUp: false,
	boolPreviousUp: false,

	boolLeft: false,
	boolPressedLeft: false,
	boolPreviousLeft: false,

	boolDown: false,
	boolPressedDown: false,
	boolPreviousDown: false,

	boolRight: false,
	boolPressedRight: false,
	boolPreviousRight: false,

	boolSpace: false,
	boolPressedSpace: false,
	boolPreviousSpace: false,

	boolShift: false,
	boolPressedShift: false,
	boolPreviousShift: false,

	init: function() {
		{
			Input.functionException = function() {
				return false;
			};

			Input.functionKeyup = function(objectEvent) {

			};

			Input.functionKeydown = function(objectEvent) {

			};
		}

		{
			Input.boolUp = false;

			Input.boolPressedUp = false;

			Input.boolPreviousUp = false;
		}

		{
			Input.boolLeft = false;

			Input.boolPressedLeft = false;

			Input.boolPreviousLeft = false;
		}

		{
			Input.boolDown = false;

			Input.boolPressedDown = false;

			Input.boolPreviousDown = false;
		}

		{
			Input.boolRight = false;

			Input.boolPressedRight = false;

			Input.boolPreviousRight = false;
		}

		{
			Input.boolSpace = false;

			Input.boolPressedSpace = false;

			Input.boolPreviousSpace = false;
		}

		{
			Input.boolShift = false;

			Input.boolPressedShift = false;

			Input.boolPreviousShift = false;
		}

		{
			jQuery(window.document)
				.off('keydown')
				.on('keydown', function(objectEvent) {
					if (Input.functionException() === true) {
						return;
					}

					{
						objectEvent.preventDefault();
					}

					{
						if ((objectEvent.keyCode === 38) | (objectEvent.keyCode === 87)) {
							Input.boolUp = true;

						} else if ((objectEvent.keyCode === 37) | (objectEvent.keyCode === 65)) {
							Input.boolLeft = true;

						} else if ((objectEvent.keyCode === 40) | (objectEvent.keyCode === 83)) {
							Input.boolDown = true;

						} else if ((objectEvent.keyCode === 39) | (objectEvent.keyCode === 68)) {
							Input.boolRight = true;

						} else if (objectEvent.keyCode === 32) {
							Input.boolSpace = true;

						} else if (objectEvent.keyCode === 16) {
							Input.boolShift = true;

						}
					}

					{
						Input.functionKeydown(objectEvent);
					}
				})
				.off('keyup')
				.on('keyup', function(objectEvent) {
					if (Input.functionException() === true) {
						return;
					}

					{
						objectEvent.preventDefault();
					}

					{
						if ((objectEvent.keyCode === 38) | (objectEvent.keyCode === 87)) {
							Input.boolUp = false;

						} else if ((objectEvent.keyCode === 37) | (objectEvent.keyCode === 65)) {
							Input.boolLeft = false;

						} else if ((objectEvent.keyCode === 40) | (objectEvent.keyCode === 83)) {
							Input.boolDown = false;

						} else if ((objectEvent.keyCode === 39) | (objectEvent.keyCode === 68)) {
							Input.boolRight = false;

						} else if (objectEvent.keyCode === 32) {
							Input.boolSpace = false;

						} else if (objectEvent.keyCode === 16) {
							Input.boolShift = false;

						}
					}

					{
						Input.functionKeyup(objectEvent);
					}
				})
			;
		}
	},

	dispel: function() {
		{
			Input.functionException = null;

			Input.functionKeyup = null;

			Input.functionKeydown = null;
		}

		{
			Input.boolUp = false;

			Input.boolPressedUp = false;

			Input.boolPreviousUp = false;
		}

		{
			Input.boolLeft = false;

			Input.boolPressedLeft = false;

			Input.boolPreviousLeft = false;
		}

		{
			Input.boolDown = false;

			Input.boolPressedDown = false;

			Input.boolPreviousDown = false;
		}

		{
			Input.boolRight = false;

			Input.boolPressedRight = false;

			Input.boolPreviousRight = false;
		}

		{
			Input.boolSpace = false;

			Input.boolPressedSpace = false;

			Input.boolPreviousSpace = false;
		}

		{
			Input.boolShift = false;

			Input.boolPressedShift = false;

			Input.boolPreviousShift = false;
		}
	},

	update: function() {
		{
			Input.boolPressedUp = false;

			if (Input.boolUp === true) {
				if (Input.boolPreviousUp === false) {
					Input.boolPressedUp = true;
				}
			}

			Input.boolPreviousUp = Input.boolUp;
		}

		{
			Input.boolPressedLeft = false;

			if (Input.boolLeft === true) {
				if (Input.boolPreviousLeft === false) {
					Input.boolPressedLeft = true;
				}
			}

			Input.boolPreviousLeft = Input.boolLeft;
		}

		{
			Input.boolPressedDown = false;

			if (Input.boolDown === true) {
				if (Input.boolPreviousDown === false) {
					Input.boolPressedDown = true;
				}
			}

			Input.boolPreviousDown = Input.boolDown;
		}

		{
			Input.boolPressedRight = false;

			if (Input.boolRight === true) {
				if (Input.boolPreviousRight === false) {
					Input.boolPressedRight = true;
				}
			}

			Input.boolPreviousRight = Input.boolRight;
		}

		{
			Input.boolPressedSpace = false;

			if (Input.boolSpace === true) {
				if (Input.boolPreviousSpace === false) {
					Input.boolPressedSpace = true;
				}
			}

			Input.boolPreviousSpace = Input.boolSpace;
		}

		{
			Input.boolPressedShift = false;

			if (Input.boolShift === true) {
				if (Input.boolPreviousShift === false) {
					Input.boolPressedShift = true;
				}
			}

			Input.boolPreviousShift = Input.boolShift;
		}
	}
};

module.exports = Input;
