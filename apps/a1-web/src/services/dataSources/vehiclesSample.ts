/**
 * Synthetic vehicle catalog for data-binding demos.
 *
 * The rows are deterministic and deliberately broad rather than manufacturer
 * certified. They cover 120 vehicles across body styles, model years, and
 * gasoline, diesel, hybrid, plug-in hybrid, electric, and hydrogen powertrains.
 * Image URLs are illustrative stock photography, not photos of the named model.
 */
import type { CreateDataSourceInput, DataColumn, DataRow } from './types';

type Powertrain = 'Gasoline' | 'Diesel' | 'Hybrid' | 'Plug-in hybrid' | 'Electric' | 'Hydrogen';

interface VehicleBlueprint {
  make: string;
  model: string;
  bodyStyle: string;
  vehicleType: string;
  segment: string;
  powertrain: Powertrain;
  startYear: number;
  basePrice: number;
  horsepower: number;
  torqueLbFt: number;
  displacementL: number;
  cylinders: number;
  drivetrain: string;
  seats: number;
  doors: number;
  lengthIn: number;
  widthIn: number;
  heightIn: number;
  wheelbaseIn: number;
  curbWeightLb: number;
  cargoCuFt: number;
  towLb: number;
  imageSet: number;
}

const columns = (
  definitions: Array<[key: string, name: string, type?: DataColumn['type']]>,
): DataColumn[] => definitions.map(([key, name, type = 'text']) => ({ key, name, type }));

