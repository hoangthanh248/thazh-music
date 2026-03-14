import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, CheckCircle, AlertCircle, Loader } from 'lucide-react'

export default function UploadZone({
  label = 'Kéo thả hoặc click để chọn file',
  accept = {},
  onUpload,      // async fn(file) => { url, ... }
  maxSize = 100 * 1024 * 1024,
  hint,
}) {
  const [status, setStatus] = useState('idle') // idle | uploading | done | error
  const [progress, setProgress] = useState(0)
  const [fileName, setFileName] = useState(null)
  const [error, setError] = useState(null)

  const onDrop = useCallback(async (accepted) => {
    const file = accepted[0]
    if (!file) return
    setFileName(file.name)
    setStatus('uploading')
    setProgress(0)
    setError(null)
    try {
      await onUpload(file, (p) => setProgress(Math.round(p.loaded / p.total * 100)))
      setStatus('done')
    } catch (e) {
      setStatus('error')
      setError(e?.response?.data?.detail || 'Upload thất bại')
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
    disabled: status === 'uploading',
  })

  return (
    <div
      {...getRootProps()}
      className={`upload-zone ${isDragActive ? 'border-pink-400 bg-pink-400/10' : ''}
        ${status === 'done' ? 'border-emerald-400 bg-emerald-400/5' : ''}
        ${status === 'error' ? 'border-red-400 bg-red-400/5' : ''}`}
    >
      <input {...getInputProps()} />

      {status === 'idle' && (
        <>
          <Upload size={32} className="text-white/30" />
          <p className="text-white/60 text-sm font-medium text-center">{label}</p>
          {hint && <p className="text-white/30 text-xs text-center">{hint}</p>}
        </>
      )}

      {status === 'uploading' && (
        <>
          <Loader size={32} className="text-pink-400 animate-spin" />
          <p className="text-white/70 text-sm font-medium">{fileName}</p>
          <div className="w-full bg-white/10 rounded-full h-1.5 mt-1">
            <div
              className="bg-pink-400 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-pink-400 text-xs">{progress}%</p>
        </>
      )}

      {status === 'done' && (
        <>
          <CheckCircle size={32} className="text-emerald-400" />
          <p className="text-emerald-400 text-sm font-semibold">Upload thành công!</p>
          <p className="text-white/40 text-xs truncate max-w-full px-4">{fileName}</p>
          <button
            onClick={(e) => { e.stopPropagation(); setStatus('idle'); setFileName(null) }}
            className="text-white/40 text-xs underline mt-1"
          >
            Thay file khác
          </button>
        </>
      )}

      {status === 'error' && (
        <>
          <AlertCircle size={32} className="text-red-400" />
          <p className="text-red-400 text-sm font-semibold">Upload thất bại</p>
          <p className="text-white/40 text-xs text-center">{error}</p>
          <button
            onClick={(e) => { e.stopPropagation(); setStatus('idle') }}
            className="text-pink-400 text-xs underline mt-1"
          >
            Thử lại
          </button>
        </>
      )}
    </div>
  )
}
