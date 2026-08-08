"""
Build Schema.org JSON-LD for Satpuda Core site.

Follows schema.org guidance:
- JSON-LD format (https://schema.org/docs/gs.html)
- One top-level entity per <script> for validator visibility
- Stable @id URLs linking Organization -> WebSite -> WebPage
- ISO 8601 dates, schema.org enumeration URLs for availability
- FAQPage always last script block
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://satpudacore.in"
ORG_ID = f"{SITE}/#organization"
WEBSITE_ID = f"{SITE}/#website"
FAQ_ID = f"{SITE}/#faq"

ORGANIZATION = {
    "@type": "Organization",
    "@id": ORG_ID,
    "name": "Satpuda Core Private Limited",
    "legalName": "Satpuda Core Private Limited",
    "alternateName": "Satpuda Core",
    "url": SITE,
    "logo": f"{SITE}/assets/logo_icon.png",
    "image": f"{SITE}/assets/logo_icon.png",
    "description": "Satpuda Core Private Limited is a software development company providing billing and management software, medical and hospital solutions, websites, and custom applications.",
    "foundingDate": "2026-07-28",
    "telephone": "+91-93254-85954",
    "email": "satpudacoreprivatelimited@gmail.com",
    "areaServed": {"@type": "Country", "name": "India"},
    "identifier": {
        "@type": "PropertyValue",
        "propertyID": "CIN",
        "value": "U62013ME2026PTC475941",
    },
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "783 Jalgaon Jamod, Wadshingi",
        "addressLocality": "Jalgaon",
        "addressRegion": "Maharashtra",
        "postalCode": "443402",
        "addressCountry": "IN",
    },
    "contactPoint": [
        {
            "@type": "ContactPoint",
            "telephone": "+91-93254-85954",
            "contactType": "customer service",
            "email": "satpudacoreprivatelimited@gmail.com",
            "areaServed": "IN",
            "availableLanguage": ["English", "Hindi", "Marathi"],
        },
        {
            "@type": "ContactPoint",
            "telephone": "+91-70588-74807",
            "contactType": "sales",
            "email": "satpudacoreprivatelimited@gmail.com",
            "areaServed": "IN",
            "availableLanguage": ["English", "Hindi", "Marathi"],
        },
    ],
}

WEBSITE = {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    "url": SITE,
    "name": "Satpuda Core Private Limited",
    "alternateName": "Satpuda Core",
    "description": "Billing | Management | Simplified - Official website of Satpuda Core Private Limited.",
    "inLanguage": ["en-IN", "hi-IN", "mr-IN"],
    "publisher": {"@id": ORG_ID},
    "copyrightHolder": {"@id": ORG_ID},
}

APPS = [
    {
        "@type": "SoftwareApplication",
        "@id": f"{SITE}/products.html#medical-pc",
        "name": "SatpudaCore Medical Management - Offline PC",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Windows",
        "url": f"{SITE}/products.html",
        "publisher": {"@id": ORG_ID},
        "author": {"@id": ORG_ID},
        "description": "Offline medical store billing and management software from Satpuda Core Private Limited. First-time licence Rs 8000. AMC Rs 1000 per year.",
        "offers": [
            {
                "@type": "Offer",
                "name": "First-time PC licence",
                "price": "8000",
                "priceCurrency": "INR",
                "availability": "https://schema.org/InStock",
                "url": f"{SITE}/products.html",
                "seller": {"@id": ORG_ID},
            },
            {
                "@type": "Offer",
                "name": "Annual Maintenance Contract (AMC)",
                "price": "1000",
                "priceCurrency": "INR",
                "availability": "https://schema.org/InStock",
                "url": f"{SITE}/products.html",
                "seller": {"@id": ORG_ID},
            },
        ],
    },
    {
        "@type": "SoftwareApplication",
        "@id": f"{SITE}/products.html#medical-pc-android",
        "name": "SatpudaCore Medical Management - PC + Android",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Windows, Android",
        "url": f"{SITE}/products.html",
        "publisher": {"@id": ORG_ID},
        "author": {"@id": ORG_ID},
        "description": "Medical management software with PC and Android from Satpuda Core Private Limited. First-time payment Rs 10000. AMC Rs 1000 per year.",
        "offers": [
            {
                "@type": "Offer",
                "name": "First-time PC + Android licence",
                "price": "10000",
                "priceCurrency": "INR",
                "availability": "https://schema.org/InStock",
                "url": f"{SITE}/products.html",
                "seller": {"@id": ORG_ID},
            },
            {
                "@type": "Offer",
                "name": "Annual Maintenance Contract (AMC)",
                "price": "1000",
                "priceCurrency": "INR",
                "availability": "https://schema.org/InStock",
                "url": f"{SITE}/products.html",
                "seller": {"@id": ORG_ID},
            },
        ],
    },
    {
        "@type": "SoftwareApplication",
        "@id": f"{SITE}/products.html#hospital",
        "name": "SatpudaCore Hospital Management for Small Hospitals",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Windows",
        "url": f"{SITE}/products.html",
        "publisher": {"@id": ORG_ID},
        "author": {"@id": ORG_ID},
        "description": "Hospital management software for small hospitals from Satpuda Core Private Limited. First-time payment Rs 15000.",
        "offers": {
            "@type": "Offer",
            "price": "15000",
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock",
            "url": f"{SITE}/products.html",
            "seller": {"@id": ORG_ID},
        },
    },
]

SERVICES = [
    {
        "@type": "Service",
        "@id": f"{SITE}/services.html#websites",
        "name": "Website Development",
        "serviceType": "Website Development",
        "provider": {"@id": ORG_ID},
        "areaServed": "IN",
        "url": f"{SITE}/services.html",
        "description": "Custom website development by Satpuda Core Private Limited for businesses.",
        "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "INR",
            "lowPrice": "6000",
            "highPrice": "100000",
            "offerCount": "1",
            "url": f"{SITE}/services.html",
            "seller": {"@id": ORG_ID},
        },
    },
    {
        "@type": "Service",
        "@id": f"{SITE}/services.html#android",
        "name": "Android Application Development",
        "serviceType": "Android Application Development",
        "provider": {"@id": ORG_ID},
        "areaServed": "IN",
        "url": f"{SITE}/services.html",
        "description": "Custom Android application development by Satpuda Core Private Limited.",
        "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "INR",
            "lowPrice": "40000",
            "highPrice": "500000",
            "offerCount": "1",
            "url": f"{SITE}/services.html",
            "seller": {"@id": ORG_ID},
        },
    },
    {
        "@type": "Service",
        "@id": f"{SITE}/services.html#desktop",
        "name": "Desktop Application Development",
        "serviceType": "Desktop Application Development",
        "provider": {"@id": ORG_ID},
        "areaServed": "IN",
        "url": f"{SITE}/services.html",
        "description": "Custom desktop software development by Satpuda Core Private Limited.",
        "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "INR",
            "lowPrice": "40000",
            "highPrice": "500000",
            "offerCount": "1",
            "url": f"{SITE}/services.html",
            "seller": {"@id": ORG_ID},
        },
    },
    {
        "@type": "Service",
        "@id": f"{SITE}/services.html#ios-mac",
        "name": "iOS and Mac Application Development",
        "serviceType": "iOS and Mac Application Development",
        "provider": {"@id": ORG_ID},
        "areaServed": "IN",
        "url": f"{SITE}/services.html",
        "description": "Custom iOS and Mac software development by Satpuda Core Private Limited.",
        "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "INR",
            "lowPrice": "40000",
            "highPrice": "500000",
            "offerCount": "1",
            "url": f"{SITE}/services.html",
            "seller": {"@id": ORG_ID},
        },
    },
    {
        "@type": "Service",
        "@id": f"{SITE}/services.html#billing-management",
        "name": "Billing and Management Software Solutions",
        "serviceType": "Billing and Management Software Solutions",
        "provider": {"@id": ORG_ID},
        "areaServed": "IN",
        "url": f"{SITE}/services.html",
        "description": "Custom billing and business management software solutions for small and medium businesses.",
    },
]

FAQ = {
    "@type": "FAQPage",
    "@id": FAQ_ID,
    "url": SITE,
    "isPartOf": {"@id": WEBSITE_ID},
    "about": {"@id": ORG_ID},
    "mainEntity": [
        {
            "@type": "Question",
            "name": "Is Satpuda Core a legal Private Limited company?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Satpuda Core Private Limited is registered under the Companies Act, 2013 with CIN U62013ME2026PTC475941. Incorporated on 28 July 2026. Registered office: 783 Jalgaon Jamod, Wadshingi, Jalgaon, Buldhana - 443402, Maharashtra, India.",
            },
        },
        {
            "@type": "Question",
            "name": "What does Satpuda Core Private Limited do?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Satpuda Core Private Limited is a software company offering billing and management solutions, medical and hospital software, websites, Android apps, desktop software, and iOS and Mac applications.",
            },
        },
        {
            "@type": "Question",
            "name": "What is the price of SatpudaCore Medical Management software?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "PC first-time payment is Rs 8000. PC + Android first-time payment is Rs 10000. Annual maintenance (AMC) is Rs 1000 per year.",
            },
        },
        {
            "@type": "Question",
            "name": "How much is hospital management software?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Hospital management software for small hospitals is Rs 15000 first-time.",
            },
        },
        {
            "@type": "Question",
            "name": "What are website and app development prices?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Website development ranges from Rs 6000 to Rs 100000. Android, desktop, iOS and Mac application development typically ranges from Rs 40000 to Rs 500000.",
            },
        },
        {
            "@type": "Question",
            "name": "How can I contact Satpuda Core Private Limited?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Email satpudacoreprivatelimited@gmail.com or call +91-93254 85954 / +91-70588 74807. Website: https://satpudacore.in",
            },
        },
    ],
}

PAGES = {
    "index.html": {
        "page": {
            "@type": "WebPage",
            "@id": f"{SITE}/#webpage",
            "url": f"{SITE}/",
            "name": "Satpuda Core Private Limited | Software Development Company",
            "description": "Satpuda Core Private Limited provides billing and management software, websites, Android apps, and custom software solutions.",
            "isPartOf": {"@id": WEBSITE_ID},
            "about": {"@id": ORG_ID},
            "publisher": {"@id": ORG_ID},
            "inLanguage": "en-IN",
        },
        "breadcrumb": [("Home", f"{SITE}/")],
    },
    "about.html": {
        "page": {
            "@type": "AboutPage",
            "@id": f"{SITE}/about.html#webpage",
            "url": f"{SITE}/about.html",
            "name": "About Us - Satpuda Core Private Limited",
            "isPartOf": {"@id": WEBSITE_ID},
            "about": {"@id": ORG_ID},
            "mainEntity": {"@id": ORG_ID},
            "publisher": {"@id": ORG_ID},
            "inLanguage": "en-IN",
        },
        "breadcrumb": [("Home", f"{SITE}/"), ("About", f"{SITE}/about.html")],
    },
    "contact.html": {
        "page": {
            "@type": "ContactPage",
            "@id": f"{SITE}/contact.html#webpage",
            "url": f"{SITE}/contact.html",
            "name": "Contact Satpuda Core Private Limited",
            "isPartOf": {"@id": WEBSITE_ID},
            "about": {"@id": ORG_ID},
            "publisher": {"@id": ORG_ID},
            "inLanguage": "en-IN",
        },
        "breadcrumb": [("Home", f"{SITE}/"), ("Contact", f"{SITE}/contact.html")],
    },
    "products.html": {
        "page": {
            "@type": "WebPage",
            "@id": f"{SITE}/products.html#webpage",
            "url": f"{SITE}/products.html",
            "name": "Products - Satpuda Core Private Limited",
            "description": "Medical and hospital management software products from Satpuda Core Private Limited.",
            "isPartOf": {"@id": WEBSITE_ID},
            "about": {"@id": ORG_ID},
            "publisher": {"@id": ORG_ID},
            "inLanguage": "en-IN",
        },
        "breadcrumb": [("Home", f"{SITE}/"), ("Products", f"{SITE}/products.html")],
    },
    "services.html": {
        "page": {
            "@type": "WebPage",
            "@id": f"{SITE}/services.html#webpage",
            "url": f"{SITE}/services.html",
            "name": "Services and Pricing - Satpuda Core Private Limited",
            "description": "Software products and custom development services from Satpuda Core Private Limited with published pricing.",
            "isPartOf": {"@id": WEBSITE_ID},
            "about": {"@id": ORG_ID},
            "publisher": {"@id": ORG_ID},
            "inLanguage": "en-IN",
        },
        "breadcrumb": [("Home", f"{SITE}/"), ("Services", f"{SITE}/services.html")],
    },
    "download.html": {
        "page": {
            "@type": "WebPage",
            "@id": f"{SITE}/download.html#webpage",
            "url": f"{SITE}/download.html",
            "name": "Downloads - Satpuda Core Private Limited",
            "description": "Download SatpudaCore installers from Satpuda Core Private Limited.",
            "isPartOf": {"@id": WEBSITE_ID},
            "about": {"@id": ORG_ID},
            "publisher": {"@id": ORG_ID},
            "inLanguage": "en-IN",
        },
        "breadcrumb": [("Home", f"{SITE}/"), ("Downloads", f"{SITE}/download.html")],
    },
}


def script_block(node: dict) -> str:
    payload = {"@context": "https://schema.org", **node}
    return (
        '<script type="application/ld+json">\n'
        + json.dumps(payload, indent=2, ensure_ascii=False)
        + "\n</script>"
    )


def breadcrumb_node(items: list[tuple[str, str]]) -> dict:
    page_url = items[-1][1]
    return {
        "@type": "BreadcrumbList",
        "@id": f"{page_url}#breadcrumb",
        "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "name": name, "item": url}
            for i, (name, url) in enumerate(items)
        ],
    }


def build_schema_section(page_cfg: dict) -> str:
    blocks = [
        ORGANIZATION,
        WEBSITE,
        page_cfg["page"],
        *APPS,
        *SERVICES,
        breadcrumb_node(page_cfg["breadcrumb"]),
        FAQ,
    ]
    return "\n".join(script_block(node) for node in blocks)


def rebuild_page(filename: str, page_cfg: dict) -> None:
    path = ROOT / filename
    text = path.read_text(encoding="utf-8")
    start = text.index('<script type="application/ld+json">')
    end = text.index("</head>", start)
    schema = build_schema_section(page_cfg)
    path.write_text(text[:start] + schema + "\n" + text[end:], encoding="utf-8")


def write_asset_files() -> None:
    assets = ROOT / "assets"
    primary = "\n".join([script_block(ORGANIZATION), script_block(WEBSITE)])
    (assets / "schema-primary.jsonld.html").write_text(
        "<!-- Schema.org primary entities: paste first in every page head -->\n" + primary + "\n",
        encoding="utf-8",
    )
    catalog_nodes = [*APPS, *SERVICES, FAQ]
    catalog = "\n".join(script_block(node) for node in catalog_nodes)
    (assets / "schema-catalog.jsonld.html").write_text(
        "<!-- Schema.org catalog entities: paste after page schema; FAQ must stay last -->\n" + catalog + "\n",
        encoding="utf-8",
    )
    (assets / "schema-organization.jsonld.html").write_text(
        script_block(ORGANIZATION) + "\n",
        encoding="utf-8",
    )


def main() -> None:
    for filename, cfg in PAGES.items():
        rebuild_page(filename, cfg)
        print(f"Updated {filename} with 13 standalone Schema.org scripts")
    write_asset_files()
    print("Updated assets/schema-primary.jsonld.html and schema-catalog.jsonld.html")


if __name__ == "__main__":
    main()
