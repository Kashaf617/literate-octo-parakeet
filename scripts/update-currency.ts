import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const setting = await prisma.setting.findFirst({ where: { key: 'general' } })
  if (setting) {
    const val = JSON.parse(setting.value)
    val.currency = 'PKR'
    await prisma.setting.update({
      where: { key: 'general' },
      data: { value: JSON.stringify(val) }
    })
    console.log("Updated currency to PKR in DB");
  } else {
    console.log("No general setting found");
  }
}
main()
