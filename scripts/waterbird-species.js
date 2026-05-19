// Water bird species grouped by section, as they appear in minneapolis-waterbirds-overview.md
// Scientific names are used as keys for Wikipedia image lookups

const waterbirds = [
  {
    section: "Ducks & Geese (Waterfowl)",
    subsections: [
      {
        name: "Dabbling Ducks",
        species: [
          { common: "Mallard", scientific: "Anas platyrhynchos" },
          { common: "American Black Duck", scientific: "Anas rubripes" },
          { common: "Blue-winged Teal", scientific: "Spatula discors" },
          { common: "Green-winged Teal", scientific: "Anas crecca" },
          { common: "Northern Shoveler", scientific: "Spatula clypeata" },
          { common: "Northern Pintail", scientific: "Anas acuta" },
          { common: "Wood Duck", scientific: "Aix sponsa" },
          { common: "American Wigeon", scientific: "Mareca americana" },
        ],
      },
      {
        name: "Diving Ducks",
        species: [
          { common: "Ring-necked Duck", scientific: "Aythya collaris" },
          { common: "Lesser Scaup", scientific: "Aythya affinis" },
          { common: "Greater Scaup", scientific: "Aythya marila" },
          { common: "Common Goldeneye", scientific: "Bucephala clangula" },
          { common: "Bufflehead", scientific: "Bucephala albeola" },
          { common: "Canvasback", scientific: "Aythya valisineria" },
          { common: "Redhead", scientific: "Aythya americana" },
          { common: "Ruddy Duck", scientific: "Oxyura jamaicensis" },
        ],
      },
      {
        name: "Geese & Swans",
        species: [
          { common: "Canada Goose", scientific: "Branta canadensis" },
          { common: "Cackling Goose", scientific: "Branta hutchinsii" },
          { common: "Snow Goose", scientific: "Anser caerulescens" },
          { common: "Trumpeter Swan", scientific: "Cygnus buccinator" },
          { common: "Tundra Swan", scientific: "Cygnus columbianus" },
        ],
      },
    ],
  },
  {
    section: "Mergansers",
    species: [
      { common: "Common Merganser", scientific: "Mergus merganser" },
      { common: "Red-breasted Merganser", scientific: "Mergus serrator" },
      { common: "Hooded Merganser", scientific: "Lophodytes cucullatus" },
    ],
  },
  {
    section: "Grebes",
    species: [
      { common: "Pied-billed Grebe", scientific: "Podilymbus podiceps" },
      { common: "Horned Grebe", scientific: "Podiceps auritus" },
      { common: "Eared Grebe", scientific: "Podiceps nigricollis" },
      { common: "Red-necked Grebe", scientific: "Podiceps grisegena" },
      { common: "Western Grebe", scientific: "Aechmophorus occidentalis" },
    ],
  },
  {
    section: "Herons & Egrets",
    species: [
      { common: "Great Blue Heron", scientific: "Ardea herodias" },
      { common: "Great Egret", scientific: "Ardea alba" },
      { common: "Green Heron", scientific: "Butorides virescens" },
      { common: "Black-crowned Night-Heron", scientific: "Nycticorax nycticorax" },
      { common: "Yellow-crowned Night-Heron", scientific: "Nyctanassa violacea" },
    ],
  },
  {
    section: "Loons & Cormorants",
    species: [
      { common: "Common Loon", scientific: "Gavia immer" },
      { common: "Double-crested Cormorant", scientific: "Nannopterum auritum" },
    ],
  },
  {
    section: "Rails, Coots & Gallinules",
    species: [
      { common: "American Coot", scientific: "Fulica americana" },
      { common: "Sora", scientific: "Porzana carolina" },
      { common: "Virginia Rail", scientific: "Rallus limicola" },
      { common: "Common Gallinule", scientific: "Gallinula galeata" },
    ],
  },
  {
    section: "Shorebirds",
    species: [
      { common: "Killdeer", scientific: "Charadrius vociferus" },
      { common: "Spotted Sandpiper", scientific: "Actitis macularius" },
      { common: "Lesser Yellowlegs", scientific: "Tringa flavipes" },
      { common: "Greater Yellowlegs", scientific: "Tringa melanoleuca" },
      { common: "Least Sandpiper", scientific: "Calidris minutilla" },
      { common: "Pectoral Sandpiper", scientific: "Calidris melanotos" },
      { common: "Wilson's Snipe", scientific: "Gallinago delicata" },
      { common: "American Woodcock", scientific: "Scolopax minor" },
    ],
  },
  {
    section: "Kingfishers & Other Fishing Birds",
    species: [
      { common: "Belted Kingfisher", scientific: "Megaceryle alcyon" },
      { common: "Osprey", scientific: "Pandion haliaetus" },
    ],
  },
];

module.exports = waterbirds;
