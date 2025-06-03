# Preview Page

The Preview Page is a key component of the 1-Click Knowledge platform that allows users to view and customize their AI-generated ebooks before exporting or moving to the Studio for advanced edits.

## Features

- **Two-Column Layout**
  - Left (70%): Scrollable ebook preview with 7 pages
  - Right (30%): Customization sidebar with theme, font, and cover options

- **Theme Customization**
  - Modern: Clean, professional look with blue accents
  - Classic: Traditional book style with amber tones
  - Minimal: Simple, distraction-free design

- **Font Options**
  - Roboto: Modern, highly readable sans-serif
  - Merriweather: Classic serif font for traditional books
  - Open Sans: Clean, versatile sans-serif

- **Export Options**
  - PDF (Free tier)
  - EPUB (Premium)
  - MP3 Audio (Premium)

## Components

- `page.tsx`: Main preview page component
- `layout.tsx`: Handles font loading and global styles
- `components/ExportModal.tsx`: Export options modal
- `utils/themeStyles.ts`: Theme styling utilities
- `utils/fontStyles.ts`: Font styling utilities
- `store/previewStore.ts`: Zustand store for state management

## Usage

1. Navigate to `/preview` after generating an ebook
2. Customize theme, font, and cover in the sidebar
3. Preview changes in real-time
4. Export as PDF (free) or upgrade for EPUB/MP3
5. Optionally move to Studio for advanced edits

## Technical Details

- Built with Next.js 14 and React 19
- Styled with Tailwind CSS
- Uses Quill.js for rich text preview
- State management with Zustand
- Responsive design for all screen sizes

## Dependencies

- `react-quill`: Rich text editor
- `@tailwindcss/typography`: Typography styles
- `zustand`: State management
- `next/font/google`: Font loading

## Future Improvements

- [ ] Add voice command support
- [ ] Implement cover image generation
- [ ] Add more theme options
- [ ] Support custom fonts
- [ ] Add page transition animations 