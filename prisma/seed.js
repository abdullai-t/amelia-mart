const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Products data (converted from TypeScript)
const productsData = [
  { id: "1", name: "Basmati Rice", description: "Premium long-grain basmati rice, perfect for biryanis and pilafs", price: 45, category: "groceries", image: "🍚", stock: 50, unit: "kg", rating: 4.5, reviews: 128 },
  { id: "2", name: "Wheat Flour", description: "All-purpose wheat flour for baking and cooking", price: 35, category: "groceries", image: "🌾", stock: 75, unit: "kg", rating: 4.3, reviews: 95 },
  { id: "3", name: "Lentils (Masoor Dal)", description: "Red lentils rich in protein and fiber", price: 55, category: "groceries", image: "🫘", stock: 40, unit: "kg", rating: 4.6, reviews: 112 },
  { id: "4", name: "Chickpeas (Kabuli Chana)", description: "Large white chickpeas for curries and salads", price: 60, category: "groceries", image: "🫘", stock: 35, unit: "kg", rating: 4.4, reviews: 87 },
  { id: "5", name: "Sunflower Oil", description: "Pure refined sunflower cooking oil", price: 120, category: "groceries", image: "🌻", stock: 60, unit: "liters", rating: 4.7, reviews: 203 },
  { id: "6", name: "Sea Salt", description: "Natural sea salt for cooking", price: 15, category: "groceries", image: "🧂", stock: 100, unit: "kg", rating: 4.5, reviews: 156 },
  { id: "7", name: "Tomatoes", description: "Fresh ripe tomatoes", price: 25, category: "vegetables", image: "🍅", stock: 80, unit: "kg", rating: 4.3, reviews: 142 },
  { id: "8", name: "Onions", description: "Fresh red onions", price: 20, category: "vegetables", image: "🧅", stock: 90, unit: "kg", rating: 4.2, reviews: 167 },
  { id: "9", name: "Garlic", description: "Fresh garlic bulbs", price: 40, category: "vegetables", image: "🧄", stock: 45, unit: "kg", rating: 4.6, reviews: 98 },
  { id: "10", name: "Carrots", description: "Fresh organic carrots", price: 30, category: "vegetables", image: "🥕", stock: 70, unit: "kg", rating: 4.4, reviews: 123 },
  { id: "11", name: "Potatoes", description: "Farm fresh potatoes", price: 18, category: "vegetables", image: "🥔", stock: 95, unit: "kg", rating: 4.3, reviews: 189 },
  { id: "12", name: "Bell Peppers", description: "Colorful bell peppers", price: 35, category: "vegetables", image: "🫑", stock: 55, unit: "kg", rating: 4.5, reviews: 87 },
  { id: "13", name: "Bananas", description: "Fresh ripe bananas", price: 22, category: "fruits", image: "🍌", stock: 85, unit: "dozen", rating: 4.4, reviews: 201 },
  { id: "14", name: "Apples", description: "Crisp red apples", price: 50, category: "fruits", image: "🍎", stock: 60, unit: "kg", rating: 4.6, reviews: 145 },
  { id: "15", name: "Oranges", description: "Juicy sweet oranges", price: 40, category: "fruits", image: "🍊", stock: 70, unit: "kg", rating: 4.5, reviews: 167 },
  { id: "16", name: "Grapes", description: "Seedless green grapes", price: 65, category: "fruits", image: "🍇", stock: 40, unit: "kg", rating: 4.7, reviews: 98 },
  { id: "17", name: "Mangoes", description: "Sweet Alphonso mangoes", price: 80, category: "fruits", image: "🥭", stock: 45, unit: "kg", rating: 4.8, reviews: 234 },
  { id: "18", name: "Watermelon", description: "Fresh juicy watermelon", price: 30, category: "fruits", image: "🍉", stock: 35, unit: "piece", rating: 4.6, reviews: 156 },
  { id: "19", name: "Orange Juice", description: "Fresh squeezed orange juice", price: 35, category: "beverages", image: "🧃", stock: 50, unit: "liters", rating: 4.5, reviews: 123 },
  { id: "20", name: "Milk", description: "Fresh full-cream milk", price: 28, category: "beverages", image: "🥛", stock: 80, unit: "liters", rating: 4.6, reviews: 289 },
  { id: "21", name: "Yogurt", description: "Creamy plain yogurt", price: 32, category: "beverages", image: "🥤", stock: 65, unit: "kg", rating: 4.4, reviews: 178 },
  { id: "22", name: "Tea", description: "Premium black tea leaves", price: 45, category: "beverages", image: "🍵", stock: 90, unit: "500g", rating: 4.7, reviews: 267 },
  { id: "23", name: "Coffee", description: "Ground coffee beans", price: 75, category: "beverages", image: "☕", stock: 55, unit: "500g", rating: 4.8, reviews: 198 },
  { id: "24", name: "Coconut Water", description: "Natural coconut water", price: 25, category: "beverages", image: "🥥", stock: 70, unit: "liters", rating: 4.5, reviews: 145 },
  { id: "25", name: "Chickpea Snack", description: "Roasted chickpea snack", price: 18, category: "snacks", image: "🥜", stock: 60, unit: "250g", rating: 4.3, reviews: 112 },
  { id: "26", name: "Mixed Nuts", description: "Assorted roasted nuts", price: 95, category: "snacks", image: "🥜", stock: 40, unit: "500g", rating: 4.7, reviews: 156 },
  { id: "27", name: "Popcorn", description: "Ready-to-eat butter popcorn", price: 12, category: "snacks", image: "🍿", stock: 85, unit: "200g", rating: 4.4, reviews: 189 },
  { id: "28", name: "Granola Bar", description: "Healthy granola energy bars", price: 35, category: "snacks", image: "🍪", stock: 70, unit: "pack of 6", rating: 4.5, reviews: 134 },
  { id: "29", name: "Chocolate", description: "Dark chocolate bar", price: 28, category: "snacks", image: "🍫", stock: 90, unit: "100g", rating: 4.6, reviews: 267 },
  { id: "30", name: "Biscuits", description: "Cream biscuits", price: 22, category: "snacks", image: "🍪", stock: 95, unit: "300g", rating: 4.3, reviews: 223 },
  { id: "31", name: "Dish Soap", description: "Liquid dish washing soap", price: 28, category: "household", image: "🧴", stock: 75, unit: "500ml", rating: 4.5, reviews: 178 },
  { id: "32", name: "Detergent", description: "Laundry detergent powder", price: 65, category: "household", image: "🧺", stock: 60, unit: "1kg", rating: 4.6, reviews: 201 },
  { id: "33", name: "Bleach", description: "Cleaning bleach solution", price: 32, category: "household", image: "🧴", stock: 50, unit: "1liter", rating: 4.4, reviews: 145 },
  { id: "34", name: "Paper Towels", description: "Absorbent paper towels", price: 45, category: "household", image: "🧻", stock: 80, unit: "pack of 6", rating: 4.5, reviews: 189 },
  { id: "35", name: "Trash Bags", description: "Durable trash bags", price: 38, category: "household", image: "🗑️", stock: 70, unit: "pack of 30", rating: 4.3, reviews: 156 },
  { id: "36", name: "Air Freshener", description: "Room air freshener spray", price: 25, category: "household", image: "💨", stock: 85, unit: "300ml", rating: 4.4, reviews: 123 },
]

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.product.deleteMany()
  await prisma.settings.deleteMany()

  // Seed products
  console.log('📦 Creating products...')
  for (const product of productsData) {
    await prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        image: product.image,
        stock: product.stock,
        unit: product.unit,
        rating: product.rating,
        reviews: product.reviews,
      },
    })
  }
  console.log(`✅ Created ${productsData.length} products`)

  // Seed settings
  console.log('⚙️  Creating settings...')
  await prisma.settings.create({
    data: {
      storeName: 'Amelia Mart',
      storeEmail: 'info@ameliamart.com',
      storePhone: '0201234567',
      storeAddress: '123 Oxford Street, Accra, Ghana',
      freeShippingThreshold: 100,
      shippingFee: 10,
      taxRate: 2.5,
      deliveryTime: '3-5 days',
    },
  })
  console.log('✅ Created settings')

  // Seed sample customers
  console.log('👤 Creating sample customers...')
  const customers = [
    {
      name: 'Kwame Mensah',
      email: 'kwame@example.com',
      phone: '0201234567',
      address: '15 Nkrumah Avenue',
      city: 'Accra',
    },
    {
      name: 'Ama Owusu',
      email: 'ama@example.com',
      phone: '0207654321',
      address: '22 Adum Street',
      city: 'Kumasi',
    },
    {
      name: 'Kofi Asante',
      email: 'kofi@example.com',
      phone: '0209876543',
      address: '8 Community 1',
      city: 'Tema',
    },
  ]

  for (const customer of customers) {
    await prisma.customer.create({ data: customer })
  }
  console.log(`✅ Created ${customers.length} customers`)

  console.log('✨ Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
