/**
 * Sample project — "Northstar Motors".
 *
 * A compact data-binding test bed for the built-in Vehicles dataset:
 * - Inventory repeats one Card template for every vehicle row.
 * - Each card links to the detail page with that row's stable `__id`.
 * - Vehicle details declares `detailDataset: "vehicles"` so its bindings resolve
 *   against the selected row (or the first row while editing).
 *
 * Add the Vehicles sample from Data sources before previewing this project.
 */
import type { ComponentNode, PageDefinition } from '../editor/pageTypes';
import type { ProjectPage } from './projectStore';

export const VEHICLE_PROJECT_ID = 'proj-northstar-motors';
export const VEHICLE_PROJECT_SEED_FLAG = 'a1-seeded-northstar-motors-v1';

type Props = Record<string, unknown>;
type N = ComponentNode;

let sequence = 0;
function node(type: ComponentNode['type'], props: Props = {}, children?: N[], content?: string): N {
  sequence += 1;
  return {
    id: `vehicle-sample-${sequence}`,
    type,
    ...(Object.keys(props).length ? { props } : {}),
    ...(content !== undefined ? { content: { fallback: content } } : {}),
    ...(children?.length ? { children } : {}),
  };
}

const section = (props: Props, children: N[]) => node('Section', props, children);
const stack = (children: N[], props: Props = {}) => node('Stack', { gap: 'md', ...props }, children);
const grid = (children: N[], props: Props = {}) => node('Grid', { columns: { xs: 1, md: 2 }, gap: 'md', ...props }, children);
const card = (children: N[], props: Props = {}) => node('Card', props, children);
const heading = (text: string, props: Props = {}) => node('Heading', { as: 'h2', size: 'md', ...props }, undefined, text);
const paragraph = (text: string, props: Props = {}) => node('Paragraph', props, undefined, text);
const badge = (text: string, props: Props = {}) => node('MessageBadge', { subtle: true, size: 'sm', ...props }, undefined, text);
const figure = (src: string, alt: string, props: Props = {}) => node('Figure', {
  src,
  alt,
  aspectRatio: '4:3',
  crop: 'center',
  radius: 'md',
  ...props,
});

function definition(
  id: string,
  name: string,
  description: string,
  nodes: N[],
  detailDataset?: string,
): PageDefinition {
  return {
    schemaVersion: '1.0.0',
    page: {
      id,
      name,
      description,
      ...(detailDataset ? { detailDataset } : {}),
      layout: {
        type: 'PageLayout',
        regions: [{ id: 'main', name: 'Main', nodes }],
      },
    },
  };
}

const inventoryCard = card([
  figure('{{ vehicles.imageHero }}', '{{ vehicles.imageAlt }}'),
  stack([
    stack([
      badge('{{ vehicles.powertrain }}', { status: 'info', icon: 'energy_savings_leaf' }),
      badge('{{ vehicles.bodyStyle }}', { status: 'info', icon: 'directions_car' }),
      badge('{{ vehicles.availability }}', { status: 'success', icon: 'check_circle' }),
    ], { direction: 'row', gap: 'xs', align: 'center', wrap: true }),
    heading('{{ vehicles.name }}', { as: 'h2', size: 'sm' }),
    paragraph('{{ vehicles.description }}', { size: 'sm', color: 'muted' }),
    stack([
      paragraph('$ {{ vehicles.salePrice }}', { size: 'lg' }),
      paragraph('{{ vehicles.mileage }} miles', { size: 'sm', color: 'muted' }),
    ], { direction: 'row', gap: 'sm', align: 'center', justify: 'between', wrap: true }),
  ], { gap: 'sm' }),
], {
  variant: 'navigation',
  href: '/?page=vehicle-details&item={{ vehicles.__id }}',
});
inventoryCard.repeat = { dataset: 'vehicles', limit: 24 };

