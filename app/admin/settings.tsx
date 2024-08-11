// pages/admin/settings.tsx
import { useState } from 'react'
import withAdminAuth from '../../components/WithAdminAuth'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const AdminSettings: React.FC = () => {
  const [basePrompt, setBasePrompt] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const updateBasePrompt = async () => {
    setLoading(true)
    const { error } = await supabase
      .from('settings')
      .update({ base_prompt: basePrompt })
      .eq('id', 1) // Assuming there's a settings table with an id field

    if (error) {
      console.error(error)
    } else {
      alert('Base prompt updated successfully')
    }
    setLoading(false)
  }

  return (
    <div>
      <h1>Admin Settings</h1>
      <textarea
        value={basePrompt}
        onChange={(e) => setBasePrompt(e.target.value)}
        placeholder="Enter new base prompt"
      />
      <button onClick={updateBasePrompt} disabled={loading}>
        {loading ? 'Updating...' : 'Update Base Prompt'}
      </button>
    </div>
  )
}

export default withAdminAuth(AdminSettings)