export const VEHICLE_COLUMNS: DataColumn[] = columns([
  // Identity and merchandising
  ['stockNumber', 'Stock number'],
  ['vin', 'VIN'],
  ['year', 'Year', 'number'],
  ['make', 'Make'],
  ['model', 'Model'],
  ['trim', 'Trim'],
  ['name', 'Display name'],
  ['slug', 'Slug'],
  ['vehicleType', 'Vehicle type'],
  ['bodyStyle', 'Body style'],
  ['segment', 'Segment'],
  ['condition', 'Condition'],
  ['certifiedPreOwned', 'Certified pre-owned', 'boolean'],
  ['availability', 'Availability'],
  ['daysInInventory', 'Days in inventory', 'number'],
  ['mileage', 'Mileage', 'number'],
  ['exteriorColor', 'Exterior color'],
  ['interiorColor', 'Interior color'],
  ['description', 'Description'],
  ['highlights', 'Highlights'],

  // Pricing and ownership
  ['msrp', 'MSRP', 'number'],
  ['salePrice', 'Sale price', 'number'],
  ['destinationCharge', 'Destination charge', 'number'],
  ['estimatedMonthlyPayment', 'Estimated monthly payment', 'number'],
  ['leaseMonthly', 'Lease monthly', 'number'],
  ['leaseDueAtSigning', 'Lease due at signing', 'number'],
  ['currency', 'Currency'],
  ['marketAdjustment', 'Market adjustment', 'number'],
  ['federalIncentive', 'Federal incentive', 'number'],
  ['estimatedFiveYearFuelCost', 'Estimated five-year fuel cost', 'number'],
  ['estimatedFiveYearMaintenance', 'Estimated five-year maintenance', 'number'],
  ['estimatedFiveYearDepreciation', 'Estimated five-year depreciation', 'number'],

  // Engine, motor, battery, and transmission
  ['powertrain', 'Powertrain'],
  ['fuelType', 'Fuel type'],
  ['engineName', 'Engine name'],
  ['engineCode', 'Engine code'],
  ['engineConfiguration', 'Engine configuration'],
  ['engineLocation', 'Engine location'],
  ['displacementL', 'Displacement (L)', 'number'],
  ['displacementCc', 'Displacement (cc)', 'number'],
  ['cylinders', 'Cylinders', 'number'],
  ['valves', 'Valves', 'number'],
  ['valvetrain', 'Valvetrain'],
  ['aspiration', 'Aspiration'],
  ['compressionRatio', 'Compression ratio', 'number'],
  ['boreIn', 'Engine bore (in)', 'number'],
  ['strokeIn', 'Engine stroke (in)', 'number'],
  ['fuelDelivery', 'Fuel delivery'],
  ['recommendedFuel', 'Recommended fuel'],
  ['emissionsStandard', 'Emissions standard'],
  ['electricMotorCount', 'Electric motor count', 'number'],
  ['motorType', 'Motor type'],
  ['motorPlacement', 'Motor placement'],
  ['batteryChemistry', 'Battery chemistry'],
  ['batteryCapacityKwh', 'Battery capacity (kWh)', 'number'],
  ['usableBatteryKwh', 'Usable battery (kWh)', 'number'],
  ['batteryVoltage', 'Battery voltage', 'number'],
  ['onboardChargerKw', 'Onboard charger (kW)', 'number'],
  ['dcFastChargeKw', 'DC fast charge (kW)', 'number'],
  ['chargePort', 'Charge port'],
  ['transmission', 'Transmission'],
  ['transmissionSpeeds', 'Transmission speeds', 'number'],
  ['shiftMode', 'Shift mode'],
  ['drivetrain', 'Drivetrain'],
  ['transferCase', 'Transfer case'],
  ['differential', 'Differential'],

  // Output, performance, and capability
  ['horsepower', 'Horsepower', 'number'],
  ['horsepowerRpm', 'Horsepower RPM', 'number'],
  ['torqueLbFt', 'Torque (lb-ft)', 'number'],
  ['torqueRpm', 'Torque RPM', 'number'],
  ['systemPowerKw', 'System power (kW)', 'number'],
  ['zeroToSixtySec', '0–60 mph (sec)', 'number'],
  ['quarterMileSec', 'Quarter mile (sec)', 'number'],
  ['topSpeedMph', 'Top speed (mph)', 'number'],
  ['powerToWeight', 'Power-to-weight (hp/ton)', 'number'],
  ['towCapacityLb', 'Tow capacity (lb)', 'number'],
  ['payloadCapacityLb', 'Payload capacity (lb)', 'number'],
  ['grossVehicleWeightLb', 'Gross vehicle weight (lb)', 'number'],
  ['groundClearanceIn', 'Ground clearance (in)', 'number'],
  ['approachAngleDeg', 'Approach angle (deg)', 'number'],
  ['departureAngleDeg', 'Departure angle (deg)', 'number'],
  ['breakoverAngleDeg', 'Breakover angle (deg)', 'number'],
  ['wadingDepthIn', 'Wading depth (in)', 'number'],

  // Efficiency, range, and charging
  ['epaCityMpg', 'EPA city (mpg)', 'number'],
  ['epaHighwayMpg', 'EPA highway (mpg)', 'number'],
  ['epaCombinedMpg', 'EPA combined (mpg)', 'number'],
  ['epaCombinedMpge', 'EPA combined (MPGe)', 'number'],
  ['electricRangeMi', 'Electric range (mi)', 'number'],
  ['totalRangeMi', 'Total range (mi)', 'number'],
  ['fuelTankGal', 'Fuel tank (gal)', 'number'],
  ['chargeTimeLevel1Hr', 'Level 1 charge time (hr)', 'number'],
  ['chargeTimeLevel2Hr', 'Level 2 charge time (hr)', 'number'],
  ['dcCharge10To80Min', 'DC charge 10–80% (min)', 'number'],
  ['energyConsumptionKwh100Mi', 'Energy consumption (kWh/100 mi)', 'number'],
  ['co2GPerMi', 'CO2 (g/mi)', 'number'],
  ['regenerativeBraking', 'Regenerative braking'],
  ['heatPump', 'Heat pump', 'boolean'],
  ['batteryPreconditioning', 'Battery preconditioning', 'boolean'],

  // Dimensions and capacities
  ['lengthIn', 'Length (in)', 'number'],
  ['widthIn', 'Width (in)', 'number'],
  ['widthMirrorsIn', 'Width with mirrors (in)', 'number'],
  ['heightIn', 'Height (in)', 'number'],
  ['wheelbaseIn', 'Wheelbase (in)', 'number'],
  ['frontTrackIn', 'Front track (in)', 'number'],
  ['rearTrackIn', 'Rear track (in)', 'number'],
  ['curbWeightLb', 'Curb weight (lb)', 'number'],
  ['weightDistribution', 'Weight distribution'],
  ['dragCoefficient', 'Drag coefficient', 'number'],
  ['frontalAreaSqFt', 'Frontal area (sq ft)', 'number'],
  ['turningCircleFt', 'Turning circle (ft)', 'number'],
  ['seatingCapacity', 'Seating capacity', 'number'],
  ['doors', 'Doors', 'number'],
  ['rows', 'Seat rows', 'number'],
  ['passengerVolumeCuFt', 'Passenger volume (cu ft)', 'number'],
  ['cargoBehindFirstRowCuFt', 'Cargo behind first row (cu ft)', 'number'],
  ['cargoBehindSecondRowCuFt', 'Cargo behind second row (cu ft)', 'number'],
  ['cargoBehindThirdRowCuFt', 'Cargo behind third row (cu ft)', 'number'],
  ['frunkVolumeCuFt', 'Frunk volume (cu ft)', 'number'],
  ['frontHeadroomIn', 'Front headroom (in)', 'number'],
  ['frontLegroomIn', 'Front legroom (in)', 'number'],
  ['frontShoulderRoomIn', 'Front shoulder room (in)', 'number'],
  ['rearHeadroomIn', 'Rear headroom (in)', 'number'],
  ['rearLegroomIn', 'Rear legroom (in)', 'number'],
  ['rearShoulderRoomIn', 'Rear shoulder room (in)', 'number'],

  // Chassis, steering, suspension, wheels, tires, and brakes
  ['platform', 'Platform'],
  ['bodyConstruction', 'Body construction'],
  ['frontSuspension', 'Front suspension'],
  ['rearSuspension', 'Rear suspension'],
  ['adaptiveDampers', 'Adaptive dampers', 'boolean'],
  ['airSuspension', 'Air suspension', 'boolean'],
  ['steeringType', 'Steering type'],
  ['steeringRatio', 'Steering ratio', 'number'],
  ['frontBrakeType', 'Front brake type'],
  ['rearBrakeType', 'Rear brake type'],
  ['frontRotorIn', 'Front rotor (in)', 'number'],
  ['rearRotorIn', 'Rear rotor (in)', 'number'],
  ['brakeAssist', 'Brake assist', 'boolean'],
  ['parkingBrake', 'Parking brake'],
  ['wheelMaterial', 'Wheel material'],
  ['frontWheelSize', 'Front wheel size'],
  ['rearWheelSize', 'Rear wheel size'],
  ['frontTireSize', 'Front tire size'],
  ['rearTireSize', 'Rear tire size'],
  ['spareTire', 'Spare tire'],
  ['allSeasonTires', 'All-season tires', 'boolean'],
  ['runFlatTires', 'Run-flat tires', 'boolean'],

  // Exterior
  ['headlights', 'Headlights'],
  ['automaticHighBeams', 'Automatic high beams', 'boolean'],
  ['adaptiveHeadlights', 'Adaptive headlights', 'boolean'],
  ['daytimeRunningLights', 'Daytime running lights', 'boolean'],
  ['fogLights', 'Fog lights', 'boolean'],
  ['rainSensingWipers', 'Rain-sensing wipers', 'boolean'],
  ['heatedMirrors', 'Heated mirrors', 'boolean'],
  ['powerFoldingMirrors', 'Power-folding mirrors', 'boolean'],
  ['handsFreeLiftgate', 'Hands-free liftgate', 'boolean'],
  ['powerLiftgate', 'Power liftgate', 'boolean'],
  ['roofType', 'Roof type'],
  ['roofRails', 'Roof rails', 'boolean'],
  ['runningBoards', 'Running boards', 'boolean'],
  ['bedLengthIn', 'Bed length (in)', 'number'],
  ['trailerHitch', 'Trailer hitch', 'boolean'],

  // Interior and comfort
  ['upholstery', 'Upholstery'],
  ['frontSeatType', 'Front seat type'],
  ['driverSeatAdjustments', 'Driver seat adjustments', 'number'],
  ['passengerSeatAdjustments', 'Passenger seat adjustments', 'number'],
  ['heatedFrontSeats', 'Heated front seats', 'boolean'],
  ['ventilatedFrontSeats', 'Ventilated front seats', 'boolean'],
  ['heatedRearSeats', 'Heated rear seats', 'boolean'],
  ['massagingFrontSeats', 'Massaging front seats', 'boolean'],
  ['memoryDriverSeat', 'Memory driver seat', 'boolean'],
  ['steeringWheelMaterial', 'Steering wheel material'],
  ['heatedSteeringWheel', 'Heated steering wheel', 'boolean'],
  ['climateZones', 'Climate zones', 'number'],
  ['rearClimateControls', 'Rear climate controls', 'boolean'],
  ['remoteStart', 'Remote start', 'boolean'],
  ['keylessEntry', 'Keyless entry', 'boolean'],
  ['pushButtonStart', 'Push-button start', 'boolean'],
  ['ambientLighting', 'Ambient lighting'],
  ['interiorAirFilter', 'Interior air filter'],
  ['cabinNoiseDb70Mph', 'Cabin noise at 70 mph (dB)', 'number'],

  // Infotainment and connectivity
  ['infotainmentSystem', 'Infotainment system'],
  ['centerDisplayIn', 'Center display (in)', 'number'],
  ['instrumentDisplayIn', 'Instrument display (in)', 'number'],
  ['headUpDisplay', 'Head-up display', 'boolean'],
  ['appleCarPlay', 'Apple CarPlay'],
  ['androidAuto', 'Android Auto'],
  ['navigation', 'Navigation', 'boolean'],
  ['voiceAssistant', 'Voice assistant'],
  ['wifiHotspot', 'Wi-Fi hotspot', 'boolean'],
  ['bluetooth', 'Bluetooth', 'boolean'],
  ['usbAPorts', 'USB-A ports', 'number'],
  ['usbCPorts', 'USB-C ports', 'number'],
  ['wirelessCharging', 'Wireless charging', 'boolean'],
  ['audioBrand', 'Audio brand'],
  ['speakerCount', 'Number of speakers', 'number'],
  ['subwoofer', 'Subwoofer', 'boolean'],
  ['satelliteRadio', 'Satellite radio', 'boolean'],
  ['otaUpdates', 'Over-the-air updates', 'boolean'],
  ['digitalKey', 'Digital key', 'boolean'],
  ['mobileApp', 'Mobile app', 'boolean'],

  // Safety and driver assistance
  ['nhtsaOverallRating', 'NHTSA overall rating', 'number'],
  ['iihsRating', 'IIHS rating'],
  ['airbagCount', 'Airbag count', 'number'],
  ['frontAirbags', 'Front airbags', 'boolean'],
  ['frontSideAirbags', 'Front side airbags', 'boolean'],
  ['rearSideAirbags', 'Rear side airbags', 'boolean'],
  ['sideCurtainAirbags', 'Side curtain airbags', 'boolean'],
  ['driverKneeAirbag', 'Driver knee airbag', 'boolean'],
  ['passengerKneeAirbag', 'Passenger knee airbag', 'boolean'],
  ['centerAirbag', 'Front center airbag', 'boolean'],
  ['abs', 'Anti-lock brakes', 'boolean'],
  ['tractionControl', 'Traction control', 'boolean'],
  ['stabilityControl', 'Stability control', 'boolean'],
  ['tirePressureMonitoring', 'Tire-pressure monitoring', 'boolean'],
  ['forwardCollisionWarning', 'Forward-collision warning', 'boolean'],
  ['automaticEmergencyBraking', 'Automatic emergency braking', 'boolean'],
  ['pedestrianDetection', 'Pedestrian detection', 'boolean'],
  ['cyclistDetection', 'Cyclist detection', 'boolean'],
  ['laneDepartureWarning', 'Lane-departure warning', 'boolean'],
  ['laneKeepingAssist', 'Lane-keeping assist', 'boolean'],
  ['laneCentering', 'Lane centering', 'boolean'],
  ['blindSpotMonitoring', 'Blind-spot monitoring', 'boolean'],
  ['rearCrossTrafficAlert', 'Rear cross-traffic alert', 'boolean'],
  ['adaptiveCruiseControl', 'Adaptive cruise control', 'boolean'],
  ['trafficSignRecognition', 'Traffic-sign recognition', 'boolean'],
  ['driverAttentionMonitor', 'Driver-attention monitor', 'boolean'],
  ['rearOccupantAlert', 'Rear-occupant alert', 'boolean'],
  ['parkingSensorsFront', 'Front parking sensors', 'boolean'],
  ['parkingSensorsRear', 'Rear parking sensors', 'boolean'],
  ['surroundViewCamera', 'Surround-view camera', 'boolean'],
  ['automaticParking', 'Automatic parking', 'boolean'],
  ['nightVision', 'Night vision', 'boolean'],
  ['handsFreeDriving', 'Hands-free driving'],

  // Warranty and service
  ['basicWarrantyYears', 'Basic warranty (years)', 'number'],
  ['basicWarrantyMiles', 'Basic warranty (miles)', 'number'],
  ['powertrainWarrantyYears', 'Powertrain warranty (years)', 'number'],
  ['powertrainWarrantyMiles', 'Powertrain warranty (miles)', 'number'],
  ['batteryWarrantyYears', 'Battery warranty (years)', 'number'],
  ['batteryWarrantyMiles', 'Battery warranty (miles)', 'number'],
  ['corrosionWarrantyYears', 'Corrosion warranty (years)', 'number'],
  ['roadsideAssistanceYears', 'Roadside assistance (years)', 'number'],
  ['complimentaryMaintenanceYears', 'Complimentary maintenance (years)', 'number'],
  ['serviceIntervalMiles', 'Service interval (miles)', 'number'],

  // Illustrative image series
  ['imageHero', 'Hero image'],
  ['imageExteriorFront', 'Exterior front image'],
  ['imageExteriorRear', 'Exterior rear image'],
  ['imageExteriorSide', 'Exterior side image'],
  ['imageInteriorFront', 'Interior front image'],
  ['imageDashboard', 'Dashboard image'],
  ['imageRearSeats', 'Rear seats image'],
  ['imageCargo', 'Cargo image'],
  ['imageAlt', 'Image alt text'],
]);

