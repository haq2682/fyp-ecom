import { PrismaClient, Category, Size, Product, User, Status } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function seedUsers() {
    const users = Array.from({ length: 1000 }).map(() => ({
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        address: faker.location.streetAddress(),
        contact: faker.phone.number()
    }))
    await prisma.user.createMany({ data: users });
}

async function seedProducts() {
    const sizes: Size[] = await prisma.$queryRaw`SELECT * FROM Size`;

    const categories: Category[] = await prisma.$queryRaw`SELECT * FROM Category`;

    for (let i = 0; i < 10; i++) {
        const product = await prisma.product.create({
            data: {
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: faker.number.int({ min: 30, max: 1000 }),
                categoryId: categories[Math.floor(Math.random() * categories.length)].id,
                stock: Math.floor(Math.random() * 100),
            },
        });

        const numberOfSizes = Math.floor(Math.random() * (sizes.length - 1)) + 2;

        const selectedSizes = faker.helpers.shuffle([...sizes]).slice(0, numberOfSizes);

        await Promise.all(
            selectedSizes.map(size =>
                prisma.productSize.create({
                    data: {
                        productId: product.id,
                        sizeId: size.id,
                    },
                })
            )
        );
    }
}
async function seedOrders() {
    const products: Product[] = await prisma.product.findMany();
    const statuses: string[] = ['placed', 'processing', 'dispatched', 'in_transit', 'out_for_delivery', 'delivered', 'returned', 'cancelled'];
    const users: User[] = await prisma.user.findMany();

    for (let i = 0; i < 10; i++) {
        const numberOfProducts: number = faker.number.int({ min: 1, max: 5 });
        const randomNumber: number = faker.number.int({ min: 0, max: products.length });
        const randomQuantity: number = faker.number.int({ min: 1, max: 5 });
        const currentStatus: Status = statuses[Math.floor(Math.random() * statuses.length)] as Status;
        const insertingProducts: Product[] = products.slice(randomNumber, numberOfProducts + 1);
        const totalAmount: number = insertingProducts.reduce((sum, product) => sum + (product.price * randomQuantity), 0);
        const order = await prisma.order.create({
            data: {
                orderNumber: faker.number.int({ min: 1, max: 99999999 }),
                status: currentStatus,
                userId: users[Math.floor(Math.random() * users.length)].id,
                totalAmount: totalAmount,
            }
        });

        await Promise.all(
            insertingProducts.map(product => prisma.orderProduct.create({
                data: {
                    orderId: order.id,
                    productId: product.id,
                    quantity: randomQuantity,
                    price: product.price * randomQuantity
                }
            })
            )
        )
    }
}

seedOrders() // Change this part to run a different seed function
    .then(async () => await prisma.$disconnect())
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });