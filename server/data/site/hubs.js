/**
 * The Trivandrum hub network.
 *
 * `status: 'live'` marks the three sites that are physically deployed and
 * photographed (the R&D installs from the pitch deck). Everything else is
 * contracted network inventory and carries the product render instead of a
 * site photo — we never show a photo of one store under another store's name.
 */

const LIVE = 'live';
const NETWORK = 'network';

const RENDER = '/assets/hub-counter.webp';
const RENDER_SM = '/assets/hub-counter-sm.webp';

export const hubs = [
  {
    hubId: 'GLT-TVM-012',
    storeName: 'Welgate Supermarket',
    locality: 'Kuravankonam',
    category: 'A',
    lat: 8.5152,
    lng: 76.9421,
    status: LIVE,
    image: '/assets/store-welgate.webp',
    thumb: '/assets/store-welgate-sm.webp',
    note: 'Backlight active & verified',
  },
  {
    hubId: 'GLT-TVM-021',
    storeName: 'Spring Supermarket',
    locality: 'Nanthancode',
    category: 'A',
    lat: 8.5121,
    lng: 76.949,
    status: LIVE,
    image: '/assets/store-spring.webp',
    thumb: '/assets/store-spring-sm.webp',
    note: 'Backlight active & verified',
  },
  {
    hubId: 'GLT-TVM-034',
    storeName: 'GG Supermarket',
    locality: 'Vattiyoorkavu',
    category: 'A',
    lat: 8.5279,
    lng: 76.9812,
    status: LIVE,
    image: '/assets/store-gg.webp',
    thumb: '/assets/store-gg-sm.webp',
    note: 'Backlight active & verified',
  },

  // Contracted network inventory.
  ['GLT-TVM-002', 'Kowdiar Daily', 'Kowdiar', 'A', 8.5188, 76.9556],
  ['GLT-TVM-003', 'Pattom Family Mart', 'Pattom', 'A', 8.5157, 76.943],
  ['GLT-TVM-004', 'Vazhuthacaud Stores', 'Vazhuthacaud', 'B', 8.5093, 76.9663],
  ['GLT-TVM-005', 'Ulloor Supermarket', 'Ulloor', 'A', 8.5325, 76.9285],
  ['GLT-TVM-006', 'Kesavadasapuram Bazaar', 'Kesavadasapuram', 'A', 8.5273, 76.9345],
  ['GLT-TVM-007', 'Technopark Provisions', 'Kazhakkoottam', 'A', 8.558, 76.876],
  ['GLT-TVM-008', 'Kaniyapuram Mart', 'Kaniyapuram', 'B', 8.5667, 76.87],
  ['GLT-TVM-009', 'Sreekaryam Super', 'Sreekaryam', 'A', 8.546, 76.913],
  ['GLT-TVM-010', 'Akkulam Fresh', 'Akkulam', 'B', 8.5245, 76.9215],
  ['GLT-TVM-011', 'Peroorkada Hyper', 'Peroorkada', 'A', 8.529, 76.97],
  ['GLT-TVM-013', 'Palayam Provisions', 'Palayam', 'B', 8.4967, 76.958],
  ['GLT-TVM-014', 'Statue Junction Mart', 'Statue', 'B', 8.488, 76.952],
  ['GLT-TVM-015', 'Thampanoor Daily', 'Thampanoor', 'B', 8.4826, 76.9498],
  ['GLT-TVM-016', 'Chalai Market Stores', 'Chalai', 'B', 8.483, 76.943],
  ['GLT-TVM-017', 'Manacaud Super', 'Manacaud', 'A', 8.474, 76.949],
  ['GLT-TVM-018', 'Jagathy Family Store', 'Jagathy', 'B', 8.493, 76.976],
  ['GLT-TVM-019', 'Poojappura Hyper', 'Poojappura', 'A', 8.479, 76.964],
  ['GLT-TVM-020', 'Karamana Provisions', 'Karamana', 'B', 8.4805, 76.9585],
  ['GLT-TVM-022', 'Pappanamcode Super', 'Pappanamcode', 'A', 8.4485, 76.972],
  ['GLT-TVM-023', 'Neyyattinkara Bazaar', 'Neyyattinkara', 'A', 8.383, 77.023],
  ['GLT-TVM-024', 'Balaramapuram Stores', 'Balaramapuram', 'B', 8.4004, 76.9787],
  ['GLT-TVM-025', 'Nemom Daily Mart', 'Nemom', 'B', 8.38, 76.99],
  ['GLT-TVM-026', 'Killippalam Provisions', 'Killippalam', 'B', 8.478, 76.953],
  ['GLT-TVM-027', 'Thirumala Super', 'Thirumala', 'A', 8.499, 76.948],
  ['GLT-TVM-028', 'Attukal Family Mart', 'Attukal', 'B', 8.4925, 76.9465],
  ['GLT-TVM-029', 'Vellayambalam Fresh', 'Vellayambalam', 'A', 8.5065, 76.9575],
  ['GLT-TVM-030', 'Kalady Stores', 'Kalady', 'B', 8.4915, 76.9678],
  ['GLT-TVM-031', 'Peyad Hyper', 'Peyad', 'A', 8.487, 76.9855],
  ['GLT-TVM-032', 'Vellayani Provisions', 'Vellayani', 'B', 8.47, 76.972],
  ['GLT-TVM-033', 'Kalliyoor Mart', 'Kalliyoor', 'B', 8.466, 76.966],
  ['GLT-TVM-035', 'Pallichal Daily', 'Pallichal', 'B', 8.476, 76.969],
  ['GLT-TVM-036', 'Muttada Super', 'Muttada', 'A', 8.532, 76.942],
  ['GLT-TVM-037', 'Paruthippara Mart', 'Paruthippara', 'B', 8.529, 76.939],
  ['GLT-TVM-038', 'Anayara Provisions', 'Anayara', 'B', 8.4885, 76.9245],
  ['GLT-TVM-039', 'Chackai Hyper', 'Chackai', 'A', 8.49, 76.935],
  ['GLT-TVM-040', 'Pettah Family Store', 'Pettah', 'B', 8.479, 76.933],
  ['GLT-TVM-041', 'Vallakadavu Stores', 'Vallakadavu', 'B', 8.474, 76.928],
  ['GLT-TVM-042', 'Kulathoor Super', 'Kulathoor', 'A', 8.5215, 76.9075],
  ['GLT-TVM-043', 'Menamkulam Mart', 'Menamkulam', 'B', 8.564, 76.888],
  ['GLT-TVM-044', 'Chempazhanthy Daily', 'Chempazhanthy', 'A', 8.539, 76.9195],
  ['GLT-TVM-045', 'Powdikonam Provisions', 'Powdikonam', 'B', 8.5525, 76.931],
  ['GLT-TVM-046', 'Mangalapuram Hyper', 'Mangalapuram', 'A', 8.585, 76.899],
  ['GLT-TVM-047', 'Vembayam Stores', 'Vembayam', 'B', 8.591, 76.954],
  ['GLT-TVM-048', 'Nedumangad Bazaar', 'Nedumangad', 'A', 8.558, 76.993],
  ['GLT-TVM-049', 'Aruvikkara Mart', 'Aruvikkara', 'B', 8.5405, 76.9915],
  ['GLT-TVM-050', 'Malayinkeezhu Super', 'Malayinkeezhu', 'B', 8.4405, 77.0225],
  ['GLT-TVM-051', 'Kattakada Provisions', 'Kattakada', 'A', 8.4, 77.085],
].map((entry) =>
  Array.isArray(entry)
    ? {
        hubId: entry[0],
        storeName: entry[1],
        locality: entry[2],
        category: entry[3],
        lat: entry[4],
        lng: entry[5],
        status: NETWORK,
        image: RENDER,
        thumb: RENDER_SM,
        note: 'Contracted · dual A3 backlit hub',
      }
    : entry,
).map((hub) => ({
  ...hub,
  city: 'Thiruvananthapuram',
  state: 'Kerala',
  panels: 2,
}));

export default hubs;
