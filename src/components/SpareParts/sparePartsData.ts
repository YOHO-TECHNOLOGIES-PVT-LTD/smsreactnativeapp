export type SparePart = {
  name: string;
  price: number;
  inStock: boolean;
  images: any[]; // Using 'any' since require() returns a number (React Native image module)
  type: string;
};

export type SparePartCategory = {
  category: string;
  image: any; // Image from require()
  parts: SparePart[];
};

const sparePartsData: SparePartCategory[] = [
  {
    category: "Engine",
    image: require("../../../src/assets/sparepartsimage/category/engine.jpg"),
    parts: [
      { name: "Spark Plug", price: 1200, inStock: true, images: [require("../../../src/assets/sparepartsimage/parts/engine.jpg")], type: "Ignition" },
      { name: "Oil Filter", price: 800, inStock: false, images: [require("../../../src/assets/sparepartsimage/parts/engine.jpg")], type: "Filtration" },
      { name: "Timing Chain", price: 3600, inStock: true, images: [require("../../../src/assets/sparepartsimage/parts/engine.jpg")], type: "Timing" },
      { name: "Camshaft", price: 6200, inStock: true, images: [require("../../../src/assets/sparepartsimage/parts/engine.jpg")], type: "Shaft" }
    ]
  },
  {
    category: "Tyres",
    image: require("../../../src/assets/sparepartsimage/category/tyres.jpg"),
    parts: [
      { name: "Radial Tyre 16\"", price: 4500, inStock: true, images: [require("../../../src/assets/sparepartsimage/parts/tyres.jpg")], type: "Radial" },
      { name: "Tubeless Tyre 14\"", price: 4200, inStock: true, images: [require("../../../src/assets/sparepartsimage/parts/tyres.jpg")], type: "Tubeless" },
      { name: "Spare Wheel", price: 3200, inStock: true, images: [require("../../../src/assets/sparepartsimage/parts/tyres.jpg")], type: "Spare" }
    ]
  },
  {
    category: "Brake Pads",
    image: require("../../../src/assets/sparepartsimage/category/brakepads.jpg"),
    parts: [
      { name: "Ceramic Brake Pad", price: 1800, inStock: true, images: [require("../../../src/assets/sparepartsimage/parts/brakepads.jpg")], type: "Ceramic" },
      { name: "Organic Brake Pad", price: 1400, inStock: false, images: [require("../../../src/assets/sparepartsimage/parts/brakepads.jpg")], type: "Organic" },
      { name: "Brake Disc", price: 2100, inStock: true, images: [require("../../../src/assets/sparepartsimage/parts/brakepads.jpg")], type: "Disc" }
    ]
  },
  {
    category: "Lighting",
    image: require("../../../src/assets/sparepartsimage/category/lighting.jpg"),
    parts: [
      { name: "Headlight Bulb", price: 800, inStock: true, images: [require("../../../src/assets/sparepartsimage/parts/lighting.jpg")], type: "Headlight" },
      { name: "Fog Light", price: 1000, inStock: false, images: [require("../../../src/assets/sparepartsimage/parts/lighting.jpg")], type: "Fog" },
      { name: "LED DRL", price: 1300, inStock: true, images: [require("../../../src/assets/sparepartsimage/parts/lighting.jpg")], type: "LED" }
    ]
  },
  {
    category: "Air Conditioning",
    image: require("../../../src/assets/sparepartsimage/category/ac.jpg"),
    parts: [
      { name: "AC Compressor", price: 5500, inStock: true, images: [require("../../../src/assets/sparepartsimage/parts/ac.jpg")], type: "Compressor" },
      { name: "AC Condenser", price: 4200, inStock: false, images: [require("../../../src/assets/sparepartsimage/parts/ac.jpg")], type: "Condenser" },
      { name: "Blower Motor", price: 2600, inStock: true, images: [require("../../../src/assets/sparepartsimage/parts/ac.jpg")], type: "Blower" }
    ]
  },
  {
    category: "Battery",
    image: require("../../../src/assets/sparepartsimage/category/battery.jpg"),
    parts: [
      { name: "12V Battery", price: 4800, inStock: true, images: [require("../../../src/assets/sparepartsimage/parts/battery.jpg")], type: "Standard" },
      { name: "Battery Terminal", price: 500, inStock: true, images: [require("../../../src/assets/sparepartsimage/parts/battery.jpg")], type: "Accessory" },
      { name: "Battery Charger", price: 2200, inStock: true, images: [require("../../../src/assets/sparepartsimage/parts/battery.jpg")], type: "Tool" }
    ]
  },
  {
    category: "Suspension",
    image: require("../../../src/assets/sparepartsimage/category/suspension.jpg"),
    parts: [
      { name: "Shock Absorber", price: 3200, inStock: true, images: [require("../../../src/assets/sparepartsimage/parts/suspension.jpg")], type: "Shock" },
      { name: "Coil Spring", price: 2900, inStock: true, images: [require("../../../src/assets/sparepartsimage/parts/suspension.jpg")], type: "Spring" },
      { name: "Stabilizer Link", price: 1100, inStock: false, images: [require("../../../src/assets/sparepartsimage/parts/suspension.jpg")], type: "Link" }
    ]
  },
  {
    category: "Interior Accessories",
    image: require("../../../src/assets/sparepartsimage/category/interior.jpg"),
    parts: [
      { name: "Floor Mats", price: 900, inStock: true, images: [require("../../../src/assets/sparepartsimage/parts/interior.jpg")], type: "Mat" },
      { name: "Seat Cover", price: 2200, inStock: true, images: [require("../../../src/assets/sparepartsimage/parts/interior.jpg")], type: "Cover" },
      { name: "Dashboard Decor", price: 750, inStock: true, images: [require("../../../src/assets/sparepartsimage/parts/interior.jpg")], type: "Decor" }
    ]
  },
  {
    category: "Exhaust",
    image: require("../../../src/assets/sparepartsimage/category/exhaust.jpg"),
    parts: [
      { name: "Muffler", price: 3500, inStock: true, images: [require("../../../src/assets/sparepartsimage/parts/exhaust.jpg")], type: "Muffler" },
      { name: "Exhaust Pipe", price: 2400, inStock: true, images: [require("../../../src/assets/sparepartsimage/parts/exhaust.jpg")], type: "Pipe" },
      { name: "Tailpipe Tip", price: 1200, inStock: true, images: [require("../../../src/assets/sparepartsimage/parts/exhaust.jpg")], type: "Tip" }
    ]
  }
];
export default sparePartsData;