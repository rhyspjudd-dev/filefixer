'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

// FAQ data with keyword-rich content
const faqData = [
  {
    id: 'remove-spaces',
    question: 'Why remove spaces from filenames?',
    answer: `Removing spaces from filenames is essential for web compatibility and SEO optimization. Here's why:

• **Web Server Compatibility**: Many web servers and browsers encode spaces as %20, creating messy URLs
• **Command Line Safety**: Spaces in filenames can break scripts and command-line operations
• **SEO Benefits**: Clean filenames without spaces improve search engine indexing and URL readability
• **Cross-Platform Compatibility**: Ensures files work seamlessly across Windows, Mac, and Linux systems
• **Database Integration**: Most databases and APIs prefer filenames without special characters or spaces

FileFixer automatically converts spaces to hyphens (kebab-case) or removes them entirely, making your files web-ready and SEO-friendly.`
  },
  {
    id: 'batch-rename',
    question: 'How to batch rename files online?',
    answer: `FileFixer makes batch file renaming simple and efficient:

**Step 1: Upload Files**
• Drag and drop up to 10 files (unlimited for Pro users)
• Supports all file types: images, documents, videos, archives

**Step 2: Choose Naming Convention**
• **Lowercase**: converts "My File.jpg" → "my file.jpg"
• **Kebab-case**: converts "My File.jpg" → "my-file.jpg"
• **Snake_case**: converts "My File.jpg" → "my_file.jpg"
• **CamelCase**: converts "My File.jpg" → "myFile.jpg"

**Step 3: Download**
• Files are automatically cleaned and renamed
• Download as a ZIP file with all renamed files
• No software installation required

**Benefits of Online Batch Renaming:**
• Process multiple files simultaneously
• No software installation needed
• Works on any device with internet
• Secure processing with automatic cleanup
• SEO-optimized filename generation`
  },
  {
    id: 'naming-conventions',
    question: 'What is kebab-case vs camelCase?',
    answer: `Understanding file naming conventions is crucial for organized file management:

**Kebab-case (hyphen-separated)**
• Example: "my-awesome-file.jpg"
• Best for: Web files, URLs, SEO optimization
• Benefits: Most readable, search-engine friendly, universally compatible
• Used by: WordPress, most CMS platforms, web developers

**camelCase (first letter lowercase)**
• Example: "myAwesomeFile.jpg"
• Best for: Programming files, JavaScript, mobile apps
• Benefits: Compact, no special characters, developer-friendly
• Used by: JavaScript, Java, mobile development

**snake_case (underscore-separated)**
• Example: "my_awesome_file.jpg"
• Best for: Database files, Python scripts, scientific data
• Benefits: Highly readable, database-compatible
• Used by: Python, SQL databases, data science

**UPPERCASE vs lowercase**
• Lowercase is recommended for web compatibility
• Some systems are case-sensitive (Linux, macOS)
• Consistent casing improves file organization

FileFixer supports all these conventions, helping you maintain consistent, professional file naming across your projects.`
  },
  {
    id: 'security',
    question: 'Is FileFixer secure?',
    answer: `Yes, FileFixer prioritizes your data security and privacy:

**Client-Side Processing**
• Files are processed directly in your browser
• No files are uploaded to our servers during renaming
• Your data never leaves your device during the cleaning process

**Secure Download System**
• Temporary download links expire automatically
• No permanent storage of your files
• HTTPS encryption for all data transmission

**Privacy Protection**
• No tracking of file contents or names
• Minimal data collection (only usage statistics)
• No third-party analytics on file processing pages

**Professional Security Standards**
• Regular security audits and updates
• Secure authentication via Google/GitHub OAuth
• Industry-standard encryption protocols

**What We Don't Store**
• Original filenames or content
• Personal documents or images
• File metadata or EXIF data

**For Maximum Security**
• Process sensitive files offline using our desktop version (coming soon)
• Use incognito/private browsing mode
• Clear browser cache after processing sensitive files

FileFixer is designed with privacy-first principles, ensuring your files remain secure throughout the renaming process.`
  },
  {
    id: 'pro-features',
    question: 'What does Pro include?',
    answer: `FileFixer Pro unlocks advanced features for power users and professionals:

**Unlimited File Processing**
• Remove the 10-file daily limit
• Process unlimited files per session
• No daily usage restrictions
• Perfect for large projects and batch operations

**Priority Support**
• Direct email support for technical issues
• Faster response times for bug reports
• Feature request prioritization
• Professional customer service

**Advanced File Operations**
• Bulk file renaming with custom patterns
• Preserve original file timestamps
• Advanced character replacement options
• Custom naming convention templates

**Enhanced Security**
• Priority processing on dedicated servers
• Extended file retention options
• Advanced privacy controls
• Business-grade data protection

**Commercial Use License**
• Use FileFixer for business projects
• Client work and commercial applications
• Reseller opportunities available
• Invoice and receipt generation

**Upcoming Pro Features**
• Desktop application download
• API access for developers
• Custom domain integration
• Advanced analytics and reporting

**Pricing Plans**
• Monthly: $9.99/month
• Yearly: $99.99/year (save 17%)
• Lifetime: $199.99 (one-time payment)

Upgrade to Pro to unlock unlimited file processing and premium support for your file management needs.`
  },
  {
    id: 'seo-images',
    question: 'Can I rename images for SEO?',
    answer: `Absolutely! FileFixer is perfect for optimizing image filenames for SEO:

**Why SEO Image Names Matter**
• Search engines read filenames to understand image content
• Clean filenames improve image search rankings
• Proper naming increases organic traffic from Google Images
• Helps with overall page SEO performance

**Best Practices for SEO Image Names**
• Use descriptive, keyword-rich filenames
• Separate words with hyphens (kebab-case)
• Keep names under 60 characters
• Use lowercase letters only
• Include target keywords naturally

**Before FileFixer:**
• "IMG_0001.jpg" → Not SEO friendly
• "DSC_2023_Photo.JPG" → Poor readability
• "My Awesome Product Shot!!.png" → Special characters cause issues

**After FileFixer:**
• "professional-headshot-linkedin.jpg" → SEO optimized
• "red-leather-handbag-collection.png" → Keyword rich
• "modern-kitchen-design-ideas.jpg" → Search engine friendly

**Supported Image Formats**
• JPEG, JPG, PNG, GIF, WebP
• RAW formats: CR2, NEF, ARW
• Vector formats: SVG, AI, EPS
• All major image file types

**SEO Benefits of Clean Image Names**
• Improved Google Images rankings
• Better accessibility for screen readers
• Enhanced user experience
• Professional appearance in URLs
• Faster website indexing

Use FileFixer to transform your image collection into SEO-optimized assets that boost your website's search engine performance.`
  }
];

