# 🎯 HOW TO RUN WELLNESS CODE FOR ojasrituwellness@gmail.com

## Question: "SABHI code ko ojasrituwellness@gmail.com se kaise run kare?"

---

## 📍 ANSWER: 3 तरीके (3 Ways)

---

## तरीका 1️⃣: Local Development (For Testing/Development)

### क्या है:
- आपके अपने कंप्यूटर पर चलाना
- Development के लिए
- Codespace को सिर्फ editor के रूप में use करें

### कैसे करें:

```bash
# Step 1: Repository clone करें
git clone https://github.com/Ojasritu/wellness.git
cd wellness

# Step 2: Python virtual environment बनाएं
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Step 3: Dependencies install करें
pip install -r requirements.txt

# Step 4: Environment file setup करें
cp .env.example .env
nano .env  # Edit and add: OPENAI_API_KEY=sk-your-key

# Step 5: Database setup करें
python manage.py migrate

# Step 6: Admin user बनाएं (ojasrituwellness@gmail.com के लिए)
python manage.py createsuperuser
# यहाँ fill करें:
# Username: admin
# Email: ojasrituwellness@gmail.com
# Password: आपका secure password

# Step 7: Server start करें
python manage.py runserver 0.0.0.0:8000
```

### Access करें:
```
Website: http://localhost:8000
Admin Panel: http://localhost:8000/admin
Username: admin
Password: (जो आपने set किया)
```

---

## तरीका 2️⃣: Production Deployment (For Public Access)

### क्या है:
- Public internet पर सबके लिए accessible
- Domain के साथ
- 24/7 चलता रहेगा

### Option A: Heroku (Recommended - Free/Paid)

```bash
# Step 1: Heroku account बनाएं
# Visit: https://www.heroku.com/

# Step 2: Heroku CLI install करें
# https://devcenter.heroku.com/articles/heroku-cli

# Step 3: Login करें
heroku login

# Step 4: Heroku app बनाएं
heroku create wellness-app-name

# Step 5: Database add करें
heroku addons:create heroku-postgresql:hobby-dev

# Step 6: Environment variables set करें
heroku config:set OPENAI_API_KEY="sk-your-actual-key"
heroku config:set SECRET_KEY="your-secret-key"
heroku config:set DEBUG=False

# Step 7: Code deploy करें
git add .
git commit -m "Deploy Wellness with GPT-4o Mini"
git push heroku main

# Step 8: Database migrations चलाएं
heroku run python manage.py migrate

# Step 9: Admin user create करें
heroku run python manage.py createsuperuser
# Email: ojasrituwellness@gmail.com
# Password: secure password

# Step 10: App को open करें
heroku open
```

### Access करें (Heroku):
```
Website: https://wellness-app-name.herokuapp.com
Admin: https://wellness-app-name.herokuapp.com/admin
Logs: heroku logs --tail
```

---

### Option B: Custom Domain के साथ (GoDaddy, Namecheap, etc)

```bash
# Step 1: Domain register करें
# GoDaddy.com या Namecheap.com से

# Step 2: Heroku में domain add करें
heroku domains:add yourdomain.com

# Step 3: DNS settings में जाएं (GoDaddy/Namecheap)
# Type: CNAME
# Name: yourdomain.com
# Value: wellness-app-name.herokuapp.com

# Step 4: 10-30 minutes के बाद काम करेगा
```

### Access करें (Custom Domain):
```
Website: https://yourdomain.com
Admin: https://yourdomain.com/admin
```

---

## तरीका 3️⃣: Self-Hosted Server (For Full Control)

### क्या है:
- अपने VPS/Server पर चलाना
- DigitalOcean, AWS, Linode, etc
- Full control

### कैसे करें:

```bash
# Step 1: Server rent करें
# DigitalOcean: https://www.digitalocean.com/
# AWS EC2, Linode, Vultr

# Step 2: Server को ssh से connect करें
ssh root@your-server-ip

# Step 3: System packages install करें
apt update && apt upgrade -y
apt install python3 python3-pip python3-venv postgresql nginx git -y

# Step 4: Repository clone करें
git clone https://github.com/Ojasritu/wellness.git
cd wellness

# Step 5: Python virtual environment बनाएं
python3 -m venv venv
source venv/bin/activate

# Step 6: Dependencies install करें
pip install -r requirements.txt
pip install gunicorn

# Step 7: Environment file setup करें
cp .env.example .env
nano .env  # Add: OPENAI_API_KEY=sk-...

# Step 8: Database setup करें
python manage.py migrate

# Step 9: Static files collect करें
python manage.py collectstatic --noinput

# Step 10: Admin user बनाएं
python manage.py createsuperuser
# Email: ojasrituwellness@gmail.com

# Step 11: Systemd service बनाएं (auto-restart के लिए)
sudo nano /etc/systemd/system/wellness.service
```

Add this to the file:
```ini
[Unit]
Description=Wellness Vaidya AI
After=network.target

[Service]
User=www-data
WorkingDirectory=/root/wellness
ExecStart=/root/wellness/venv/bin/gunicorn wellness_project.wsgi:application --bind 127.0.0.1:8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Enable और start करें
sudo systemctl enable wellness
sudo systemctl start wellness
sudo systemctl status wellness
```

