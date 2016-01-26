/**
 * Created by Murali on 7/20/2015.
 */
var phonecatApp = angular.module('LTApp', ['ngAnimate']);

phonecatApp.controller('LTAController', function ($scope, $sce, $timeout) {
    var serviceList = [];
    $scope.seatavailable = $sce.trustAsResourceUrl('PassengerIcons_green.png');
    $scope.standingavailable = $sce.trustAsResourceUrl('PassengerIcons_amber.png');
    $scope.limitedstanding = $sce.trustAsResourceUrl('PassengerIcons_red.png');
    $scope.row_num = 6;
    $scope.slideIndex = 0;
    function getData() {
        /*jQuery.ajax({
            url: 'https://hhxj6n4z48.execute-api.us-east-1.amazonaws.com/Dev/?UniqueUserId=1ed4dbd9-f588-430a-8467-6b47725763aa&BusStopID=28339&AccountKey=FBdMzRsiwxeAHgJC8yfCuQ==&',
            type: 'GET',
            success: function (data) {
            },
            error: function (error) {
                $scope.IsLive = 0;
            }
        });*/

        var busStopID = "";
        if (typeof Item !== 'undefined') {
            var custombusStopID = Item.getData("busStopID");
            if (custombusStopID) {
                busStopID = custombusStopID;
            }
        }

        var busStopName = "";
        if (typeof Item !== 'undefined') {
            var custombusStopName = Item.getData("busStopName");
            if (custombusStopName) {
                busStopName = custombusStopName;
            }
        }


        jQuery.ajax({
            url: 'https://hhxj6n4z48.execute-api.us-east-1.amazonaws.com/Dev/?UniqueUserId=1ed4dbd9-f588-430a-8467-6b47725763aa&BusStopID=' + busStopID + '&AccountKey=FBdMzRsiwxeAHgJC8yfCuQ==&',
            type: 'GET',
            success: function (data) {
                $scope.pageList = [];
                serviceList = [];
                if (busStopID != "")
                {
                    $scope.busStopID =  "(" + busStopID + ")";
                }
                else
                {
                    $scope.busStopID = "";
                }
                if(busStopName != "")
                {
                    $scope.busStopName = " - "+ busStopName;
                }
                else
                {
                    $scope.busStopName = "";
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
                                        serviceItem.SeatImage = $scope.seatavailable;
                                    }
                                    else if (serviceItem.NextBusLoad == "Standing Available") {
                                        serviceItem.SeatImage = $scope.standingavailable;
                                    }
                                    else if (serviceItem.NextBusLoad == "Limited Standing") {
                                        serviceItem.SeatImage = $scope.limitedstanding;
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
                                    serviceItem.SeatImage1 = $scope.seatavailable;
                                }
                                else if (serviceItem.SubsequentBusLoad == "Standing Available") {
                                    serviceItem.SeatImage1 = $scope.standingavailable;
                                }
                                else if (serviceItem.SubsequentBusLoad == "Limited Standing") {
                                    serviceItem.SeatImage1 = $scope.limitedstanding;
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
});


