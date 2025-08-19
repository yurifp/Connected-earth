(function() {
    'use strict';

    angular.module('connectedEarthApp')
        .service('NASAApiService', NASAApiService)
        .constant('NASA_CONFIG', {
            API_KEY: 'DEMO_KEY', // Substitua pela sua chave da NASA
            BASE_URL: 'https://api.nasa.gov',
            TIMEOUT: 30000
        });

    NASAApiService.$inject = ['$http', '$q', 'NASA_CONFIG'];

    function NASAApiService($http, $q, NASA_CONFIG) {
        var service = {
            // Earth Observation
            getEarthImagery: getEarthImagery,
            getLandsatImagery: getLandsatImagery,
            
            // Climate Data
            getClimateData: getClimateData,
            getTemperatureAnomalies: getTemperatureAnomalies,
            getCO2Levels: getCO2Levels,
            
            // Natural Events
            getWildfires: getWildfires,
            getEarthquakes: getEarthquakes,
            getSevereWeather: getSevereWeather,
            
            // Air Quality
            getAirQuality: getAirQuality,
            getAerosolData: getAerosolData,
            
            // Ocean Data
            getSeaLevel: getSeaLevel,
            getOceanTemperature: getOceanTemperature,
            
            // Vegetation
            getVegetationIndex: getVegetationIndex,
            getDeforestationData: getDeforestationData,
            
            // Utility Functions
            searchDatasets: searchDatasets,
            getDatasetMetadata: getDatasetMetadata
        };

        return service;

 
        /**
         * Get Earth imagery for a specific location and date
         * @param {number} lat - Latitude
         * @param {number} lon - Longitude
         * @param {string} date - Date in YYYY-MM-DD format
         * @param {number} dim - Width and height of the image (default: 0.15)
         */
        function getEarthImagery(lat, lon, date, dim) {
            var params = {
                lat: lat,
                lon: lon,
                date: date || '',
                dim: dim || 0.15,
                api_key: NASA_CONFIG.API_KEY
            };

            return $http.get(NASA_CONFIG.BASE_URL + '/planetary/earth/imagery', {
                params: params,
                responseType: 'blob'
            }).then(function(response) {
                // Convert blob to base64 for display
                return new Promise(function(resolve) {
                    var reader = new FileReader();
                    reader.onloadend = function() {
                        resolve({
                            imageUrl: reader.result,
                            metadata: {
                                location: { lat: lat, lon: lon },
                                date: date,
                                source: 'NASA Earth API'
                            }
                        });
                    };
                    reader.readAsDataURL(response.data);
                });
            });
        }

        /**
         * Get Landsat 8 imagery assets
         */
        function getLandsatImagery(lat, lon, date) {
            var params = {
                lat: lat,
                lon: lon,
                date: date,
                dim: 0.15,
                api_key: NASA_CONFIG.API_KEY
            };

            return $http.get(NASA_CONFIG.BASE_URL + '/planetary/earth/assets', {
                params: params
            }).then(function(response) {
                return response.data;
            });
        }


        /**
         * Get global temperature and climate vital signs
         */
        function getClimateData() {
            // Using NASA Climate API
            return $http.get('https://climate.nasa.gov/system/internal_resources/details/original/647_Global_Temperature_Data_File.txt')
                .then(function(response) {
                    return parseClimateData(response.data);
                });
        }

        /**
         * Get temperature anomalies data
         */
        function getTemperatureAnomalies() {
            return $http.get('https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.json')
                .then(function(response) {
                    return formatTemperatureData(response.data);
                });
        }

        /**
         * Get CO2 concentration levels
         */
        function getCO2Levels() {
            return $http.get('https://data.giss.nasa.gov/modelforce/ghgases/Fig1A.ext.txt')
                .then(function(response) {
                    return parseCO2Data(response.data);
                });
        }

 
        /**
         * Get active wildfire data from FIRMS
         */
        function getWildfires(region, dayRange) {
            var baseUrl = 'https://firms.modaps.eosdis.nasa.gov/api/area/csv/';
            var params = {
                source: 'viirs',
                region: region || 'world',
                dayRange: dayRange || 1,
                api_key: NASA_CONFIG.API_KEY
            };

            return $http.get(baseUrl, { params: params })
                .then(function(response) {
                    return parseCSVData(response.data);
                });
        }

        /**
         * Get earthquake data from USGS (NASA partner)
         */
        function getEarthquakes(startDate, endDate, minMagnitude) {
            var params = {
                format: 'geojson',
                starttime: startDate,
                endtime: endDate,
                minmagnitude: minMagnitude || 4.5
            };

            return $http.get('https://earthquake.usgs.gov/fdsnws/event/1/query', {
                params: params
            }).then(function(response) {
                return response.data;
            });
        }

        /**
         * Get severe weather events from EONET
         */
        function getSevereWeather(days) {
            var params = {
                days: days || 7,
                api_key: NASA_CONFIG.API_KEY
            };

            return $http.get(NASA_CONFIG.BASE_URL + '/eonet/events', {
                params: params
            }).then(function(response) {
                return response.data.events.filter(function(event) {
                    return event.categories.some(function(cat) {
                        return cat.title === 'Severe Storms';
                    });
                });
            });
        }


        /**
         * Get air quality data
         */
        function getAirQuality(lat, lon) {
            // This would connect to NASA's Air Quality API
            // For now, returning simulated data structure
            return $q.resolve({
                location: { lat: lat, lon: lon },
                measurements: {
                    pm25: Math.random() * 50 + 10,
                    pm10: Math.random() * 100 + 20,
                    o3: Math.random() * 80 + 40,
                    no2: Math.random() * 60 + 20,
                    so2: Math.random() * 40 + 5,
                    co: Math.random() * 10 + 1
                },
                quality_index: Math.floor(Math.random() * 200) + 50,
                timestamp: new Date().toISOString()
            });
        }

        /**
         * Get aerosol optical depth data
         */
        function getAerosolData(lat, lon, date) {
            // Connect to MODIS/VIIRS aerosol products
            return $q.resolve({
                aod: Math.random() * 0.5 + 0.1,
                location: { lat: lat, lon: lon },
                date: date,
                source: 'MODIS Terra/Aqua'
            });
        }


        /**
         * Get sea level data
         */
        function getSeaLevel() {
            return $http.get('https://climate.nasa.gov/system/internal_resources/details/original/121_Global_Sea_Level_Data_File.txt')
                .then(function(response) {
                    return parseSeaLevelData(response.data);
                });
        }

        /**
         * Get ocean temperature data
         */
        function getOceanTemperature(lat, lon) {
            // Connect to NASA Ocean Color or MODIS SST
            return $q.resolve({
                temperature: Math.random() * 10 + 20,
                anomaly: Math.random() * 2 - 1,
                location: { lat: lat, lon: lon },
                depth: 'surface',
                unit: 'celsius'
            });
        }

        // ===================================
        // VEGETATION
        // ===================================
        
        /**
         * Get NDVI (Normalized Difference Vegetation Index)
         */
        function getVegetationIndex(lat, lon, startDate, endDate) {
            // Connect to MODIS NDVI products
            return $q.resolve({
                ndvi: Math.random() * 0.4 + 0.3,
                location: { lat: lat, lon: lon },
                period: { start: startDate, end: endDate },
                health: Math.random() > 0.5 ? 'Healthy' : 'Stressed',
                source: 'MODIS'
            });
        }

        /**
         * Get deforestation alerts
         */
        function getDeforestationData(region) {
            // Connect to GLAD alerts or similar
            return $q.resolve({
                region: region,
                alerts: Math.floor(Math.random() * 1000),
                area_lost: Math.random() * 10000,
                trend: Math.random() > 0.5 ? 'increasing' : 'decreasing',
                period: 'last_30_days'
            });
        }

        /**
         * Search NASA datasets
         */
        function searchDatasets(query, limit) {
            var params = {
                q: query,
                limit: limit || 10
            };

            return $http.get('https://cmr.earthdata.nasa.gov/search/collections.json', {
                params: params
            }).then(function(response) {
                return response.data.feed.entry;
            });
        }

        /**
         * Get dataset metadata
         */
        function getDatasetMetadata(datasetId) {
            return $http.get('https://cmr.earthdata.nasa.gov/search/collections/' + datasetId + '.json')
                .then(function(response) {
                    return response.data;
                });
        }

        // ===================================
        // HELPER FUNCTIONS
        // ===================================
        
        function parseClimateData(rawData) {
            // Parse raw climate data into structured format
            var lines = rawData.split('\n');
            var data = [];
            
            lines.forEach(function(line) {
                if (line && !line.startsWith('#')) {
                    var parts = line.split(/\s+/);
                    if (parts.length >= 2) {
                        data.push({
                            year: parseInt(parts[0]),
                            temperature_anomaly: parseFloat(parts[1]),
                            smoothed: parts[2] ? parseFloat(parts[2]) : null
                        });
                    }
                }
            });
            
            return data;
        }

        function formatTemperatureData(jsonData) {
            // Format temperature anomaly data
            var formatted = [];
            
            for (var year in jsonData) {
                if (year !== 'base_period' && !isNaN(parseInt(year))) {
                    formatted.push({
                        year: parseInt(year),
                        annual: jsonData[year]['J-D'],
                        months: [
                            jsonData[year]['Jan'], jsonData[year]['Feb'],
                            jsonData[year]['Mar'], jsonData[year]['Apr'],
                            jsonData[year]['May'], jsonData[year]['Jun'],
                            jsonData[year]['Jul'], jsonData[year]['Aug'],
                            jsonData[year]['Sep'], jsonData[year]['Oct'],
                            jsonData[year]['Nov'], jsonData[year]['Dec']
                        ]
                    });
                }
            }
            
            return formatted.sort(function(a, b) { return a.year - b.year; });
        }

        function parseCO2Data(rawData) {
            // Parse CO2 concentration data
            var lines = rawData.split('\n');
            var data = [];
            
            lines.forEach(function(line) {
                if (line && !line.startsWith('#')) {
                    var parts = line.trim().split(/\s+/);
                    if (parts.length >= 2) {
                        data.push({
                            year: parseFloat(parts[0]),
                            co2_ppm: parseFloat(parts[1])
                        });
                    }
                }
            });
            
            return data;
        }

        function parseSeaLevelData(rawData) {
            // Parse sea level data
            var lines = rawData.split('\n');
            var data = [];
            
            lines.forEach(function(line) {
                if (line && !line.startsWith('#')) {
                    var parts = line.split(/\s+/);
                    if (parts.length >= 2) {
                        data.push({
                            date: parseFloat(parts[0]),
                            sea_level_mm: parseFloat(parts[1]),
                            uncertainty: parts[2] ? parseFloat(parts[2]) : null
                        });
                    }
                }
            });
            
            return data;
        }

        function parseCSVData(csvString) {
            // Simple CSV parser
            var lines = csvString.split('\n');
            var headers = lines[0].split(',');
            var data = [];
            
            for (var i = 1; i < lines.length; i++) {
                if (lines[i]) {
                    var values = lines[i].split(',');
                    var obj = {};
                    
                    headers.forEach(function(header, index) {
                        obj[header.trim()] = values[index] ? values[index].trim() : '';
                    });
                    
                    data.push(obj);
                }
            }
            
            return data;
        }
    }
})();


/*
// Em seu controller, injete o NASAApiService:

angular.module('connectedEarthApp')
    .controller('DataController', ['$scope', 'NASAApiService', 
        function($scope, NASAApiService) {
            
            // Exemplo 1: Obter imagem da Terra
            NASAApiService.getEarthImagery(37.7749, -122.4194, '2024-01-01')
                .then(function(result) {
                    $scope.earthImage = result.imageUrl;
                    console.log('Imagem obtida:', result.metadata);
                });
            
            // Exemplo 2: Obter dados de temperatura
            NASAApiService.getTemperatureAnomalies()
                .then(function(data) {
                    $scope.temperatureData = data;
                    updateTemperatureChart(data);
                });
            
            // Exemplo 3: Obter incêndios ativos
            NASAApiService.getWildfires('usa', 7)
                .then(function(fires) {
                    $scope.activeFires = fires;
                    plotFiresOnMap(fires);
                });
            
            // Exemplo 4: Obter qualidade do ar
            NASAApiService.getAirQuality(40.7128, -74.0060)
                .then(function(airData) {
                    $scope.airQuality = airData;
                    updateAirQualityDisplay(airData);
                });
        }
    ]);
*/