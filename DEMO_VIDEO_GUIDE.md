# Demo Video Setup Guide

## 📹 How to Add Your Demo Videos

The CloseTrack app now has a beautiful demo video modal system that supports role-specific videos (Agent, Broker, and Title Company). Until you upload your actual demo videos, users will see an elegant "Coming Soon" placeholder with key feature highlights.

---

## 🎬 Video Requirements

### Technical Specifications
- **Format:** MP4 (H.264 codec recommended)
- **Aspect Ratio:** 16:9 (widescreen)
- **Resolution:** 1920x1080 (1080p) or 1280x720 (720p)
- **File Size:** Recommended under 50MB for fast loading
- **Duration:** 3-5 minutes optimal
- **Audio:** AAC codec, stereo, normalized audio levels

### Content Recommendations
Each role should have its own unique demo video showcasing:

#### Agent Demo Video
- Overview of the agent dashboard
- Creating and managing listings
- Tracking commissions and deal pipeline
- Client communication features
- Deadline automation
- Mobile app usage
- **Duration:** ~3:30 minutes

#### Broker Demo Video
- Broker dashboard overview
- Team management and agent oversight
- Office performance metrics
- Revenue tracking and analytics
- Agent leaderboards
- Office-wide reporting
- **Duration:** ~4:00 minutes

#### Title Company Demo Video
- Title company dashboard walkthrough
- Processing title searches
- Managing closing documents
- Escrow tracking
- Issue resolution workflow
- Closing coordination
- **Duration:** ~3:45 minutes

---

## 📁 Where to Upload Videos

### Option 1: Self-Hosted (Recommended for small files)

1. **Create video directories:**
   ```bash
   mkdir -p public/videos
   mkdir -p public/images
   ```

2. **Add your video files:**
   - `public/videos/agent-demo.mp4`
   - `public/videos/broker-demo.mp4`
   - `public/videos/title-company-demo.mp4`

3. **Add video thumbnails (optional but recommended):**
   - `public/images/agent-demo-thumbnail.jpg`
   - `public/images/broker-demo-thumbnail.jpg`
   - `public/images/title-company-demo-thumbnail.jpg`
   - **Size:** 1920x1080px
   - **Format:** JPG or WebP
   - **Quality:** High quality screenshot from the video

4. **Deploy:**
   ```bash
   git add public/videos public/images
   git commit -m "Add demo videos for all roles"
   git push origin main
   ```

### Option 2: Cloud Hosting (Recommended for large files)

For better performance with large video files, use a cloud video hosting service:

#### A. Using AWS S3 + CloudFront
1. Upload videos to your S3 bucket
2. Enable CloudFront distribution for fast global delivery
3. Update video URLs in `src/components/ui/DemoVideoModal.tsx`

#### B. Using Vimeo or YouTube
1. Upload videos to Vimeo/YouTube (unlisted)
2. Update the video player component to use embedded players
3. Better analytics and adaptive streaming

#### C. Using Cloudinary
1. Upload to Cloudinary (free tier available)
2. Automatic video optimization and CDN delivery
3. Update URLs in the modal component

---

## 🔧 Updating Video URLs

If you're hosting videos externally, update the URLs in:

**File:** `src/components/ui/DemoVideoModal.tsx`

```typescript
const DEMO_VIDEOS = {
  agent: {
    url: 'https://your-cdn.com/agent-demo.mp4', // Update this
    thumbnail: 'https://your-cdn.com/agent-thumbnail.jpg', // Update this
    title: 'Agent Dashboard Demo',
    description: '...',
    duration: '3:24' // Update to match actual video length
  },
  broker: {
    url: 'https://your-cdn.com/broker-demo.mp4', // Update this
    thumbnail: 'https://your-cdn.com/broker-thumbnail.jpg', // Update this
    title: 'Broker Dashboard Demo',
    description: '...',
    duration: '4:12' // Update to match actual video length
  },
  title_company: {
    url: 'https://your-cdn.com/title-demo.mp4', // Update this
    thumbnail: 'https://your-cdn.com/title-thumbnail.jpg', // Update this
    title: 'Title Company Dashboard Demo',
    description: '...',
    duration: '3:45' // Update to match actual video length
  }
}
```

---

## 🎥 Recording Your Demo Videos

### Recommended Tools

#### Screen Recording
- **Mac:** QuickTime Player (built-in) or ScreenFlow
- **Windows:** OBS Studio (free) or Camtasia
- **Cross-platform:** Loom (easy sharing), ScreenFlow, or Camtasia