const inventory = definition(
  'vehicle-inventory',
  'Inventory',
  'Browse the Vehicles dataset and open any record as a full detail page.',
  [
    section({
      padding: 'xl',
      contentWidth: 'xl',
      surface: 'panel',
      gradient: 'accent',
      gradientPosition: 'top-right',
      gap: 'md',
    }, [
      badge('Synthetic vehicle inventory', { icon: 'dataset' }),
      heading('Find your next vehicle', { as: 'h1', type: 'display', size: { xs: 'xl', md: 'xxl' } }),
      paragraph('A data-bound inventory for testing repeated cards, vehicle imagery, and links into item-specific detail pages.', { size: 'lg', color: 'muted' }),
      node('Banner', {
        status: 'info',
        variant: 'inline',
        title: 'Add the Vehicles dataset',
      }, undefined, 'Open Data sources and add the Vehicles sample if binding tokens are still visible in the editor.'),
    ]),
    section({ padding: 'lg', contentWidth: 'xl', gap: 'lg' }, [
      stack([
        heading('Available inventory', { as: 'h2', size: 'lg' }),
        paragraph('The first 24 rows are shown here. Edit the repeated Card to change every result at once.', { size: 'sm', color: 'muted' }),
      ], { gap: 'xs' }),
      grid([inventoryCard], { columns: { xs: 1, sm: 2, lg: 3 }, gap: 'md', alignItems: 'stretch' }),
    ]),
  ],
);

function statCard(label: string, value: string, icon: string): N {
  return card([
    stack([
      node('Icon', { name: icon, color: 'accent' }),
      paragraph(label, { size: 'xs', color: 'muted' }),
      heading(value, { as: 'p', size: 'sm' }),
    ], { gap: 'xs' }),
  ]);
}

function specCard(title: string, icon: string, specs: Array<[string, string]>): N {
  return card([
    stack([
      stack([
        node('Icon', { name: icon, color: 'accent' }),
        heading(title, { as: 'h2', size: 'sm' }),
      ], { direction: 'row', gap: 'xs', align: 'center' }),
      node('Divider', { space: 'xs' }),
      ...specs.map(([label, value]) => stack([
        paragraph(label, { size: 'xs', color: 'muted' }),
        paragraph(value, { size: 'sm' }),
      ], { gap: 4 })),
    ], { gap: 'sm' }),
  ]);
}

