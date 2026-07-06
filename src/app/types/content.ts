export interface ContentItem {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  tag?: string;
  tagType?: "live" | "new" | "trending" | "hot";
  rating?: string;
  progress?: number;
}
