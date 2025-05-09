Document Converter
A free, no-registration web-based document converter that transforms JPG, PNG, TXT, and SVG files into PDF format. Enjoy fast, secure, and easy conversions directly in your browser, hosted on GitHub Pages with a custom domain via Cloudflare.
Features

Supported Formats: Convert JPG, PNG, TXT, and SVG files to PDF.
No Registration: Use the converter without signing up or logging in.
Free to Use: Completely free with no hidden costs.
Donation Support: Help keep the project free by donating via PayPal.
Responsive Design: Works on desktop and mobile devices.
Secure: All processing is done client-side in your browser.

Usage

Visit www.contohdomain.com.
Upload your JPG, PNG, TXT, or SVG files (max 10MB each).
Click "Convert to PDF" to download the generated PDF.
Support the project by clicking the "Donate" button.

Installation (For Developers)

Clone this repository:git clone https://github.com/username/image-to-pdf-converter.git


Update the DONATE_LINK variable in index.html with your donation link.
Deploy to GitHub Pages:
Ensure the repository is public or has GitHub Pages enabled.
Set the branch to main and folder to / (root) in Settings > Pages.


Configure a custom domain in Cloudflare (see Cloudflare Setup).

Cloudflare Setup

Add a CNAME record:Type: CNAME
Name: www
Target: username.github.io
Proxy status: Proxied
TTL: Auto


Ensure no conflicting A, AAAA, or CNAME records exist for the same host.
Enable SSL/TLS (Full strict) and Always Use HTTPS in Cloudflare.

Support
If you encounter issues or have feature requests, open an issue in this repository or support the project via PayPal.

Keep this project free! Donate to support ongoing development.
