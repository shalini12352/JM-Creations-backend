const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const Service = require("../models/service");

const INITIAL_SERVICES = [
  // 1. BUSINESS & STRATEGY
  {
    title: "Business Consulting",
    category: "BUSINESS & STRATEGY",
    description: "Strategic advice and actionable frameworks to optimize business operations, scale revenue streams, and navigate market expansion.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
    status: "active"
  },
  {
    title: "Startup Consulting",
    category: "BUSINESS & STRATEGY",
    description: "End-to-end guidance for early-stage founders, from product-market fit verification to investor pitch decks and GTM strategy.",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80",
    status: "active"
  },
  {
    title: "Business Registration & Startup Support",
    category: "BUSINESS & STRATEGY",
    description: "Comprehensive legal structure registration, compliance filing, GST onboarding, and foundational operational setup for new ventures.",
    image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
    status: "active"
  },

  // 2. BRANDING & DESIGN
  {
    title: "Brand Identity & Logo Design",
    category: "BRANDING & DESIGN",
    description: "Complete visual identity systems including bespoke logo marks, color psychology, typography rules, and brand style guides.",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80",
    status: "active"
  },
  {
    title: "Graphic Design",
    category: "BRANDING & DESIGN",
    description: "High-impact marketing collateral, digital display banners, brochures, sales sheets, and branded visual communications.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
    status: "active"
  },
  {
    title: "Printing Solutions",
    category: "BRANDING & DESIGN",
    description: "Premium tactile physical print materials including metallic foiled business cards, hardbound catalogues, roll-up banners, and packaging.",
    image: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=800&q=80",
    status: "active"
  },
  {
    title: "Event Branding & Management",
    category: "BRANDING & DESIGN",
    description: "Immersive event design, booth backdrops, stage graphics, collateral printing, and seamless spatial branding execution.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    status: "active"
  },

  // 3. WEB & E-COMMERCE
  {
    title: "Website Design & Development",
    category: "WEB & E-COMMERCE",
    description: "High-performance, bespoke web platforms engineered for speed, SEO excellence, responsive elegance, and maximum lead conversion.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    status: "active"
  },
  {
    title: "E-commerce Website Development",
    category: "WEB & E-COMMERCE",
    description: "Scalable online storefronts integrated with secure payment gateways, inventory sync, cart recovery, and lightning-fast checkout.",
    image: "https://images.unsplash.com/photo-1556742049-0a67d57a22a3?auto=format&fit=crop&w=800&q=80",
    status: "active"
  },

  // 4. DIGITAL MARKETING
  {
    title: "Digital Marketing",
    category: "DIGITAL MARKETING",
    description: "Integrated multi-channel growth campaigns engineered to amplify brand reach, lower acquisition costs, and drive measurable ROI.",
    image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80",
    status: "active"
  },
  {
    title: "Meta Advertising",
    category: "DIGITAL MARKETING",
    description: "High-converting Facebook & Instagram ad campaigns utilizing AI targeting, custom lookalike audiences, and creative A/B testing.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80",
    status: "active"
  },
  {
    title: "Google Ads",
    category: "DIGITAL MARKETING",
    description: "Search, PPC, Display, and Shopping ads engineered to capture intent-driven leads at the precise moment they search for your solutions.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    status: "active"
  },
  {
    title: "SEO",
    category: "DIGITAL MARKETING",
    description: "Search engine optimization strategies combining technical site audits, keyword domination, quality backlink building, and content authority.",
    image: "https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?auto=format&fit=crop&w=800&q=80",
    status: "active"
  },
  {
    title: "Lead Generation",
    category: "DIGITAL MARKETING",
    description: "Automated, multi-touch lead capture funnels designed to deliver qualified B2B and B2C sales inquiries directly into your CRM.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
    status: "active"
  },

  // 5. SOCIAL & CONTENT
  {
    title: "Social Media Management",
    category: "SOCIAL & CONTENT",
    description: "End-to-end management of Instagram, LinkedIn, Facebook, and Twitter accounts with curated monthly content calendars and community engagement.",
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=800&q=80",
    status: "active"
  },
  {
    title: "Content Creation & Copywriting",
    category: "SOCIAL & CONTENT",
    description: "Persuasive brand storytelling, blog articles, website copy, ad copy, and video scripts crafted to engage audiences and convert readers.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
    status: "active"
  },
  {
    title: "Influencer Marketing",
    category: "SOCIAL & CONTENT",
    description: "Strategic matchmaking with niche creators and micro-influencers to build authentic brand awareness and social proof.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    status: "active"
  },
  {
    title: "WhatsApp Marketing",
    category: "SOCIAL & CONTENT",
    description: "Personalized broadcast flows, automated customer support bots, and targeted promo campaigns via official WhatsApp Business API.",
    image: "https://images.unsplash.com/photo-1614680376593-902f749f7ba0?auto=format&fit=crop&w=800&q=80",
    status: "active"
  },
  {
    title: "Email Marketing",
    category: "SOCIAL & CONTENT",
    description: "Automated welcome sequences, lifecycle newsletters, promotional blasts, and abandoned cart revivals with high deliverability.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    status: "active"
  },

  // 6. MEDIA PRODUCTION
  {
    title: "Video Editing & Motion Graphics",
    category: "MEDIA PRODUCTION",
    description: "Cinematic reel edits, promotional brand videos, 2D/3D motion graphics, and high-energy ads optimized for digital channels.",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    status: "active"
  },
  {
    title: "Product Photography & Videography",
    category: "MEDIA PRODUCTION",
    description: "High-resolution studio product photography, commercial lifestyle shoots, and 4K video showcases that make products stand out.",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80",
    status: "active"
  }
];

const seedServices = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("MONGODB_URI is not defined in environment variables.");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for service seeding...");

    const existingServices = await Service.find();
    const existingTitles = new Set(existingServices.map(s => s.title.toLowerCase().trim()));

    let insertedCount = 0;
    let skippedCount = 0;

    for (const item of INITIAL_SERVICES) {
      const normalizedTitle = item.title.toLowerCase().trim();
      if (existingTitles.has(normalizedTitle)) {
        skippedCount++;
      } else {
        await Service.create(item);
        existingTitles.add(normalizedTitle);
        insertedCount++;
      }
    }

    console.log(`Service Seeding Summary: ${insertedCount} inserted, ${skippedCount} skipped (already exist). Total Services in DB: ${await Service.countDocuments()}`);
  } catch (error) {
    console.error("Error during service seeding:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB after seeding.");
  }
};

if (require.main === module) {
  seedServices();
}

module.exports = seedServices;
