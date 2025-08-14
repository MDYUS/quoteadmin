import { supabase } from '../../utils/supabase.js'

export async function handler(event) {
  const body = JSON.parse(event.body)

  const { data, error } = await supabase
    .from('leads')
    .insert([body])

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
