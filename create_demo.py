# Run this after migrations and after activating venv:
# python manage.py shell < create_demo.py
from shop.models import Product
p, created = Product.objects.get_or_create(
    name="Ojasritu Herbal Capsule - Demo",
    defaults={
        "description": "Demo herbal wellness capsule. Buy one, feel refreshed. (Demo product)",
        "price": "199.00",
    }
)
if not p.image:
    p.image = "products/demo.jpg"
    p.save()
print("Demo product created:", p.name)

from shop.models import BlogPost, Prebooking

BlogPost.objects.get_or_create(
    title='Ayurvedic Morning Routine',
    slug='ayurvedic-morning-routine',
    defaults={'content': 'Start your day with warm water, herbal teas and light exercises.'}
)

Prebooking.objects.get_or_create(
    user_name='Demo User',
    service_name='Consultation',
    defaults={
        'preferred_date': '2025-12-01',
        'preferred_time': '10:00',
        'quantity': 1,
    }
)
print('Demo blog and prebooking created')
