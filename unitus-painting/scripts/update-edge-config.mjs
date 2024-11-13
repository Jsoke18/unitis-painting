import fetch from 'node-fetch';

const EDGE_CONFIG = "https://edge-config.vercel.com/ecfg_xpin1fwffvyz44uy3zkh5rtkaznh?token=bd7a110e-992d-4cee-b701-cb0196ab8826";
const VERCEL_API_TOKEN = "IiK8k6LKIlpNXdnEJzK9B4wc";

const configData = {
  "location": {
    "text": "Serving Greater Vancouver, Fraser Valley, BC Interior, and Calgary"
  },
  "mainHeading": {
    "line1": "Transform Your Space",
    "line2": "Professional Painting Services"
  },
  "subheading": "Expert residential and commercial painting solutions delivered with precision, professionalism, and attention to detail.",
  "buttons": {
    "primary": {
      "text": "Explore Our Services",
      "link": "/services"
    },
    "secondary": {
      "text": "Get Free Quote",
      "link": "/contact"
    }
  },
  "videoUrl": "https://storage.googleapis.com/unitis-videos/Banner%20Video.mp4"
};

async function updateEdgeConfig() {
  // Extract Edge Config ID from the connection string
  const configId = EDGE_CONFIG.match(/edge-config\.vercel\.com\/([^?]+)/)[1];
  
  console.log('Config ID:', configId);

  // Create items array for the update operation
  const items = Object.entries(configData).map(([key, value]) => ({
    operation: 'upsert', // This will create if doesn't exist, update if it does
    key,
    value
  }));

  try {
    const response = await fetch(
      `https://api.vercel.com/v1/edge-config/${configId}/items`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${VERCEL_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items })
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Full response:', data);
      throw new Error(`Failed to update Edge Config: ${JSON.stringify(data)}`);
    }

    return data;
  } catch (error) {
    console.error('Full error:', error);
    throw new Error(`Error updating Edge Config: ${error.message}`);
  }
}

// Execute the update
updateEdgeConfig()
  .then(result => console.log('Successfully updated Edge Config:', result))
  .catch(error => console.error('Failed to update Edge Config:', error));