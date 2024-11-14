// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const heroContent = {
  location: {
    text: "Serving Greater Vancouver, Fraser Valley, BC Interior, and Calgary"
  },
  mainHeading: {
    line1: "Transform Your Space",
    line2: "Professional Painting Services"
  },
  subheading: "Expert residential and commercial painting solutions delivered with precision, professionalism, and attention to detail.",
  buttons: {
    primary: {
      text: "Explore Our Services",
      link: "/services"
    },
    secondary: {
      text: "Get Free Quote",
      link: "/contact"
    }
  },
  videoUrl: "https://storage.googleapis.com/unitis-videos/Banner%20Video.mp4"
}

async function main() {
  console.log('Starting seed...')
  
  try {
    await prisma.hero.deleteMany()
    console.log('Cleaned up existing records')

    const hero = await prisma.hero.create({
      data: heroContent
    })
    
    console.log('Created hero content:', hero)
  } catch (error) {
    console.error('Error during seeding:', error)
    throw error
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })