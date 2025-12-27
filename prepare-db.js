import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'public/data');
const OUTPUT_FILE = path.join(__dirname, 'db.json');

const cleanPrice = (priceStr) => {
  if (!priceStr) return 0;
  return parseFloat(priceStr.replace('$', '').replace(',', ''));
};

async function generateDb() {
  const database = {
    cities: [],
    listings: []
  };

  const citiesRaw = fs.readFileSync(path.join(DATA_DIR, 'cities.json'), 'utf8');
  const baseCities = JSON.parse(citiesRaw);

  for (const city of baseCities) {
    console.log(`Processing ${city.name}...`);
    
    const folder = city.folderName || city.id;
    const csvPath = path.join(DATA_DIR, 'cities', folder, 'listings_detailed.csv');
    
    let realCount = 0;

    if (fs.existsSync(csvPath)) {
      const csvContent = fs.readFileSync(csvPath, 'utf8');
      
      const result = Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true
      });

      realCount = result.data.length;

      const cityListings = result.data.map((item, index) => ({
        id: item.id || `${city.id}_${index}`,
        cityId: city.id,
        name: item.name,
        image: item.picture_url, 
        host_name: item.host_name,
        host_image: item.host_picture_url,
        is_superhost: item.host_is_superhost === 't',
        rating: parseFloat(item.review_scores_rating) || 0,
        url: item.listing_url,
        license: item.license,
        latitude: parseFloat(item.latitude),
        longitude: parseFloat(item.longitude),
        price: cleanPrice(item.price), 
        propertyType: normalizeType(item.room_type),
        room_type: item.room_type,
        neighbourhood: item.neighbourhood_cleansed,
        accommodates: parseInt(item.accommodates) || 0,
        bedrooms: parseInt(item.bedrooms) || 0,
        beds: parseInt(item.beds) || 0,
        reviews: parseInt(item.number_of_reviews) || 0,
        revenue: parseFloat(item.estimated_revenue_l365d) || 0,
        availability: parseInt(item.availability_365) || 0,
        
        host_id: item.host_id
      }));
      
      database.listings.push(...cityListings);
    } else {
      console.warn(`⚠️ CSV não encontrado para ${city.name} em ${csvPath}`);
    }

    database.cities.push({
      ...city,
      listingCount: realCount
    });
  }
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(database, null, 2));
  
  const totalListings = database.listings.length;
  console.log(`Total Cidades: ${database.cities.length}`);
  console.log(`Total Listings: ${totalListings}`);
}

function normalizeType(type) {
  if (!type) return "unknown";
  const lower = type.toLowerCase();
  if (lower.includes("entire")) return "entire_home";
  if (lower.includes("private")) return "private_room";
  if (lower.includes("shared")) return "shared_room";
  if (lower.includes("hotel")) return "hotel_room";
  return "unknown";
}

generateDb();