---

## 🔑 Database Transfer (Old Server → New Server)

### Data Transfer करना:

```bash
# Old server से backup लें
python manage.py dumpdata > backup.json

# File को download करें
scp root@old-server:/path/to/backup.json ./backup.json

# New server पर upload करें
scp backup.json root@new-server:/path/to/wellness/

# New server पर restore करें
cd /path/to/wellness
source venv/bin/activate
python manage.py loaddata backup.json
```

### Superuser Transfer:

```bash
# Old database में superuser check करें
python manage.py shell
>>> from django.contrib.auth.models import User
>>> User.objects.filter(is_superuser=True).values('username', 'email')

# New database में load होगा backup.json से
# अगर नहीं है तो नया create करें:
python manage.py createsuperuser
# Email: ojasrituwellness@gmail.com
```

---

## 🎯 RECOMMENDED SETUP FOR ojasrituwellness@gmail.com

### Development Phase:
1. Use तरीका 1 (Local) for testing
2. All code changes in Codespace
3. Test locally before deploying

### Production Phase:
1. Use तरीका 2 (Heroku) for public
2. Domain pointing to Heroku
3. Database automatically managed

### Both Together:
```
┌─────────────────┐         ┌──────────────────┐
│  Codespace      │         │  Your Computer   │
│  (Edit only)    │         │  (Run & Test)    │
└────────┬────────┘         └────────┬─────────┘
         │                           │
         └───────────────┬───────────┘
                         │
                    Git Repository
                    (GitHub)
                         │
                         ↓
                  ┌───────────────┐
                  │  Heroku       │
                  │  (Production) │
                  └───────────────┘
                         │
                         ↓
                   Domain: yourdomain.com
                   Public Website
```

---

## ✅ Verification Steps

### After Setup, Check:

```bash
# 1. Admin login काम करता है?
# Go to: http://localhost:8000/admin
# Login with ojasrituwellness@gmail.com credentials

# 2. API काम करता है?
curl -X POST http://localhost:8000/api/chat/ \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","language":"en"}'

# 3. Database सही है?
python manage.py shell
>>> from django.contrib.auth.models import User
>>> User.objects.all().count()  # Check users

# 4. All packages installed?
pip list | grep -E "Django|openai|stripe"
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "OPENAI_API_KEY not found" | `export OPENAI_API_KEY="sk-..."` or add to .env |
| "Port 8000 already in use" | `python manage.py runserver 8001` |
| "ModuleNotFoundError: openai" | `pip install openai>=1.0.0` |
| "Database locked" | `rm db.sqlite3` then `migrate` again |
| Admin login नहीं हो रहा | Superuser create करें फिर से |
| Domain resolve नहीं हो रहा | DNS propagation के लिए 24-48 hours wait करें |

---

## 📊 Comparison

| Feature | Local | Heroku | Self-Hosted |
|---------|-------|--------|-------------|
| Setup Time | 5 min | 10 min | 30 min |
| Cost | Free | $7/month | $5-20/month |
| Uptime | 99% (your PC) | 99.9% | 99% (depends) |
| Scalability | Limited | Easy | Complex |
| Best For | Development | Production | Power Users |

---

## 🚀 QUICK START COMMANDS

### Local (Fastest):
```bash
git clone https://github.com/Ojasritu/wellness.git && cd wellness
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt && cp .env.example .env
# Edit .env with OPENAI_API_KEY
python manage.py migrate && python manage.py createsuperuser
python manage.py runserver
```

### Heroku (Production):
```bash
heroku login && heroku create wellness-app
heroku config:set OPENAI_API_KEY="sk-..."
git push heroku main
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
heroku open
```

---

## 📞 Support Resources

- **Setup Help**: `GPT4O_MINI_SETUP.md`
- **Production**: `PRODUCTION_GUIDE.md`
- **Quick Ref**: `QUICK_REFERENCE.md`
- **API Docs**: `/api/` endpoints in your running app
- **Django Docs**: https://docs.djangoproject.com
- **OpenAI Docs**: https://platform.openai.com/docs

---

## ✨ Key Points

1. ✅ **Codespace सिर्फ editing के लिए है**
   - Code को actually run करने के लिए local machine या server use करें

2. ✅ **Django & Superuser automatically transfer होंगे**
   - Database backup/restore के through
   - या नया create कर सकते हैं

3. ✅ **All code ready है**
   - GPT-4o Mini integrated
   - Just API key add करो और run करो

4. ✅ **Production में run करते समय**
   - Same Django database और superuser use होगा
   - No data loss
   - Everything portable

---

## 🎯 NEXT IMMEDIATE STEPS

1. **OpenAI API Key लो**
   - https://platform.openai.com/account/api-keys

2. **Local पर test करो**
   - तरीका 1 follow करो
   - Admin login करो
   - API test करो

3. **Production में deploy करो**
   - तरीका 2 follow करो
   - Domain point करो
   - Go live!

---

**तैयार हो? शुरू करो! 🚀**

---

**Updated**: December 10, 2025  
**Ready**: ✅ 100% Complete  
**For**: ojasrituwellness@gmail.com  
**Questions**: Check documentation files included in repo
