# Software Developer Portfolio Website

A professional, modern portfolio website for a software developer featuring a clean design and minimal backend functionality.

## Features

- **Modern Design**: Clean, professional, and trustworthy appearance
- **Responsive Layout**: Works seamlessly on all devices
- **Multiple Pages**:
  - Homepage (index.html)
  - About Me page
  - Why Work Together page
  - Projects showcase page
  - FAQ & Contact page with client application form

## Pages

1. **index.html** - Landing page with hero section and feature highlights
2. **about.html** - Personal background, skills, and values
3. **why-work-together.html** - Benefits of collaboration and process overview
4. **projects.html** - Portfolio showcase with filtering capabilities
5. **faq-contact.html** - Frequently asked questions and client application form

## Setup Instructions

### Basic Setup (Static Website)

1. Simply open `index.html` in a web browser to view the site locally
2. All pages are linked and ready to use
3. The form will work for frontend validation, but email submission requires a backend

### Backend Setup (For Form Submission)

The website includes a PHP form handler (`submit-form.php`). To enable form submissions:

1. **Using PHP**:
   - Ensure PHP is installed on your server
   - Update the email address in `submit-form.php` (line 30)
   - Upload all files to a PHP-enabled web server
   - The form will send emails and log applications to `applications.log`

2. **Alternative Backend Options**:
   - Replace `submit-form.php` with a Node.js endpoint
   - Use a service like Formspree, Netlify Forms, or similar
   - Update the form action URL in `faq-contact.html` accordingly

## Customization

### Update Personal Information

- Replace placeholder text in HTML files with your actual information
- Add your photo to the about page (replace the placeholder)
- Update project details in `projects.html`
- Modify skills and technologies in `about.html`

### Styling

- Colors can be customized in `styles.css` using CSS variables (defined in `:root`)
- Fonts can be changed by updating the Google Fonts link in HTML files

### Form Configuration

- Update the form handler URL in `faq-contact.html` if using a different backend
- Modify form fields as needed in `faq-contact.html`
- Update validation in both frontend (`script.js`) and backend (`submit-form.php`)

## File Structure

```
portfolio/
├── index.html
├── about.html
├── why-work-together.html
├── projects.html
├── faq-contact.html
├── styles.css
├── script.js
├── submit-form.php
└── README.md
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- The form requires a backend server to actually send emails
- For production use, consider implementing additional security measures (CSRF protection, rate limiting, etc.)
- Replace placeholder images with actual project screenshots
- Update the email address in `submit-form.php` before deploying

## License

This portfolio template is free to use and modify for personal or commercial projects.