export default function FAQ() {
  const { data: session } = useSession();
  const [openItems, setOpenItems] = useState<string[]>([]);

  // Check if user is Pro for contact info
  const user = session?.user as { isPro?: boolean; role?: string } | undefined;
  const isPro = user?.isPro || user?.role === 'admin';

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--background)',
      padding: 'var(--spacing-md)'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
          <h1 style={{ 
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: 'var(--spacing-md)',
            background: 'linear-gradient(135deg, var(--color-turquoise), var(--color-chartreuse))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Frequently Asked Questions
          </h1>
          <p style={{ 
            fontSize: '1.1rem',
            color: 'var(--text-muted)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Everything you need to know about FileFixer's batch file renaming, 
            SEO optimization, and file cleaning services.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          {faqData.map((item) => (
            <div 
              key={item.id}
              style={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--border-radius)',
                marginBottom: 'var(--spacing-sm)',
                overflow: 'hidden',
                backgroundColor: 'var(--card-background)'
              }}
            >
              {/* Question Header */}
              <button
                onClick={() => toggleItem(item.id)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md)',
                  border: 'none',
                  backgroundColor: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'var(--text)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--hover-background)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>{item.question}</span>
                <span style={{
                  transform: openItems.includes(item.id) ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  fontSize: '1.2rem'
                }}>
                  ▼
                </span>
              </button>

              {/* Answer Content */}
              {openItems.includes(item.id) && (
                <div style={{
                  padding: '0 var(--spacing-md) var(--spacing-md)',
                  borderTop: '1px solid var(--border)',
                  backgroundColor: 'var(--background)'
                }}>
                  <div style={{
                    color: 'var(--text-muted)',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-line'
                  }}>
                    {item.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section - Only for Pro Users */}
        {isPro && (
          <div style={{
            padding: 'var(--spacing-lg)',
            border: '1px solid var(--color-turquoise)',
            borderRadius: 'var(--border-radius)',
            backgroundColor: 'var(--card-background)',
            textAlign: 'center',
            marginBottom: 'var(--spacing-xl)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: 'var(--spacing-md)',
              color: 'var(--color-turquoise)'
            }}>
              Pro Support
            </h2>
            <p style={{ 
              color: 'var(--text-muted)',
              marginBottom: 'var(--spacing-sm)'
            }}>
              Need help or have a feature request? As a Pro user, you have direct access to our support team.
            </p>
            <a 
              href="mailto:rhyspjudd.dev@gmail.com"
              style={{
                color: 'var(--color-turquoise)',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              rhyspjudd.dev@gmail.com
            </a>
          </div>
        )}

        {/* Back to App */}
        <div style={{ textAlign: 'center' }}>
          <a 
            href="/"
            style={{
              display: 'inline-block',
              padding: 'var(--spacing-sm) var(--spacing-lg)',
              backgroundColor: 'var(--color-turquoise)',
              color: 'var(--color-night)',
              textDecoration: 'none',
              borderRadius: 'var(--border-radius)',
              fontWeight: '600',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ← Back to FileFixer
          </a>
        </div>
      </div>
    </div>
  );
}
