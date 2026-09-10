import { useState } from 'react'

export default function CloudinaryUploadWidget({ onSuccess, label = 'Upload' }) {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo'
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'unsigned'

      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', uploadPreset)

      const resourceType = file.type.startsWith('video') ? 'video' : 'image'
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (res.ok) {
        const data = await res.json()
        if (data.secure_url) {
          onSuccess(data.secure_url)
          setUploading(false)
          return
        }
      }
    } catch (err) {
      console.warn('Cloudinary direct upload fallback to local URL preview:', err)
    }

    const reader = new FileReader()
    reader.onload = (evt) => {
      onSuccess(evt.target.result)
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  return (
    <label className="relative flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl font-semibold text-xs cursor-pointer transition-all shrink-0">
      {uploading ? (
        <>
          <svg className="w-4 h-4 animate-spin text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          Uploading...
        </>
      ) : (
        <>
          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          {label}
        </>
      )}
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="sr-only"
      />
    </label>
  )
}
