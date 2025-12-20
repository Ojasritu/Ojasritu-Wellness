from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from shop.models import Category, Product
from pathlib import Path
from PIL import Image
from io import BytesIO

class Command(BaseCommand):
    help = 'Seed database with demo products and generate placeholder images'

    def create_placeholder_image(self, text, filename):
        """Create a simple placeholder image with PIL"""
        # Create a 400x400 image with gradient background
        img = Image.new('RGB', (400, 400), color=(245, 222, 179))  # Wheat color
        
        # Save to BytesIO
        img_io = BytesIO()
        img.save(img_io, format='PNG')
        img_io.seek(0)
        
        return ContentFile(img_io.getvalue(), name=filename)

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Starting product seeding...'))
        
        # Create categories
        categories_data = [
            {'name': 'Wellness Capsules', 'hindi_name': 'कल्याण कैप्सूल', 'slug': 'wellness-capsules'},
            {'name': 'Herbal Oils', 'hindi_name': 'हर्बल तेल', 'slug': 'herbal-oils'},
            {'name': 'Ayurvedic Powders', 'hindi_name': 'आयुर्वेदिक चूर्ण', 'slug': 'ayurvedic-powders'},
        ]
        
        categories = {}
        for cat_data in categories_data:
            cat, created = Category.objects.get_or_create(
                slug=cat_data['slug'],
                defaults=cat_data
            )
            categories[cat_data['slug']] = cat
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Created category: {cat.name}'))
        
        # Create products with images
        products_data = [
            {
                'name': 'Anti-Aging Wellness Capsule',
                'hindi_name': 'बुढ़ापा रोधी कैप्सूल',
                'slug': 'anti-aging-capsule',
                'description': 'Premium Ayurvedic formula for youthful vitality and longevity',
                'benefits': 'त्वचा में चमक, ऊर्जा वृद्धि, प्रतिरक्षा सुधार, उम्र बढ़ने को धीमा करे',
                'ingredients': 'Ashwagandha, Shatavari, Amla, Guduchi, Brahmi',
                'usage_instructions': 'दिन में दो बार भोजन के बाद एक कैप्सूल लें',
                'price': 799.00,
                'discount_price': 649.00,
                'category': categories['wellness-capsules'],
                'dosha_type': 'tridosha',
                'quantity_in_stock': 50,
                'is_bestseller': True,
                'is_featured': True,
                'rating': 4.5,
                'sku': 'AAC-001',
            },
            {
                'name': 'Jeeva Asthi Joint Care',
                'hindi_name': 'जीवाष्ठि जोड़ों की देखभाल',
                'slug': 'jeeva-asthi',
                'description': 'Natural joint and bone strength formula for pain relief',
                'benefits': 'जोड़ों का दर्द कम करे, हड्डियों को मजबूत बनाए, गतिशीलता बढ़ाए',
                'ingredients': 'Guggulu, Shallaki, Ashwagandha, Nirgundi',
                'usage_instructions': 'सुबह-शाम एक कैप्सूल गुनगुने पानी के साथ',
                'price': 899.00,
                'discount_price': 749.00,
                'category': categories['wellness-capsules'],
                'dosha_type': 'vata',
                'quantity_in_stock': 30,
                'is_featured': True,
                'rating': 4.7,
                'sku': 'JAC-002',
            },
            {
                'name': 'Triphala Churna',
                'hindi_name': 'त्रिफला चूर्ण',
                'slug': 'triphala-churna',
                'description': 'Traditional Ayurvedic powder for digestive health',
                'benefits': 'पाचन सुधार, शरीर शुद्धि, कब्ज दूर करे',
                'ingredients': 'Amla, Haritaki, Bibhitaki',
                'usage_instructions': 'रात को सोने से पहले गुनगुने पानी के साथ',
                'price': 349.00,
                'category': categories['ayurvedic-powders'],
                'dosha_type': 'tridosha',
                'quantity_in_stock': 100,
                'is_bestseller': True,
                'rating': 4.8,
                'sku': 'TPC-003',
            },
        ]
        
        for prod_data in products_data:
            product, created = Product.objects.get_or_create(
                slug=prod_data['slug'],
                defaults=prod_data
            )
            
            # Always update or create image
            if created or not product.image:
                try:
                    image_file = self.create_placeholder_image(
                        prod_data['name'],
                        f'{product.slug}.png'
                    )
                    product.image.save(f'{product.slug}.png', image_file, save=True)
                    self.stdout.write(self.style.SUCCESS(f'✓ Added image to: {product.name}'))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'✗ Could not add image to {product.name}: {e}'))
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Created product: {product.name}'))
            else:
                self.stdout.write(self.style.WARNING(f'○ Product exists: {product.name}'))
        
        # Count products with images
        total_products = Product.objects.count()
        products_with_images = Product.objects.exclude(image='').count()
        
        self.stdout.write(self.style.SUCCESS('='*60))
        self.stdout.write(self.style.SUCCESS(f'✓ Database seeded successfully!'))
        self.stdout.write(self.style.SUCCESS(f'✓ Total products: {total_products}'))
        self.stdout.write(self.style.SUCCESS(f'✓ Products with images: {products_with_images}'))
        self.stdout.write(self.style.SUCCESS('='*60))
