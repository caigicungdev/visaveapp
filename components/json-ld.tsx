'use client';

/**
 * JSON-LD Structured Data for SEO
 * Helps Google understand the website content better
 */
export function JsonLd() {
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Visave App",
        "url": "https://visaveapp.com",
        "description": "Free online video downloader for TikTok, Instagram, YouTube, Facebook. Download videos without watermark. AI-powered video summarization and analysis tools.",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Download TikTok videos without watermark",
            "Download Instagram videos and reels",
            "Download YouTube videos",
            "Download Facebook videos",
            "AI video summarization",
            "Video to audio conversion",
            "Background removal",
            "Watermark removal"
        ],
        "author": {
            "@type": "Organization",
            "name": "Visave App"
        }
    };

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Visave App",
        "url": "https://visaveapp.com",
        "logo": "https://visaveapp.com/assets/b-logo.png",
        "sameAs": []
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
        </>
    );
}
