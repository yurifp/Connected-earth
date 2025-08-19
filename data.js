var EarthSystemsData = {
    // Earth Systems Configuration
    systems: [
        {
            id: 'atmosphere',
            name: 'Atmosphere',
            icon: '☁️',
            x: 300,
            y: 100,
            description: 'The atmosphere regulates Earth\'s temperature and protects us from harmful radiation. Changes in atmospheric composition affect all other Earth systems.',
            impacts: [
                {value: '+1.1°C', label: 'Global Temperature Rise'},
                {value: '421 ppm', label: 'CO₂ Concentration'},
                {value: '15%', label: 'Extreme Weather Increase'}
            ],
            connections: ['water', 'biodiversity', 'agriculture'],
            nasaData: {
                mission: 'OCO-2',
                dataType: 'Carbon Dioxide Monitoring',
                updateFrequency: 'Daily'
            }
        },
        {
            id: 'water',
            name: 'Water Resources',
            icon: '💧',
            x: 600,
            y: 150,
            description: 'Water cycles connect oceans, atmosphere, and land. Changes in water availability affect agriculture, ecosystems, and human communities.',
            impacts: [
                {value: '2.1B', label: 'People Facing Water Stress'},
                {value: '-13%', label: 'Arctic Ice Coverage'},
                {value: '3.3mm/yr', label: 'Sea Level Rise'}
            ],
            connections: ['atmosphere', 'agriculture', 'biodiversity'],
            nasaData: {
                mission: 'GRACE-FO',
                dataType: 'Groundwater and Ice Mass',
                updateFrequency: 'Monthly'
            }
        },
        {
            id: 'biodiversity',
            name: 'Biodiversity',
            icon: '🦋',
            x: 900,
            y: 200,
            description: 'Biodiversity maintains ecosystem stability and provides essential services. Loss of species affects food webs and ecosystem functions.',
            impacts: [
                {value: '1M', label: 'Species at Risk'},
                {value: '-68%', label: 'Wildlife Population Decline'},
                {value: '75%', label: 'Insect Pollinator Loss Risk'}
            ],
            connections: ['agriculture', 'atmosphere', 'wildfire'],
            nasaData: {
                mission: 'MODIS',
                dataType: 'Vegetation and Land Cover',
                updateFrequency: 'Weekly'
            }
        },
        {
            id: 'agriculture',
            name: 'Agriculture',
            icon: '🌾',
            x: 200,
            y: 350,
            description: 'Agriculture feeds the world but also impacts land, water, and atmosphere. Climate change affects crop yields and food security.',
            impacts: [
                {value: '-5%', label: 'Global Crop Yields'},
                {value: '828M', label: 'People Facing Hunger'},
                {value: '24%', label: 'GHG from Agriculture'}
            ],
            connections: ['water', 'biodiversity', 'atmosphere'],
            nasaData: {
                mission: 'Landsat 8',
                dataType: 'Crop Health Monitoring',
                updateFrequency: '16 days'
            }
        },
        {
            id: 'wildfire',
            name: 'Wildfires',
            icon: '🔥',
            x: 500,
            y: 400,
            description: 'Wildfires are increasing in frequency and intensity due to climate change, affecting air quality, ecosystems, and communities.',
            impacts: [
                {value: '+50%', label: 'Fire Season Length'},
                {value: '2x', label: 'Area Burned Annually'},
                {value: '339M', label: 'People Exposed to Smoke'}
            ],
            connections: ['atmosphere', 'biodiversity', 'health'],
            nasaData: {
                mission: 'VIIRS',
                dataType: 'Active Fire Detection',
                updateFrequency: 'Real-time'
            }
        },
        {
            id: 'energy',
            name: 'Energy',
            icon: '⚡',
            x: 800,
            y: 450,
            description: 'Energy production and consumption drive climate change. Transitioning to renewable energy is crucial for sustainability.',
            impacts: [
                {value: '30%', label: 'Renewable Energy Share'},
                {value: '36.8Gt', label: 'Annual CO₂ Emissions'},
                {value: '2.8TW', label: 'Solar/Wind Capacity'}
            ],
            connections: ['atmosphere', 'water', 'biodiversity'],
            nasaData: {
                mission: 'DSCOVR',
                dataType: 'Solar Radiation Monitoring',
                updateFrequency: 'Hourly'
            }
        },
        {
            id: 'health',
            name: 'Human Health',
            icon: '🏥',
            x: 1000,
            y: 350,
            description: 'Climate change affects human health through heat stress, disease spread, air quality, and food security.',
            impacts: [
                {value: '250K', label: 'Annual Climate Deaths'},
                {value: '7M', label: 'Air Pollution Deaths'},
                {value: '2B', label: 'At Risk from Dengue'}
            ],
            connections: ['atmosphere', 'water', 'wildfire'],
            nasaData: {
                mission: 'TEMPO',
                dataType: 'Air Quality Monitoring',
                updateFrequency: 'Hourly'
            }
        }
    ],

    // Story Chapters
    stories: [
        {
            title: 'Chapter 1: The Delicate Balance',
            content: 'Earth\'s systems have evolved over billions of years to create a delicate balance that supports life. The atmosphere, oceans, land, and living organisms all work together in complex ways. When we change one part of this system, like adding greenhouse gases to the atmosphere, it creates ripple effects throughout all other systems.',
            backgroundImage: 'earth_balance.jpg',
            soundEffect: 'ambient_earth.mp3'
        },
        {
            title: 'Chapter 2: The Warming World',
            content: 'As greenhouse gases trap more heat in our atmosphere, global temperatures rise. This warming doesn\'t happen uniformly - polar regions warm faster, disrupting weather patterns worldwide. The jet stream weakens, causing extreme weather events to become more frequent and severe. What starts as a change in atmospheric chemistry becomes floods, droughts, and storms that affect millions.',
            backgroundImage: 'warming_world.jpg',
            soundEffect: 'weather_change.mp3'
        },
        {
            title: 'Chapter 3: Water in Crisis',
            content: 'Rising temperatures accelerate the water cycle. More water evaporates from warming oceans, leading to intense rainfall in some regions while others face severe droughts. Glaciers and ice sheets melt, raising sea levels and threatening coastal communities. Freshwater becomes scarce where it\'s needed most, affecting agriculture and triggering conflicts over water resources.',
            backgroundImage: 'water_crisis.jpg',
            soundEffect: 'water_flow.mp3'
        },
        {
            title: 'Chapter 4: Life Under Pressure',
            content: 'Ecosystems that took millennia to develop are changing in decades. Species must adapt, migrate, or face extinction. Coral reefs bleach in warming oceans, forests shift toward the poles, and the timing of natural events like flowering and migration falls out of sync. Each species lost weakens the web of life that provides us with food, clean air, and water.',
            backgroundImage: 'biodiversity_loss.jpg',
            soundEffect: 'nature_sounds.mp3'
        },
        {
            title: 'Chapter 5: The Path Forward',
            content: 'Understanding these connections empowers us to act. By seeing Earth as one interconnected system, we can make better decisions. Protecting forests helps regulate climate and preserve biodiversity. Transitioning to renewable energy reduces atmospheric pollution and slows warming. Every action we take ripples through the Earth system, and together, our actions can create positive change.',
            backgroundImage: 'future_hope.jpg',
            soundEffect: 'hopeful_future.mp3'
        }
    ],

    // Historical Climate Data (simulated)
    generateHistoricalData: function() {
        var data = [];
        var baseTemp = 14;
        var baseCO2 = 325;
        var baseSeaLevel = 0;
        
        for (var i = 0; i < 50; i++) {
            var year = 1970 + i;
            data.push({
                year: year,
                temperature: baseTemp + Math.random() * 0.3 + i * 0.022,
                co2: baseCO2 + i * 1.9 + Math.random() * 5,
                seaLevel: baseSeaLevel + i * 3.3 + Math.random() * 2,
                iceExtent: 7.5 - i * 0.03 + Math.random() * 0.5,
                forestCover: 31.6 - i * 0.02 + Math.random() * 0.3
            });
        }
        return data;
    },

    // Simulation Calculations
    calculateSimulationImpacts: function(temperature, co2, deforestation) {
        return [
            {
                value: Math.round(temperature * 15) + '%',
                label: 'Extreme Weather Events',
                icon: '🌪️'
            },
            {
                value: Math.round(deforestation * 2.5) + 'M',
                label: 'Species at Risk',
                icon: '🦎'
            },
            {
                value: Math.round(co2 / 10 - 30) + '%',
                label: 'Crop Yield Change',
                icon: '🌽'
            },
            {
                value: Math.round(temperature * 100) + 'M',
                label: 'Climate Refugees',
                icon: '👥'
            },
            {
                value: Math.round(temperature * 3.3) + 'mm/yr',
                label: 'Sea Level Rise',
                icon: '🌊'
            },
            {
                value: '$' + Math.round(temperature * 2) + 'T',
                label: 'Economic Impact',
                icon: '💰'
            }
        ];
    },

    // NASA API Endpoints (examples)
    nasaAPIs: {
        earthImagery: 'https://api.nasa.gov/planetary/earth/imagery',
        climate: 'https://climate.nasa.gov/system/internal_resources/details/original/',
        fires: 'https://firms.modaps.eosdis.nasa.gov/api/area/',
        airQuality: 'https://api.nasa.gov/insight_weather/',
        satellites: {
            landsat: 'https://landsat.usgs.gov/landsat-data-access',
            modis: 'https://modis.gsfc.nasa.gov/data/',
            viirs: 'https://www.earthdata.nasa.gov/learn/find-data/near-real-time/firms'
        }
    },

    // Educational Resources
    educationalContent: {
        beginner: {
            title: 'Understanding Earth Systems',
            topics: ['What is Climate?', 'The Water Cycle', 'How Ecosystems Work'],
            interactiveElements: ['Simple Quiz', 'Drag and Drop', 'Memory Game']
        },
        intermediate: {
            title: 'Climate Change Impacts',
            topics: ['Greenhouse Effect', 'Feedback Loops', 'Tipping Points'],
            interactiveElements: ['Simulations', 'Data Explorer', 'Predictions']
        },
        advanced: {
            title: 'Solutions and Actions',
            topics: ['Renewable Energy', 'Conservation', 'Policy Actions'],
            interactiveElements: ['Carbon Calculator', 'Solution Designer', 'Impact Tracker']
        }
    },

    // Feedback Messages
    messages: {
        welcome: 'Welcome to Connected Earth! Explore how our planet\'s systems interact.',
        systemSelected: 'Click on connections to see how this system affects others.',
        simulationUpdate: 'See how your changes affect Earth\'s interconnected systems.',
        storyProgress: 'Continue reading to understand our planet\'s story.',
        dataLoading: 'Loading NASA satellite data...',
        interactionHint: 'Hover over elements to see more details.'
    }
};