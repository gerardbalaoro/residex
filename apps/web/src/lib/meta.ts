export const meta = {
  title: "Residex",
  description:
    "Offline-first web app for medical residents to track patient encounters, clinical skills, and procedures toward residency requirements.",
  page(title: string, description?: string) {
    return [
      { title: `${title} | ${this.title}` },
      ...(description ? [{ name: "description", content: description }] : []),
    ];
  },
};

export const seo = ({
  title,
  description,
  keywords,
  image,
}: {
  title: string;
  description?: string;
  image?: string;
  keywords?: string;
}) => {
  const tags = [
    { title },
    { name: "twitter:title", content: title },
    { name: "og:type", content: "website" },
    { name: "og:title", content: title },
    ...(keywords ? [{ name: "keywords", content: keywords }] : []),
    ...(description
      ? [
          { name: "description", content: description },
          { name: "twitter:description", content: description },
          { name: "og:description", content: description },
        ]
      : []),
    ...(image
      ? [
          { name: "twitter:image", content: image },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "og:image", content: image },
        ]
      : []),
  ];

  return tags;
};
