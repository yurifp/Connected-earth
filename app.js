
(function() {
    'use strict';

    // Create Angular Module
    angular.module('connectedEarthApp', ['ngAnimate'])
        
        // Main Controller
        .controller('MainController', MainController)
        
        // Services
        .service('DataService', DataService)
        .service('VisualizationService', VisualizationService)
        .service('SimulationService', SimulationService)
        
        // Directives
        .directive('earthSystem', EarthSystemDirective)
        .directive('impactCard', ImpactCardDirective)
        .directive('dataChart', DataChartDirective)
        
        // Filters
        .filter('percentage', PercentageFilter)
        .filter('largeNumber', LargeNumberFilter);

    // ===================================
    // MAIN CONTROLLER
    // ===================================
    MainController.$inject = ['$scope', '$timeout', '$interval', 'DataService', 'VisualizationService', 'SimulationService'];
    
    function MainController($scope, $timeout, $interval, DataService, VisualizationService, SimulationService) {
        var vm = this;
        
        // Initialize
        function init() {
            $scope.loading = true;
            $scope.earthSystems = EarthSystemsData.systems;
            $scope.stories = EarthSystemsData.stories;
            $scope.storyIndex = 0;
            $scope.currentStory = $scope.stories[0];
            $scope.selectedSystem = null;
            $scope.activeConnections = [];
            
            // Simulator defaults
            $scope.temperature = 1.5;
            $scope.co2 = 421;
            $scope.deforestation = 15;
            $scope.simulationResults = [];
            
            // Initialize after loading
            $timeout(function() {
                $scope.loading = false;
                initializeVisualization();
            }, 2000);
            
            // Auto-select first system
            $timeout(function() {
                $scope.selectSystem($scope.earthSystems[0]);
            }, 2500);
            
            // Start automatic system rotation
            startSystemRotation();
        }
        
        // System Selection
        $scope.selectSystem = function(system) {
            $scope.selectedSystem = system;
            updateConnections(system);
            highlightConnectedSystems(system);
            playSystemSound(system);
            logInteraction('system_selected', system.id);
        };
        
        // Update Connections
        function updateConnections(system) {
            $scope.activeConnections = [];
            if (system && system.connections) {
                system.connections.forEach(function(targetId) {
                    var target = $scope.earthSystems.find(function(s) {
                        return s.id === targetId;
                    });
                    if (target) {
                        $scope.activeConnections.push({
                            from: system,
                            to: target
                        });
                    }
                });
            }
        }
        
        // Connection Line Styling
        $scope.getConnectionStyle = function(connection) {
            var dx = connection.to.x - connection.from.x;
            var dy = connection.to.y - connection.from.y;
            var length = Math.sqrt(dx * dx + dy * dy);
            var angle = Math.atan2(dy, dx) * 180 / Math.PI;
            
            return {
                left: (connection.from.x + 60) + 'px',
                top: (connection.from.y + 60) + 'px',
                width: length + 'px',
                transform: 'rotate(' + angle + 'deg)'
            };
        };
        
        // Simulation Update
        $scope.updateSimulation = function() {
            var impacts = SimulationService.calculateImpacts(
                $scope.temperature,
                $scope.co2,
                $scope.deforestation
            );
            
            $scope.simulationResults = impacts;
            updateVisualization();
            playSimulationSound();
        };
        
        // Story Navigation
        $scope.nextStory = function() {
            if ($scope.storyIndex < $scope.stories.length - 1) {
                $scope.storyIndex++;
                $scope.currentStory = $scope.stories[$scope.storyIndex];
                animateStoryTransition();
            }
        };
        
        $scope.previousStory = function() {
            if ($scope.storyIndex > 0) {
                $scope.storyIndex--;
                $scope.currentStory = $scope.stories[$scope.storyIndex];
                animateStoryTransition();
            }
        };
        
        // Scroll to Section
        $scope.scrollTo = function(elementId) {
            var element = document.getElementById(elementId);
            if (element) {
                element.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        };
        
        // Auto-rotate Systems
        function startSystemRotation() {
            $interval(function() {
                if ($scope.selectedSystem) {
                    var currentIndex = $scope.earthSystems.indexOf($scope.selectedSystem);
                    var nextIndex = (currentIndex + 1) % $scope.earthSystems.length;
                    $scope.selectSystem($scope.earthSystems[nextIndex]);
                }
            }, 5000);
        }
        
        // Initialize D3 Visualization
        function initializeVisualization() {
            VisualizationService.createChart('dataChart', EarthSystemsData.generateHistoricalData());
        }
        
        // Update Visualization
        function updateVisualization() {
            VisualizationService.updateChart({
                temperature: $scope.temperature,
                co2: $scope.co2,
                deforestation: $scope.deforestation
            });
        }
        
        // Highlight Connected Systems
        function highlightConnectedSystems(system) {
            $scope.earthSystems.forEach(function(s) {
                s.highlighted = false;
            });
            
            if (system && system.connections) {
                system.connections.forEach(function(connId) {
                    var connSystem = $scope.earthSystems.find(function(s) {
                        return s.id === connId;
                    });
                    if (connSystem) {
                        connSystem.highlighted = true;
                    }
                });
            }
        }
        
        // Story Transition Animation
        function animateStoryTransition() {
            // Add fade effect or other animations
            var storyElement = document.querySelector('.story-text');
            if (storyElement) {
                storyElement.style.opacity = '0';
                $timeout(function() {
                    storyElement.style.opacity = '1';
                }, 100);
            }
        }
        
        // Sound Effects (placeholder)
        function playSystemSound(system) {
            // Implement sound playback if needed
            console.log('Playing sound for:', system.name);
        }
        
        function playSimulationSound() {
            // Implement sound playback for simulation updates
            console.log('Simulation updated');
        }
        
        // Analytics/Logging
        function logInteraction(action, data) {
            console.log('User Interaction:', action, data);
            // Could send to analytics service
        }
        
        // Initialize simulation on load
        $scope.updateSimulation();
        
        // Initialize controller
        init();
    }

    // ===================================
    // DATA SERVICE
    // ===================================
    function DataService($http, $q) {
        var service = {
            loadNASAData: loadNASAData,
            getSystemData: getSystemData,
            saveUserProgress: saveUserProgress
        };
        
        return service;
        
        function loadNASAData(endpoint) {
            // Simulate NASA API call
            var deferred = $q.defer();
            
            // In production, this would be actual API call
            $http.get(endpoint)
                .then(function(response) {
                    deferred.resolve(response.data);
                })
                .catch(function(error) {
                    console.error('Error loading NASA data:', error);
                    deferred.reject(error);
                });
            
            return deferred.promise;
        }
        
        function getSystemData(systemId) {
            return EarthSystemsData.systems.find(function(s) {
                return s.id === systemId;
            });
        }
        
        function saveUserProgress(progress) {
            // Save to localStorage or backend
            localStorage.setItem('connectedEarth_progress', JSON.stringify(progress));
        }
    }

    // ===================================
    // VISUALIZATION SERVICE
    // ===================================
    function VisualizationService() {
        var chart = null;
        var service = {
            createChart: createChart,
            updateChart: updateChart,
            animateConnections: animateConnections
        };
        
        return service;
        
        function createChart(elementId, data) {
            var width = document.getElementById(elementId).offsetWidth;
            var height = 400;
            var margin = {top: 20, right: 30, bottom: 40, left: 60};
            
            var svg = d3.select('#' + elementId)
                .append('svg')
                .attr('width', width)
                .attr('height', height);
            
            var xScale = d3.scaleLinear()
                .domain([1970, 2020])
                .range([margin.left, width - margin.right]);
            
            var yScale = d3.scaleLinear()
                .domain([13, 17])
                .range([height - margin.bottom, margin.top]);
            
            // Add axes
            svg.append('g')
                .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
                .call(d3.axisBottom(xScale).tickFormat(d3.format('d')))
                .style('color', '#a8b2d1');
            
            svg.append('g')
                .attr('transform', 'translate(' + margin.left + ',0)')
                .call(d3.axisLeft(yScale))
                .style('color', '#a8b2d1');
            
            // Temperature line
            var tempLine = d3.line()
                .x(function(d) { return xScale(d.year); })
                .y(function(d) { return yScale(d.temperature); })
                .curve(d3.curveMonotoneX);
            
            svg.append('path')
                .datum(data)
                .attr('class', 'temp-line')
                .attr('fill', 'none')
                .attr('stroke', '#4a90e2')
                .attr('stroke-width', 2)
                .attr('d', tempLine);
            
            // Add interactive dots
            svg.selectAll('.dot')
                .data(data.filter(function(d, i) { return i % 5 === 0; }))
                .enter().append('circle')
                .attr('class', 'dot')
                .attr('cx', function(d) { return xScale(d.year); })
                .attr('cy', function(d) { return yScale(d.temperature); })
                .attr('r', 4)
                .attr('fill', '#63b8ff')
                .on('mouseover', function(event, d) {
                    showTooltip(event, d);
                })
                .on('mouseout', hideTooltip);
            
            // Labels
            svg.append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', 15)
                .attr('x', -(height / 2))
                .style('text-anchor', 'middle')
                .style('fill', '#a8b2d1')
                .text('Temperature (°C)');
            
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', height - 5)
                .style('text-anchor', 'middle')
                .style('fill', '#a8b2d1')
                .text('Year');
            
            chart = svg;
        }
        
        function updateChart(params) {
            if (!chart) return;
            
            // Update chart based on simulation parameters
            // This would update the visualization with new data
            console.log('Updating chart with:', params);
        }
        
        function animateConnections() {
            // Animate connection lines between systems
            d3.selectAll('.connection-line')
                .transition()
                .duration(1000)
                .style('opacity', function() {
                    return Math.random() * 0.5 + 0.5;
                });
        }
        
        function showTooltip(event, data) {
            // Create and show tooltip
            var tooltip = d3.select('body')
                .append('div')
                .attr('class', 'chart-tooltip')
                .style('position', 'absolute')
                .style('background', 'rgba(0,0,0,0.8)')
                .style('color', 'white')
                .style('padding', '10px')
                .style('border-radius', '5px')
                .style('pointer-events', 'none')
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px')
                .html('Year: ' + data.year + '<br>Temp: ' + data.temperature.toFixed(2) + '°C');
        }
        
        function hideTooltip() {
            d3.selectAll('.chart-tooltip').remove();
        }
    }

    // ===================================
    // SIMULATION SERVICE
    // ===================================
    function SimulationService() {
        var service = {
            calculateImpacts: calculateImpacts,
            runScenario: runScenario,
            predictFuture: predictFuture
        };
        
        return service;
        
        function calculateImpacts(temperature, co2, deforestation) {
            return EarthSystemsData.calculateSimulationImpacts(
                parseFloat(temperature),
                parseFloat(co2),
                parseFloat(deforestation)
            );
        }
        
        function runScenario(scenario) {
            // Run complex scenario simulations
            var results = {
                temperature: scenario.temperature,
                impacts: [],
                timeline: []
            };
            
            // Calculate cascading effects
            for (var year = 2025; year <= 2100; year += 5) {
                results.timeline.push({
                    year: year,
                    temperature: scenario.temperature * (year - 2025) / 75,
                    seaLevel: scenario.temperature * 3.3 * (year - 2025) / 75
                });
            }
            
            return results;
        }
        
        function predictFuture(currentData) {
            // Machine learning prediction placeholder
            return {
                prediction: 'Based on current trends...',
                confidence: 0.85
            };
        }
    }

    // ===================================
    // DIRECTIVES
    // ===================================
    function EarthSystemDirective() {
        return {
            restrict: 'E',
            scope: {
                system: '=',
                onSelect: '&'
            },
            template: `
                <div class="system-node" ng-click="onSelect({system: system})">
                    <div class="system-icon">{{system.icon}}</div>
                    <div class="system-label">{{system.name}}</div>
                </div>
            `,
            link: function(scope, element, attrs) {
                element.on('mouseenter', function() {
                    element.addClass('hover');
                });
                
                element.on('mouseleave', function() {
                    element.removeClass('hover');
                });
            }
        };
    }
    
    function ImpactCardDirective() {
        return {
            restrict: 'E',
            scope: {
                impact: '='
            },
            template: `
                <div class="impact-card">
                    <div class="impact-value">{{impact.value}}</div>
                    <div class="impact-label">{{impact.label}}</div>
                </div>
            `
        };
    }
    
    function DataChartDirective() {
        return {
            restrict: 'E',
            scope: {
                data: '=',
                type: '@'
            },
            link: function(scope, element, attrs) {
                // Initialize chart when data is available
                scope.$watch('data', function(newData) {
                    if (newData) {
                        // Create or update chart
                        console.log('Creating chart with data:', newData);
                    }
                });
            }
        };
    }

 
    function PercentageFilter() {
        return function(input, decimals) {
            decimals = decimals || 0;
            return (input * 100).toFixed(decimals) + '%';
        };
    }
    
    function LargeNumberFilter() {
        return function(input) {
            if (input >= 1000000000) {
                return (input / 1000000000).toFixed(1) + 'B';
            } else if (input >= 1000000) {
                return (input / 1000000).toFixed(1) + 'M';
            } else if (input >= 1000) {
                return (input / 1000).toFixed(1) + 'K';
            }
            return input.toString();
        };
    }

})();