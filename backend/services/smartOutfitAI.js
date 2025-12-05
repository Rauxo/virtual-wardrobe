const AiClothing = require("../models/AiClothing");
const chroma = require("chroma-js");

const smartCombos = {
  red: [
    "white",
    "black",
    "beige",
    "navy",
    "gold",
    "grey",
    "cream",
    "denim",
    "charcoal",
    "burgundy",
  ],
  maroon: [
    "white",
    "cream",
    "gold",
    "beige",
    "black",
    "grey",
    "olive",
    "nude",
    "peach",
    "mustard",
  ],
  pink: [
    "white",
    "grey",
    "black",
    "beige",
    "mint",
    "gold",
    "navy",
    "silver",
    "blush",
    "rose gold",
  ],
  baby_pink: [
    "white",
    "grey",
    "mint",
    "lavender",
    "peach",
    "beige",
    "silver",
    "black",
  ],
  coral: ["white", "navy", "teal", "gold", "beige", "grey", "black", "denim"],
  blue: [
    "white",
    "yellow",
    "orange",
    "grey",
    "pink",
    "red",
    "beige",
    "brown",
    "gold",
    "cream",
  ],
  navy: [
    "white",
    "red",
    "gold",
    "yellow",
    "coral",
    "beige",
    "grey",
    "pink",
    "mustard",
    "orange",
  ],
  royal_blue: ["white", "gold", "silver", "black", "yellow", "orange", "grey"],
  sky_blue: ["white", "coral", "peach", "grey", "yellow", "mint", "lavender"],
  green: [
    "white",
    "beige",
    "brown",
    "cream",
    "gold",
    "black",
    "pink",
    "yellow",
    "olive",
    "mustard",
  ],
  emerald: ["black", "gold", "white", "cream", "navy", "burgundy", "silver"],
  mint: ["white", "pink", "grey", "coral", "peach", "lavender", "gold", "navy"],
  olive: [
    "white",
    "beige",
    "brown",
    "mustard",
    "cream",
    "black",
    "orange",
    "maroon",
  ],
  yellow: [
    "blue",
    "black",
    "white",
    "grey",
    "navy",
    "pink",
    "green",
    "purple",
    "red",
  ],
  mustard: [
    "navy",
    "maroon",
    "olive",
    "beige",
    "black",
    "white",
    "cream",
    "brown",
  ],
  purple: [
    "white",
    "gold",
    "silver",
    "grey",
    "black",
    "yellow",
    "mint",
    "beige",
    "pink",
  ],
  lavender: ["white", "grey", "mint", "peach", "silver", "pink", "beige"],
  black: [
    "white",
    "red",
    "gold",
    "silver",
    "emerald",
    "pink",
    "yellow",
    "beige",
    "maroon",
    "any",
  ],
  white: ["any"],
  grey: ["pink", "yellow", "red", "blue", "black", "purple", "green", "beige"],
  charcoal: [
    "white",
    "red",
    "mustard",
    "emerald",
    "gold",
    "silver",
    "burgundy",
  ],
  beige: [
    "white",
    "brown",
    "black",
    "navy",
    "maroon",
    "olive",
    "red",
    "gold",
    "blue",
    "green",
  ],
  cream: [
    "maroon",
    "navy",
    "olive",
    "gold",
    "black",
    "emerald",
    "brown",
    "red",
  ],
  nude: ["black", "white", "gold", "blush", "maroon", "emerald"],
  brown: [
    "cream",
    "beige",
    "white",
    "green",
    "orange",
    "gold",
    "blue",
    "mustard",
  ],
  coffee: ["white", "cream", "gold", "beige", "black", "olive"],
  orange: ["blue", "white", "black", "grey", "navy", "beige", "brown", "gold"],
  peach: ["white", "mint", "grey", "navy", "gold", "coral", "pink"],
  gold: ["black", "white", "navy", "maroon", "emerald", "red", "royal_blue"],
  silver: ["black", "white", "purple", "navy", "pink", "grey", "emerald"],
  teal: ["white", "coral", "gold", "navy", "grey", "mustard", "pink"],
  turquoise: ["white", "coral", "gold", "navy", "black", "yellow"],
  wine: ["gold", "cream", "black", "beige", "emerald", "white"],
  burgundy: ["gold", "cream", "black", "white", "grey", "mustard"],
  denim: ["white", "red", "yellow", "black", "pink", "mustard", "grey"],
  khaki: ["white", "black", "navy", "maroon", "olive", "cream"],
  rose_gold: ["white", "black", "blush", "navy", "grey"],
  blush: ["grey", "white", "black", "gold", "navy", "mint"],
  ivory: ["any"],
  off_white: ["any"],
  champagne: ["navy", "black", "maroon", "gold"],
};

const getSmartOutfit = async () => {
  const tops = await AiClothing.aggregate([
    {
      $match: {
        category: {
          $in: [
            "Kurti",
            "Top",
            "T-Shirt",
            "Shirt",
            "Crop Top",
            "Blouse",
            "Tunic",
          ],
        },
      },
    },
    { $sample: { size: 1 } },
  ]);

  const bottoms = await AiClothing.aggregate([
    {
      $match: {
        category: {
          $in: [
            "Jeans",
            "Palazzo",
            "Skirt",
            "Leggings",
            "Trousers",
            "Shorts",
            "Salwar",
            "Dhoti",
            "Lehenga",
            "Patiala",
          ],
        },
      },
    },
    { $sample: { size: 1 } },
  ]);

  if (!tops[0] || !bottoms[0]) return null;

  const top = tops[0];
  const bottom = bottoms[0];

  const topColor = top.color.toLowerCase().replace(/ /g, "_");
  const bottomColor = bottom.color.toLowerCase().replace(/ /g, "_");

  const isGoodMatch =
    smartCombos[topColor]?.includes(bottomColor) ||
    smartCombos[bottomColor]?.includes(topColor) ||
    ["white", "black", "ivory", "off_white"].includes(topColor) ||
    ["white", "black", "ivory", "off_white"].includes(bottomColor);

  const phrase = isGoodMatch
    ? [
        "Perfect match!",
        "You’ll look stunning!",
        "This combo is fire!",
        "So chic!",
        "Slay today!",
      ]
    : ["Bold & unique!", "Fashion rebel!", "Break the rules!", "Stand out!"];

  return {
    title: "AI Outfit Suggestion",
    message: `${phrase[Math.floor(Math.random() * phrase.length)]} Try ${
      top.color
    } ${top.category} with ${bottom.color} ${bottom.category}!`,
    top,
    bottom,
    isGoodMatch,
  };
};

module.exports = { getSmartOutfit };
