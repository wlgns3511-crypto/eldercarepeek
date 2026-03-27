const SITE_NAME = 'ElderCarePeek';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://eldercarepeek.com';

export function datasetSchema(title: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: title,
    description,
    url: SITE_URL,
    creator: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    temporalCoverage: '2024',
    spatialCoverage: {
      '@type': 'Place',
      name: 'United States',
    },
    license: 'https://creativecommons.org/licenses/by-nc/4.0/',
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function webPageSchema(title: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `${SITE_URL}${url}`,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
    dateModified: new Date().toISOString(),
  };
}
