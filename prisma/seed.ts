import { PrismaClient, Category, Size } from "@prisma/client";
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
                price: faker.commerce.price(),
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

seedProducts() // Change this part to run a different seed function
    .then(async () => await prisma.$disconnect())
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });