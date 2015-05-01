
//USE THIS COUNTER TO FIGURE OUT WEATHER TOGGLE IS ON OR OFF
$count = 0;
//SETTING DEFAULT VALUE TO MAINTENANCE
window.localStorage['storedMaintenance'] = 0;
window.localStorage['consumedCalories'] = "";
window.localStorage['Calories+'] = 0;
angular.module('ionicApp', ['ionic'])
	
//ALL CONTROLERS ARE SET FOR TEMPLATES HERE
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('eventmenu', {
      url: "/event",
      abstract: true,
      templateUrl: "templates/event-menu.html"
    })

    .state('eventmenu.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "templates/home.html",
          controller: "HomeCtr"
        }
      }
    })
    .state('eventmenu.checkin', {
      url: "/check-in",
      views: {
        'menuContent' :{
          templateUrl: "templates/check-in.html",
          controller: "CheckinCtrl"
        }
      }
    })
	
	.state('eventmenu.test', {
      url: "/test",
      views: {
        'menuContent' :{
          templateUrl: "templates/test.html",
          controller: "CheckinCtrl"
        }
      }
    })
	.state('eventmenu.calculator', {
      url: "/calculator",
      views: {
        'menuContent' :{
          templateUrl: "templates/calculator.html",
          controller: "CheckinCtrl1"
        }
      }
    })

  .state('eventmenu.progress', {
      url: "/progress",
      views: {
        'menuContent' :{
          templateUrl: "templates/progress.html",
          controller: "CheckinCtrl1"
        }
      }
    })

  .state('intro', {
    url: '/',
    templateUrl: 'templates/intro.html',
    controller: 'IntroCtrl'
  })

  .state('event-menu', {
    url: '/event-menu',
    templateUrl: 'templates/event-menu.html',
    controller: 'MainCtrl'
  });

  $urlRouterProvider.otherwise("/");
})

/*
* START OF CONTROLERS FOR THE VIEWS
*/
.controller('CheckinCtrl', function($scope, $ionicModal) {

  //CALCULATING AND PUSHING TO OVERVIEW 
  $scope.saveConsumed = function() {
    if (!consumed.value) {
    }else{
      //SAVING TO LOCAL STORAGE OF ALL THE CALORIES CONSUMED
      window.localStorage['consumedCalories'] += " <br/> + "+ consumed.value + " Cal";
      window.localStorage['Calories+'] = parseInt(window.localStorage['Calories+']) + parseInt(consumed.value);
      //DISPLAYING THE CALORIES CONSUMED ON THE CONSUMED TEMPLATE (INSERTING INTO HTML BY ID)
      document.getElementById('consumedSpan').innerHTML = window.localStorage['consumedCalories'];
      document.getElementById('consumedTotal').innerHTML = window.localStorage['Calories+'];
      document.getElementById('Consumed').innerHTML = window.localStorage['Calories+']; 
      document.getElementById('Remaining').innerHTML = window.localStorage['targetCals'] - window.localStorage['Calories+'];
    }
  }

  //CALCULATING AND PUSHING TO OVERVIEW 
  $scope.saveExpent= function() {
    if (!consumed.value) {
    }else{
    //SAVING TO LOCAL STORAGE OF ALL THE CALORIES Expent
    window.localStorage['consumedCalories'] += " <br/> - "+ consumed.value + " Cal";
    window.localStorage['Calories+'] -= parseInt(consumed.value);
    //DISPLAYING THE CALORIES CONSUMED ON THE CONSUMED TEMPLATE (INSERTING INTO HTML BY ID)
    document.getElementById('consumedSpan').innerHTML = window.localStorage['consumedCalories'];
    document.getElementById('consumedTotal').innerHTML = window.localStorage['Calories+'];
    document.getElementById('Consumed').innerHTML = window.localStorage['Calories+'];
    document.getElementById('Remaining').innerHTML = window.localStorage['targetCals'] - window.localStorage['Calories+'];
  }
  }

  //CALCULATING AND PUSHING TO OVERVIEW 
  $scope.clearLog= function() {
    //SAVING TO LOCAL STORAGE OF ALL THE CALORIES Expent
    window.localStorage['consumedCalories'] = "";
    window.localStorage['Calories+'] = 0;
    //DISPLAYING THE CALORIES CONSUMED ON THE CONSUMED TEMPLATE (INSERTING INTO HTML BY ID)
    document.getElementById('consumedSpan').innerHTML = window.localStorage['consumedCalories'];
    document.getElementById('consumedTotal').innerHTML = window.localStorage['Calories+'];
    document.getElementById('Consumed').innerHTML = window.localStorage['Calories+'];
    document.getElementById('Remaining').innerHTML = window.localStorage['targetCals'] - window.localStorage['Calories+'];
  }
})


