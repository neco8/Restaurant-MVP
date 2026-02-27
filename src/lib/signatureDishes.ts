export type SignatureDish = {
  japanese: string;
  english: string;
  description: string;
  price: string;
};

export const SIGNATURE_DISHES: SignatureDish[] = [
  {
    japanese: "黒酢酢豚",
    english: "Black Vinegar Sweet & Sour Pork",
    description:
      "Kurobuta pork loin, aged Kagoshima black vinegar, seasonal root vegetables",
    price: "$38",
  },
  {
    japanese: "海老のチリソース",
    english: "Chili Prawns",
    description:
      "Live tiger prawns, house-fermented doubanjiang, hand-cracked egg ribbons",
    price: "$42",
  },
  {
    japanese: "白胡麻担々麺",
    english: "White Sesame Tantanmen",
    description:
      "Hand-pulled noodles, white sesame broth, Berkshire pork ragù",
    price: "$28",
  },
  {
    japanese: "陳麻婆豆腐",
    english: "Heritage Mapo Tofu",
    description:
      "Silken Kyoto tofu, aged doubanjiang, Japanese Sichuan peppercorn oil",
    price: "$32",
  },
  {
    japanese: "北京烤鴨",
    english: "Peking Duck",
    description: "48-hour aged whole duck, thin crêpes, nine condiments",
    price: "$88",
  },
];
