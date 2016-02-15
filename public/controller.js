/**
 * Created by Murali on 7/20/2015.
 */
var phonecatApp = angular.module('LTApp', ['ngRoute','ngAnimate']).config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/busstop', {
                templateUrl: 'busstop.html',
                controller: 'BeeBusController',
                controllerAs: 'BusBee'
            })
            .when('/', {
                templateUrl: 'maps.html',
                controller: 'BeeMapsController',
                controllerAs: 'LTAMaps'
            })
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }]).directive('myMap', function() {
    // directive link function
    var link = function(scope, element, attrs) {
        var map, infoWindow;
        var markers = [];

        // map config
        var mapOptions = {
            center: new google.maps.LatLng(50, 2),
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: true
        };

        // init the map
        function initMap() {
            if (map === void 0) {
                map = new google.maps.Map(element[0], mapOptions);
            }
        }

        // place a marker
        function setMarker(map, position, title, content) {
            var marker;
            var markerOptions = {
                position: position,
                map: map,
                title: title,
                icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
            };

            marker = new google.maps.Marker(markerOptions);
            markers.push(marker); // add marker to array

            google.maps.event.addListener(marker, 'click', function () {
                // close window if not undefined
                if (infoWindow !== void 0) {
                    infoWindow.close();
                }
                // create new window
                var infoWindowOptions = {
                    content: content
                };
                infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                infoWindow.open(map, marker);
            });
        }

        // show the map and place some markers
        initMap();

        /*setMarker(map, new google.maps.LatLng(51.508515, -0.125487), 'London', 'Just some content');
        setMarker(map, new google.maps.LatLng(52.370216, 4.895168), 'Amsterdam', 'More content');
        setMarker(map, new google.maps.LatLng(48.856614, 2.352222), 'Paris', 'Text here');*/
    };

    return {
        restrict: 'A',
        template: '<div id="gmaps"></div>',
        replace: true,
        link: link
    };
}).controller('BeeBusController',['$route', '$routeParams', '$location', '$scope', '$sce','$timeout', function ($route, $routeParams, $location, $scope, $sce, $timeout) {
    this.$route = $route;
    this.$location = $location;
    this.$routeParams = $routeParams;

    console.log("Bus Controller");
    var serviceList = [];
    $scope.row_num = 6;
    $scope.slideIndex = 0;
    $scope.inpbusStopID = "";

    function getData() {

        /*
        /!*jQuery.ajax({
            url: 'https://hhxj6n4z48.execute-api.us-east-1.amazonaws.com/Dev/?UniqueUserId=1ed4dbd9-f588-430a-8467-6b47725763aa&BusStopID=28339&AccountKey=FBdMzRsiwxeAHgJC8yfCuQ==&',
            type: 'GET',
            success: function (data) {
            },
            error: function (error) {
                $scope.IsLive = 0;
            }
        });*!/

        //var busStopID = "";
        //if (typeof Item !== 'undefined') {
            //var custombusStopID = Item.getData("busStopID");
            //if (custombusStopID) {
            //    busStopID = custombusStopID;
            //}
        //}

        //var busStopName = "";
        //if (typeof Item !== 'undefined') {
            //var custombusStopName = Item.getData("busStopName");
            //if (custombusStopName) {
            //    busStopName = custombusStopName;
            //}
        //}*/

        console.log("busStopID" + $scope.inpbusStopID);
        jQuery.ajax({
            url: 'https://hhxj6n4z48.execute-api.us-east-1.amazonaws.com/Dev/?UniqueUserId=1ed4dbd9-f588-430a-8467-6b47725763aa&BusStopID=' + $scope.inpbusStopID + '&AccountKey=FBdMzRsiwxeAHgJC8yfCuQ==&',
            type: 'GET',
            success: function (data) {
                $scope.pageList = [];
                serviceList = [];
                if ($scope.inpbusStopID != "")
                {
                    $scope.busStopID =  "(" + $scope.inpbusStopID + ")";
                }
                else
                {
                    $scope.busStopID = "";
                }

                jQuery.each(data, function (key, value) {
                    if(key == "Services") {
                        jQuery.each(value, function (serviceindex, servicevalue) {
                            var serviceItem = {};
                            //console.log(serviceindex + servicevalue);
                            if (servicevalue["ServiceNo"] != "") serviceItem.ServiceNo = servicevalue["ServiceNo"];
                            if (servicevalue["Status"] != "") serviceItem.Status = servicevalue["Status"];
                            if (servicevalue["Operator"] != "") serviceItem.Operator = servicevalue["Operator"];
                            if (servicevalue["NextBus"] != "") serviceItem.NextBus = servicevalue["NextBus"];
                                if (serviceItem.NextBus["EstimatedArrival"] == null) serviceItem.NextBus["EstimatedArrival"] = "NA";
                                if (serviceItem.NextBus["EstimatedArrival"] != "NA") {
                                    var dateNow = new Date();
                                    var bus_time = new Date(serviceItem.NextBus["EstimatedArrival"]);
                                    var seconds = (bus_time - dateNow) / 1000;
                                    if (seconds < 0) seconds = 0;
                                    var minutes = Math.floor(seconds / 60);
                                    var hours = Math.floor(minutes / 60);
                                    var days = Math.floor(hours / 24);
                                    //var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
                                    hours = hours - (days * 24);
                                    minutes = minutes - (days * 24 * 60) - (hours * 60);
                                    seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);
                                    if(minutes == 0)
                                    {
                                        serviceItem.DiffNextBus = "Arr";
                                    }
                                    else if (minutes >= -10) {
                                        serviceItem.DiffNextBus = minutes + (hours * 60);
                                    }
                                    else {
                                        serviceItem.DiffNextBus = "--";
                                    }
                                    serviceItem.NextBusArrival = serviceItem.NextBus["EstimatedArrival"];
                                    serviceItem.NextBusLoad = serviceItem.NextBus["Load"];
                                    if (serviceItem.NextBusLoad == "Seats Available") {
                                        serviceItem.SeatImage = "green";
                                    }
                                    else if (serviceItem.NextBusLoad == "Standing Available") {
                                        serviceItem.SeatImage = "orange";
                                    }
                                    else if (serviceItem.NextBusLoad == "Limited Standing") {
                                        serviceItem.SeatImage = "red";
                                    }
                                    else
                                    {
                                        serviceItem.SeatImage = '';
                                    }
                                   if (serviceItem.NextBus["Feature"] != "") serviceItem.NextBusFeature = serviceItem.NextBus["Feature"];
                                }
                                else {
                                    //serviceItem.DiffNextBus = "--";
                                    if (serviceItem.SeatImage != '') serviceItem.SeatImage = "";
                                    //serviceItem.NextBusFeature = "";
                                }
                            //console.log(serviceItem.SeatImage);
                            if (servicevalue["SubsequentBus"] != "") serviceItem.SubsequentBus = servicevalue["SubsequentBus"];
                            if (serviceItem.SubsequentBus["EstimatedArrival"] == null) serviceItem.SubsequentBus["EstimatedArrival"] = "NA";
                            if(serviceItem.SubsequentBus["EstimatedArrival"] != "") serviceItem.SubsequentBusArrival = serviceItem.SubsequentBus["EstimatedArrival"];
                            if(serviceItem.SubsequentBus["Load"] != "")    serviceItem.SubsequentBusLoad = serviceItem.SubsequentBus["Load"];

                            serviceItem.SubsequentBusFeature = serviceItem.SubsequentBus["Feature"];
                            if (serviceItem.SubsequentBus["EstimatedArrival"] != "NA") {
                                var dateNow = new Date();
                                var subsequentbus_time = new Date(serviceItem.SubsequentBus["EstimatedArrival"]);
                                var seconds1 = (subsequentbus_time - dateNow) / 1000;
                                if (seconds1 < 0) seconds1 = 0;
                                var minutes = Math.floor(seconds1 / 60);
                                var hours = Math.floor(minutes / 60);
                                var days = Math.floor(hours / 24);
                                hours = hours - (days * 24);
                                minutes = minutes - (days * 24 * 60) - (hours * 60);
                                seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

                                if (serviceItem.SubsequentBusLoad == "Seats Available") {
                                    serviceItem.SeatImage1 = "green";
                                }
                                else if (serviceItem.SubsequentBusLoad == "Standing Available") {
                                    serviceItem.SeatImage1 = "orange";
                                }
                                else if (serviceItem.SubsequentBusLoad == "Limited Standing") {
                                    serviceItem.SeatImage1 = "red";
                                }
                                else
                                {
                                    serviceItem.SeatImage1 = "";
                                }
                                if (minutes >= -10) {
                                    serviceItem.DiffSubsequentBus = minutes + (hours * 60);
                                }
                                else {
                                    serviceItem.DiffSubsequentBus = "--";
                                    serviceItem.SeatImage1 = $scope.seatavailable;
                                    serviceItem.SubsequentBusFeature = "";
                                }
                            }
                            else {
                                //serviceItem.DiffSubsequentBus = "--";
                                //serviceItem.SeatImage1 = "";
                                //serviceItem.SubsequentBusFeature = "";
                            }
                            serviceList.push(serviceItem);
                        });
                    }
                });

                var serviceSortedList = _.sortBy(serviceList, function(obj) {
                    var cc = [], s = obj.ServiceNo;
                    for(var i = 0, c; c = s.charAt(i); i++)
                        c == +c ? cc.push(+c) : cc.push(c.charCodeAt(0));
                    return +cc.join('');
                });

                //var serviceSortedList = _(serviceList).sortBy("ServiceNo");
                //$scope.serviceList = serviceSortedList;

                $scope.$apply(function (){
                        $scope.pageList = chunk(serviceSortedList, $scope.row_num);
                });
                $scope.IsLive = 1;
            },
            error: function (error) {
                $scope.IsLive = 0;
            }
        });
    }

    $scope.next = function() {
        var total = $scope.pageList.length;
        if (total > 0) {
            $scope.slideIndex = ($scope.slideIndex == total - 1) ? 0 : $scope.slideIndex + 1;
        }
    };

    $scope.play = function() {
        timeOut = $timeout(function() {
            $scope.next();
            $scope.play();
        }, 8000);
    };

    function chunk(arr, size) {
        var result = [];
        $scope.pageList = [];
        while (arr.length > size) {
            result.push(arr.splice(0, size))
        }
        if (arr.length)
            result.push(arr);

        return result;
    };

    setInterval(function() {
        getData();
    },30000);
    getData();
    $scope.play();

    $scope.clickBusStopID = function()
    {
        console.log("clickBusStopID");
        getData();
    }
}]).controller('BeeMapsController',['$route', '$routeParams', '$location',  function ($route, $routeParams, $location) {
    this.$route = $route;
    this.$location = $location;
    this.$routeParams = $routeParams;

    console.log("Maps Controller");
}]).controller('MainController', ['$route', '$routeParams', '$location',
    function($route, $routeParams, $location) {
        this.$route = $route;
        this.$location = $location;
        this.$routeParams = $routeParams;

        console.log("Main Controller");
    }]);


