import React from 'react';
import { Helmet } from 'react-helmet';


const Seo = ({ seo }) => {
  return (
    <Helmet>
      <title>{seo.metaTitle}</title>
      <meta name="description" content={seo.metaDescription} />
      <meta name="twitter:description" content={seo.metaDescription} />
      <meta name="twitter:title" content={seo.metaTitle} />
      <meta property="og:title" content={seo.metaTitle} />
      <meta property="og:description" content={seo.metaDescription} />
    </Helmet>
  )
}


export default Seo;
