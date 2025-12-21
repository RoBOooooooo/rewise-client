import { Helmet } from 'react-helmet-async';


const SEO = ({ title, description, keywords, image, url, type = 'website' }) => {
    const siteTitle = 'Rewise';
    // Ensure title is a string and fallback safely
    const safeTitle = title ? String(title) : '';
    const fullTitle = safeTitle ? `${safeTitle} | ${siteTitle}` : siteTitle;

    const defaultDescription = 'Learn, Share, and Grow with Rewise - A Community Learning Platform';
    const safeDescription = description ? String(description).substring(0, 160) : defaultDescription;

    const defaultImage = window.location.origin + '/favicon.ico';
    const safeImage = image ? (image.startsWith('http') ? image : window.location.origin + image) : defaultImage;

    const currentUrl = url || window.location.href;

    return (
        <Helmet prioritizeSeoTags>

            <title>{fullTitle}</title>
            <meta name="description" content={safeDescription} />
            <meta name="keywords" content={keywords || 'education, learning, sharing, community, wisdom, lessons'} />

            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={safeDescription} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:image" content={safeImage} />
            <meta property="og:site_name" content={siteTitle} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={safeDescription} />
            <meta name="twitter:image" content={safeImage} />

            <link rel="canonical" href={currentUrl} />
        </Helmet>
    );
};



export default SEO;
