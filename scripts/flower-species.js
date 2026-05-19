// Flower species grouped by section, as they appear in minneapolis-flowers-overview.md

const flowers = [
  {
    section: "Spring Ephemerals",
    species: [
      { common: "Bloodroot", scientific: "Sanguinaria canadensis" },
      { common: "Large-flowered Trillium", scientific: "Trillium grandiflorum" },
      { common: "Wild Ginger", scientific: "Asarum canadense" },
      { common: "Dutchman's Breeches", scientific: "Dicentra cucullaria" },
      { common: "Spring Beauty", scientific: "Claytonia virginica" },
      { common: "Hepatica", scientific: "Hepatica nobilis" },
      { common: "Jack-in-the-Pulpit", scientific: "Arisaema triphyllum" },
    ],
  },
  {
    section: "Prairie & Open Habitat Flowers",
    species: [
      { common: "Purple Coneflower", scientific: "Echinacea purpurea" },
      { common: "Black-eyed Susan", scientific: "Rudbeckia hirta" },
      { common: "Common Milkweed", scientific: "Asclepias syriaca" },
      { common: "Butterfly Weed", scientific: "Asclepias tuberosa" },
      { common: "Wild Bergamot", scientific: "Monarda fistulosa" },
      { common: "Prairie Blazing Star", scientific: "Liatris pycnostachya" },
      { common: "Wild Lupine", scientific: "Lupinus perennis" },
      { common: "Wild Blue Indigo", scientific: "Baptisia australis" },
      { common: "Compass Plant", scientific: "Silphium laciniatum" },
      { common: "Prairie Coreopsis", scientific: "Coreopsis palmata" },
    ],
  },
  {
    section: "Wetland & Shoreline Flowers",
    species: [
      { common: "Blue Flag Iris", scientific: "Iris versicolor" },
      { common: "Swamp Milkweed", scientific: "Asclepias incarnata" },
      { common: "Cardinal Flower", scientific: "Lobelia cardinalis" },
      { common: "Great Blue Lobelia", scientific: "Lobelia siphilitica" },
      { common: "Yellow Pond Lily", scientific: "Nuphar lutea" },
      { common: "White Water Lily", scientific: "Nymphaea odorata" },
      { common: "Pickerelweed", scientific: "Pontederia cordata" },
      { common: "Arrowhead", scientific: "Sagittaria latifolia" },
      { common: "Marsh Marigold", scientific: "Caltha palustris" },
    ],
  },
  {
    section: "Woodland & Shade-Tolerant Flowers",
    species: [
      { common: "Wild Columbine", scientific: "Aquilegia canadensis" },
      { common: "Solomon's Seal", scientific: "Polygonatum biflorum" },
      { common: "False Solomon's Seal", scientific: "Maianthemum racemosum" },
      { common: "Wild Geranium", scientific: "Geranium maculatum" },
      { common: "Wild Sarsaparilla", scientific: "Aralia nudicaulis" },
      { common: "White Baneberry", scientific: "Actaea pachypoda" },
      { common: "Red Baneberry", scientific: "Actaea rubra" },
      { common: "Mayapple", scientific: "Podophyllum peltatum" },
      { common: "Nodding Wild Onion", scientific: "Allium cernuum" },
    ],
  },
  {
    section: "Meadow, Disturbed Ground & Roadsides",
    species: [
      { common: "Canada Goldenrod", scientific: "Solidago canadensis" },
      { common: "Tall Goldenrod", scientific: "Solidago altissima" },
      { common: "New England Aster", scientific: "Symphyotrichum novae-angliae" },
      { common: "Ironweed", scientific: "Vernonia fasciculata" },
      // Wild Bergamot is already in the prairie section; skip duplicate
      { common: "Spotted Joe Pye Weed", scientific: "Eutrochium maculatum" },
      { common: "Queen Anne's Lace", scientific: "Daucus carota" },
      { common: "Common Chicory", scientific: "Cichorium intybus" },
    ],
  },
];

module.exports = flowers;
