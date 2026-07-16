const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  for (const p of products) {
    let parsedDesc = {};
    try {
      parsedDesc = JSON.parse(p.description);
    } catch (e) {
      parsedDesc = { content: p.description };
    }
    
    parsedDesc.showBundleSave = true;
    parsedDesc.showComparison = true;
    parsedDesc.showHowItWorks = true;
    parsedDesc.showFaqs = true;
    
    // Add defaults if missing
    parsedDesc.compTitle = parsedDesc.compTitle || 'WHY CHOOSE US';
    parsedDesc.compSubtitle = parsedDesc.compSubtitle || 'Premium quality at the best price';
    parsedDesc.compOurBrand = parsedDesc.compOurBrand || 'BUYSIAL';
    parsedDesc.compCompetitor1 = parsedDesc.compCompetitor1 || 'OTHERS';
    parsedDesc.compCompetitor2 = parsedDesc.compCompetitor2 || 'CHEAP KNOCKOFFS';
    parsedDesc.compRows = parsedDesc.compRows || [
      { label: 'Quality', ourValue: '✓', comp1Value: 'X', comp2Value: 'X' },
      { label: 'Fast Delivery', ourValue: '✓', comp1Value: 'X', comp2Value: '✓' }
    ];
    
    parsedDesc.howTitle = parsedDesc.howTitle || 'How It Works';
    parsedDesc.howSubtitle = parsedDesc.howSubtitle || 'Follow these simple steps to get started';
    parsedDesc.howSteps = parsedDesc.howSteps || [
      { title: 'Place Order', desc: 'Add to cart and checkout securely.' },
      { title: 'Fast Delivery', desc: 'Receive your order in 2-3 working days.' }
    ];
    
    parsedDesc.faqs = parsedDesc.faqs || [
      { question: 'Is this product original?', answer: 'Yes, all our products are 100% authentic and sourced directly from manufacturers.' },
      { question: 'How long does shipping take?', answer: 'We offer fast delivery nationwide within 2-3 business days.' }
    ];
    
    await prisma.product.update({
      where: { id: p.id },
      data: { description: JSON.stringify(parsedDesc) }
    });
    console.log('Updated', p.name);
  }
}

main().then(() => prisma.$disconnect()).catch(console.error);