const details = definition(
  'vehicle-details',
  'Vehicle details',
  'A comprehensive item-specific view of one Vehicles dataset row.',
  [
    section({
      padding: 'xl',
      contentWidth: 'xl',
      surface: 'panel',
      gradient: 'accent',
      gradientPosition: 'bottom-left',
      gap: 'lg',
    }, [
      stack([
        badge('{{ vehicles.availability }}', { status: 'success', icon: 'check_circle' }),
        badge('{{ vehicles.condition }}', { status: 'info', icon: 'verified' }),
        badge('{{ vehicles.powertrain }}', { status: 'info', icon: 'energy_savings_leaf' }),
      ], { direction: 'row', gap: 'xs', align: 'center', wrap: true }),
      heading('{{ vehicles.name }}', { as: 'h1', type: 'display', size: { xs: 'xl', md: 'xxl' } }),
      paragraph('{{ vehicles.description }}', { size: 'lg', color: 'muted' }),
      stack([
        heading('$ {{ vehicles.salePrice }}', { as: 'p', size: 'lg' }),
        paragraph('MSRP $ {{ vehicles.msrp }} · {{ vehicles.mileage }} miles · Stock {{ vehicles.stockNumber }}', { size: 'sm', color: 'muted' }),
      ], { gap: 'xs' }),
    ]),

    section({ padding: 'lg', contentWidth: 'xl', gap: 'lg' }, [
      figure('{{ vehicles.imageHero }}', '{{ vehicles.imageAlt }}', { aspectRatio: '16:9', radius: 'lg' }),
      grid([
        figure('{{ vehicles.imageExteriorFront }}', 'Front view of {{ vehicles.name }}'),
        figure('{{ vehicles.imageExteriorRear }}', 'Rear view of {{ vehicles.name }}'),
        figure('{{ vehicles.imageExteriorSide }}', 'Side view of {{ vehicles.name }}'),
        figure('{{ vehicles.imageInteriorFront }}', 'Front interior of {{ vehicles.name }}'),
        figure('{{ vehicles.imageDashboard }}', 'Dashboard of {{ vehicles.name }}'),
        figure('{{ vehicles.imageCargo }}', 'Cargo area of {{ vehicles.name }}'),
      ], { columns: { xs: 2, md: 3 }, gap: 'sm' }),
    ]),

    section({ padding: 'lg', contentWidth: 'xl', surface: 'panel', gap: 'lg' }, [
      heading('At a glance', { as: 'h2', size: 'lg' }),
      grid([
        statCard('Power', '{{ vehicles.horsepower }} hp', 'speed'),
        statCard('Torque', '{{ vehicles.torqueLbFt }} lb-ft', 'manufacturing'),
        statCard('Drivetrain', '{{ vehicles.drivetrain }}', 'settings_input_component'),
        statCard('0–60 mph', '{{ vehicles.zeroToSixtySec }} sec', 'timer'),
        statCard('Combined efficiency', '{{ vehicles.epaCombinedMpg }} mpg · {{ vehicles.epaCombinedMpge }} MPGe', 'eco'),
        statCard('Range', '{{ vehicles.totalRangeMi }} miles', 'route'),
        statCard('Seats', '{{ vehicles.seatingCapacity }}', 'airline_seat_recline_normal'),
        statCard('Tow capacity', '{{ vehicles.towCapacityLb }} lb', 'rv_hookup'),
      ], { columns: { xs: 2, md: 4 }, gap: 'sm' }),
    ]),

    section({ padding: 'lg', contentWidth: 'xl', gap: 'lg' }, [
      heading('Full specifications', { as: 'h2', size: 'lg' }),
      grid([
        specCard('Powertrain', 'electric_bolt', [
          ['Engine', '{{ vehicles.engineName }}'],
          ['Engine code', '{{ vehicles.engineCode }}'],
          ['Displacement', '{{ vehicles.displacementL }} L / {{ vehicles.displacementCc }} cc'],
          ['Configuration', '{{ vehicles.engineConfiguration }} · {{ vehicles.cylinders }} cylinders · {{ vehicles.valves }} valves'],
          ['Aspiration', '{{ vehicles.aspiration }}'],
          ['Bore × stroke', '{{ vehicles.boreIn }} × {{ vehicles.strokeIn }} in'],
          ['Compression ratio', '{{ vehicles.compressionRatio }}:1'],
          ['Transmission', '{{ vehicles.transmission }}'],
          ['Differential', '{{ vehicles.differential }}'],
        ]),
        specCard('Battery and charging', 'battery_charging_full', [
          ['Battery', '{{ vehicles.batteryCapacityKwh }} kWh {{ vehicles.batteryChemistry }}'],
          ['Usable capacity', '{{ vehicles.usableBatteryKwh }} kWh'],
          ['Voltage', '{{ vehicles.batteryVoltage }} V'],
          ['Onboard charger', '{{ vehicles.onboardChargerKw }} kW'],
          ['DC fast charge', '{{ vehicles.dcFastChargeKw }} kW'],
          ['Charge port', '{{ vehicles.chargePort }}'],
          ['Level 2 time', '{{ vehicles.chargeTimeLevel2Hr }} hr'],
          ['10–80% DC time', '{{ vehicles.dcCharge10To80Min }} min'],
          ['Electric range', '{{ vehicles.electricRangeMi }} miles'],
        ]),
        specCard('Dimensions', 'straighten', [
          ['Length', '{{ vehicles.lengthIn }} in'],
          ['Width', '{{ vehicles.widthIn }} in'],
          ['Height', '{{ vehicles.heightIn }} in'],
          ['Wheelbase', '{{ vehicles.wheelbaseIn }} in'],
          ['Ground clearance', '{{ vehicles.groundClearanceIn }} in'],
          ['Curb weight', '{{ vehicles.curbWeightLb }} lb'],
          ['Turning circle', '{{ vehicles.turningCircleFt }} ft'],
          ['Drag coefficient', '{{ vehicles.dragCoefficient }}'],
          ['Cargo volume', '{{ vehicles.cargoBehindSecondRowCuFt }} cu ft'],
        ]),
        specCard('Chassis and wheels', 'tire_repair', [
          ['Construction', '{{ vehicles.bodyConstruction }}'],
          ['Front suspension', '{{ vehicles.frontSuspension }}'],
          ['Rear suspension', '{{ vehicles.rearSuspension }}'],
          ['Steering', '{{ vehicles.steeringType }}'],
          ['Front brakes', '{{ vehicles.frontBrakeType }} · {{ vehicles.frontRotorIn }} in'],
          ['Rear brakes', '{{ vehicles.rearBrakeType }} · {{ vehicles.rearRotorIn }} in'],
          ['Front wheels', '{{ vehicles.frontWheelSize }} · {{ vehicles.frontTireSize }}'],
          ['Rear wheels', '{{ vehicles.rearWheelSize }} · {{ vehicles.rearTireSize }}'],
          ['Spare', '{{ vehicles.spareTire }}'],
        ]),
        specCard('Interior and technology', 'connected_car', [
          ['Upholstery', '{{ vehicles.upholstery }}'],
          ['Climate zones', '{{ vehicles.climateZones }}'],
          ['Center display', '{{ vehicles.centerDisplayIn }} in'],
          ['Instrument display', '{{ vehicles.instrumentDisplayIn }} in'],
          ['Phone integration', '{{ vehicles.appleCarPlay }} CarPlay · {{ vehicles.androidAuto }} Android Auto'],
          ['Audio', '{{ vehicles.audioBrand }} · {{ vehicles.speakerCount }} speakers'],
          ['USB ports', '{{ vehicles.usbAPorts }} USB-A · {{ vehicles.usbCPorts }} USB-C'],
          ['Voice assistant', '{{ vehicles.voiceAssistant }}'],
          ['Ambient lighting', '{{ vehicles.ambientLighting }}'],
        ]),
        specCard('Safety', 'health_and_safety', [
          ['NHTSA rating', '{{ vehicles.nhtsaOverallRating }} stars'],
          ['IIHS rating', '{{ vehicles.iihsRating }}'],
          ['Airbags', '{{ vehicles.airbagCount }}'],
          ['Automatic emergency braking', '{{ vehicles.automaticEmergencyBraking }}'],
          ['Lane centering', '{{ vehicles.laneCentering }}'],
          ['Blind-spot monitoring', '{{ vehicles.blindSpotMonitoring }}'],
          ['Adaptive cruise control', '{{ vehicles.adaptiveCruiseControl }}'],
          ['Surround-view camera', '{{ vehicles.surroundViewCamera }}'],
          ['Hands-free driving', '{{ vehicles.handsFreeDriving }}'],
        ]),
        specCard('Warranty and service', 'verified_user', [
          ['Basic warranty', '{{ vehicles.basicWarrantyYears }} yr / {{ vehicles.basicWarrantyMiles }} mi'],
          ['Powertrain warranty', '{{ vehicles.powertrainWarrantyYears }} yr / {{ vehicles.powertrainWarrantyMiles }} mi'],
          ['Battery warranty', '{{ vehicles.batteryWarrantyYears }} yr / {{ vehicles.batteryWarrantyMiles }} mi'],
          ['Corrosion warranty', '{{ vehicles.corrosionWarrantyYears }} yr'],
          ['Roadside assistance', '{{ vehicles.roadsideAssistanceYears }} yr'],
          ['Complimentary maintenance', '{{ vehicles.complimentaryMaintenanceYears }} yr'],
          ['Service interval', '{{ vehicles.serviceIntervalMiles }} miles'],
        ]),
        specCard('Ownership estimate', 'payments', [
          ['Estimated payment', '$ {{ vehicles.estimatedMonthlyPayment }} / month'],
          ['Lease estimate', '$ {{ vehicles.leaseMonthly }} / month'],
          ['Due at signing', '$ {{ vehicles.leaseDueAtSigning }}'],
          ['Federal incentive', '$ {{ vehicles.federalIncentive }}'],
          ['Five-year fuel cost', '$ {{ vehicles.estimatedFiveYearFuelCost }}'],
          ['Five-year maintenance', '$ {{ vehicles.estimatedFiveYearMaintenance }}'],
          ['Five-year depreciation', '$ {{ vehicles.estimatedFiveYearDepreciation }}'],
        ]),
      ], { columns: { xs: 1, lg: 2 }, gap: 'md', alignItems: 'start' }),
    ]),

    section({ padding: 'lg', contentWidth: 'lg', surface: 'panel', gap: 'md' }, [
      node('Banner', {
        status: 'info',
        variant: 'inline',
        title: 'Synthetic specifications',
      }, undefined, 'This project uses generated demo values and illustrative stock photography. Do not treat them as manufacturer-certified vehicle data.'),
      node('ButtonContainer', { align: 'start' }, [
        node('Button', {
          variant: 'secondary',
          icon: 'arrow_back',
          href: '/?page=vehicle-inventory',
        }, undefined, 'Back to inventory'),
      ]),
    ]),
  ],
  'vehicles',
);

export const vehicleProject = {
  id: VEHICLE_PROJECT_ID,
  name: 'Northstar Motors',
  description: 'A data-bound vehicle inventory and comprehensive details page for testing the Vehicles sample dataset.',
  icon: 'directions_car',
};

export const vehiclePages: ProjectPage[] = [
  { id: 'vehicle-inventory', title: 'Inventory', icon: 'directions_car', parentId: null, order: 0 },
  { id: 'vehicle-details', title: 'Vehicle details', icon: 'description', parentId: 'vehicle-inventory', order: 0 },
];

export const vehicleContent: Record<string, PageDefinition> = {
  'vehicle-inventory': inventory,
  'vehicle-details': details,
};
