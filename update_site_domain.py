#!/usr/bin/env python
"""
Update Django Site domain to ojasritu.co.in
Run this on Railway after deployment to fix the domain
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wellness_project.settings')
django.setup()

from django.contrib.sites.models import Site

try:
    # Delete any existing sites with ojasritu.co.in domain
    Site.objects.filter(domain='ojasritu.co.in').exclude(id=1).delete()
    
    # Update or create site with id=1
    site, created = Site.objects.update_or_create(
        id=1,
        defaults={
            'domain': 'ojasritu.co.in',
            'name': 'Ojasritu Wellness'
        }
    )
    action = "created" if created else "updated"
    print(f"✓ Site {action}: {site.domain} ({site.name})")
    
    # List all sites for verification
    print("\nAll sites in database:")
    for s in Site.objects.all():
        print(f"  - ID {s.id}: {s.domain} ({s.name})")
        
except Exception as e:
    print(f"✗ Error updating site: {e}")
    import traceback
    traceback.print_exc()