const BLUEPRINTS: VehicleBlueprint[] = [
  { make: 'Aster', model: 'Aero', bodyStyle: 'Sedan', vehicleType: 'Passenger car', segment: 'Compact', powertrain: 'Gasoline', startYear: 2001, basePrice: 21900, horsepower: 158, torqueLbFt: 138, displacementL: 2.0, cylinders: 4, drivetrain: 'FWD', seats: 5, doors: 4, lengthIn: 182, widthIn: 70.8, heightIn: 56.5, wheelbaseIn: 107.2, curbWeightLb: 2980, cargoCuFt: 14.3, towLb: 0, imageSet: 0 },
  { make: 'Aster', model: 'Grand Touring', bodyStyle: 'Wagon', vehicleType: 'Passenger car', segment: 'Midsize', powertrain: 'Diesel', startYear: 2004, basePrice: 28900, horsepower: 188, torqueLbFt: 295, displacementL: 2.2, cylinders: 4, drivetrain: 'FWD', seats: 5, doors: 5, lengthIn: 190, widthIn: 72.1, heightIn: 58.2, wheelbaseIn: 111.4, curbWeightLb: 3540, cargoCuFt: 31.0, towLb: 2200, imageSet: 1 },
  { make: 'Boreal', model: 'Metro', bodyStyle: 'Hatchback', vehicleType: 'Passenger car', segment: 'Subcompact', powertrain: 'Gasoline', startYear: 1998, basePrice: 16900, horsepower: 121, torqueLbFt: 113, displacementL: 1.6, cylinders: 4, drivetrain: 'FWD', seats: 5, doors: 5, lengthIn: 161, widthIn: 68.0, heightIn: 57.4, wheelbaseIn: 101.6, curbWeightLb: 2520, cargoCuFt: 17.8, towLb: 0, imageSet: 2 },
  { make: 'Boreal', model: 'Summit', bodyStyle: 'SUV', vehicleType: 'Crossover', segment: 'Compact', powertrain: 'Hybrid', startYear: 2006, basePrice: 31900, horsepower: 204, torqueLbFt: 247, displacementL: 2.5, cylinders: 4, drivetrain: 'AWD', seats: 5, doors: 5, lengthIn: 181, widthIn: 73.2, heightIn: 66.1, wheelbaseIn: 106.8, curbWeightLb: 3820, cargoCuFt: 29.4, towLb: 2000, imageSet: 3 },
  { make: 'Caldera', model: 'Ridge', bodyStyle: 'SUV', vehicleType: 'Sport utility', segment: 'Midsize', powertrain: 'Gasoline', startYear: 2002, basePrice: 37900, horsepower: 285, torqueLbFt: 262, displacementL: 3.5, cylinders: 6, drivetrain: '4WD', seats: 7, doors: 5, lengthIn: 196, widthIn: 78.0, heightIn: 70.5, wheelbaseIn: 114.2, curbWeightLb: 4480, cargoCuFt: 18.1, towLb: 5000, imageSet: 4 },
  { make: 'Caldera', model: 'Trailmaster', bodyStyle: 'SUV', vehicleType: 'Off-road vehicle', segment: 'Midsize', powertrain: 'Plug-in hybrid', startYear: 2012, basePrice: 51900, horsepower: 375, torqueLbFt: 470, displacementL: 2.0, cylinders: 4, drivetrain: '4WD', seats: 5, doors: 5, lengthIn: 188, widthIn: 75.9, heightIn: 73.2, wheelbaseIn: 110.5, curbWeightLb: 4980, cargoCuFt: 27.7, towLb: 6000, imageSet: 5 },
  { make: 'Caspian', model: 'Sovereign', bodyStyle: 'Sedan', vehicleType: 'Luxury car', segment: 'Full-size', powertrain: 'Gasoline', startYear: 2000, basePrice: 68900, horsepower: 355, torqueLbFt: 369, displacementL: 3.0, cylinders: 6, drivetrain: 'RWD', seats: 5, doors: 4, lengthIn: 201, widthIn: 74.8, heightIn: 58.4, wheelbaseIn: 119.6, curbWeightLb: 4260, cargoCuFt: 17.0, towLb: 0, imageSet: 6 },
  { make: 'Caspian', model: 'Voltair', bodyStyle: 'Sedan', vehicleType: 'Luxury car', segment: 'Midsize', powertrain: 'Electric', startYear: 2016, basePrice: 57900, horsepower: 402, torqueLbFt: 486, displacementL: 0, cylinders: 0, drivetrain: 'AWD', seats: 5, doors: 4, lengthIn: 193, widthIn: 75.0, heightIn: 57.1, wheelbaseIn: 116.3, curbWeightLb: 4720, cargoCuFt: 16.2, towLb: 2000, imageSet: 7 },
  { make: 'Driftwood', model: 'Scout', bodyStyle: 'Pickup', vehicleType: 'Truck', segment: 'Midsize', powertrain: 'Gasoline', startYear: 2003, basePrice: 32900, horsepower: 278, torqueLbFt: 317, displacementL: 3.5, cylinders: 6, drivetrain: '4WD', seats: 5, doors: 4, lengthIn: 213, widthIn: 74.4, heightIn: 71.2, wheelbaseIn: 127.4, curbWeightLb: 4420, cargoCuFt: 0, towLb: 6800, imageSet: 8 },
  { make: 'Driftwood', model: 'Workhorse', bodyStyle: 'Pickup', vehicleType: 'Truck', segment: 'Full-size', powertrain: 'Diesel', startYear: 2005, basePrice: 48900, horsepower: 445, torqueLbFt: 910, displacementL: 6.6, cylinders: 8, drivetrain: '4WD', seats: 5, doors: 4, lengthIn: 250, widthIn: 80.0, heightIn: 79.8, wheelbaseIn: 158.9, curbWeightLb: 6980, cargoCuFt: 0, towLb: 18500, imageSet: 9 },
  { make: 'Evergreen', model: 'Family', bodyStyle: 'Minivan', vehicleType: 'Multi-purpose vehicle', segment: 'Midsize', powertrain: 'Hybrid', startYear: 2007, basePrice: 38900, horsepower: 245, torqueLbFt: 230, displacementL: 2.5, cylinders: 4, drivetrain: 'FWD', seats: 8, doors: 5, lengthIn: 204, widthIn: 78.5, heightIn: 69.7, wheelbaseIn: 120.4, curbWeightLb: 4660, cargoCuFt: 32.8, towLb: 3500, imageSet: 10 },
  { make: 'Evergreen', model: 'Sprout', bodyStyle: 'SUV', vehicleType: 'Crossover', segment: 'Subcompact', powertrain: 'Electric', startYear: 2018, basePrice: 33900, horsepower: 201, torqueLbFt: 266, displacementL: 0, cylinders: 0, drivetrain: 'FWD', seats: 5, doors: 5, lengthIn: 169, widthIn: 70.2, heightIn: 63.4, wheelbaseIn: 104.7, curbWeightLb: 3680, cargoCuFt: 24.1, towLb: 1000, imageSet: 11 },
  { make: 'Halcyon', model: 'Pulse', bodyStyle: 'Coupe', vehicleType: 'Sports car', segment: 'Compact', powertrain: 'Gasoline', startYear: 1999, basePrice: 42900, horsepower: 310, torqueLbFt: 280, displacementL: 3.0, cylinders: 6, drivetrain: 'RWD', seats: 4, doors: 2, lengthIn: 176, widthIn: 72.8, heightIn: 51.8, wheelbaseIn: 105.1, curbWeightLb: 3260, cargoCuFt: 10.2, towLb: 0, imageSet: 12 },
  { make: 'Halcyon', model: 'Roadster', bodyStyle: 'Convertible', vehicleType: 'Sports car', segment: 'Compact', powertrain: 'Electric', startYear: 2019, basePrice: 64900, horsepower: 469, torqueLbFt: 516, displacementL: 0, cylinders: 0, drivetrain: 'AWD', seats: 2, doors: 2, lengthIn: 174, widthIn: 73.3, heightIn: 49.9, wheelbaseIn: 102.4, curbWeightLb: 4020, cargoCuFt: 7.4, towLb: 0, imageSet: 13 },
  { make: 'Juniper', model: 'Crosswind', bodyStyle: 'SUV', vehicleType: 'Crossover', segment: 'Midsize', powertrain: 'Plug-in hybrid', startYear: 2014, basePrice: 44900, horsepower: 302, torqueLbFt: 369, displacementL: 2.4, cylinders: 4, drivetrain: 'AWD', seats: 5, doors: 5, lengthIn: 188, widthIn: 74.7, heightIn: 67.3, wheelbaseIn: 112.2, curbWeightLb: 4380, cargoCuFt: 30.1, towLb: 3500, imageSet: 14 },
  { make: 'Juniper', model: 'Cityline', bodyStyle: 'Sedan', vehicleType: 'Passenger car', segment: 'Midsize', powertrain: 'Hybrid', startYear: 2009, basePrice: 28900, horsepower: 212, torqueLbFt: 232, displacementL: 2.0, cylinders: 4, drivetrain: 'FWD', seats: 5, doors: 4, lengthIn: 190, widthIn: 72.6, heightIn: 56.9, wheelbaseIn: 111.8, curbWeightLb: 3480, cargoCuFt: 15.1, towLb: 0, imageSet: 15 },
  { make: 'Meridian', model: 'Atlas', bodyStyle: 'SUV', vehicleType: 'Sport utility', segment: 'Full-size', powertrain: 'Gasoline', startYear: 2001, basePrice: 55900, horsepower: 420, torqueLbFt: 460, displacementL: 5.0, cylinders: 8, drivetrain: '4WD', seats: 8, doors: 5, lengthIn: 211, widthIn: 81.0, heightIn: 76.2, wheelbaseIn: 121.7, curbWeightLb: 5840, cargoCuFt: 25.5, towLb: 8500, imageSet: 16 },
  { make: 'Meridian', model: 'Eon', bodyStyle: 'SUV', vehicleType: 'Crossover', segment: 'Midsize', powertrain: 'Electric', startYear: 2017, basePrice: 53900, horsepower: 384, torqueLbFt: 472, displacementL: 0, cylinders: 0, drivetrain: 'AWD', seats: 7, doors: 5, lengthIn: 194, widthIn: 77.4, heightIn: 67.8, wheelbaseIn: 118.1, curbWeightLb: 5260, cargoCuFt: 20.4, towLb: 5000, imageSet: 17 },
  { make: 'Northstar', model: 'Nexa', bodyStyle: 'Hatchback', vehicleType: 'Passenger car', segment: 'Compact', powertrain: 'Hydrogen', startYear: 2015, basePrice: 49900, horsepower: 182, torqueLbFt: 221, displacementL: 0, cylinders: 0, drivetrain: 'FWD', seats: 5, doors: 5, lengthIn: 175, widthIn: 70.7, heightIn: 58.6, wheelbaseIn: 106.3, curbWeightLb: 3980, cargoCuFt: 12.4, towLb: 0, imageSet: 18 },
  { make: 'Northstar', model: 'Courier', bodyStyle: 'Van', vehicleType: 'Commercial van', segment: 'Full-size', powertrain: 'Electric', startYear: 2018, basePrice: 48900, horsepower: 266, torqueLbFt: 317, displacementL: 0, cylinders: 0, drivetrain: 'RWD', seats: 3, doors: 4, lengthIn: 235, widthIn: 80.2, heightIn: 99.1, wheelbaseIn: 147.6, curbWeightLb: 6120, cargoCuFt: 420, towLb: 4000, imageSet: 19 },
];