#### Video Editing
- **Free:** DaVinci Resolve, iMovie (Mac), OpenShot
- **Paid:** Adobe Premiere Pro, Final Cut Pro, Camtasia
- **Online:** Kapwing, Descript

### Recording Tips

1. **Script your demo:**
   - Write a clear script covering all key features
   - Keep it concise and focused on benefits
   - Practice before recording

2. **Use a clean demo account:**
   - Use the demo accounts created in Clerk
   - Ensure sample data looks realistic
   - No lorem ipsum or test data

3. **Record at high resolution:**
   - 1920x1080 minimum
   - Use full screen, hide desktop clutter
   - Close unnecessary apps

4. **Audio quality matters:**
   - Use a decent microphone (not laptop mic)
   - Record in a quiet room
   - Add background music at low volume (10-15%)

5. **Add professional touches:**
   - Intro slate with CloseTrack logo (2-3 seconds)
   - Highlight cursor or mouse clicks for clarity
   - Add captions/subtitles for accessibility
   - End with clear CTA (sign up link)

6. **Keep it engaging:**
   - Show real workflows, not just features
   - Use smooth transitions between sections
   - Maintain steady pacing (not too fast or slow)
   - Add zoom-ins on important UI elements

### Suggested Video Structure

```
1. Intro (0:00-0:15)
   - Logo animation
   - "Welcome to CloseTrack for [Role]"

2. Dashboard Overview (0:15-0:45)
   - Quick tour of the main dashboard
   - Highlight key metrics

3. Core Features (0:45-2:30)
   - Feature 1 with use case
   - Feature 2 with use case
   - Feature 3 with use case

4. Unique Value Props (2:30-3:00)
   - What makes CloseTrack different
   - Time/money saved

5. Mobile Preview (3:00-3:20)
   - Quick mobile app showcase

6. Call to Action (3:20-3:30)
   - "Start your free trial today"
   - Visit URL or sign up button
```

---

## 🎨 Creating Video Thumbnails

### Design Guidelines
- **Dimensions:** 1920x1080px (16:9 ratio)
- **Format:** JPG (optimized) or WebP
- **File size:** Under 200KB
- **Content:** 
  - Show the dashboard in action
  - Include CloseTrack logo
  - Add text overlay: "[Role] Dashboard Demo"
  - Use brand colors (Blue, Emerald, Purple)

### Tools
- **Canva:** Easy templates
- **Figma:** Professional design
- **Photoshop:** Advanced editing
- **Screenshot + edit:** Take a screenshot from your video and add text overlay

---

## ✅ Testing Your Videos

After uploading, test the following:

1. **Playback:**
   - ✅ Video loads and plays smoothly
   - ✅ Audio is clear and synchronized
   - ✅ No buffering issues

2. **Thumbnail:**
   - ✅ Shows before video plays
   - ✅ Looks good on all screen sizes
   - ✅ Loads quickly

3. **Mobile:**
   - ✅ Plays on iPhone Safari
   - ✅ Plays on Android Chrome
   - ✅ Fullscreen works correctly
   - ✅ Touch controls work

4. **Accessibility:**
   - ✅ Captions/subtitles included
   - ✅ Audio description (if needed)
   - ✅ Keyboard controls work

---

## 🚀 Current Features

The demo video modal includes:
- ✅ Beautiful placeholder UI until videos are uploaded
- ✅ Role-specific feature highlights
- ✅ Custom video player with controls
- ✅ Play/Pause, Mute, Fullscreen buttons
- ✅ Smooth animations and transitions
- ✅ Mobile-optimized
- ✅ Role selector on homepage
- ✅ CTA to start free trial
- ✅ Professional design matching CloseTrack branding

---

## 🎯 Quick Start Checklist

- [ ] Record screen demos for all 3 roles
- [ ] Edit videos (add intro/outro, music, captions)
- [ ] Export as MP4 at 1080p
- [ ] Create thumbnail images (1920x1080px)
- [ ] Compress videos if needed (keep under 50MB)
- [ ] Upload to `public/videos/` directory
- [ ] Upload thumbnails to `public/images/` directory
- [ ] Update durations in DemoVideoModal.tsx
- [ ] Test on desktop and mobile
- [ ] Deploy to production

---

## 💡 Need Help?

If you need assistance with:
- Video recording
- Video editing
- Hosting setup
- Custom player features

Contact: info.closetrackapp@gmail.com

---

## 📊 Analytics (Optional Enhancement)

Consider adding video analytics to track:
- Play rate (how many people click play)
- Average watch time
- Drop-off points
- Conversion rate (viewers who sign up)

Tools: Google Analytics, Mixpanel, or custom tracking.