//ANOTHER CONTROLER FOR ANOTHER THEME
.controller('CheckinCtrl1', function($scope, $ionicModal,$window) {
    var remain = parseInt(window.localStorage['targetCals']) - parseInt(window.localStorage['Calories+']);
    var cons = parseInt(window.localStorage['Calories+']);
    var goal = parseInt(window.localStorage['targetCals']);

    //TRYING TO PREVENT A NEGATIVE VALUE THAT SEEMS TO COUSE THE GRAPH TO CRASH
    //MOST LIKELY GRAPH.JS FAULT FOR NOT HANDELING NEGATIVES ERROR = -0.5 RADIUS

    if (remain  < 0.1) {
      remain = 0.0;
    }
    if(cons < 0.1 ){
      cons = 0.0;
    }
    if(goal < 0.1 ){
      goal = 0.0;
    }

    //SETTING CONFIGS FOR THE GRAPHS

      var pieData = [
        {
          value: cons,
          color:"#F7464A",
          highlight: "#FF5A5E",
          label: "Consumed (cal)"
        },
        {
          value: remain,
          color: "#3299CC",
          highlight: "#5AD3D1",
          label: "Remaining (cal)"
        },
      ];

          var lineChartData = {
      labels : ["Goal Calories","Consumed Total","Goal Calories"],
      datasets : [
        {
          label: "Comparison",
          fillColor : "rgba(220,220,220,0.2)",
          strokeColor : "rgba(220,220,220,1)",
          pointColor : "rgba(220,220,220,1)",
          pointStrokeColor : "#fff",
          pointHighlightFill : "#fff",
          pointHighlightStroke : "rgba(220,220,220,1)",
          data : [goal,cons,goal]
        },
      ]

    }

    var lineChartWithStart = {
      labels : ["Start Cal","Consumed Total","Goal Calories"],
      datasets : [
        {
          label: "Comparison",
          fillColor : "rgba(220,220,220,0.2)",
          strokeColor : "rgba(220,220,220,1)",
          pointColor : "rgba(220,220,220,1)",
          pointStrokeColor : "#fff",
          pointHighlightFill : "#fff",
          pointHighlightStroke : "rgba(220,220,220,1)",
          data : [0,cons,goal]
        },
      ]

    }

//CHECKS IF THE VIEW IS FULLY LOADED BEFORE DISPLAYING THE CHARTS ($stateChangeSuccess) ELSE CRASH OCCURS
//REFRENCES THE CANVAS IN HTML AND DRAWS CHARTS INSIDE THEM
$scope.$on('$stateChangeSuccess', function() {
    console.log("test2");
        var ctx = document.getElementById("chart-area2").getContext("2d");
        window.myDoughnut = new Chart(ctx).Doughnut(pieData, {responsive : false});

        var ctx = document.getElementById("chart-area5").getContext("2d");
        window.myLine = new Chart(ctx).Line(lineChartData, {
          responsive: true
        });

        var ctx = document.getElementById("chart-area6").getContext("2d");
        window.myLine = new Chart(ctx).Line(lineChartWithStart, {
          responsive: false
        });
});

$scope.ni_toggle = $window.localStorage.getItem('ni_toggle') === 'true';
    $scope.updateLocalStorage = function() {
        $window.localStorage.setItem('ni_toggle', $scope.ni_toggle);
        $count++;
        if($count %= 2){
          window.localStorage['isMale'] = true;    
        }else{
          window.localStorage['isMale'] = false;
        }
    };


  $ionicModal.fromTemplateUrl('templates/mylongform.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });


  $scope.openModal = function(){

    $scope.$on("$ionicView.beforeEnter", function(){

  });
    $weight = weight.value;
    $height = height.value;
    $gender = gender.value;
    $age = age.value;
    $exc = exc.value;
    
    //window.alert($gender);

    var isMale = window.localStorage['isMale'];

    console.log(isMale);
    console.log($exc);


    $BMR = 10 * $weight + 6.25 * $height - 5 * $age;

    //IF THE USER IS A MALE OR FEMALE CHANGES MAINTENANCE
    if(isMale === 'false'){
      $BMR =  $BMR - 161;
    }
    if(isMale === 'true'){
      $BMR = $BMR + 5;
    }

    $maintenanceWeight = $BMR;

    //CALCULATING ACTIVITY 
    switch($exc){
      case '1':
        $maintenanceWeight *= 1.2;
        break;
      case '2':
        $maintenanceWeight *= 1.375;
        break;
      case '3':
        $maintenanceWeight *= 1.55;
        break;
      case '4':
        $maintenanceWeight *= 1.725;
        break;
      case '5':
        $maintenanceWeight *= 1.9;
        break;
    }
    //DISPLAY THIS OUT 
    $scope.modal.show();
    document.getElementById('span1').innerHTML = 'Your BMR is <b style="color:black">' + Math.round($BMR) +"</b> Cals/day "
    + '<br /> You need <b style="color:black">'+ Math.round($maintenanceWeight)+"</b> Cal/day to maintain your weight.";
    

    
  }
  $scope.closeModal = function(){
    window.localStorage['storedMaintenance'] = Math.round($maintenanceWeight);
    document.getElementById('Maintain').innerHTML = window.localStorage['storedMaintenance']+" Cal/day";
    $scope.modal.hide();
  }
})



.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate) {
 
  // Called to navigate to the event-menu app
  $scope.startApp = function() {
    $state.go('event-menu');
  };
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };
})


