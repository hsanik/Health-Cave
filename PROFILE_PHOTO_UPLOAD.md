# Profile Photo Upload Feature

## Overview
Added profile photo upload functionality using ImgBB API. Users can now upload and update their profile pictures directly from the dashboard.

## Features Implemented

### ✅ Image Upload
- Click on camera icon to select image
- Supports all common image formats (JPG, PNG, GIF, etc.)
- Maximum file size: 5MB
- Automatic upload to ImgBB
- Direct URL stored in MongoDB

### ✅ User Experience
- Loading spinner during upload
- Real-time preview of uploaded image
- Toast notifications for success/error
- Automatic page refresh after upload
- Disabled state during upload

### ✅ Validation
- File type validation (images only)
- File size validation (max 5MB)
- Error handling for failed uploads

## How It Works

### 1. User Clicks Camera Icon
```jsx
<Button onClick={() => document.getElementById('profile-image-upload')?.click()}>
  <Camera />
</Button>
```

### 2. File Selection
```jsx
<input
  type="file"
  id="profile-image-upload"
  accept="image/*"
  onChange={handleImageUpload}
  className="hidden"
/>
```

### 3. Upload to ImgBB
```javascript
const formData = new FormData()
formData.append('image', file)
formData.append('key', '65df0a73d8b9c158eb537673b6c68c58')

const response = await fetch('https://api.imgbb.com/1/upload', {
  method: 'POST',
  body: formData
})
```

### 4. Save URL to MongoDB
```javascript
await fetch('/api/profile/update', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ image: imageUrl })
})
```

### 5. Update UI
- Image URL stored in state
- Profile picture updates immediately
- Page refreshes to update session

## API Configuration

### ImgBB API Key
```
Key: 65df0a73d8b9c158eb537673b6c68c58
Endpoint: https://api.imgbb.com/1/upload
```

### Request Format
```javascript
POST https://api.imgbb.com/1/upload
Content-Type: multipart/form-data

{
  key: "65df0a73d8b9c158eb537673b6c68c58",
  image: <file>
}
```

### Response Format
```json
{
  "success": true,
  "data": {
    "url": "https://i.ibb.co/xxxxx/image.jpg",
    "display_url": "https://i.ibb.co/xxxxx/image.jpg",
    "delete_url": "https://ibb.co/xxxxx/delete"
  }
}
```

## Database Schema

### User Collection Update
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  image: String, // ImgBB URL
  // ... other fields
}
```

## Code Changes

### Added State Variables
```javascript
const [uploadingImage, setUploadingImage] = useState(false)
const [profileImage, setProfileImage] = useState(null)
```

### Added Upload Function
```javascript
const handleImageUpload = async (e) => {
  // 1. Validate file
  // 2. Upload to ImgBB
  // 3. Update profile in MongoDB
  // 4. Refresh UI
}
```

### Updated Profile Picture Display
```jsx
<div className="relative">
  {uploadingImage && <LoadingOverlay />}
  <img src={profileImage || session?.user?.image} />
  <Button onClick={triggerFileInput}>
    <Camera />
  </Button>
</div>
```

## User Flow

```
User clicks camera icon
    ↓
File picker opens
    ↓
User selects image
    ↓
Validation (type & size)
    ↓
Upload to ImgBB
    ↓
Get image URL
    ↓
Update MongoDB
    ↓
Update UI
    ↓
Page refresh
    ↓
New photo displayed
```

## Error Handling

### File Type Error
```javascript
if (!file.type.startsWith('image/')) {
  toast.error('Please select an image file')
  return
}
```

### File Size Error
```javascript
if (file.size > 5 * 1024 * 1024) {
  toast.error('Image size should be less than 5MB')
  return
}
```

### Upload Error
```javascript
catch (error) {
  toast.error('Failed to upload image. Please try again.')
}
```

## Testing Scenarios

### ✅ Valid Upload
- **Action:** Upload 2MB JPG image
- **Result:** ✅ Image uploaded, profile updated

### ❌ Invalid File Type
- **Action:** Upload PDF file
- **Result:** ❌ Error: "Please select an image file"

### ❌ File Too Large
- **Action:** Upload 10MB image
- **Result:** ❌ Error: "Image size should be less than 5MB"

### ✅ Replace Existing Photo
- **Action:** Upload new image when one exists
- **Result:** ✅ Old image replaced with new one

### ❌ Network Error
- **Action:** Upload with no internet
- **Result:** ❌ Error: "Failed to upload image"

## UI States

### 1. Default State
- Profile picture or default avatar
- Camera icon visible
- Button enabled

### 2. Uploading State
- Loading spinner overlay
- Camera icon shows spinner
- Button disabled
- Toast: "Uploading image..."

### 3. Success State
- New image displayed
- Toast: "Profile photo updated successfully!"
- Page refreshes after 1 second

### 4. Error State
- Original image remains
- Toast: Error message
- Button re-enabled

## Benefits

### For Users:
✅ Easy profile customization
✅ Instant visual feedback
✅ No complex forms
✅ Professional appearance

### For System:
✅ Reliable image hosting (ImgBB)
✅ No server storage needed
✅ Fast CDN delivery
✅ Automatic image optimization

### For Developers:
✅ Simple integration
✅ No backend image processing
✅ Clean code structure
✅ Easy to maintain

## Security Considerations

### ✅ Implemented:
- File type validation
- File size limits
- Client-side validation
- Error handling

### 🔒 Recommended:
- Rate limiting on uploads
- Virus scanning (if needed)
- Content moderation (if needed)
- User upload quotas

## Future Enhancements

- [ ] Image cropping before upload
- [ ] Multiple image formats support
- [ ] Drag & drop upload
- [ ] Image preview before upload
- [ ] Remove/delete photo option
- [ ] Upload progress bar
- [ ] Image compression
- [ ] Avatar selection from gallery

## API Limits

### ImgBB Free Tier:
- Unlimited uploads
- Unlimited bandwidth
- Permanent storage
- No expiration
- API rate limits apply

## Summary

Profile photo upload feature successfully implemented:
- ✅ Click camera icon to upload
- ✅ Validates file type and size
- ✅ Uploads to ImgBB
- ✅ Stores URL in MongoDB
- ✅ Updates UI in real-time
- ✅ Proper error handling
- ✅ Loading states
- ✅ Toast notifications

**Users can now personalize their profiles with custom photos!** 📸
