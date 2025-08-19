// Connected Earth - NASA Space Apps Challenge
// Working Version WITHOUT ngAnimate

angular.module('connectedEarthApp', [])  // REMOVIDO ngAnimate
    .controller('MainController', function($scope, $timeout, $interval) {
        
        console.log('MainController starting...');
        
        // Loading state
        $scope.loading = true;
        
        // Check if data exists
        if (!window.EarthSystemsData) {
            console.error('EarthSystemsData not found! Check data.js');
            // Create minimal data to prevent errors
            window.EarthSystemsData = {
                systems: [],
                stories: [],
                calculateSimulationImpacts: function() { return []; },
                generateHistoricalData: function() { return []; }
            };
        }
        
        // Initialize data
        $scope.earthSystems = EarthSystemsData.systems || [];
        $scope.stories = EarthSystemsData.stories || [];
        $scope.storyIndex = 0;
        $scope.currentStory = $scope.stories[0] || {title: 'Welcome', content: 'Connected Earth Application'};
        $scope.selectedSystem = null;
        $scope.activeConnections = [];
        
        // Simulator values
        $scope.temperature = 1.5;
        $scope.co2 = 421;
        $scope.deforestation = 15;
        $scope.simulationResults = [];
        
        console.log('Data loaded:', {
            systems: $scope.earthSystems.length,
            stories: $scope.stories.length
        });
        
        // Hide loading screen after 2 seconds
        $timeout(function() {
            console.log('Hiding loading screen...');
            $scope.loading = false;
            
            // Select first system
            if ($scope.earthSystems.length > 0) {
                $scope.selectSystem($scope.earthSystems[0]);
            }
            
            // Try to initialize chart
            try {
                initChart();
            } catch(e) {
                console.warn('Chart initialization failed:', e);
            }
        }, 2000);
        
        // Select system function
        $scope.selectSystem = function(system) {
            if (!system) return;
            
            console.log('Selecting system:', system.name);
            $scope.selectedSystem = system;
            $scope.activeConnections = [];
            
            // Update connections
            if (system.connections && Array.isArray(system.connections)) {
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
        };
        
        // Connection line style
        $scope.getConnectionStyle = function(connection) {
            if (!connection || !connection.from || !connection.to) {
                return {};
            }
            
            var dx = connection.to.x - connection.from.x;
            var dy = connection.to.y - connection.from.y;
            var length = Math.sqrt(dx * dx + dy * dy);
            var angle = Math.atan2(dy, dx) * 180 / Math.PI;
            
            return {
                'left': (connection.from.x + 60) + 'px',
                'top': (connection.from.y + 60) + 'px',
                'width': length + 'px',
                'transform': 'rotate(' + angle + 'deg)'
            };
        };
        
        // Update simulation
        $scope.updateSimulation = function() {
            var temp = parseFloat($scope.temperature) || 1.5;
            var co2Val = parseFloat($scope.co2) || 421;
            var defor = parseFloat($scope.deforestation) || 15;
            
            // Use EarthSystemsData function if available
            if (EarthSystemsData && typeof EarthSystemsData.calculateSimulationImpacts === 'function') {
                $scope.simulationResults = EarthSystemsData.calculateSimulationImpacts(temp, co2Val, defor);
            } else {
                // Fallback calculation
                $scope.simulationResults = [
                    {
                        value: Math.round(temp * 15) + '%',
                        label: 'Extreme Weather Events'
                    },
                    {
                        value: Math.round(defor * 2.5) + 'M',
                        label: 'Species at Risk'
                    },
                    {
                        value: Math.round(co2Val / 10 - 30) + '%',
                        label: 'Crop Yield Change'
                    },
                    {
                        value: Math.round(temp * 100) + 'M',
                        label: 'Climate Refugees'
                    },
                    {
                        value: Math.round(temp * 3.3) + 'mm/yr',
                        label: 'Sea Level Rise'
                    },
                    {
                        value: '$' + Math.round(temp * 2) + 'T',
                        label: 'Economic Impact'
                    }
                ];
            }
            
            console.log('Simulation updated with', $scope.simulationResults.length, 'results');
        };
        
        // Story navigation
        $scope.nextStory = function() {
            if ($scope.storyIndex < $scope.stories.length - 1) {
                $scope.storyIndex++;
                $scope.currentStory = $scope.stories[$scope.storyIndex];
                console.log('Next story:', $scope.currentStory.title);
            }
        };
        
        $scope.previousStory = function() {
            if ($scope.storyIndex > 0) {
                $scope.storyIndex--;
                $scope.currentStory = $scope.stories[$scope.storyIndex];
                console.log('Previous story:', $scope.currentStory.title);
            }
        };
        
        // Scroll to section
        $scope.scrollTo = function(elementId) {
            console.log('Scrolling to:', elementId);
            var element = document.getElementById(elementId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        };
        
        // Initialize chart
        function initChart() {
            console.log('Initializing chart...');
            
            // Check if D3 is available
            if (typeof d3 === 'undefined') {
                console.warn('D3.js not available');
                return;
            }
            
            var chartElement = document.getElementById('dataChart');
            if (!chartElement) {
                console.warn('Chart element not found');
                return;
            }
            
            var width = chartElement.offsetWidth || 800;
            var height = 400;
            var margin = {top: 20, right: 30, bottom: 40, left: 60};
            
            // Clear any existing chart
            d3.select('#dataChart').selectAll('*').remove();
            
            var svg = d3.select('#dataChart')
                .append('svg')
                .attr('width', width)
                .attr('height', height);
            
            // Get data
            var data = [];
            if (EarthSystemsData && typeof EarthSystemsData.generateHistoricalData === 'function') {
                data = EarthSystemsData.generateHistoricalData();
            } else {
                // Generate sample data
                for (var i = 0; i < 50; i++) {
                    data.push({
                        year: 1970 + i,
                        temperature: 14 + Math.random() * 2 + i * 0.02
                    });
                }
            }
            
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
            
            // Add line
            var line = d3.line()
                .x(function(d) { return xScale(d.year); })
                .y(function(d) { return yScale(d.temperature); })
                .curve(d3.curveMonotoneX);
            
            svg.append('path')
                .datum(data)
                .attr('fill', 'none')
                .attr('stroke', '#4a90e2')
                .attr('stroke-width', 2)
                .attr('d', line);
            
            // Add dots
            svg.selectAll('.dot')
                .data(data.filter(function(d, i) { return i % 5 === 0; }))
                .enter().append('circle')
                .attr('cx', function(d) { return xScale(d.year); })
                .attr('cy', function(d) { return yScale(d.temperature); })
                .attr('r', 4)
                .attr('fill', '#63b8ff');
            
            console.log('Chart initialized successfully');
        }
        
        // Auto-rotate systems
        $interval(function() {
            if (!$scope.loading && $scope.selectedSystem && $scope.earthSystems.length > 0) {
                var currentIndex = $scope.earthSystems.indexOf($scope.selectedSystem);
                if (currentIndex >= 0) {
                    var nextIndex = (currentIndex + 1) % $scope.earthSystems.length;
                    $scope.selectSystem($scope.earthSystems[nextIndex]);
                }
            }
        }, 5000);
        
        // Initialize simulation on start
        $scope.updateSimulation();
        
        console.log('MainController initialized successfully');
    });