.controller('HomeCtr', function($scope, $state, $ionicSlideBoxDelegate,$ionicModal,$window) {

  $ionicModal.fromTemplateUrl('templates/mylongform2.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
 
  //CHART PIE SETTING UP AND DISPLAY
  $scope.openModal2 = function(){
    var remain = window.localStorage['targetCals'] - window.localStorage['Calories+'];
    var cons = window.localStorage['Calories+'];
      var pieData = [
        {
          value: cons,
          color:"#F7464A",
          highlight: "#FF5A5E",
          label: "Consumed (cal)"
        },
        {
          value: remain,
          color: "#3299CC",
          highlight: "#5AD3D1",
          label: "Remaining (cal)"
        },
      ];

   
    $scope.modal.show();
    
        var ctx = document.getElementById("chart-area").getContext("2d");
        window.myPie = new Chart(ctx).Pie(pieData);
  }

  $scope.closeModal2 = function(){
    $scope.modal.hide();
  }
})


//ANOTHER CONTROLER
.controller('MainCtrl',function($scope, $ionicPopup, $timeout, $state) {

  $scope.toIntro = function(){
    $state.go('intro');
  }

 // Triggered on a button click, or some other target
 $scope.showPopup2 = function() {
   $scope.data = {}

   // An elaborate, custom popup
   var myPopup = $ionicPopup.show({
     template: '<input type="tel" ng-model="data.num2">',
     title: 'Enter maintenance calories',
     subTitle: 'Please use decimals & integers only',
     scope: $scope,
     buttons: [
       { text: 'Exit' ,type: 'button-light'},
       { text: 'Accept',type: 'button-positive',onTap: function(e) {
           if (!$scope.data.num2) {
             //don't allow the user to close unless he enters 
             e.preventDefault();
           } else {
             window.localStorage['storedMaintenance'] = parseInt($scope.data.num2);
             document.getElementById('Maintain').innerHTML = parseInt($scope.data.num2);
           }
         }
        },
     ]
   });
  };


   //ANOTHER POPUP
 $scope.showPopup = function() {
   $scope.data = {}

   // An elaborate, custom popup
   var myPopup = $ionicPopup.show({
     template: '<input type="tel" ng-model="data.num">',
     title: 'Enter Gain/Loss Amount (Kg/wk)',
     subTitle: 'Please use decimals & integers only',
     scope: $scope,
     buttons: [
       { text: 'Exit' ,type: 'button-light'},
       { text: 'Loss',type: 'button-assertive',onTap: function(e) {
           if (!$scope.data.num) {
             //don't allow the user to close unless he enters 
             e.preventDefault();
           } else {
             $gains = window.localStorage['storedMaintenance'];
             var gains = 0;
             gains = parseInt(parseInt($gains) - ($scope.data.num * 1000));
             window.localStorage['targetCals'] = gains;
             document.getElementById('Target').innerHTML = window.localStorage['targetCals'] + ' Cal/day';
             document.getElementById('Remaining').innerHTML = window.localStorage['targetCals'] - window.localStorage['Calories+'];
           }
         }
        },

       {
         text: '<b>Gain</b>',
         type: 'button-balanced',
         onTap: function(e) {
           if (!$scope.data.num) {
             //don't allow the user to close unless he enters 
             e.preventDefault();
           } else {
            $gains = window.localStorage['storedMaintenance'];
             var gains = 0;
             gains = parseInt(parseInt($gains) + ($scope.data.num * 1000));
             window.localStorage['targetCals'] = gains;
             document.getElementById('Target').innerHTML = window.localStorage['targetCals'] + ' Cal/day';
             document.getElementById('Remaining').innerHTML = window.localStorage['targetCals'] - window.localStorage['Calories+'];
           }
         }
       },
     ]
   });
   myPopup.then(function(res) {
     console.log('Tapped!', res);
   });
  };
   // A confirm dialog
   $scope.showConfirm = function() {
    $gainTwo = window.localStorage['storedMaintenance'];
    var gain = parseInt($gainTwo) + 2000;
    window.localStorage['targetCals'] = gain;
     var confirmPopup = $ionicPopup.confirm({
       title: '',
       template: 'Gain 2kg per week? <br/> Your Daily Caloric Target will be set to '+ gain
       + 'Cal/week'
     });
     confirmPopup.then(function(res) {
       if(res) {
         console.log('You are sure');
         document.getElementById('Target').innerHTML = window.localStorage['targetCals'] + ' Cal/day';
         document.getElementById('Remaining').innerHTML = window.localStorage['targetCals'] - window.localStorage['Calories+'];
       } else {
         console.log('You are not sure');
       }
     });
   };



   $scope.showGain15 = function() {
    $gainTwo = window.localStorage['storedMaintenance'];
    var gain = parseInt($gainTwo) + 1500;
    window.localStorage['targetCals'] = gain;
     var confirmPopup = $ionicPopup.confirm({
       title: '',
       template: 'Gain 1.5kg per week? <br/> Your Daily Caloric Target will be set to '+ gain
       + 'Cal/week'
     });
     confirmPopup.then(function(res) {
       if(res) {
         console.log('You are sure');
         document.getElementById('Target').innerHTML = window.localStorage['targetCals'] + ' Cal/day';
         document.getElementById('Remaining').innerHTML = window.localStorage['targetCals'] - window.localStorage['Calories+'];
       } else {
         console.log('You are not sure');
       }
     });
   };

   $scope.showGain1 = function() {
    $gainTwo = window.localStorage['storedMaintenance'];
    var gain = parseInt($gainTwo) + 1000;
    window.localStorage['targetCals'] = gain;
     var confirmPopup = $ionicPopup.confirm({
       title: '',
       template: 'Gain 1kg per week? <br/> Your Daily Caloric Target will be set to '+ gain
       + 'Cal/week'
     });
     confirmPopup.then(function(res) {
       if(res) {
         console.log('You are sure');
         document.getElementById('Target').innerHTML = window.localStorage['targetCals'] + ' Cal/day';
         document.getElementById('Remaining').innerHTML = window.localStorage['targetCals'] - window.localStorage['Calories+'];
       } else {
         console.log('You are not sure');
       }
     });
   };


   $scope.showGain05 = function() {
    $gainTwo = window.localStorage['storedMaintenance'];
    var gain = parseInt($gainTwo) + 500;
    window.localStorage['targetCals'] = gain;
     var confirmPopup = $ionicPopup.confirm({
       title: '',
       template: 'Gain 0.5kg per week? <br/> Your Daily Caloric Target will be set to '+ gain
       + 'Cal/week'
     });
     confirmPopup.then(function(res) {
       if(res) {
         console.log('You are sure');
         document.getElementById('Target').innerHTML = window.localStorage['targetCals'] + ' Cal/day';
         document.getElementById('Remaining').innerHTML = window.localStorage['targetCals'] - window.localStorage['Calories+'];
       } else {
         console.log('You are not sure');
       }
     });
   };

   $scope.showMaintain = function() {
    $gainTwo = window.localStorage['storedMaintenance'];
    var gain = parseInt($gainTwo);
    window.localStorage['targetCals'] = gain;
     var confirmPopup = $ionicPopup.confirm({
       title: '',
       template: 'Maintain Caloric Intake? <br/> Your Daily Caloric Target will be set to '+ gain
       + 'Cal/week'
     });
     confirmPopup.then(function(res) {
       if(res) {
         console.log('You are sure');
         document.getElementById('Target').innerHTML = window.localStorage['targetCals'] + ' Cal/day';
         document.getElementById('Remaining').innerHTML = window.localStorage['targetCals'] - window.localStorage['Calories+'];
       } else {
         console.log('You are not sure');
       }
     });
   };

   $scope.showLoss05 = function() {
    $gainTwo = window.localStorage['storedMaintenance'];
    var gain = parseInt($gainTwo) - 500;
    window.localStorage['targetCals'] = gain;
     var confirmPopup = $ionicPopup.confirm({
       title: '',
       template: 'Loose 0.5kg per week? <br/> Your Daily Caloric Target will be set to '+ gain
       + 'Cal/week'
     });
     confirmPopup.then(function(res) {
       if(res) {
         console.log('You are sure');
         document.getElementById('Target').innerHTML = window.localStorage['targetCals'] + ' Cal/day';
         document.getElementById('Remaining').innerHTML = window.localStorage['targetCals'] - window.localStorage['Calories+'];
       } else {
         console.log('You are not sure');
       }
     });
   };

   $scope.showLoss1 = function() {
    $gainTwo = window.localStorage['storedMaintenance'];
    var gain = parseInt($gainTwo) - 1000;
    window.localStorage['targetCals'] = gain;
     var confirmPopup = $ionicPopup.confirm({
       title: '',
       template: 'Loose 1kg per week? <br/> Your Daily Caloric Target will be set to '+ gain
       + 'Cal/week'
     });
     confirmPopup.then(function(res) {
       if(res) {
         console.log('You are sure');
         document.getElementById('Target').innerHTML = window.localStorage['targetCals'] + ' Cal/day';
         document.getElementById('Remaining').innerHTML = window.localStorage['targetCals'] - window.localStorage['Calories+'];
       } else {
         console.log('You are not sure');
       }
     });
   };

   $scope.showLoss15 = function() {
    $gainTwo = window.localStorage['storedMaintenance'];
    var gain = parseInt($gainTwo) - 1500;
    window.localStorage['targetCals'] = gain;
     var confirmPopup = $ionicPopup.confirm({
       title: '',
       template: 'Loose 1.5kg per week? <br/> Your Daily Caloric Target will be set to '+ gain
       + 'Cal/week'
     });
     confirmPopup.then(function(res) {
       if(res) {
         console.log('You are sure');
         document.getElementById('Target').innerHTML = window.localStorage['targetCals'] + ' Cal/day';
        document.getElementById('Remaining').innerHTML = window.localStorage['targetCals'] - window.localStorage['Calories+'];
       } else {
         console.log('You are not sure');
       }
     });
   };

   $scope.showLoss2 = function() {
    $gainTwo = window.localStorage['storedMaintenance'];
    var gain = parseInt($gainTwo) - 2000;
    window.localStorage['targetCals'] = gain;
     var confirmPopup = $ionicPopup.confirm({
       title: '',
       template: 'Loose 2kg per week? <br/> Your Daily Caloric Target will be set to '+ gain
       + 'Cal/week'
     });
     confirmPopup.then(function(res) {
       if(res) {
         console.log('You are sure');
         document.getElementById('Target').innerHTML = window.localStorage['targetCals'] + ' Cal/day';
         document.getElementById('Remaining').innerHTML = window.localStorage['targetCals'] - window.localStorage['Calories+'];
       } else {
         console.log('You are not sure');
       }
     });
   };
});




