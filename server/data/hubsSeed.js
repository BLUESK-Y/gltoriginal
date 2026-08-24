// Seed data for the FlashPop Crunch / Trivandrum Cycle 3 demo campaign.
// Ported from the static prototype so the MERN app starts with the same 50 hubs.

const RAW = [
  ["Welgate Supermarket", "Kuravankonam", 8.5152, 76.9421, "A"],
  ["Spring Fresh Mart", "Nanthancode", 8.5121, 76.9490, "A"],
  ["GG Bakes & Store", "Vattiyoorkavu", 8.5279, 76.9812, "A"],
  ["Kowdiar Family Mart", "Kowdiar", 8.5188, 76.9556, "A"],
  ["Pattom Daily Needs", "Pattom", 8.5157, 76.9430, "B"],
  ["Sasthamangalam Super", "Sasthamangalam", 8.5093, 76.9663, "A"],
  ["Ulloor Hyper", "Ulloor", 8.5325, 76.9285, "A"],
  ["Kesavadasapuram Stores", "Kesavadasapuram", 8.5273, 76.9345, "B"],
  ["Technopark Convenience", "Technopark", 8.5580, 76.8760, "A"],
  ["Kazhakkoottam Bazaar", "Kazhakkoottam", 8.5667, 76.8700, "A"],
  ["Sreekaryam Provisions", "Sreekaryam", 8.5460, 76.9130, "B"],
  ["Medical College Mart", "Medical College", 8.5245, 76.9215, "A"],
  ["Peroorkada Super", "Peroorkada", 8.5290, 76.9700, "A"],
  ["Vazhuthacaud Grocers", "Vazhuthacaud", 8.4967, 76.9580, "B"],
  ["Thampanoor Junction Store", "Thampanoor", 8.4880, 76.9520, "B"],
  ["Chalai Market Mart", "Chalai", 8.4826, 76.9498, "B"],
  ["East Fort Provisions", "East Fort", 8.4830, 76.9430, "B"],
  ["Manacaud Family Store", "Manacaud", 8.4740, 76.9490, "B"],
  ["Poojappura Hyper", "Poojappura", 8.4930, 76.9760, "A"],
  ["Karamana Daily", "Karamana", 8.4790, 76.9640, "B"],
  ["Killippalam Stores", "Killippalam", 8.4805, 76.9585, "B"],
  ["Nemom Supermarket", "Nemom", 8.4485, 76.9720, "A"],
  ["Balaramapuram Bazaar", "Balaramapuram", 8.3830, 77.0230, "A"],
  ["Kovalam Beach Mart", "Kovalam", 8.4004, 76.9787, "B"],
  ["Vizhinjam Harbour Store", "Vizhinjam", 8.3800, 76.9900, "B"],
  ["Attukal Provisions", "Attukal", 8.4780, 76.9530, "B"],
  ["Palayam Central", "Palayam", 8.4990, 76.9480, "A"],
  ["Statue Junction Mart", "Statue", 8.4925, 76.9465, "B"],
  ["Vellayambalam Super", "Vellayambalam", 8.5065, 76.9575, "A"],
  ["Jagathy Fresh", "Jagathy", 8.4915, 76.9678, "B"],
  ["Thirumala Hyper", "Thirumala", 8.4870, 76.9855, "A"],
  ["Pappanamcode Stores", "Pappanamcode", 8.4700, 76.9720, "B"],
  ["Kaimanam Daily Needs", "Kaimanam", 8.4660, 76.9660, "B"],
  ["Kalady Family Mart", "Kalady", 8.4760, 76.9690, "B"],
  ["Muttada Supermarket", "Muttada", 8.5320, 76.9420, "A"],
  ["Paruthippara Stores", "Paruthippara", 8.5290, 76.9390, "B"],
  ["Anayara Provisions", "Anayara", 8.4885, 76.9245, "B"],
  ["Pettah Bazaar", "Pettah", 8.4900, 76.9350, "B"],
  ["Vallakadavu Mart", "Vallakadavu", 8.4790, 76.9330, "B"],
  ["Enchakkal Fresh", "Enchakkal", 8.4740, 76.9280, "B"],
  ["Akkulam Lakeview Store", "Akkulam", 8.5215, 76.9075, "B"],
  ["Kariavattom Campus Mart", "Kariavattom", 8.5640, 76.8880, "A"],
  ["Pongumoodu Stores", "Pongumoodu", 8.5390, 76.9195, "B"],
  ["Mannanthala Super", "Mannanthala", 8.5525, 76.9310, "A"],
  ["Pothencode Bazaar", "Pothencode", 8.5850, 76.8990, "A"],
  ["Vattappara Provisions", "Vattappara", 8.5910, 76.9540, "B"],
  ["Aruvikkara Family Mart", "Aruvikkara", 8.5580, 76.9930, "B"],
  ["Malayinkeezhu Stores", "Malayinkeezhu", 8.4405, 77.0225, "B"],
  ["Neyyattinkara Hyper", "Neyyattinkara", 8.4000, 77.0850, "A"],
  ["Venganoor Daily", "Venganoor", 8.4180, 77.0060, "B"]
];

// Deterministic pseudo-random generator so the seed is reproducible: 41 verified, 7 pending, 2 flagged.
let seed = 20260810;
function rnd() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}

const FLAG_IDX = [2, 17];
const PEND_IDX = [8, 15, 24, 31, 37, 44, 47];
const CAMPAIGN_TODAY = new Date(Date.UTC(2026, 7, 10));

export function buildHubsSeed() {
  return RAW.map((r, i) => {
    const [name, area, lat, lng, category] = r;
    const status = FLAG_IDX.includes(i) ? "flagged" : PEND_IDX.includes(i) ? "pending" : "verified";
    const hh = 9 + Math.floor(rnd() * 9);
    const mm = Math.floor(rnd() * 60);
    const daysAgo = status === "pending" ? 3 + Math.floor(rnd() * 3) : Math.floor(rnd() * 3);
    const auditDate = new Date(CAMPAIGN_TODAY);
    auditDate.setUTCDate(auditDate.getUTCDate() - daysAgo);

    let note = "";
    if (status === "flagged") {
      note = i === 2 ? "Cartons stacked in front of left panel" : "Right poster edge lifting at corner";
    }

    return {
      hubId: "GLT-TVM-" + String(i + 1).padStart(3, "0"),
      name,
      area,
      lat,
      lng,
      category,
      status,
      footfall: (category === "A" ? 2200 : 900) + Math.floor(rnd() * 1400),
      auditDate: status === "pending" ? undefined : auditDate,
      auditTime: status === "pending" ? undefined : String(hh).padStart(2, "0") + ":" + String(mm).padStart(2, "0"),
      note
    };
  });
}
