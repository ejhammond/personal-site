export type Data = {
  site: {
    siteMetadata: {
      title: string;
      description: string;
      author: {
        name: string;
        twitter: string;
      };
    };
  };
  mdx: {
    id: string;
    body: string;
    timeToRead: number;
    fields: {
      articleURL: string;
      seriesURL: string | null;
      pathInRepo: string;
    };
    frontmatter: {
      article: string;
      series: string | null;
      number: number | null;
      description: string;
      title: string;
      date: string;
      tags: string[] | null;
    };
  };
};
