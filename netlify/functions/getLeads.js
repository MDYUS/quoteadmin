import { supabase } from '../../utils/supabase.js'

export async function handler() {
  const { data, error } = await supabase.from('leads').select('*')

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  }
}
