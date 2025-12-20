#!/usr/bin/env python
"""
Test media file serving in production environment
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wellness_project.settings')
django.setup()

from shop.models import Product
from pathlib import Path
from django.conf import settings

def test_product_images():
    print("="*60)
    print("PRODUCT IMAGE DIAGNOSTIC TEST")
    print("="*60)
    
    # Test settings
    print("\n1. Django Settings:")
    print(f"   MEDIA_URL: {settings.MEDIA_URL}")
    print(f"   MEDIA_ROOT: {settings.MEDIA_ROOT}")
    print(f"   MEDIA_ROOT exists: {Path(settings.MEDIA_ROOT).exists()}")
    
    # Test products
    print("\n2. Products in Database:")
    products = Product.objects.all()
    print(f"   Total products: {products.count()}")
    
    for product in products:
        print(f"\n   Product: {product.name}")
        print(f"   - Slug: {product.slug}")
        print(f"   - Image field: {product.image}")
        
        if product.image:
            print(f"   - Image URL: {product.image.url}")
            image_path = Path(settings.MEDIA_ROOT) / str(product.image)
            print(f"   - Full path: {image_path}")
            print(f"   - File exists: {image_path.exists()}")
            
            if image_path.exists():
                size = image_path.stat().st_size
                print(f"   - File size: {size:,} bytes")
        else:
            print(f"   - ⚠️ NO IMAGE SET")
    
    # Test media directory
    print("\n3. Media Directory Contents:")
    media_root = Path(settings.MEDIA_ROOT)
    products_dir = media_root / "products"
    
    if products_dir.exists():
        images = list(products_dir.glob("*"))
        print(f"   Found {len(images)} files in products/:")
        for img in images[:10]:  # Show first 10
            print(f"   - {img.name} ({img.stat().st_size:,} bytes)")
    else:
        print("   ⚠️ products/ directory does not exist!")
    
    print("\n" + "="*60)
    print("Test Complete!")
    print("="*60)

if __name__ == "__main__":
    test_product_images()
