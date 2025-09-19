export type Post = {
  id:number;
  title:string;
  createdAt:string;
  categories:string[];
  content:string;
  cat:string;
  thumbnailUrl:string;
}

export type ApiType = {
  method: string;
  headers: Record<string, string>;
  body: string;
}