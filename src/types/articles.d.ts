declare module "*.md" {
  const article: { slug: string; html: string };
  export default article;
}