const TRIMS = ['Core', 'Touring', 'Sport', 'Limited', 'Performance', 'Signature'];
const COLORS = ['Arctic white', 'Graphite gray', 'Midnight blue', 'Forest green', 'Crimson red', 'Solar silver'];
const INTERIORS = ['Black cloth', 'Charcoal leatherette', 'Saddle leather', 'Light gray cloth', 'Black leather', 'Ivory leather'];
const IMAGE_IDS = [
  '1492144534655-ae79c964c9d7',
  '1502877338535-766e1452684a',
  '1549317661-bd32c8ce0db2',
  '1553440569-bcc63803a83d',
  '1552519507-da3b142c6e3d',
  '1551830820-330a71b99659',
  '1503736334956-4c8f8e92946d',
  '1511919884226-fd3cad34687c',
  '1533473359331-0135ef1b58bf',
  '1542362567-b07e54358753',
  '1494905998402-395d579af36f',
  '1485291571150-772bcfc10da5',
  '1541899481282-d53bffe3c35d',
  '1549399542-7e3f8b79c341',
  '1525609004556-c46c7d6cf023',
  '1533106418989-88406c7cc8ca',
  '1519641471654-76ce0107ad1b',
  '1550355291-bbee04a92027',
  '1567818735868-e71b99932e29',
  '1570733117311-d990c3816c47',
  '1583121274602-3e2820c69888',
  '1594502184342-2e12f877aa73',
  '1606664515524-ed2f786a0bd6',
  '1618843479313-40f8afb4b4d8',
];

