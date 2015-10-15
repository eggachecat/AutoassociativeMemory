app.controller('LearningController',function ($timeout) {
	this.teacherMatrixs = []

	typicalMatrix = math.matrix(MATRIX_FOR_INIT); 
	x_length = typicalMatrix._size[0]; y_length = typicalMatrix._size[1];
	size = x_length * y_length;
	this.weight = math.zeros(size,size);

	this.resultMatrix = math.zeros(typicalMatrix._size[0],typicalMatrix._size[1])

	this.matrixToForecast = math.matrix(MATRIX_FOR_INIT);

	this.trained = false;
	this.training = false;

	var self = this;

	var hardLim = function(x){
		if(x < 0){
			return 0;
		}else{
			return 1;
		}
	}
	var matrixToInput = function(m){
		vector = [];
		angular.forEach(m._data,function(row){
			angular.forEach(row,function(item){
				vector.push(item);
			});
		});
		inputToReturn = [];
		inputToReturn.push(vector);
		return math.matrix(inputToReturn);
	}

	var InputToMatrix = function(input){
		var input_vector = math.transpose(input)._data;
		console.log(input_vector);
		var matrix = [];
		var sub_vector = [];
		for (var i = 0; i <=  y_length ; i ++) {
			for (var j = 0; j <  x_length - 1; j ++) {
				sub_vector.push(input_vector[0][i * y_length + j])
			};
			matrix.push(sub_vector);
			sub_vector = [];
		};
		return math.matrix(matrix);
	}

	angular.forEach(TEACHERS_ARRAY,function(t, index){
		self.teacherMatrixs.push(
			{
				value  : t.value,
				matrix : math.matrix(t.matrix)
			}
		);
	});
	this.addTeacher = function(){
		var init_matrix = angular.copy(MATRIX_FOR_INIT);
		var newMatrix = {
				value  : "",
				matrix : math.matrix(init_matrix)
		}
		self.teacherMatrixs.push(newMatrix)
	}
	this.deleteTeacher = function(t){
		var index = self.teacherMatrixs.indexOf(t);
		if (index > -1) {
		    self.teacherMatrixs.splice(index, 1);
		}
	}
	this.startTraining = function(){
		self.training = true;
		angular.forEach(self.teacherMatrixs,function(t){
			p = matrixToInput(t.matrix);
			p_t = math.transpose(p);
			self.weight = math.add(self.weight, math.multiply(p_t, p));		
		});

		$timeout(function(){
			self.trained = true;
			self.training = false;
		}, 1000);
	}
	this.forecast = function(){
		forecastInput = math.transpose(matrixToInput(self.matrixToForecast));
		self.resultMatrix = InputToMatrix(math.multiply(self.weight, forecastInput));
	}
});

app.controller('ForecastController', ['', function () {
	
}]);