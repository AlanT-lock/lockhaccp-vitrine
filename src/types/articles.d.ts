declare module "*.md" {
  const article: {
    slug: string;
    meta: { titre: string; description: string; date: string; maj?: string; motCle: string; resume: string; illustration?: string };
    html: string;
    sommaire: { id: string; titre: string }[];
    mots: number;
    lecture: number;
  };
  export default article;
}
