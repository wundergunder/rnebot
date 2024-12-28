import { ThemeSupa } from '@supabase/auth-ui-shared';

export const authTheme = {
  theme: ThemeSupa,
  variables: {
    default: {
      colors: {
        brand: '#06b6d4',
        brandAccent: '#0891b2',
        inputText: '#ffffff',
        inputBackground: '#1e293b',
        inputBorder: '#334155',
        inputLabelText: '#e2e8f0',
        inputPlaceholder: '#94a3b8',
        messageText: '#ffffff',
        messageTextDanger: '#ef4444',
      }
    }
  },
  style: {
    input: {
      color: '#ffffff',
      backgroundColor: '#1e293b',
      borderColor: '#334155',
    },
    label: {
      color: '#e2e8f0',
    },
    message: {
      color: '#ffffff',
    },
  },
  className: {
    input: 'text-white bg-slate-800 border-slate-600 placeholder-slate-400',
    label: 'text-slate-200',
    message: 'text-white',
    button: 'w-full bg-cyan-500 hover:bg-cyan-600 text-white',
    container: 'w-full',
  }
};