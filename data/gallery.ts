import furnitureImage from "@/public/images/shop/antique-furniture-and-decor.jpg";
import chairImage from "@/public/images/shop/vintage-chair.jpg";
import quiltsImage from "@/public/images/shop/vintage-quilts-and-fabrics.jpg";
import clocksImage from "@/public/images/shop/handcrafted-wood-clocks.jpg";
import lanternsImage from "@/public/images/shop/vintage-lanterns.jpg";
import artisanImage from "@/public/images/shop/artisan-woodwork.jpg";

export const galleryItems = [
  {
    label: "Furniture & Décor",
    image: furnitureImage,
    alt: "Antique wood furniture, glassware, framed art, and home décor arranged inside the shop",
    className: "gallery-card gallery-card-featured",
  },
  {
    label: "Statement Pieces",
    image: chairImage,
    alt: "Turquoise vintage chair displayed in the front window",
    className: "gallery-card gallery-card-tall",
  },
  {
    label: "Vintage Textiles",
    image: quiltsImage,
    alt: "Shelves filled with colorful vintage quilts and fabrics",
    className: "gallery-card",
  },
  {
    label: "Artisan Finds",
    image: clocksImage,
    alt: "Handcrafted live-edge wood clocks displayed on a wall",
    className: "gallery-card",
  },
  {
    label: "Collectibles",
    image: lanternsImage,
    alt: "Collection of vintage oil and camp lanterns",
    className: "gallery-card",
  },
  {
    label: "One of a Kind",
    image: artisanImage,
    alt: "Handmade cutting boards, honey, and wood pieces in a welcoming shop display",
    className: "gallery-card gallery-card-wide",
  },
] as const;
