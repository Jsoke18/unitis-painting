import { createClient } from '@vercel/edge-config';
import { HeroContent } from '@/app/types/hero';

const EDGE_CONFIG = process.env.EDGE_CONFIG || 'edge_config_id=ecfg_xpin1fwffvyz44uy3zkh5rtkaznh;edge_config_token=bd7a110e-992d-4cee-b701-cb0196ab8826';

const config = createClient(EDGE_CONFIG);

export async function getHeroFromEdgeConfig(): Promise<HeroContent | null> {
  try {
    // Fetch each field individually or fetch the entire hero object at once
    // Option 1: Fetch entire hero object (recommended)
    const heroContent = await config.get<HeroContent>('hero');

    // Option 2: Fetch individual fields
    // const [location, mainHeading, subheading, buttons, videoUrl] = await Promise.all([
    //   config.get<HeroContent['location']>('location'),
    //   config.get<HeroContent['mainHeading']>('mainHeading'),
    //   config.get<string>('subheading'),
    //   config.get<HeroContent['buttons']>('buttons'),
    //   config.get<string>('videoUrl')
    // ]);
    
    // const heroContent = {
    //   location,
    //   mainHeading,
    //   subheading,
    //   buttons,
    //   videoUrl
    // };

    console.log('Edge Config Response:', heroContent);

    if (!heroContent) {
      console.error('No content returned from Edge Config');
      return null;
    }

    const isValidHeroContent = (
      content: any
    ): content is HeroContent => {
      const hasAllFields = 
        'location' in content &&
        'mainHeading' in content &&
        'subheading' in content &&
        'buttons' in content &&
        'videoUrl' in content;

      if (!hasAllFields) {
        console.error('Missing required fields in Edge Config response:', {
          hasLocation: 'location' in content,
          hasMainHeading: 'mainHeading' in content,
          hasSubheading: 'subheading' in content,
          hasButtons: 'buttons' in content,
          hasVideoUrl: 'videoUrl' in content
        });
        return false;
      }

      return true;
    };

    if (!isValidHeroContent(heroContent)) {
      return null;
    }

    return heroContent;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Edge Config error:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    } else {
      console.error('Unknown Edge Config error:', error);
    }
    return null;
  }
}

export async function checkEdgeConfigConnection(): Promise<boolean> {
  try {
    const isConnected = await config.has('hero');
    console.log('Edge Config connection status:', isConnected);
    return isConnected;
  } catch (error) {
    console.error('Edge Config connection check failed:', error);
    return false;
  }
}