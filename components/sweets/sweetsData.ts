export interface Sweet {
  id: string;
  name: string;
  emoji: string;
  flavor: string;
  meaning: string;
  color: string;
  bgColor: string;
}

export const sweets: Sweet[] = [
  {
    id: "vanilla-cupcake",
    name: "Vanilla Cupcake",
    emoji: "\u{1F9C1}",
    flavor: "Classic vanilla with buttercream frosting",
    meaning: "Simplicity & Joy",
    color: "#f5e6c8",
    bgColor: "#fdf6ec",
  },
  {
    id: "chocolate-cupcake",
    name: "Chocolate Cupcake",
    emoji: "\u{1F370}",
    flavor: "Rich dark chocolate with ganache swirl",
    meaning: "Comfort & Warmth",
    color: "#6b3a2a",
    bgColor: "#f0e0d6",
  },
  {
    id: "red-velvet",
    name: "Red Velvet Cupcake",
    emoji: "\u{2764}\u{FE0F}",
    flavor: "Red velvet with cream cheese frosting",
    meaning: "Love & Passion",
    color: "#c0392b",
    bgColor: "#fce4e4",
  },
  {
    id: "strawberry-macaron",
    name: "Strawberry Macaron",
    emoji: "\u{1F353}",
    flavor: "Delicate strawberry with rose filling",
    meaning: "Sweetness & Grace",
    color: "#e8789a",
    bgColor: "#fdeef3",
  },
  {
    id: "lavender-macaron",
    name: "Lavender Macaron",
    emoji: "\u{1F338}",
    flavor: "Floral lavender with honey ganache",
    meaning: "Calm & Serenity",
    color: "#9b7fbf",
    bgColor: "#f0e8f7",
  },
  {
    id: "pistachio-macaron",
    name: "Pistachio Macaron",
    emoji: "\u{1F33F}",
    flavor: "Nutty pistachio with white chocolate",
    meaning: "Luck & Prosperity",
    color: "#7dab6e",
    bgColor: "#edf5ea",
  },
  {
    id: "chocolate-truffle",
    name: "Chocolate Truffle",
    emoji: "\u{1F36B}",
    flavor: "Silky dark chocolate with cocoa dust",
    meaning: "Luxury & Indulgence",
    color: "#4a2c2a",
    bgColor: "#efe0d8",
  },
  {
    id: "caramel-bonbon",
    name: "Caramel Bonbon",
    emoji: "\u{1F36C}",
    flavor: "Creamy salted caramel in a chocolate shell",
    meaning: "Warmth & Friendship",
    color: "#d4a04a",
    bgColor: "#faf0dc",
  },
  {
    id: "sugar-cookie",
    name: "Sugar Cookie",
    emoji: "\u{1F36A}",
    flavor: "Classic sugar cookie with royal icing",
    meaning: "Nostalgia & Childhood",
    color: "#e8c170",
    bgColor: "#fdf5e6",
  },
  {
    id: "cake-pop",
    name: "Cake Pop",
    emoji: "\u{1F382}",
    flavor: "Rainbow sprinkle vanilla cake pop",
    meaning: "Celebration & Fun",
    color: "#e75480",
    bgColor: "#fde8ef",
  },
  {
    id: "glazed-donut",
    name: "Glazed Donut",
    emoji: "\u{1F369}",
    flavor: "Golden glazed ring donut",
    meaning: "Happiness & Delight",
    color: "#e89b3f",
    bgColor: "#fef3e2",
  },
  {
    id: "cinnamon-roll",
    name: "Cinnamon Roll",
    emoji: "\u{1F300}",
    flavor: "Warm cinnamon swirl with cream cheese icing",
    meaning: "Coziness & Home",
    color: "#b87333",
    bgColor: "#f5eade",
  },
];

export const MIN_SWEETS = 4;
export const MAX_SWEETS = 9;
