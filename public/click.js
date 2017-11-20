angular.module('buttons',[])
	.controller('buttonCtrl',ButtonCtrl)
	.factory('buttonApi',buttonApi)
	.constant('apiUrl','http://localhost:1337'); // CHANGED for the lab 2017!

function ButtonCtrl($scope,buttonApi){
	$scope.buttons=[]; //Initially all was still
	$scope.users = [];
	$scope.loggedin = false;
	$scope.errorMessage='';
	$scope.isLoading=isLoading;
	$scope.refreshButtons=refreshButtons;
	$scope.buttonClick=buttonClick;
	$scope.removeItem = removeItem;
	$scope.currenT=[];
	$scope.checkUser = checkUser;
	$scope.total= 0;
	$scope.prices=[];
	$scope.total = 0;
	$scope.timeStamps = [];
	var loading = false;
	$scope.voidSales = voidSales;
	$scope.user = null;
	$scope.sale = sale;
	$scope.logout = logout;

	function isLoading(){
		return loading;
	}
	function checkUser(name, password){
		for (i=0;i < $scope.users.length;i++){
			if($scope.users[i].name == name && $scope.users[i].password == password){
				console.log(i);
				$scope.loggedin = true;
				console.log("hi");
				$scope.user = $scope.users[i];
break;
			}
			else{
				console.log(i);
				console.log($scope.users[i].name);
				console.log(name);
				console.log(password);
				$scope.loggedin = false;
			}
		}
	}

	function sum(a){
		//	var i = 0;
		$scope.total=0;
		console.log($scope.currenT);
		for(i = 0; i < a.length; i++){
			console.log(a[i].price);
			$scope.total = ($scope.total + (a[i].price * a[i].Amount));
			console.log($scope.total);
		}
	}
	function sale(user_id){
		console.log(user_id);
		loading = true;
		$scope.errorMessage = '';
		buttonApi.makeSale(user_id)
		.success(function(data){
			loading = false;
		})
		.error(function(){
			$scope.errorMessage = 'Unable to make sale';
		});
	}

	function refreshTrans(){
		loading = true;
		$scope.errorMessage = '';
		buttonApi.getTrans()
			.success(function(data){
				$scope.currenT = data;
				loading = false;
				sum($scope.currenT);
			})
			.error(function(){
				$scope.errorMessage = 'Unable to load current transactions';
			});
	}
	function removeItem($event){
		console.log('deleted');
		$scope.errorMessage = '';
		console.log($event.target.id);
		buttonApi.removeItem($event.target.id)
			.success(function(){refreshTrans()})
			.error(function(){$scope.errorMessage="Unable remove";});
	}

	function refreshButtons(){
		loading=true;
		$scope.errorMessage='';
		buttonApi.getButtons()
			.success(function(data){
				$scope.buttons=data;
				loading=false;
			})
			.error(function () {
				$scope.errorMessage="Unable to load Buttons:  Database request failed";
				loading=false;
			});
		buttonApi.getPrices()
			.success(function(data){
				$scope.prices=data;
				loading = false;
			})
			.error(function (){
				$scope.errorMessage="Unable to load Prices: Database request failed";
			});
	}
	function refreshUsers(){
		loading=true;
		$scope.errorMessage='';
		buttonApi.getUsers()
			.success(function(data){
				console.log(data);
				$scope.users = data;
				loading =false;
			})
			.error(function (){
				$scope.errorMessage="Unable to load Users";
			});
	}

	function buttonClick($event){
		$scope.errorMessage='';
		buttonApi.clickButton($event.target.id)
			.success(function(){ 
				refreshTrans()
			})
			.error(function(){$scope.errorMessage="Unable click";});

	}
	function logout(){
		$scope.loggedin = false;
		$scope.user = null;
	}
	function voidSales($event){
		$scope.errorMessage='';
		buttonApi.void($event)
		.success(function(){
			refreshTrans()
		})
		.error(function(){$scope.errorMessage="Unable to void";});
	}

	refreshTrans();
	refreshButtons();
	refreshUsers();
}

function buttonApi($http,apiUrl){
	return{
		getButtons: function(){
			var url = apiUrl + '/buttons';
			return $http.get(url);
		},
		clickButton: function(id){
			var url = apiUrl+'/click?id='+id;
			return $http.get(url); // Easy enough to do this way
		},
		removeItem: function(id) {
			var url = apiUrl + '/removeItem?id='+id;
			return $http.get(url);
		},
		totalAmount: function(){
			var url = apiUrl + '/total';
			console.log("Attempting with "+url);
			return $http.get(url);
		},
		getPrices: function(){
			var url = apiUrl +'/prices';
			return $http.get(url);
		},
		getTrans: function(){
			var url = apiUrl + '/trans';
			return $http.get(url);
		},
		getUsers: function(){
			var url = apiUrl + '/users';
			return $http.get(url);
		},
		void: function(){
			var url = apiUrl + '/void';
			return $http.get(url);
		},
		makeSale: function(user_id){
			var url = apiUrl + '/sale?user_id=' + user_id;
			return $http.get(url);
		}
	}
}

