import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cropper from 'react-easy-crop'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { getApiErrorMessage } from '../utils/apiError'
import WelcomeToast from '../components/WelcomeToast'

const createCroppedImage = (imageUrl, pixelCrop) => new Promise((resolve, reject) => {
  const image = new Image()
  image.onload = () => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) {
      reject(new Error('Could not prepare the cropped image.'))
      return
    }

    canvas.width = 512
    canvas.height = 512
    context.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      canvas.width,
      canvas.height,
    )
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Could not prepare the cropped image.'))
    }, 'image/jpeg', 0.9)
  }
  image.onerror = () => reject(new Error('Could not load this image. Please choose another one.'))
  image.src = imageUrl
})

const getDateInputValue = (value) => {
  if (typeof value !== 'string') return ''
  return value.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || ''
}

const formatDateOfBirth = (value) => {
  const date = getDateInputValue(value)
  if (!date) return 'Not provided'

  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function Profile() {
  const { user, setUser, logout } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(!user?.phone)
  const [form, setForm] = useState({
    dob: getDateInputValue(user?.dob),
    organization: user?.organization || '',
    organization_type: user?.organization_type || 'college',
  })
  const [saving, setSaving] = useState(false)
  const [pictureSaving, setPictureSaving] = useState(false)
  const [cropImage, setCropImage] = useState('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    return () => {
      if (cropImage) URL.revokeObjectURL(cropImage)
    }
  }, [cropImage])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handlePictureChange = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Choose a JPG, PNG, or WebP image.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Choose an image that is 10 MB or smaller.')
      return
    }

    setError('')
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    setCropImage(URL.createObjectURL(file))
  }

  const handleCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

  const handleCropSave = async () => {
    if (!cropImage || !croppedAreaPixels) return

    setPictureSaving(true)
    setError('')
    try {
      const croppedBlob = await createCroppedImage(cropImage, croppedAreaPixels)
      if (croppedBlob.size > 2 * 1024 * 1024) {
        setError('The cropped image is too large. Please zoom in or choose another image.')
        return
      }

      const formData = new FormData()
      formData.append('profile_picture', croppedBlob, 'profile-photo.jpg')
      const res = await api.post('/user/profile-picture', formData)
      setUser(res.data)
      setCropImage('')
    } catch (err) {
      setError(err.response?.data?.errors?.profile_picture?.[0] || err.message || 'Could not update picture')
    } finally {
      setPictureSaving(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await api.put('/user/me', form)
      setUser(res.data)
      setEditing(false)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not save changes'))
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) return null

  return (
    <>
      <WelcomeToast user={user} />
      <main className="min-h-[65vh] bg-gradient-to-b from-indigo-50/80 via-slate-50 to-white px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-2xl">
        <section className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/80 to-violet-100/70 shadow-xl shadow-indigo-950/[0.09]">
          <div className="h-1.5 bg-gradient-to-r from-brand-purple via-indigo-500 to-sky-400" />

          <div className="p-4 sm:p-6">
            <div className="flex flex-col items-center gap-3 border-b border-slate-100 pb-5 text-center sm:pb-6">
              <div className="relative shrink-0">
                <img
                  src={user.profile_picture || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name || user.email}`}
                  alt={`${user.name || 'User'}'s profile`}
                  className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg ring-1 ring-slate-200 sm:h-28 sm:w-28"
                />
                <label
                  title="Crop and update profile photo"
                  aria-label="Crop and update profile photo"
                  className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-indigo-700 text-white shadow-md transition hover:bg-indigo-800 focus-within:ring-4 focus-within:ring-indigo-200"
                >
                  {pictureSaving ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-label="Uploading" />
                  ) : (
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path d="M13.586 3.586a2 2 0 0 1 2.828 2.828l-8.5 8.5a1 1 0 0 1-.424.253l-3.5 1a.5.5 0 0 1-.618-.618l1-3.5a1 1 0 0 1 .253-.424l8.96-8.04ZM12.172 5 5.29 11.176l-.618 2.163 2.163-.618L13 5.828 12.172 5Z" />
                    </svg>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={handlePictureChange}
                    disabled={pictureSaving}
                  />
                  <span className="sr-only">Crop and update profile photo</span>
                </label>
              </div>
              <div className="w-full min-w-0">
                <h2 className="break-words text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{user.name}</h2>
                <p className="mt-1 break-all text-sm text-slate-500">{user.email}</p>
                <p className="mt-2 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold capitalize text-indigo-700">
                  {user.organization_type === 'company' ? 'Company account' : 'College account'}
                </p>
              </div>
            </div>

            {error && !editing && (
              <p role="alert" className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
            )}

            {!editing ? (
              <div className="mt-5">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Personal information</h3>
                <dl className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/80 bg-white/75 p-3.5 shadow-sm backdrop-blur-sm sm:p-4">
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Date of birth</dt>
                    <dd className="mt-1.5 text-sm font-semibold text-slate-900">{formatDateOfBirth(user.dob)}</dd>
                  </div>
                  <div className="rounded-xl border border-white/80 bg-white/75 p-3.5 shadow-sm backdrop-blur-sm sm:p-4">
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{user.organization_type === 'company' ? 'Company' : 'College'}</dt>
                    <dd className="mt-1.5 break-words text-sm font-semibold text-slate-900">{user.organization || 'Not provided'}</dd>
                  </div>
                  <div className="rounded-xl border border-white/80 bg-white/75 p-3.5 shadow-sm backdrop-blur-sm sm:col-span-2 sm:p-4">
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Phone</dt>
                    <dd className="mt-1.5 text-sm font-semibold text-slate-900">{user.phone || 'Not provided'}</dd>
                  </div>
                </dl>
              </div>
            ) : (
              <form onSubmit={handleSave} className="mt-5">
                <h3 className="mb-5 text-lg font-bold text-slate-900">Update your information</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="profile-email" className="mb-1.5 block text-sm font-medium text-slate-700">Email address</label>
                    <input id="profile-email" value={user.email} disabled className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-left text-slate-500" />
                    <p className="mt-1.5 text-xs text-slate-500">Email address cannot be changed.</p>
                  </div>
                  <div>
                    <label htmlFor="profile-name" className="mb-1.5 block text-sm font-medium text-slate-700">Full name</label>
                    <input id="profile-name" value={user.name} readOnly
                      className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-left text-slate-500" />
                    <p className="mt-1.5 text-xs text-slate-500">Name cannot be changed.</p>
                  </div>
                  <div>
                    <label htmlFor="profile-dob" className="mb-1.5 block text-sm font-medium text-slate-700">
                      Date of birth <span className="text-red-600" aria-hidden="true">*</span>
                    </label>
                    <input id="profile-dob" name="dob" type="date" value={form.dob} onChange={handleChange} required
                      className="block w-full min-w-0 appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-slate-900 outline-none [color-scheme:light] focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
                  </div>
                  <div>
                    <label htmlFor="profile-organization-type" className="mb-1.5 block text-sm font-medium text-slate-700">
                      Account type <span className="text-red-600" aria-hidden="true">*</span>
                    </label>
                    <select id="profile-organization-type" name="organization_type" value={form.organization_type} onChange={handleChange} required
                      className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-slate-900 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100">
                      <option value="college">College</option>
                      <option value="company">Company</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="profile-organization" className="mb-1.5 block text-sm font-medium text-slate-700">
                      College or company <span className="text-red-600" aria-hidden="true">*</span>
                    </label>
                    <input id="profile-organization" name="organization" autoComplete="organization" placeholder="College or company" value={form.organization} onChange={handleChange} required
                      className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
                  </div>
                  <div>
                    <label htmlFor="profile-phone" className="mb-1.5 block text-sm font-medium text-slate-700">
                      Phone number
                    </label>
                    <input id="profile-phone" value={user.phone || 'Not provided'} readOnly
                      className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-left text-slate-500" />
                    <p className="mt-1.5 text-xs text-slate-500">Phone number cannot be changed.</p>
                  </div>
                </div>

                {error && <p role="alert" className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                  <button type="button" onClick={() => { setEditing(false); setError('') }}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    className="rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-900/15 transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60">
                    {saving ? 'Saving...' : 'Save changes'}
                  </button>
                </div>
              </form>
            )}

            {!editing && (
              <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
                <button
                  onClick={() => setEditing(true)}
                  className="rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-900/15 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Edit profile
                </button>
                <button
                  onClick={handleLogout}
                  className="rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </section>
        </div>

        {cropImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4" role="dialog" aria-modal="true" aria-labelledby="crop-photo-title">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
            <h2 id="crop-photo-title" className="text-xl font-bold text-slate-900">Crop profile photo</h2>
            <p className="mt-1 text-sm text-slate-500">Drag the image and adjust the zoom to choose how it appears.</p>
            <div className="relative mt-5 h-72 overflow-hidden rounded-xl bg-slate-950 sm:h-80">
              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>
            <label htmlFor="profile-photo-zoom" className="mt-5 block text-sm font-medium text-slate-700">Zoom</label>
            <input
              id="profile-photo-zoom"
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="mt-2 w-full accent-indigo-700"
            />
            {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => { setCropImage(''); setError('') }}
                disabled={pictureSaving}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCropSave}
                disabled={pictureSaving || !croppedAreaPixels}
                className="rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pictureSaving ? 'Uploading...' : 'Save photo'}
              </button>
            </div>
          </div>
          </div>
        )}
      </main>
    </>
  )
}