import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const setting = await prisma.setting.findFirst({ where: { key: 'general' } })
  if (setting) {
    const val = JSON.parse(setting.value)
    val.storeName = 'The Hair Factory'
    val.tagline = 'Cover Grays Naturally'
    val.supportPhone = '+92 300 1234567'
    val.freeShippingText = 'Free delivery nationwide on orders over Rs. 2,500'
    await prisma.setting.update({
      where: { key: 'general' },
      data: { value: JSON.stringify(val) }
    })
    console.log("Updated store general settings to match The Hair Factory");
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
