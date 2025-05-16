import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CategoryService } from '../services/category.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    const categoryService = app.get(CategoryService);
    
    // Create some initial categories
    console.log('Starting to seed categories...');
    
    const categories = [
      'Electronics',
      'Clothing',
      'Books',
      'Home & Kitchen',
      'Toys & Games'
    ];
    
    for (const categoryName of categories) {
      const newCategory = await categoryService.create(categoryName);
      console.log(`Created category: ${categoryName} with ID: ${newCategory.id}`);
    }
    
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await app.close();
  }
}

bootstrap(); 