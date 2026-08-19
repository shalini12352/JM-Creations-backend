import { useEffect } from 'react';

const Seo = ({
  title = 'JM Creations — Business Solutions & Digital Agency',
  description = 'JM Creations provides end-to-end business solutions including Website Development, Digital Marketing, SEO, Branding, and Business Consulting.',
  keywords = 'JM Creations, Web Development, Digital Marketing, SEO, Brand Identity, Logo Design, Startup Consulting, Event Branding',
}) => {
  useEffect(() => {
    // Set Document Title
    document.title = title ? `${title} | JM Creations` : 'JM Creations — End-to-End Business Solutions';

    // Set Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description;

    // Set Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = Array.isArray(keywords) ? keywords.join(', ') : keywords;
  }, [title, description, keywords]);

  return null;
};

export default Seo;
