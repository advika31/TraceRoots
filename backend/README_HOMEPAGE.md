# TraceRoots Homepage

A modern, glassmorphism-based homepage for TraceRoots - an AI + blockchain-powered food traceability and zero-waste network.

## Features

### Design Elements

- **Glassmorphism UI**: Frosted glass effects with backdrop blur
- **Eco-Tech Palette**: Vibrant greens (#34C759), blues (#007AFF), and yellows (#FFD60A)
- **Dark Mode Toggle**: Fully functional light/dark theme switcher
- **Smooth Animations**: Fade-in effects, animated counters, parallax scrolling
- **Responsive Design**: Mobile-friendly layout

### Sections

1. **Navbar**

   - TraceRoots logo (SVG placeholder included)
   - Navigation links (How It Works, Our Impact, Network)
   - Farmer Login and Sign Up buttons
   - Dark/Light mode toggle

2. **Hero Section**

   - Gradient background with subtle farming/blockchain motifs
   - Animated info cards showing real-time activity
   - Call-to-action buttons

3. **How It Works**

   - Four-step workflow visualization
   - Connected cards with flow arrows
   - Glassmorphism card design

4. **Our Impact**

   - Live statistics with animated counters
   - Community illustration section
   - Impact report CTA

5. **Footer**
   - Company links
   - Legal pages
   - Social media icons

## Setup

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Run the FastAPI server:

```bash
uvicorn main:app --reload
```

3. Open your browser to:

```
http://localhost:8000
```

## Logo

The homepage uses an SVG logo at `/static/images/traceroots-logo.svg`.

To replace it with your custom TraceRoots logo:

- Replace the SVG file, or
- Add a PNG/JPG version and update the image source in `templates/index.html`

## Customization

### Colors

Edit CSS variables in `static/css/styles.css`:

- `--green-primary`: Main green color
- `--blue-primary`: Blue accent
- `--yellow-primary`: Yellow accent

### Content

- Edit `templates/index.html` for text content
- Stats are dynamically loaded from the database
- Hero cards can be updated in the template

## Technologies

- **FastAPI**: Backend framework
- **Jinja2**: Template rendering
- **Vanilla JavaScript**: Interactions and animations
- **CSS3**: Glassmorphism, animations, responsive design
- **Font Awesome**: Icons
