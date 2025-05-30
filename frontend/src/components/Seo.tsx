import Head from "next/head";

export const Seo = ({
  imgHeight = 640,
  imgUrl,
  imgWidth = 1280,
  pageDescription,
  path,
  title,
}: {
  imgHeight: number;
  imgUrl: string;
  imgWidth: number;
  pageDescription: string;
  path: string;
  title: string;
}) => {
  const defaultDescription = "";

  const description = pageDescription ? pageDescription : defaultDescription;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:url" content={path} />
      <meta property="og:title" content={title} />
      <meta property="og:site_name" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={imgUrl} />
      <meta property="og:image:width" content={String(imgWidth)} />
      <meta property="og:image:height" content={String(imgHeight)} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@sol_hayama" />
      <meta name="twitter:url" content={path} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image:alt" content="image" />
      <link rel="canonical" href={path} />
    </Head>
  );
};
