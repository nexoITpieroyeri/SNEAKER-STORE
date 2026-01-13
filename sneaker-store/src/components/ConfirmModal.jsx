import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, AlertTriangle, CheckCircle, Info, HelpCircle } from 'lucide-react'

const MODAL_TYPES = {
  danger: {
    icon: AlertTriangle,
    iconColor: 'text-red-400',
    bgColor: 'bg-red-500/20',
    buttonColor: 'bg-red-600 hover:bg-red-700'
  },
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-400',
    bgColor: 'bg-green-500/20',
    buttonColor: 'bg-green-600 hover:bg-green-700'
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    buttonColor: 'bg-blue-600 hover:bg-blue-700'
  },
  question: {
    icon: HelpCircle,
    iconColor: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    buttonColor: 'bg-blue-600 hover:bg-blue-700'
  }
}

export function useConfirm() {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'question',
    onConfirm: null
  })

  const confirm = ({ title, message, type = 'question', onConfirm }) => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        title,
        message,
        type,
        onConfirm: () => {
          onConfirm?.()
          resolve(true)
          setConfirmState(prev => ({ ...prev, isOpen: false }))
        },
        onCancel: () => {
          resolve(false)
          setConfirmState(prev => ({ ...prev, isOpen: false }))
        }
      })
    })
  }

  return { confirm, confirmState }
}

export function ConfirmModal({ state }) {
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  if (!state.isOpen || !isBrowser) return null

  const config = MODAL_TYPES[state.type] || MODAL_TYPES.question
  const Icon = config.icon

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl border border-slate-700 animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 ${config.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
              <Icon className={`h-6 w-6 ${config.iconColor}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{state.title}</h3>
              <p className="text-slate-400 text-sm">{state.message}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={state.onCancel}
              className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={state.onConfirm}
              className={`flex-1 px-4 py-2.5 ${config.buttonColor} text-white font-medium rounded-lg transition-colors`}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoom-in {
          from { transform: scale(0.95); }
          to { transform: scale(1); }
        }
        .animate-in {
          animation: fade-in 0.2s ease-out, zoom-in 0.2s ease-out;
        }
      `}</style>
    </div>,
    document.body
  )
}

// Toast notifications
export function useToast() {
  const [toasts, setToasts] = useState([])

  const toast = ({ title, type = 'info', duration = 3000 }) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, title, type, duration }])
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }

  const ToastContainer = () => {
    if (typeof window === 'undefined') return null

    return createPortal(
      <div className="fixed bottom-4 right-4 z-[100] space-y-2">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onClose={() => {
            setToasts(prev => prev.filter(t => t.id !== toast.id))
          }} />
        ))}
      </div>,
      document.body
    )
  }

  return { toast, ToastContainer }
}

function ToastItem({ toast, onClose }) {
  const config = MODAL_TYPES[toast.type] || MODAL_TYPES.info
  const Icon = config.icon

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${config.bgColor} border border-slate-700 animate-in slide-in-from-right duration-300`}>
      <Icon className={`h-5 w-5 ${config.iconColor}`} />
      <span className="text-white font-medium">{toast.title}</span>
      <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white">
        <X className="h-4 w-4" />
      </button>
      <style>{`
        @keyframes slide-in-from-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-in {
          animation: slide-in-from-right 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
