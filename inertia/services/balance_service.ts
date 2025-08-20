export async function createBalance(payload: any) {
  const response = await fetch('/api/balances', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  return response.json()
}