function round(value: number, places = 1): number {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function imageUrl(id: string, vehicleIndex: number, imageIndex: number): string {
  const positions = ['center', 'left', 'right', 'top', 'bottom'];
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&h=800&q=78&crop=${positions[(vehicleIndex + imageIndex) % positions.length]}`;
}

function vehicleImages(blueprint: VehicleBlueprint, vehicleIndex: number): Record<string, string> {
  const ids = Array.from({ length: 8 }, (_, index) => (
    IMAGE_IDS[(blueprint.imageSet + index * 3 + vehicleIndex) % IMAGE_IDS.length]
  ));
  return {
    imageHero: imageUrl(ids[0], vehicleIndex, 0),
    imageExteriorFront: imageUrl(ids[1], vehicleIndex, 1),
    imageExteriorRear: imageUrl(ids[2], vehicleIndex, 2),
    imageExteriorSide: imageUrl(ids[3], vehicleIndex, 3),
    imageInteriorFront: imageUrl(ids[4], vehicleIndex, 4),
    imageDashboard: imageUrl(ids[5], vehicleIndex, 5),
    imageRearSeats: imageUrl(ids[6], vehicleIndex, 6),
    imageCargo: imageUrl(ids[7], vehicleIndex, 7),
  };
}

function makeVehicle(blueprint: VehicleBlueprint, blueprintIndex: number, variant: number): DataRow {
  const yearStep = Math.max(1, Math.floor((2026 - blueprint.startYear) / 5));
  const year = Math.min(2026, blueprint.startYear + variant * yearStep);
  const age = 2026 - year;
  const trim = TRIMS[variant];
  const isNew = year >= 2024;
  const isElectric = blueprint.powertrain === 'Electric';
  const isHydrogen = blueprint.powertrain === 'Hydrogen';
  const isElectrified = isElectric || isHydrogen || blueprint.powertrain === 'Hybrid' || blueprint.powertrain === 'Plug-in hybrid';
  const isPlugIn = isElectric || blueprint.powertrain === 'Plug-in hybrid';
  const isTruck = blueprint.vehicleType === 'Truck';
  const isUtility = ['SUV', 'Pickup', 'Van', 'Minivan'].includes(blueprint.bodyStyle);
  const isPerformance = trim === 'Performance' || blueprint.vehicleType === 'Sports car';
  const luxury = trim === 'Limited' || trim === 'Signature' || blueprint.vehicleType === 'Luxury car';
  const powerMultiplier = 1 + variant * 0.035 + (trim === 'Performance' ? 0.12 : 0);
  const horsepower = Math.round(blueprint.horsepower * powerMultiplier);
  const torque = Math.round(blueprint.torqueLbFt * (1 + variant * 0.04));
  const curbWeight = Math.round(blueprint.curbWeightLb * (1 + variant * 0.008));
  const msrp = Math.round((blueprint.basePrice * (1 + variant * 0.075) * (1 + Math.max(0, year - 2015) * 0.012)) / 50) * 50;
  const mileage = isNew ? variant * 28 : Math.max(3200, age * (8800 + blueprintIndex * 115) + variant * 1700);
  const salePrice = Math.max(6900, Math.round((msrp * (isNew ? 0.965 : Math.max(0.24, 1 - age * 0.055))) / 50) * 50);
  const battery = isElectric ? 58 + blueprintIndex % 5 * 9 + variant * 3
    : blueprint.powertrain === 'Plug-in hybrid' ? 14 + variant * 1.4
      : blueprint.powertrain === 'Hybrid' ? 1.6 + variant * 0.2
        : isHydrogen ? 1.2 : 0;
  const electricRange = isElectric ? Math.round(215 + battery * 1.25 + variant * 8)
    : blueprint.powertrain === 'Plug-in hybrid' ? Math.round(24 + battery * 1.15)
      : 0;
  const combinedMpg = isElectric || isHydrogen ? 0
    : blueprint.powertrain === 'Hybrid' ? Math.round(40 + variant * 1.5 - blueprint.displacementL)
      : blueprint.powertrain === 'Plug-in hybrid' ? Math.round(34 + variant)
        : blueprint.powertrain === 'Diesel' ? Math.round(29 + variant * 0.8)
          : Math.round(clamp(35 - blueprint.displacementL * 3.3 - curbWeight / 1900 + variant * 0.4, 14, 39));
  const cityMpg = combinedMpg ? Math.max(10, combinedMpg - (isElectrified ? -2 : 3)) : 0;
  const highwayMpg = combinedMpg ? combinedMpg + (isElectrified ? -1 : 4) : 0;
  const mpge = isElectric ? Math.round(111 - curbWeight / 900 + variant * 2)
    : isHydrogen ? 68 : blueprint.powertrain === 'Plug-in hybrid' ? 82 + variant * 2 : 0;
  const totalRange = isElectric ? electricRange
    : isHydrogen ? 380 + variant * 7
      : Math.round((blueprint.bodyStyle === 'Pickup' ? 26 : 16) * Math.max(combinedMpg, 20) + electricRange);
  const length = round(blueprint.lengthIn + variant * 0.35);
  const wheelbase = round(blueprint.wheelbaseIn + variant * 0.18);
  const frontWheel = isPerformance || luxury ? 19 + (variant % 2) : isTruck ? 18 : 17 + (variant > 3 ? 1 : 0);
  const rearWheel = isPerformance ? frontWheel + 1 : frontWheel;
  const advancedSafety = year >= 2018;
  const modernSafety = year >= 2012;
  const airbags = year < 2004 ? 4 : year < 2012 ? 6 : year < 2020 ? 8 : 10 + (luxury ? 1 : 0);
  const speakers = luxury ? 16 + variant : isPerformance ? 12 : 6 + Math.min(variant, 4) * 2;
  const rows = blueprint.seats > 5 ? 3 : 2;
  const cargoSecond = blueprint.cargoCuFt;
  const cargoFirst = round(cargoSecond * (rows === 3 ? 3.1 : 2.25));
  const cargoThird = rows === 3 ? round(cargoSecond * 0.58) : 0;
  const bore = blueprint.cylinders ? round(3.05 + blueprint.displacementL * 0.12, 2) : 0;
  const stroke = blueprint.cylinders ? round(3.12 + blueprint.displacementL * 0.1, 2) : 0;
  const slug = `${year}-${blueprint.make}-${blueprint.model}-${trim}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const images = vehicleImages(blueprint, blueprintIndex * 6 + variant);
  const stock = `A1V-${String(blueprintIndex + 1).padStart(2, '0')}${variant + 1}-${String(year).slice(-2)}`;
  const vinSeed = `${blueprintIndex + 10}${variant + 1}${year}${horsepower}${curbWeight}`.replace(/\D/g, '');
  const vin = `1A1${vinSeed.padEnd(14, '7').slice(0, 14)}`;
  const engineLabel = isElectric ? 'Permanent-magnet electric drive'
    : isHydrogen ? 'Hydrogen fuel-cell electric drive'
      : `${round(blueprint.displacementL, 1)}L ${blueprint.cylinders === 4 ? 'inline-four' : blueprint.cylinders === 6 ? 'V6' : 'V8'}${blueprint.powertrain.includes('Hybrid') || blueprint.powertrain === 'Hybrid' ? ' hybrid' : ''}`;

  return {
    stockNumber: stock,
    vin,
    year,
    make: blueprint.make,
    model: blueprint.model,
    trim,
    name: `${year} ${blueprint.make} ${blueprint.model} ${trim}`,
    slug,
    vehicleType: blueprint.vehicleType,
    bodyStyle: blueprint.bodyStyle,
    segment: blueprint.segment,
    condition: isNew ? 'New' : mileage < 30000 ? 'Excellent used' : mileage < 80000 ? 'Good used' : 'High-mileage used',
    certifiedPreOwned: !isNew && year >= 2021 && variant % 2 === 0,
    availability: variant === 5 ? 'In transit' : variant === 4 ? 'Reserved' : 'Available',
    daysInInventory: isNew ? 4 + variant * 3 : 12 + blueprintIndex * 2 + variant * 5,
    mileage,
    exteriorColor: COLORS[(blueprintIndex + variant) % COLORS.length],
    interiorColor: INTERIORS[(blueprintIndex * 2 + variant) % INTERIORS.length],
    description: `${blueprint.powertrain} ${blueprint.bodyStyle.toLowerCase()} with ${horsepower} hp, ${blueprint.seats} seats, ${blueprint.drivetrain}, and a ${trim.toLowerCase()} equipment package.`,
    highlights: `${isPlugIn ? `${electricRange}-mile electric range; ` : ''}${isUtility ? `${blueprint.towLb.toLocaleString()}-lb tow rating; ` : ''}${speakers}-speaker audio; ${advancedSafety ? 'full driver-assistance suite' : 'core safety equipment'}`,

    msrp,
    salePrice,
    destinationCharge: isNew ? 1195 + (isTruck ? 300 : 0) : 0,
    estimatedMonthlyPayment: Math.round(salePrice / 60 * 1.13),
    leaseMonthly: isNew ? Math.round(msrp / 115) : 0,
    leaseDueAtSigning: isNew ? 2999 + variant * 250 : 0,
    currency: 'USD',
    marketAdjustment: isNew && variant === 5 ? 1500 : 0,
    federalIncentive: isPlugIn && year >= 2023 ? (isElectric ? 7500 : 3750) : 0,
    estimatedFiveYearFuelCost: isElectric ? 4700 : isHydrogen ? 9800 : Math.round(15000 / Math.max(combinedMpg, 18) * 3.65 * 5),
    estimatedFiveYearMaintenance: isElectric ? 3100 : isElectrified ? 4400 : 5200 + blueprint.cylinders * 180,
    estimatedFiveYearDepreciation: Math.round(msrp * (isElectric ? 0.48 : luxury ? 0.52 : 0.42)),

    powertrain: blueprint.powertrain,
    fuelType: isElectric ? 'Electricity' : isHydrogen ? 'Compressed hydrogen' : blueprint.powertrain === 'Diesel' ? 'Ultra-low-sulfur diesel' : blueprint.powertrain.includes('Hybrid') || blueprint.powertrain === 'Hybrid' ? 'Regular gasoline and electricity' : isPerformance ? 'Premium gasoline' : 'Regular gasoline',
    engineName: engineLabel,
    engineCode: blueprint.cylinders ? `${blueprint.make.slice(0, 2)}${Math.round(blueprint.displacementL * 10)}-${blueprint.cylinders}` : 'Not applicable',
    engineConfiguration: blueprint.cylinders ? (blueprint.cylinders === 4 ? 'Inline' : 'V') : 'Not applicable',
    engineLocation: isElectric ? 'Front and rear axles' : 'Front',
    displacementL: blueprint.displacementL,
    displacementCc: Math.round(blueprint.displacementL * 1000),
    cylinders: blueprint.cylinders,
    valves: blueprint.cylinders * 4,
    valvetrain: blueprint.cylinders ? 'DOHC variable valve timing' : 'Not applicable',
    aspiration: blueprint.cylinders ? (horsepower > 320 || blueprint.powertrain === 'Diesel' ? 'Turbocharged' : 'Naturally aspirated') : 'Not applicable',
    compressionRatio: blueprint.cylinders ? round(9.8 + (blueprint.powertrain === 'Diesel' ? 6.2 : isElectrified ? 3.1 : variant * 0.15), 1) : 0,
    boreIn: bore,
    strokeIn: stroke,
    fuelDelivery: blueprint.cylinders ? 'Direct injection' : 'Not applicable',
    recommendedFuel: isElectric ? 'Not applicable' : isHydrogen ? 'SAE J2601 hydrogen' : isPerformance || luxury ? 'Premium unleaded' : blueprint.powertrain === 'Diesel' ? 'Diesel' : 'Regular unleaded',
    emissionsStandard: year >= 2022 ? 'Tier 3 Bin 30' : year >= 2010 ? 'Tier 2 Bin 5' : 'Period compliant',
    electricMotorCount: isElectric ? (blueprint.drivetrain === 'AWD' ? 2 : 1) : isElectrified ? 1 : 0,
    motorType: isElectrified ? 'Permanent-magnet synchronous' : 'Not applicable',
    motorPlacement: isElectric ? (blueprint.drivetrain === 'AWD' ? 'Front and rear' : 'Front') : isElectrified ? 'Transmission integrated' : 'Not applicable',
    batteryChemistry: isPlugIn ? 'Lithium-ion NMC' : blueprint.powertrain === 'Hybrid' ? 'Lithium-ion' : isHydrogen ? 'Lithium-ion buffer' : 'Not applicable',
    batteryCapacityKwh: round(battery, 1),
    usableBatteryKwh: round(battery * (isPlugIn ? 0.91 : 0.82), 1),
    batteryVoltage: isElectric ? 400 + (variant >= 4 ? 400 : 0) : isElectrified ? 240 : 12,
    onboardChargerKw: isElectric ? (variant >= 4 ? 11.5 : 9.6) : blueprint.powertrain === 'Plug-in hybrid' ? 7.2 : 0,
    dcFastChargeKw: isElectric ? 125 + variant * 35 : blueprint.powertrain === 'Plug-in hybrid' && year >= 2024 ? 50 : 0,
    chargePort: isPlugIn ? (year >= 2025 ? 'NACS' : 'CCS Combo 1') : 'Not applicable',
    transmission: isElectric || isHydrogen ? 'Single-speed reduction gear' : blueprint.powertrain === 'Hybrid' ? 'Electronic continuously variable' : variant < 2 && isPerformance ? 'Six-speed manual' : `${6 + Math.min(variant, 4)}-speed automatic`,
    transmissionSpeeds: isElectric || isHydrogen || blueprint.powertrain === 'Hybrid' ? 1 : 6 + Math.min(variant, 4),
    shiftMode: isElectric || blueprint.powertrain === 'Hybrid' ? 'Electronic selector' : variant < 2 && isPerformance ? 'Manual' : 'Automatic with manual mode',
    drivetrain: blueprint.drivetrain,
    transferCase: blueprint.drivetrain === '4WD' ? 'Two-speed electronic' : 'Not applicable',
    differential: isPerformance ? 'Electronic limited-slip' : blueprint.drivetrain === 'AWD' || blueprint.drivetrain === '4WD' ? 'Active torque vectoring' : 'Open',

    horsepower,
    horsepowerRpm: blueprint.cylinders ? 5800 + variant * 100 : 0,
    torqueLbFt: torque,
    torqueRpm: blueprint.cylinders ? 1800 + variant * 100 : 0,
    systemPowerKw: Math.round(horsepower * 0.7457),
    zeroToSixtySec: round(clamp(9.8 - horsepower / 75 + curbWeight / 1900, 2.8, 11.5), 1),
    quarterMileSec: round(clamp(17.5 - horsepower / 115 + curbWeight / 2400, 10.8, 19.2), 1),
    topSpeedMph: Math.round(clamp(105 + horsepower / 5.5, 108, isPerformance ? 190 : 155)),
    powerToWeight: Math.round(horsepower / (curbWeight / 2000)),
    towCapacityLb: Math.round(blueprint.towLb * (1 + variant * 0.03)),
    payloadCapacityLb: isTruck || blueprint.vehicleType === 'Commercial van' ? 1450 + variant * 110 : isUtility ? 1050 + variant * 45 : 850,
    grossVehicleWeightLb: curbWeight + (isTruck ? 2200 : 1450),
    groundClearanceIn: round(isTruck || blueprint.vehicleType === 'Off-road vehicle' ? 9.4 + variant * 0.2 : isUtility ? 7.2 + variant * 0.1 : 5.2, 1),
    approachAngleDeg: isUtility ? round(18 + variant * 1.1, 1) : 12.5,
    departureAngleDeg: isUtility ? round(20 + variant * 0.9, 1) : 14.0,
    breakoverAngleDeg: isUtility ? round(16 + variant * 0.6, 1) : 10.0,
    wadingDepthIn: blueprint.vehicleType === 'Off-road vehicle' ? 30 + variant : isTruck ? 24 : 0,

    epaCityMpg: cityMpg,
    epaHighwayMpg: highwayMpg,
    epaCombinedMpg: combinedMpg,
    epaCombinedMpge: mpge,
    electricRangeMi: electricRange,
    totalRangeMi: totalRange,
    fuelTankGal: isElectric ? 0 : isHydrogen ? 0 : isTruck ? 26 + variant : 12.4 + blueprint.displacementL,
    chargeTimeLevel1Hr: isPlugIn ? round(battery / 1.4, 1) : 0,
    chargeTimeLevel2Hr: isPlugIn ? round(battery / (isElectric ? 9.6 : 7.2), 1) : 0,
    dcCharge10To80Min: isElectric ? Math.round(46 - variant * 4) : blueprint.powertrain === 'Plug-in hybrid' && year >= 2024 ? 38 : 0,
    energyConsumptionKwh100Mi: isElectric ? round(24 + curbWeight / 900 - variant * 0.5, 1) : 0,
    co2GPerMi: isElectric || isHydrogen ? 0 : Math.round(8887 / Math.max(combinedMpg, 12)),
    regenerativeBraking: isElectrified ? (isPlugIn ? 'Driver-selectable, four levels' : 'Blended regenerative braking') : 'Not applicable',
    heatPump: isPlugIn && year >= 2021,
    batteryPreconditioning: isPlugIn && year >= 2020,

    lengthIn: length,
    widthIn: round(blueprint.widthIn + variant * 0.08),
    widthMirrorsIn: round(blueprint.widthIn + 8.4),
    heightIn: round(blueprint.heightIn + variant * 0.04),
    wheelbaseIn: wheelbase,
    frontTrackIn: round(blueprint.widthIn - 9.8),
    rearTrackIn: round(blueprint.widthIn - 10.1),
    curbWeightLb: curbWeight,
    weightDistribution: isElectric ? '49/51 front/rear' : blueprint.drivetrain === 'RWD' ? '50/50 front/rear' : '58/42 front/rear',
    dragCoefficient: round(isTruck ? 0.39 : isUtility ? 0.32 : isElectric ? 0.24 : 0.29, 2),
    frontalAreaSqFt: round((blueprint.widthIn * blueprint.heightIn) / 144 * 0.84, 1),
    turningCircleFt: round(wheelbase / 3 + (isTruck ? 8 : 4.5), 1),
    seatingCapacity: blueprint.seats,
    doors: blueprint.doors,
    rows,
    passengerVolumeCuFt: round(blueprint.seats * 18.4 + (rows === 3 ? 12 : 0), 1),
    cargoBehindFirstRowCuFt: cargoFirst,
    cargoBehindSecondRowCuFt: cargoSecond,
    cargoBehindThirdRowCuFt: cargoThird,
    frunkVolumeCuFt: isElectric ? round(2.8 + variant * 0.6, 1) : 0,
    frontHeadroomIn: round(37.5 + (isUtility ? 2.4 : 0) + variant * 0.08),
    frontLegroomIn: round(41.2 + variant * 0.12),
    frontShoulderRoomIn: round(blueprint.widthIn - 15.5),
    rearHeadroomIn: round(36.8 + (isUtility ? 2.1 : 0)),
    rearLegroomIn: round(34.2 + wheelbase / 28),
    rearShoulderRoomIn: round(blueprint.widthIn - 16.4),

    platform: `${blueprint.make} ${blueprint.segment} modular architecture`,
    bodyConstruction: isTruck ? 'Fully boxed high-strength-steel frame' : 'Unitized high-strength-steel body',
    frontSuspension: isTruck ? 'Independent double wishbone' : 'MacPherson strut with stabilizer bar',
    rearSuspension: isTruck ? 'Multi-leaf live axle' : isPerformance ? 'Five-link independent' : 'Multi-link independent',
    adaptiveDampers: luxury || isPerformance,
    airSuspension: luxury && isUtility,
    steeringType: 'Electric power-assisted rack-and-pinion',
    steeringRatio: round(isPerformance ? 13.2 : 15.4 - variant * 0.15, 1),
    frontBrakeType: 'Ventilated disc',
    rearBrakeType: isNew || luxury ? 'Ventilated disc' : 'Solid disc',
    frontRotorIn: round(11.5 + curbWeight / 1800 + (isPerformance ? 1.2 : 0), 1),
    rearRotorIn: round(10.8 + curbWeight / 2200 + (isPerformance ? 0.8 : 0), 1),
    brakeAssist: modernSafety,
    parkingBrake: year >= 2015 ? 'Electronic' : 'Mechanical',
    wheelMaterial: variant < 2 ? 'Painted alloy' : variant < 5 ? 'Machined alloy' : 'Forged alloy',
    frontWheelSize: `${frontWheel} x ${isTruck ? 8.5 : 7.5} in`,
    rearWheelSize: `${rearWheel} x ${isPerformance ? 9.5 : isTruck ? 8.5 : 7.5} in`,
    frontTireSize: `${isTruck ? 265 : isPerformance ? 245 : 225}/${isTruck ? 65 : 45}R${frontWheel}`,
    rearTireSize: `${isTruck ? 265 : isPerformance ? 275 : 225}/${isTruck ? 65 : 45}R${rearWheel}`,
    spareTire: isElectric ? 'Tire repair kit' : isTruck || isUtility ? 'Full-size spare' : 'Compact temporary spare',
    allSeasonTires: !isPerformance,
    runFlatTires: luxury && !isUtility,

    headlights: year >= 2020 ? 'Matrix LED' : year >= 2012 ? 'LED projector' : 'Halogen reflector',
    automaticHighBeams: advancedSafety,
    adaptiveHeadlights: luxury && year >= 2016,
    daytimeRunningLights: year >= 2010,
    fogLights: isUtility || luxury,
    rainSensingWipers: luxury || trim === 'Limited' || trim === 'Signature',
    heatedMirrors: year >= 2008,
    powerFoldingMirrors: luxury || variant >= 4,
    handsFreeLiftgate: blueprint.doors === 5 && variant >= 3,
    powerLiftgate: blueprint.doors === 5 && variant >= 2,
    roofType: blueprint.bodyStyle === 'Convertible' ? 'Power retractable soft top' : luxury ? 'Panoramic glass roof' : variant >= 3 ? 'Power moonroof' : 'Fixed steel roof',
    roofRails: isUtility && blueprint.bodyStyle !== 'Pickup',
    runningBoards: isTruck && variant >= 2,
    bedLengthIn: blueprint.bodyStyle === 'Pickup' ? (blueprint.segment === 'Full-size' ? 78.9 : 60.5) : 0,
    trailerHitch: blueprint.towLb > 0,

    upholstery: luxury ? 'Nappa leather' : variant >= 3 ? 'Leather-trimmed' : variant >= 1 ? 'Premium cloth' : 'Durable cloth',
    frontSeatType: isPerformance ? 'Sport bucket' : luxury ? 'Comfort contour' : 'Bucket',
    driverSeatAdjustments: luxury ? 18 : variant >= 3 ? 12 : variant >= 1 ? 8 : 6,
    passengerSeatAdjustments: luxury ? 16 : variant >= 3 ? 10 : 4,
    heatedFrontSeats: variant >= 2 || luxury,
    ventilatedFrontSeats: variant >= 4 || luxury,
    heatedRearSeats: luxury && variant >= 3,
    massagingFrontSeats: luxury && variant >= 4,
    memoryDriverSeat: variant >= 3,
    steeringWheelMaterial: variant >= 2 ? 'Leather-wrapped' : 'Urethane',
    heatedSteeringWheel: variant >= 3 && year >= 2014,
    climateZones: blueprint.seats > 5 ? 3 : luxury ? 4 : variant >= 2 ? 2 : 1,
    rearClimateControls: blueprint.seats > 5,
    remoteStart: year >= 2012 && blueprint.powertrain !== 'Diesel',
    keylessEntry: year >= 2005,
    pushButtonStart: year >= 2013,
    ambientLighting: luxury ? '64-color configurable' : variant >= 4 ? 'Eight-color configurable' : 'White footwell',
    interiorAirFilter: isNew ? 'HEPA-grade particulate and carbon' : 'Replaceable particulate',
    cabinNoiseDb70Mph: round(luxury ? 64.2 : isElectric ? 66.1 : isTruck ? 71.8 : 68.4, 1),

    infotainmentSystem: year >= 2020 ? `${blueprint.make} Connect 4` : year >= 2012 ? `${blueprint.make} Connect 2` : 'AM/FM audio system',
    centerDisplayIn: year >= 2022 ? 12.3 + (luxury ? 2.6 : 0) : year >= 2015 ? 8.0 : year >= 2008 ? 5.8 : 0,
    instrumentDisplayIn: year >= 2020 ? 12.3 : year >= 2013 ? 4.2 : 0,
    headUpDisplay: luxury || (variant >= 4 && year >= 2018),
    appleCarPlay: year >= 2022 ? 'Wireless' : year >= 2016 ? 'Wired' : 'Not available',
    androidAuto: year >= 2022 ? 'Wireless' : year >= 2017 ? 'Wired' : 'Not available',
    navigation: luxury || variant >= 3,
    voiceAssistant: year >= 2020 ? 'Natural-language vehicle assistant' : year >= 2012 ? 'Command-based voice control' : 'Not available',
    wifiHotspot: year >= 2018,
    bluetooth: year >= 2009,
    usbAPorts: year >= 2012 ? Math.max(1, 4 - variant / 2) : 0,
    usbCPorts: year >= 2020 ? 2 + Math.min(variant, 3) : 0,
    wirelessCharging: year >= 2019 && variant >= 2,
    audioBrand: luxury ? 'Clarion Atelier' : variant >= 4 ? 'Horizon premium audio' : 'A1 Audio',
    speakerCount: speakers,
    subwoofer: speakers >= 10,
    satelliteRadio: year >= 2010,
    otaUpdates: year >= 2021,
    digitalKey: year >= 2022 && variant >= 2,
    mobileApp: year >= 2018,

    nhtsaOverallRating: year >= 2011 ? (advancedSafety ? 5 : 4) : 0,
    iihsRating: year >= 2020 && advancedSafety ? 'Top Safety Pick+' : year >= 2010 ? 'Good' : 'Not rated',
    airbagCount: airbags,
    frontAirbags: true,
    frontSideAirbags: year >= 2002,
    rearSideAirbags: luxury && year >= 2012,
    sideCurtainAirbags: year >= 2005,
    driverKneeAirbag: year >= 2014,
    passengerKneeAirbag: year >= 2018,
    centerAirbag: year >= 2021,
    abs: year >= 2000,
    tractionControl: year >= 2004,
    stabilityControl: year >= 2008,
    tirePressureMonitoring: year >= 2008,
    forwardCollisionWarning: modernSafety,
    automaticEmergencyBraking: advancedSafety,
    pedestrianDetection: advancedSafety,
    cyclistDetection: year >= 2020,
    laneDepartureWarning: year >= 2015,
    laneKeepingAssist: advancedSafety,
    laneCentering: year >= 2020 && variant >= 2,
    blindSpotMonitoring: year >= 2015 && variant >= 1,
    rearCrossTrafficAlert: year >= 2015 && variant >= 1,
    adaptiveCruiseControl: year >= 2017 && variant >= 2,
    trafficSignRecognition: year >= 2020,
    driverAttentionMonitor: year >= 2018,
    rearOccupantAlert: year >= 2019 && blueprint.seats > 4,
    parkingSensorsFront: variant >= 2 || luxury,
    parkingSensorsRear: year >= 2010,
    surroundViewCamera: year >= 2018 && variant >= 3,
    automaticParking: year >= 2020 && variant >= 4,
    nightVision: luxury && variant === 5,
    handsFreeDriving: year >= 2023 && variant >= 4 ? 'Mapped divided highways with driver monitoring' : 'Not available',

    basicWarrantyYears: isNew ? 4 : Math.max(0, 4 - age),
    basicWarrantyMiles: isNew ? 50000 : Math.max(0, 50000 - mileage),
    powertrainWarrantyYears: isNew ? (isElectrified ? 8 : 6) : Math.max(0, 6 - age),
    powertrainWarrantyMiles: isNew ? (isElectrified ? 100000 : 70000) : Math.max(0, 70000 - mileage),
    batteryWarrantyYears: isElectrified ? (isNew ? 8 : Math.max(0, 8 - age)) : 0,
    batteryWarrantyMiles: isElectrified ? (isNew ? 100000 : Math.max(0, 100000 - mileage)) : 0,
    corrosionWarrantyYears: isNew ? 7 : Math.max(0, 7 - age),
    roadsideAssistanceYears: isNew ? 5 : Math.max(0, 5 - age),
    complimentaryMaintenanceYears: isNew && luxury ? 3 : isNew ? 2 : 0,
    serviceIntervalMiles: isElectric ? 12000 : blueprint.powertrain === 'Diesel' ? 10000 : 7500,

    ...images,
    imageAlt: `${year} ${blueprint.make} ${blueprint.model} ${trim} in ${COLORS[(blueprintIndex + variant) % COLORS.length]}`,
  };
}

export function buildVehiclesSample(): CreateDataSourceInput {
  const rows = BLUEPRINTS.flatMap((blueprint, blueprintIndex) => (
    Array.from({ length: 6 }, (_, variant) => makeVehicle(blueprint, blueprintIndex, variant))
  ));

  return {
    name: 'Vehicles',
    description: `Synthetic demo inventory with ${rows.length} vehicles and ${VEHICLE_COLUMNS.length} detailed fields, including pricing, dimensions, engine bore/stroke, EV charging, airbags, speakers, driver assistance, warranty, and eight illustrative images per vehicle. Values are realistic test data, not manufacturer-certified specifications.`,
    columns: VEHICLE_COLUMNS,
    rows,
    projectIds: [],
  };
}
