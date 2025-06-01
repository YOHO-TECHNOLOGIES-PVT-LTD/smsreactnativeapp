// src/data/sparePartsData.ts

// Import category images with names matching category (all lowercase, no spaces)
import engine from '../../../src/assets/sparepartsimage/category';
import tyres from '../assets/category/tyres.jpg';
import brakepads from '../assets/category/brakepads.jpg';
import lighting from '../assets/category/lighting.jpg';
import ac from '../assets/category/ac.jpg';
import battery from '../../../src/assets/sparepartsimage/category/';
import suspension from '../assets/category/suspension.jpg';
import interior from '../assets/category/interior.jpg';
import exhaust from '../assets/category/exhaust.jpg';

export type SparePart = {
  name: string;
  price: number;
  inStock: boolean;
  images: string[]; // images of individual parts
  type: string;
};

export type SparePartCategory = {
  category: string;
  image: string;  // category image
  parts: SparePart[];
};

export const sparePartsData: SparePartCategory[] = [
  {
    category: "Engine",
    image: engine,
    parts: [
      { name: "Spark Plug", price: 1200, inStock: true, images: ["images/parts/engine/sparkplug.jpg"], type: "Ignition" },
      { name: "Oil Filter", price: 800, inStock: false, images: ["images/parts/engine/oilfilter.jpg"], type: "Filtration" },
      { name: "Timing Chain", price: 3600, inStock: true, images: ["images/parts/engine/timingchain.jpg"], type: "Timing" },
      { name: "Camshaft", price: 6200, inStock: true, images: ["images/parts/engine/camshaft.jpg"], type: "Shaft" }
    ]
  },
  {
    category: "Tyres",
    image: tyres,
    parts: [
      { name: "Radial Tyre 16\"", price: 4500, inStock: true, images: ["images/parts/tyres/radial16.jpg"], type: "Radial" },
      { name: "Tubeless Tyre 14\"", price: 4200, inStock: true, images: ["images/parts/tyres/tubeless14.jpg"], type: "Tubeless" },
      { name: "Spare Wheel", price: 3200, inStock: true, images: ["images/parts/tyres/sparewheel.jpg"], type: "Spare" }
    ]
  },
  {
    category: "Brake Pads",
    image: brakepads,
    parts: [
      { name: "Ceramic Brake Pad", price: 1800, inStock: true, images: ["images/parts/brakes/ceramic.jpg"], type: "Ceramic" },
      { name: "Organic Brake Pad", price: 1400, inStock: false, images: ["images/parts/brakes/organic.jpg"], type: "Organic" },
      { name: "Brake Disc", price: 2100, inStock: true, images: ["images/parts/brakes/disc.jpg"], type: "Disc" }
    ]
  },
  {
    category: "Lighting",
    image: lighting,
    parts: [
      { name: "Headlight Bulb", price: 800, inStock: true, images: ["images/parts/lighting/headlight.jpg"], type: "Headlight" },
      { name: "Fog Light", price: 1000, inStock: false, images: ["images/parts/lighting/fog.jpg"], type: "Fog" },
      { name: "LED DRL", price: 1300, inStock: true, images: ["images/parts/lighting/drl.jpg"], type: "LED" }
    ]
  },
  {
    category: "Air Conditioning",
    image: ac,
    parts: [
      { name: "AC Compressor", price: 5500, inStock: true, images: ["images/parts/ac/compressor.jpg"], type: "Compressor" },
      { name: "AC Condenser", price: 4200, inStock: false, images: ["images/parts/ac/condenser.jpg"], type: "Condenser" },
      { name: "Blower Motor", price: 2600, inStock: true, images: ["images/parts/ac/blower.jpg"], type: "Blower" }
    ]
  },
  {
    category: "Battery",
    image: battery,
    parts: [
      { name: "12V Battery", price: 4800, inStock: true, images: ["images/parts/battery/12v.jpg"], type: "Standard" },
      { name: "Battery Terminal", price: 500, inStock: true, images: ["images/parts/battery/terminal.jpg"], type: "Accessory" },
      { name: "Battery Charger", price: 2200, inStock: true, images: ["images/parts/battery/charger.jpg"], type: "Tool" }
    ]
  },
  {
    category: "Suspension",
    image: suspension,
    parts: [
      { name: "Shock Absorber", price: 3200, inStock: true, images: ["images/parts/suspension/shock.jpg"], type: "Shock" },
      { name: "Coil Spring", price: 2900, inStock: true, images: ["images/parts/suspension/coil.jpg"], type: "Spring" },
      { name: "Stabilizer Link", price: 1100, inStock: false, images: ["images/parts/suspension/stabilizer.jpg"], type: "Link" }
    ]
  },
  {
    category: "Interior Accessories",
    image: interior,
    parts: [
      { name: "Floor Mats", price: 900, inStock: true, images: ["images/parts/interior/floormats.jpg"], type: "Mat" },
      { name: "Seat Cover", price: 2200, inStock: true, images: ["images/parts/interior/seatcover.jpg"], type: "Cover" },
      { name: "Dashboard Decor", price: 750, inStock: true, images: ["images/parts/interior/dashboard.jpg"], type: "Decor" }
    ]
  },
  {
    category: "Exhaust",
    image: exhaust,
    parts: [
      { name: "Muffler", price: 3500, inStock: true, images: ["images/parts/exhaust/muffler.jpg"], type: "Muffler" },
      { name: "Exhaust Pipe", price: 2400, inStock: true, images: ["images/parts/exhaust/pipe.jpg"], type: "Pipe" },
      { name: "Tailpipe Tip", price: 1200, inStock: true, images: ["images/parts/exhaust/tip.jpg"], type: "Tip" }
    ]
  }
];