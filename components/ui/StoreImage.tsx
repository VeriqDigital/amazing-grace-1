import Image, { type ImageProps } from "next/image";
import { getStoreSettings } from "@/lib/cms/client";
import { imageUrl } from "@/lib/cms/images";
import type { StoreSettings } from "@/lib/cms/types";

type Props = ImageProps & { slot: Exclude<keyof StoreSettings, "visitNote"> };
export default async function StoreImage({ slot, src, alt, ...props }: Props) {
  const settings = await getStoreSettings();
  const photo = settings[slot];
  const portrait = ["heroImage", "aboutImage", "sellImage"].includes(slot);
  const url = imageUrl(photo, 1280, portrait ? 1600 : 1280);
  return <Image {...props} src={url || src} alt={url && photo ? photo.alt : alt} />;
}
