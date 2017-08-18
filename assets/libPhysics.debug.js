'use strict';

#define PHYSICS_3D

var Physics = {
	browserify: function(objectBrowserify) {
		for (var strKey in objectBrowserify) {
			global[strKey] = objectBrowserify[strKey];
		}
	},

	functionWorldcol: null,

	init: function() {
		{
			#ifdef PHYSICS_2D
			Physics.functionWorldcol = function(intCoordinateX, intCoordinateY) {
				return false;
			}
			#endif

			#ifdef PHYSICS_3D
			Physics.functionWorldcol = function(intCoordinateX, intCoordinateY, intCoordinateZ) {
				return false;
			}
			#endif
		}
	},

	dispel: function() {
		{
			Physics.functionWorldcol = null;
		}
	},

	update: function(objectPhysics) {
		{
			#ifdef PHYSICS_2D
			objectPhysics.dblAcceleration[0] += objectPhysics.dblGravity[0];
			objectPhysics.dblAcceleration[1] += objectPhysics.dblGravity[1];
			#endif

			#ifdef PHYSICS_3D
			objectPhysics.dblAcceleration[0] += objectPhysics.dblGravity[0];
			objectPhysics.dblAcceleration[1] += objectPhysics.dblGravity[1];
			objectPhysics.dblAcceleration[2] += objectPhysics.dblGravity[2];
			#endif
		}

		{
			#ifdef PHYSICS_2D
			var dblVerletX = objectPhysics.dblPosition[0];
			var dblVerletY = objectPhysics.dblPosition[1];

			objectPhysics.dblPosition[0] = objectPhysics.dblPosition[0] + (objectPhysics.dblPosition[0] - objectPhysics.dblVerlet[0]) + objectPhysics.dblAcceleration[0];
			objectPhysics.dblPosition[1] = objectPhysics.dblPosition[1] + (objectPhysics.dblPosition[1] - objectPhysics.dblVerlet[1]) + objectPhysics.dblAcceleration[1];

			objectPhysics.dblVerlet[0] = dblVerletX;
			objectPhysics.dblVerlet[1] = dblVerletY;

			objectPhysics.dblAcceleration[0] = 0.0;
			objectPhysics.dblAcceleration[1] = 0.0;
			#endif

			#ifdef PHYSICS_3D
			var dblVerletX = objectPhysics.dblPosition[0];
			var dblVerletY = objectPhysics.dblPosition[1];
			var dblVerletZ = objectPhysics.dblPosition[2];

			objectPhysics.dblPosition[0] = objectPhysics.dblPosition[0] + (objectPhysics.dblPosition[0] - objectPhysics.dblVerlet[0]) + objectPhysics.dblAcceleration[0];
			objectPhysics.dblPosition[1] = objectPhysics.dblPosition[1] + (objectPhysics.dblPosition[1] - objectPhysics.dblVerlet[1]) + objectPhysics.dblAcceleration[1];
			objectPhysics.dblPosition[2] = objectPhysics.dblPosition[2] + (objectPhysics.dblPosition[2] - objectPhysics.dblVerlet[2]) + objectPhysics.dblAcceleration[2];

			objectPhysics.dblVerlet[0] = dblVerletX;
			objectPhysics.dblVerlet[1] = dblVerletY;
			objectPhysics.dblVerlet[2] = dblVerletZ;

			objectPhysics.dblAcceleration[0] = 0.0;
			objectPhysics.dblAcceleration[1] = 0.0;
			objectPhysics.dblAcceleration[2] = 0.0;
			#endif
		}

		{
			#ifdef PHYSICS_2D
			var dblVelocityX = objectPhysics.dblPosition[0] - objectPhysics.dblVerlet[0];
			var dblVelocityY = objectPhysics.dblPosition[1] - objectPhysics.dblVerlet[1];

			{
				dblVelocityX *= objectPhysics.dblFriction[0];
				dblVelocityY *= objectPhysics.dblFriction[1];
			}

			{
				if (objectPhysics.dblMaxvel.length === 1) {
					{
						var dblLength = Math.sqrt((dblVelocityX * dblVelocityX) + (dblVelocityY * dblVelocityY));

						if (dblLength > objectPhysics.dblMaxvel[0]) {
							dblVelocityX *= objectPhysics.dblMaxvel[0] / dblLength;
							dblVelocityY *= objectPhysics.dblMaxvel[0] / dblLength;

						} else if (dblLength < 0.0001) {
							dblVelocityX = 0.0;
							dblVelocityY = 0.0;

						}
					}

				} else if (objectPhysics.dblMaxvel.length === 2) {
					{
						if (Math.abs(dblVelocityX) > objectPhysics.dblMaxvel[0]) {
							dblVelocityX = (dblVelocityX > 0.0 ? 1.0 : -1.0) * objectPhysics.dblMaxvel[0];

						} else if (Math.abs(dblVelocityX) < 0.0001) {
							dblVelocityX = 0.0;

						}
					}

					{
						if (Math.abs(dblVelocityY) > objectPhysics.dblMaxvel[1]) {
							dblVelocityY = (dblVelocityY > 0.0 ? 1.0 : -1.0) * objectPhysics.dblMaxvel[1];

						} else if (Math.abs(dblVelocityY) < 0.0001) {
							dblVelocityY = 0.0;

						}
					}

				}
			}

			objectPhysics.dblPosition[0] = objectPhysics.dblVerlet[0] + dblVelocityX;
			objectPhysics.dblPosition[1] = objectPhysics.dblVerlet[1] + dblVelocityY;
			#endif

			#ifdef PHYSICS_3D
			var dblVelocityX = objectPhysics.dblPosition[0] - objectPhysics.dblVerlet[0];
			var dblVelocityY = objectPhysics.dblPosition[1] - objectPhysics.dblVerlet[1];
			var dblVelocityZ = objectPhysics.dblPosition[2] - objectPhysics.dblVerlet[2];

			{
				dblVelocityX *= objectPhysics.dblFriction[0];
				dblVelocityY *= objectPhysics.dblFriction[1];
				dblVelocityZ *= objectPhysics.dblFriction[2];
			}

			{
				if (objectPhysics.dblMaxvel.length === 1) {
					{
						var dblLength = Math.sqrt((dblVelocityX * dblVelocityX) + (dblVelocityY * dblVelocityY) + (dblVelocityZ * dblVelocityZ));

						if (dblLength > objectPhysics.dblMaxvel[0]) {
							dblVelocityX *= objectPhysics.dblMaxvel[0] / dblLength;
							dblVelocityY *= objectPhysics.dblMaxvel[0] / dblLength;
							dblVelocityZ *= objectPhysics.dblMaxvel[0] / dblLength;

						} else if (dblLength < 0.0001) {
							dblVelocityX = 0.0;
							dblVelocityY = 0.0;
							dblVelocityZ = 0.0;

						}
					}

				} else if (objectPhysics.dblMaxvel.length === 3) {
					{
						if (Math.abs(dblVelocityX) > objectPhysics.dblMaxvel[0]) {
							dblVelocityX = (dblVelocityX > 0.0 ? 1.0 : -1.0) * objectPhysics.dblMaxvel[0];

						} else if (Math.abs(dblVelocityX) < 0.0001) {
							dblVelocityX = 0.0;

						}
					}

					{
						if (Math.abs(dblVelocityY) > objectPhysics.dblMaxvel[1]) {
							dblVelocityY = (dblVelocityY > 0.0 ? 1.0 : -1.0) * objectPhysics.dblMaxvel[1];

						} else if (Math.abs(dblVelocityY) < 0.0001) {
							dblVelocityY = 0.0;

						}
					}

					{
						if (Math.abs(dblVelocityZ) > objectPhysics.dblMaxvel[2]) {
							dblVelocityZ = (dblVelocityZ > 0.0 ? 1.0 : -1.0) * objectPhysics.dblMaxvel[2];

						} else if (Math.abs(dblVelocityZ) < 0.0001) {
							dblVelocityZ = 0.0;

						}
					}

				}
			}

			objectPhysics.dblPosition[0] = objectPhysics.dblVerlet[0] + dblVelocityX;
			objectPhysics.dblPosition[1] = objectPhysics.dblVerlet[1] + dblVelocityY;
			objectPhysics.dblPosition[2] = objectPhysics.dblVerlet[2] + dblVelocityZ;
			#endif
		}
	},

	updateOverwrite: function(objectPhysics, objectOverwrite) {
		{
			#ifdef PHYSICS_2D
			var dblPositionX = 0.5 * (objectPhysics.dblPosition[0] + objectOverwrite.dblPosition[0]);
			var dblPositionY = 0.5 * (objectPhysics.dblPosition[1] + objectOverwrite.dblPosition[1]);

			var dblVerletX = dblPositionX - (objectOverwrite.dblPosition[0] - objectOverwrite.dblVerlet[0]);
			var dblVerletY = dblPositionY - (objectOverwrite.dblPosition[1] - objectOverwrite.dblVerlet[1]);

			objectPhysics.dblPosition[0] = dblPositionX;
			objectPhysics.dblPosition[1] = dblPositionY;

			objectPhysics.dblVerlet[0] = dblVerletX;
			objectPhysics.dblVerlet[1] = dblVerletY;
			#endif

			#ifdef PHYSICS_3D
			var dblPositionX = 0.5 * (objectPhysics.dblPosition[0] + objectOverwrite.dblPosition[0]);
			var dblPositionY = 0.5 * (objectPhysics.dblPosition[1] + objectOverwrite.dblPosition[1]);
			var dblPositionZ = 0.5 * (objectPhysics.dblPosition[2] + objectOverwrite.dblPosition[2]);

			var dblVerletX = dblPositionX - (objectOverwrite.dblPosition[0] - objectOverwrite.dblVerlet[0]);
			var dblVerletY = dblPositionY - (objectOverwrite.dblPosition[1] - objectOverwrite.dblVerlet[1]);
			var dblVerletZ = dblPositionZ - (objectOverwrite.dblPosition[2] - objectOverwrite.dblVerlet[2]);

			objectPhysics.dblPosition[0] = dblPositionX;
			objectPhysics.dblPosition[1] = dblPositionY;
			objectPhysics.dblPosition[2] = dblPositionZ;

			objectPhysics.dblVerlet[0] = dblVerletX;
			objectPhysics.dblVerlet[1] = dblVerletY;
			objectPhysics.dblVerlet[2] = dblVerletZ;
			#endif
		}
	},

	updateWorldcol: function(objectPhysics, boolSmall) {
		{
			#ifdef PHYSICS_2D
			objectPhysics.boolCollisionTop = false;

			objectPhysics.boolCollisionRight = false;

			objectPhysics.boolCollisionBottom = false;

			objectPhysics.boolCollisionLeft = false;
			#endif

			#ifdef PHYSICS_3D
			objectPhysics.boolCollisionTop = false;

			objectPhysics.boolCollisionSide = false;

			objectPhysics.boolCollisionBottom = false;
			#endif
		}

		{
			#ifdef PHYSICS_2D
			var intCoordinate = [];

			if (boolSmall === true) {
				var dblCoordinateX = objectPhysics.dblPosition[0] / Constants.dblGameBlocksize;
				var dblCoordinateY = objectPhysics.dblPosition[1] / Constants.dblGameBlocksize;

				var intCoordinateX = Math.floor(dblCoordinateX);
				var intCoordinateY = Math.floor(dblCoordinateY);

				var intShiftX = 0;
				var intShiftY = 0;

				if ((dblCoordinateX % 1) < 0.5) {
					intShiftX = -1;

				} else if ((dblCoordinateX % 1) >= 0.5) {
					intShiftX = 1;

				}

				if ((dblCoordinateY % 1) < 0.5) {
					intShiftY = -1;

				} else if ((dblCoordinateY % 1) >= 0.5) {
					intShiftY = 1;

				}

				intCoordinate.push([ intCoordinateX + intShiftX, intCoordinateY ]);
				intCoordinate.push([ intCoordinateX, intCoordinateY + intShiftY ]);
				intCoordinate.push([ intCoordinateX + intShiftX, intCoordinateY + intShiftY ]);

			} else if (boolSmall === false) {
				var intCoordinateX = Math.floor(objectPhysics.dblPosition[0] / Constants.dblGameBlocksize);
				var intCoordinateY = Math.floor(objectPhysics.dblPosition[1] / Constants.dblGameBlocksize);

				for (var intFor1 = 0; intFor1 < 3; intFor1 += 1) {
					for (var intFor2 = 0; intFor2 < 3; intFor2 += 1) {
						intCoordinate.push([ intCoordinateX + [ 0, -1, 1 ][intFor1], intCoordinateY + [ 1, 0, -1 ][intFor2] ]);
					}
				}

			}

			for (var intFor1 = 0; intFor1 < intCoordinate.length; intFor1 += 1) {
				var intCoordinateX = intCoordinate[intFor1][0];
				var intCoordinateY = intCoordinate[intFor1][1];

				var dblPositionX = (intCoordinateX * Constants.dblGameBlocksize) + (0.5 * Constants.dblGameBlocksize);
				var dblPositionY = (intCoordinateY * Constants.dblGameBlocksize) + (0.5 * Constants.dblGameBlocksize);

				if (Physics.functionWorldcol(intCoordinateX, intCoordinateY) === false) {
					continue;
				}

				{
					var dblIntersectX = 0.0;
					var dblIntersectY = 0.0;

					{
						dblIntersectX = Math.abs(objectPhysics.dblPosition[0] - dblPositionX) - (0.5 * objectPhysics.dblSize[0]) - (0.5 * Constants.dblGameBlocksize);
						dblIntersectY = Math.abs(objectPhysics.dblPosition[1] - dblPositionY) - (0.5 * objectPhysics.dblSize[1]) - (0.5 * Constants.dblGameBlocksize);

						if (dblIntersectX >= 0.0) {
							continue;

						} else if (dblIntersectY >= 0.0) {
							continue;

						}
					}

					if (Math.max(dblIntersectX, dblIntersectY) === dblIntersectX) {
						if ((objectPhysics.dblPosition[0] - dblPositionX) > 0.0) {
							objectPhysics.dblPosition[0] -= dblIntersectX;

							objectPhysics.boolCollisionLeft = true;

						} else if ((objectPhysics.dblPosition[0] - dblPositionX) < 0.0) {
							objectPhysics.dblPosition[0] += dblIntersectX;

							objectPhysics.boolCollisionRight = true;

						}

					} else if (Math.max(dblIntersectX, dblIntersectY) === dblIntersectY) {
						if ((objectPhysics.dblPosition[1] - dblPositionY) > 0.0) {
							objectPhysics.dblPosition[1] -= dblIntersectY;

							objectPhysics.boolCollisionTop = true;

						} else if ((objectPhysics.dblPosition[1] - dblPositionY) < 0.0) {
							objectPhysics.dblPosition[1] += dblIntersectY;

							objectPhysics.boolCollisionBottom = true;

						}

					}
				}
			}
			#endif

			#ifdef PHYSICS_3D
			var intCoordinate = [];

			if (boolSmall === true) {
				var dblCoordinateX = objectPhysics.dblPosition[0] / Constants.dblGameBlocksize;
				var dblCoordinateY = objectPhysics.dblPosition[1] / Constants.dblGameBlocksize;
				var dblCoordinateZ = objectPhysics.dblPosition[2] / Constants.dblGameBlocksize;

				var intCoordinateX = Math.floor(dblCoordinateX);
				var intCoordinateY = Math.floor(dblCoordinateY);
				var intCoordinateZ = Math.floor(dblCoordinateZ);

				var intShiftX = 0;
				var intShiftY = 0;
				var intShiftZ = 0;

				if ((dblCoordinateX % 1) < 0.5) {
					intShiftX = -1;

				} else if ((dblCoordinateX % 1) >= 0.5) {
					intShiftX = 1;

				}

				if ((dblCoordinateY % 1) < 0.5) {
					intShiftY = -1;

				} else if ((dblCoordinateY % 1) >= 0.5) {
					intShiftY = 1;

				}

				if ((dblCoordinateZ % 1) < 0.5) {
					intShiftZ = -1;

				} else if ((dblCoordinateZ % 1) >= 0.5) {
					intShiftZ = 1;

				}

				intCoordinate.push([ intCoordinateX + intShiftX, intCoordinateY, intCoordinateZ ]);
				intCoordinate.push([ intCoordinateX, intCoordinateY + intShiftY, intCoordinateZ ]);
				intCoordinate.push([ intCoordinateX, intCoordinateY, intCoordinateZ + intShiftZ ]);
				intCoordinate.push([ intCoordinateX + intShiftX, intCoordinateY + intShiftY, intCoordinateZ ]);
				intCoordinate.push([ intCoordinateX, intCoordinateY + intShiftY, intCoordinateZ + intShiftZ ]);
				intCoordinate.push([ intCoordinateX + intShiftX, intCoordinateY, intCoordinateZ + intShiftZ ]);
				intCoordinate.push([ intCoordinateX + intShiftX, intCoordinateY + intShiftY, intCoordinateZ + intShiftZ ]);

			} else if (boolSmall === false) {
				var intCoordinateX = Math.floor(objectPhysics.dblPosition[0] / Constants.dblGameBlocksize);
				var intCoordinateY = Math.floor(objectPhysics.dblPosition[1] / Constants.dblGameBlocksize);
				var intCoordinateZ = Math.floor(objectPhysics.dblPosition[2] / Constants.dblGameBlocksize);

				for (var intFor1 = 0; intFor1 < 3; intFor1 += 1) {
					for (var intFor2 = 0; intFor2 < 3; intFor2 += 1) {
						for (var intFor3 = 0; intFor3 < 3; intFor3 += 1) {
							intCoordinate.push([ intCoordinateX + [ 0, -1, 1 ][intFor1], intCoordinateY + [ -1, 0, 1 ][intFor2], intCoordinateZ + [ 0, -1, 1 ][intFor3] ]);
						}
					}
				}

			}

			for (var intFor1 = 0; intFor1 < intCoordinate.length; intFor1 += 1) {
				var intCoordinateX = intCoordinate[intFor1][0];
				var intCoordinateY = intCoordinate[intFor1][1];
				var intCoordinateZ = intCoordinate[intFor1][2];

				var dblPositionX = intCoordinateX + (0.5 * Constants.dblGameBlocksize);
				var dblPositionY = intCoordinateY + (0.5 * Constants.dblGameBlocksize);
				var dblPositionZ = intCoordinateZ + (0.5 * Constants.dblGameBlocksize);

				if (Physics.functionWorldcol(intCoordinateX, intCoordinateY, intCoordinateZ) === false) {
					continue;
				}

				{
					var dblIntersectX = Math.abs(objectPhysics.dblPosition[0] - dblPositionX) - (0.5 * objectPhysics.dblSize[0]) - (0.5 * Constants.dblGameBlocksize);
					var dblIntersectY = Math.abs(objectPhysics.dblPosition[1] - dblPositionY) - (0.5 * objectPhysics.dblSize[1]) - (0.5 * Constants.dblGameBlocksize);
					var dblIntersectZ = Math.abs(objectPhysics.dblPosition[2] - dblPositionZ) - (0.5 * objectPhysics.dblSize[2]) - (0.5 * Constants.dblGameBlocksize);

					if (dblIntersectX >= 0.0) {
						continue;

					} else if (dblIntersectY >= 0.0) {
						continue;

					} else if (dblIntersectZ >= 0.0) {
						continue;

					}

					if (Math.max(dblIntersectX, dblIntersectY, dblIntersectZ) === dblIntersectX) {
						if ((objectPhysics.dblPosition[0] - dblPositionX) > 0.0) {
							objectPhysics.dblPosition[0] -= dblIntersectX;

							objectPhysics.boolCollisionSide = true;

						} else if ((objectPhysics.dblPosition[0] - dblPositionX) < 0.0) {
							objectPhysics.dblPosition[0] += dblIntersectX;

							objectPhysics.boolCollisionSide = true;

						}

					} else if (Math.max(dblIntersectX, dblIntersectY, dblIntersectZ) === dblIntersectY) {
						if ((objectPhysics.dblPosition[1] - dblPositionY) > 0.0) {
							objectPhysics.dblPosition[1] -= dblIntersectY;

							objectPhysics.boolCollisionBottom = true;

						} else if ((objectPhysics.dblPosition[1] - dblPositionY) < 0.0) {
							objectPhysics.dblPosition[1] += dblIntersectY;

							objectPhysics.boolCollisionTop = true;

						}

					} else if (Math.max(dblIntersectX, dblIntersectY, dblIntersectZ) === dblIntersectZ) {
						if ((objectPhysics.dblPosition[2] - dblPositionZ) > 0.0) {
							objectPhysics.dblPosition[2] -= dblIntersectZ;

							objectPhysics.boolCollisionSide = true;

						} else if ((objectPhysics.dblPosition[2] - dblPositionZ) < 0.0) {
							objectPhysics.dblPosition[2] += dblIntersectZ;

							objectPhysics.boolCollisionSide = true;

						}

					}
				}
			}
			#endif
		}
	},

	updateObjectcol: function(objectPhysics, functionObjectcol, functionCollision) {
		{
			do {
				var physicsObjectcol = functionObjectcol(functionObjectcol);

				if (physicsObjectcol === null) {
					break;
				}

				{
					#ifdef PHYSICS_2D
					var dblIntersectX = Math.abs(objectPhysics.dblPosition[0] - physicsObjectcol.dblPosition[0]) - (0.5 * objectPhysics.dblSize[0]) - (0.5 * physicsObjectcol.dblSize[0]);
					var dblIntersectY = Math.abs(objectPhysics.dblPosition[1] - physicsObjectcol.dblPosition[1]) - (0.5 * objectPhysics.dblSize[1]) - (0.5 * physicsObjectcol.dblSize[1]);

					if (dblIntersectX >= 0.0) {
						continue;

					} else if (dblIntersectY >= 0.0) {
						continue;

					}
					#endif

					#ifdef PHYSICS_3D
					var dblIntersectX = Math.abs(objectPhysics.dblPosition[0] - physicsObjectcol.dblPosition[0]) - (0.5 * objectPhysics.dblSize[0]) - (0.5 * physicsObjectcol.dblSize[0]);
					var dblIntersectY = Math.abs(objectPhysics.dblPosition[1] - physicsObjectcol.dblPosition[1]) - (0.5 * objectPhysics.dblSize[1]) - (0.5 * physicsObjectcol.dblSize[1]);
					var dblIntersectZ = Math.abs(objectPhysics.dblPosition[2] - physicsObjectcol.dblPosition[2]) - (0.5 * objectPhysics.dblSize[2]) - (0.5 * physicsObjectcol.dblSize[2]);

					if (dblIntersectX >= 0.0) {
						continue;

					} else if (dblIntersectY >= 0.0) {
						continue;

					} else if (dblIntersectZ >= 0.0) {
						continue;

					}
					#endif
				}

				{
					functionCollision(physicsObjectcol);
				}
			} while (true);
		}
	},

	updateRaycol: function(objectPhysics, functionRaycol, functionCollision) {
		{
			do {
				var physicsRaycol = functionRaycol(functionRaycol);

				if (physicsRaycol === null) {
					break;
				}

				{
					var dblSlabMin = Number.MIN_VALUE;
					var dblSlabMax = Number.MAX_VALUE;

					#ifdef PHYSICS_2D
					var intDimensions = 2;
					#endif

					#ifdef PHYSICS_3D
					var intDimensions = 3;
					#endif

					for (var intFor1 = 0; intFor1 < intDimensions; intFor1 += 1) {
						if (objectPhysics.dblAcceleration[intFor1] === 0.0) {
							continue;
						}

						{
							var dblBoxMin = physicsRaycol.dblPosition[intFor1] - (0.5 * physicsRaycol.dblSize[intFor1]);
							var dblBoxMax = physicsRaycol.dblPosition[intFor1] + (0.5 * physicsRaycol.dblSize[intFor1]);

							var dblCandidateMin = (dblBoxMin - objectPhysics.dblPosition[intFor1]) / objectPhysics.dblAcceleration[intFor1];
							var dblCandidateMax = (dblBoxMax - objectPhysics.dblPosition[intFor1]) / objectPhysics.dblAcceleration[intFor1];

							dblSlabMin = Math.max(dblSlabMin, Math.min(dblCandidateMin, dblCandidateMax));
							dblSlabMax = Math.min(dblSlabMax, Math.max(dblCandidateMin, dblCandidateMax));
						}
					}

					if (dblSlabMax < Math.max(0.0, dblSlabMin)) {
						continue;
					}
				}

				{
					functionCollision(physicsRaycol);
				}
			} while (true);
		}
	}
};

module.exports = Physics;
